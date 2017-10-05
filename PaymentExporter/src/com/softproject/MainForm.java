package com.softproject;

import com.michaelbaranov.microba.calendar.DatePicker;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;

@SuppressWarnings({"ThrowablePrintedToSystemOut", "unchecked", "MagicConstant"})
public class MainForm extends JFrame {
    private JPanel contentPane;
    private JButton buttonExport;
    private JComboBox comboBox1;
    private DatePicker DatePicker;
    private JButton buttonSetSertificate;
    private JButton buttonShowError;
    private JProgressBar progressBar;

    private Config config = new Config();

    private FirebirdWorker firebirdWorker;

    public String serverIp = config.getProperty("serverIP");
    public String serverPort = config.getProperty("serverPort");
    public String user = config.getProperty("user");
    public String password = config.getProperty("password");
    public String alias = config.getProperty("alias");
    public String exportUrl = config.getProperty("exportUrl");
    public String certificatePassword = "";

    public MainForm() throws IOException {
        setBounds(350, 350, 500, 250);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        firebirdWorker = new FirebirdWorker();
        firebirdWorker.Initialize(serverIp, serverPort, alias, user, password);
        List<Owner> owners = firebirdWorker.getOwners();

        for (Owner owner : owners) {
            comboBox1.addItem(new ComboItem(owner.name, owner.id));
        }

        setContentPane(contentPane);
        getRootPane().setDefaultButton(buttonExport);

        buttonExport.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                try {
                    onExport();
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
        });

        buttonShowError.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                try {
                    showError();
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
        });

        buttonSetSertificate.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                try {
                    setSertificate();
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
        });

        addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                onWindowClose();
            }
        });
    }

    private void setSertificate() {
        try {
            try {
                Path keystorePath = FileSystems.getDefault().getPath("", "keystore.jks");
                if(keystorePath.toFile().exists())
                    Files.delete(keystorePath);
            } catch (NoSuchFileException x) {
                System.err.format("%s: no such" + " file or directory%n", "keystore.jks");
            } catch (DirectoryNotEmptyException x) {
                System.err.format("%s not empty%n", "keystorePath");
            } catch (IOException x) {
                System.err.println(x);
            }
            FileChooser fileChooser = new FileChooser();
            File crtPath = fileChooser.Choose();
            if(crtPath == null)
                return;
            String crt = crtPath.getPath();
            String[] pathToCertificate = crt.split("[.]");
            String userAlias = pathToCertificate[0];
            String p12 = pathToCertificate[0] + ".p12";
            certificatePassword = JOptionPane.showInputDialog(contentPane, "Введіть пароль до сертифікату.", "", JOptionPane.OK_CANCEL_OPTION);

            String CreateKeyStore = "keytool -genkey -alias keystore -keystore keystore.jks" +
                    " -dname \"CN=localhost, OU=dev64, O=dev64-payment, L=Unknown, ST=Unknown, C=RU\"" +
                    " -storepass " + certificatePassword +
                    " -keypass " + certificatePassword;
            Runtime.getRuntime().exec(CreateKeyStore).waitFor();
            String DeleteKey = "keytool -delete -alias keystore -keystore keystore.jks" +
                    " -storepass " + certificatePassword +
                    " -keypass " + certificatePassword;
            Runtime.getRuntime().exec(DeleteKey).waitFor();
            String ImportCertificate = "keytool -import -v -trustcacerts -noprompt -alias server" +
                    " -file ./server -keystore keystore.jks" +
                    " -storepass " + certificatePassword +
                    " -keypass " + certificatePassword;
            Runtime.getRuntime().exec(ImportCertificate).waitFor();

            if(certificatePassword == null || certificatePassword.equals(""))
                return;
            int exitVal = 0;

            String crtExec = "keytool -import -v -trustcacerts -noprompt -alias " + userAlias +
                    " -file " + crt + " -keystore keystore.jks" +
                    " -storepass " + certificatePassword;
            Process crtExecProc = Runtime.getRuntime().exec(crtExec);
            exitVal = crtExecProc.waitFor();
            if(exitVal == 1) {
                JOptionPane.showMessageDialog(null, "Не вірний файл сертіфікату або пароль.", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            String p12Exec = "keytool -v -importkeystore" +
                    " -srckeystore " + p12 +
                    " -srcstoretype pkcs12 -srcstorepass " + certificatePassword + " -destkeystore keystore.jks" +
                    " -deststoretype JKS -deststorepass " + certificatePassword;
            Process p12ExecProc = Runtime.getRuntime().exec(p12Exec);
            exitVal = p12ExecProc.waitFor();
            if(exitVal == 1) {
                JOptionPane.showMessageDialog(null, "Файл ключів до сертіфікату повинен знаходитись в одній папці з сертифікатом.", "Error", JOptionPane.ERROR_MESSAGE);
            }

        } catch (Throwable ex) {
            String time = new SimpleDateFormat("HH:mm:ss yyyy-MM-dd").format(new Date());
            FileWorker.write("./logs.txt", time + ' ' + ex.getMessage() + "\n");
            System.out.println(ex.getMessage());
            ex.printStackTrace();
        }
    }

    private void onExport() throws Exception {
        Object selectedOwner = comboBox1.getSelectedItem();
        String OwnerId = ((ComboItem)selectedOwner).getValue();
        DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss yyyy-MM-dd");
        String time = "";
        Map<String, Service> services = firebirdWorker.getServices();
        Map<String, String> accrualMap = new HashMap<String, String>();
        Map<String, String> counterMap = new HashMap<String, String>();
        Map<String, String> paymentMap = new HashMap<String, String>();
        Map<String, String> response = new HashMap<String, String>();
        JSONObject json = new JSONObject();
        JSONArray accrualsJSON = new JSONArray();
        JSONArray countersJSON = new JSONArray();
        JSONArray paymentsJSON = new JSONArray();
        Boolean firstRowSendedAccrual = false;
        Boolean firstRowSendedCounter = false;
        Boolean firstRowSendedPayment = false;
        String[] transcript = new String[4];
        String transcripts = "";

        Map<String, String[]> transcriptAccruals = new HashMap<String, String[]>();
        Map<String, String[]> transcriptServiceRecalculation = new HashMap<String, String[]>();
        Map<String, String[]> transcriptBenefits = new HashMap<String, String[]>();
        Map<String, String[]> transcriptBenefitsRecalculation = new HashMap<String, String[]>();

        JSONArray transcriptServices = new JSONArray();
        JSONObject transcriptJson = new JSONObject();

        int length = 0;
        int progress = 0;
        boolean errors = false;

        if(certificatePassword == null || certificatePassword.equals("")) {
            certificatePassword = JOptionPane.showInputDialog(contentPane, "Введіть пароль до сертифікату.", "", JOptionPane.OK_CANCEL_OPTION);
            if(certificatePassword == null || certificatePassword.equals("")) {
                JOptionPane.showMessageDialog(null, "Для продовження необхідно ввести пароль.", "Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
        }
        Date chosenDate = DatePicker.getDate();
        chosenDate.setDate(1);
        String date = new SimpleDateFormat("yyyy-MM-dd").format(chosenDate);
        if(!firebirdWorker.checkCloseDate(date, OwnerId)) {
            JOptionPane.showMessageDialog(null, "Не допустимий місяць. Обраний місяць не закрито", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        time = new SimpleDateFormat("HH:mm:ss yyyy-MM-dd").format(new Date());
        JOptionPane.showMessageDialog(null, "Вивантаження даних розпочато.");
        FileWorker.write("./logs.txt", time + ' ' + "Вивантаження даних розпочато.\n");
        length = firebirdWorker.getLength(date, OwnerId);
        progressBar.setMaximum(length);
        //Выгрузка и обработка начислений, описания и счетчиков по одной записи
        if(firebirdWorker.prepareAccruals(date, OwnerId)) {
            Accrual accrual = new Accrual();
            while (firebirdWorker.getAccrual(accrual)) { //выгрузка начислений в переменную accrual
                if(!firstRowSendedAccrual) {
                    json.put("companyId", (accrual.OKPO));
                    json.put("companyName", (accrual.PREDPR));
                    json.put("accrualDate", (accrual.DATEFirst));
                    response = SendingData.Delete(exportUrl, json, certificatePassword, "accruals");
                    time = dateFormat.format(new Date());
                    if(response.containsKey("true")) {
                        JSONObject obj = new JSONObject(response.get("true"));
                        FileWorker.write("./logs.txt", time + ' ' + obj.getString("message") + "\n");
                    }
                    else {
                        if (response.containsKey("false")) {
                            FileWorker.write("./logs.txt", time + ' ' + response.get("false") + "\n");
                            errors = true;
                        }
                    }
                }

                String idHouse = AddressParser.parse(accrual.CityID, accrual.KOD_STR, accrual.DOM,
                        accrual.KORP, accrual.KV, null); //as last param "null" || "accrual.IND"
                if(idHouse == null) {
                    time = dateFormat.format(new Date());
                    FileWorker.write("./logs.txt", time + ' ' + "Помилка. Перевірте поле у нарахуваннях з лицевим рахунком \"" + accrual.LSA + "\" та послугою " + accrual.ID_UslugGroup + ".\n");
                    errors = true;
                    continue;
                }
                if(firebirdWorker.prepareAccrualDescription(date, accrual.vLC_ID, accrual.ID_UslugGroup)) {
                    int len = transcript.length;
                    if (len > 0)
                        transcript[0] = "";
                    for (int i = 1; i < len; i += i)
                        System.arraycopy( transcript, 0, transcript, i, ((len - i) < i) ? (len - i) : i);
                    transcripts = "";
                    transcriptJson = new JSONObject();
                    DecryptionAccrual decryptionAccrual = new DecryptionAccrual();
                    while(firebirdWorker.getAccrualDecryption(decryptionAccrual)) {
                        transcriptServices = new JSONArray();
                        transcript = DataProcessing.DecryptionAccrualProcessing(decryptionAccrual);
                        if(transcriptJson.length() > 0) {
                            try{
                                transcriptServices = transcriptJson.getJSONArray(transcript[2]);
                            }
                            catch(Exception err) {
                            }
                            transcriptServices.put(Integer.parseInt(transcript[0]), transcript);
                            transcriptJson.put(transcript[2], transcriptServices);
                        }
                        else {
                            transcriptServices.put(Integer.parseInt(transcript[0]), transcript);
                            transcriptJson.put(transcript[2], transcriptServices);

                        }
                    }

                    Iterator iter = transcriptJson.keys();
                    while(iter.hasNext()) {
                        String key = (String)iter.next();
                        transcriptServices = transcriptJson.getJSONArray(key);
                        for(int i = 0; i < transcriptServices.length(); i++) {
                            try {
                                transcript = (String[]) transcriptServices.get(i);
                                if(transcript != null)
                                    break;

                            } catch (Exception err) {
                            }
                        }
                        transcripts += transcript[3] + "<br>";
                        for(int i = 0; i < transcriptServices.length(); i++) {
                            transcript = null;
                            try {
                                transcript = (String[]) transcriptServices.get(i);
                            }
                            catch(Exception err) {
                            }
                            if(transcript != null) {
                                if (Objects.equals(transcript[0], "0"))
                                    transcripts += "Нарахування: " + transcript[1] + "<br>";
                                if (Objects.equals(transcript[0], "1"))
                                    transcripts += "Пільги: " + transcript[1] + "<br>";
                                if (Objects.equals(transcript[0], "3"))
                                    transcripts += "Перерахунок за послугою: " + transcript[1] + "<br>";
                                if (Objects.equals(transcript[0], "4"))
                                    transcripts += "Перерахунок за пільгою: " + transcript[1] + "<br>";

                            }
                        }
                    }
                }
                accrualMap = DataProcessing.AccrualProcessing(accrual, services);
                if(accrualMap.containsKey("error")) {
                    time = dateFormat.format(new Date());
                    FileWorker.write("./logs.txt", time + ' ' + "Помилка. Перевірте поле " + accrualMap.get("error") + " у нарахуваннях з лицевим рахунком \"" + accrual.LSA + "\" та послугою " + accrual.ID_UslugGroup + ".\n");
                    errors = true;
                    continue;
                }
                accrualMap.put("transcript", transcripts);
                accrualMap.put("idHouse", idHouse);
                accrualsJSON.put(0, accrualMap);
                json.put("accruals", accrualsJSON);

                response = SendingData.Add(exportUrl, json, certificatePassword, "accruals");
                time = dateFormat.format(new Date());
                if(response.containsKey("true")) {
                    JSONObject obj = new JSONObject(response.get("true"));
                    FileWorker.write("./logs.txt", time + ' ' + obj.getString("message") + "\n");
                    firstRowSendedAccrual = true;
                }
                else {
                    if (response.containsKey("false")) {
                        FileWorker.write("./logs.txt", time + ' ' + response.get("false") + "\n");
                        errors = true;
                    }
                }
                progress = progressBar.getValue() + 1;
                progressBar.setValue(progress);
                contentPane.update(contentPane.getGraphics());
                json.remove("accruals");
                //todo отправка потоком
            }
        }

        if(firebirdWorker.preparePayments(date, OwnerId)) {
            Payment payment = new Payment();
            while (firebirdWorker.getPayment(payment)) {
                if(!firstRowSendedPayment) {
                    json.put("companyId", (payment.outEdrpouKGP));
                    json.put("companyName", (payment.outNameKGP));
                    json.put("paymentDate", (payment.paymentDate));
                    response = SendingData.Delete(exportUrl, json, certificatePassword, "payments");
                    time = dateFormat.format(new Date());
                    if(response.containsKey("true")) {
                        JSONObject obj = new JSONObject(response.get("true"));
                        FileWorker.write("./logs.txt", time + ' ' + obj.getString("message") + "\n");
                        firstRowSendedPayment = true;
                    }
                    else {
                        if (response.containsKey("false")) {
                            FileWorker.write("./logs.txt", time + ' ' + response.get("false") + "\n");
                            errors = true;
                        }
                    }
                }
                paymentMap.clear();
                String idHouse = AddressParser.parse(payment.outCityID, payment.outExtCode, payment.outNumber,
                        payment.outKorp, payment.outNomer, null); //as last param "null" || "payment.IND"
                paymentMap = DataProcessing.PaymentProcessing(payment);
                if(paymentMap.containsKey("error")) {
                    time = dateFormat.format(new Date());
                    FileWorker.write("./logs.txt", time + ' ' + "Помилка. Перевірте поле " + accrualMap.get("error") + " у нарахуваннях з лицевим рахунком \"" + payment.outLicSh + "\" та послугою " + payment.outLicSh + ".\n");
                    errors = true;
                    continue;
                }
                paymentMap.put("idHouse", idHouse);
                paymentsJSON.put(0, paymentMap);
                json.put("payments", paymentsJSON);
                response = SendingData.Add(exportUrl, json, certificatePassword, "payments");
                time = dateFormat.format(new Date());
                if(response.containsKey("true")) {
                    JSONObject obj = new JSONObject(response.get("true"));
                    FileWorker.write("./logs.txt", time + ' ' + obj.getString("message") + "\n");
                }
                else {
                    if (response.containsKey("false")) {
                        FileWorker.write("./logs.txt", time + ' ' + response.get("false") + "\n");
                        errors = true;
                    }
                }
                progress = progressBar.getValue() + 1;
                progressBar.setValue(progress);
                contentPane.update(contentPane.getGraphics());
                json.remove("payments");
            }
        }

        if(firebirdWorker.prepareCounters(date, OwnerId)) {
            Counters counter = new Counters();
            while (firebirdWorker.getCounter(counter)) {
                if(!firstRowSendedCounter) {
                    json.put("companyId", (counter.outIdKGP));
                    json.put("companyName", (counter.outNameKGP));
                    json.put("counterDate", (counter.outDatePokaz));
                    response = SendingData.Delete(exportUrl, json, certificatePassword, "counters");
                    time = dateFormat.format(new Date());
                    if(response.containsKey("true")) {
                        JSONObject obj = new JSONObject(response.get("true"));
                        FileWorker.write("./logs.txt", time + ' ' + obj.getString("message") + "\n");
                        firstRowSendedCounter = true;
                    }
                    else {
                        if (response.containsKey("false")) {
                            FileWorker.write("./logs.txt", time + ' ' + response.get("false") + "\n");
                            errors = true;
                        }
                    }
                }
                counterMap.clear();
                String idHouse = AddressParser.parse(counter.outCityID, counter.outExtCode, counter.outNumber,
                        counter.outKorp, counter.outNomer, null); //as last param "null" || "accrual.IND"
                counterMap = DataProcessing.CounterProcessing(counter);
                if(counterMap.containsKey("error")) {
                    time = dateFormat.format(new Date());
                    FileWorker.write("./logs.txt", time + ' ' + "Помилка. Перевірте поле " + accrualMap.get("error") + " у нарахуваннях з лицевим рахунком \"" + counter.outLicSh + "\" та послугою " + counter.outLicSh + ".\n");
                    errors = true;
                    continue;
                }
                counterMap.put("idHouse", idHouse);
                countersJSON.put(0, counterMap);
                json.put("counters", countersJSON);
                response = SendingData.Add(exportUrl, json, certificatePassword, "counters");
                time = dateFormat.format(new Date());
                if(response.containsKey("true")) {
                    JSONObject obj = new JSONObject(response.get("true"));
                    FileWorker.write("./logs.txt", time + ' ' + obj.getString("message") + "\n");
                }
                else {
                    if (response.containsKey("false")) {
                        FileWorker.write("./logs.txt", time + ' ' + response.get("false") + "\n");
                        errors = true;
                    }
                }
                progress = progressBar.getValue() + 1;
                progressBar.setValue(progress);
                contentPane.update(contentPane.getGraphics());
                json.remove("counters");
            }
        }
        time = new SimpleDateFormat("HH:mm:ss yyyy-MM-dd").format(new Date());
        FileWorker.write("./logs.txt", time + ' ' + "Вивантаження даних закінчилось.\n");
        if(errors)
            JOptionPane.showMessageDialog(null, "Під час вивантаження виникли помилки. Перегляньте log файл.");
        else
            JOptionPane.showMessageDialog(null, "Вивантаження даних успішно закінчилося.");
    }

    private void showError() throws Exception {
        File log = new File("./logs.txt");
        Desktop.getDesktop().open(log);
    }

    private void onWindowClose() {
        firebirdWorker.Release();
        dispose();
        System.exit(0);
    }

    public static void main(String[] args) throws IOException {
        MainForm app = new MainForm();
        app.setVisible(true);
    }
}