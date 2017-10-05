package com.softproject;

import java.sql.*;
import java.text.DateFormat;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;

class Owner {
    String id;
    String name;
}

class Letter {
    Integer id;
    String value;

    public Letter(Integer id, String value) {
        this.id = id;
        this.value = value;
    }
}

class Service {
    String name;
}

class Accrual {
    String LSA;
    String FAM;
    String KOD_STR;
    String DOM;
    String IND;
    String KORP;
    String KV;
    String DOLG;
    String PREDPR;
    String OKPO;
    String MESYZ;
    String GOD;
    String NAZ;
    String KOPLATE;
    String OPL;
    String SUBS;
    String KOL;
    String outCounterPokaz;
    String outIsCounter;
    String PLO;
    String vLC_ID;
    String CityID;
    String Street;
    String DATEFirst;
    String vNachPoslug;
    String vNachPilg;
    String vRecalc;
    String DATELast;
    String ID_UslugGroup;
    String vFlatID;
    String vBuildingID;
    String MegaBankLC;
    String CodeERC;
    String TYPE_STR;
    String CityCod;
    String StreetName;
}

class DecryptionAccrual {
    String DateRecort;
    String LSA;
    String FAM;
    String KOD_STR;//номер улимцы
    String DOM;//номер дом
    String IND;//буква наверное
    String KORP;//корпус
    String KV;//квартира
    String PREDPR;
    String OKPO;
    String Street;//номер улицы
    String ID_Uslug;
    String vFlatID;
    String vBuildingID;
    String NameUslug;
    String CodeUslug;
    String NacCalcText;
    String NacPeriodText;
    String vLC_ID;
    String PilgiCalcText;
    String PilgiPeriodText;
    String RecalcText;
    String RecalcPeriodText;
    String RecalcTaPilgiID;

}

class Counters {
    String outNameKGP; //Название предприятия
    String outIdKGP; //id предприятия
    String outExtCode; //Номер улицы
    String outMesto; //Месторасположение счётчика
    String outUslugID; //Сервис id
    String outUslugName; //Сервис имя
    String outValuePokaz; //Текущие показания
    String outDatePokaz; //Дата показаний
    String outOldPokaz; //прошлые показания
    String outCityID; //Номер города
    String outNumber; //Номер дома + буква
    String outLit; //Буква дома
    String outKorp; //Буква корпуса
    String outNomer; //Номер дома + наниматель + немного магии
    String outDatePredPokaz; //Дата предведущих показаний
    String outLicSh; //Номер лицевого счета
}

class Payment {
    String recipientBankAccount; //расчётный счёт принимателя
    String senderBankAccount; //расчётный счёт отправителя
    String transactionId; //id транзакции
    String mfoSender; //мфо отправителя
    String mfoRecipient; //мфо получателя
    String amount; //сумма
    String paymentDate; //дата платежа
    String dateOfEnrollment; //дата зачисления
    String outNameKGP; //Название предприятия
    String outEdrpouKGP; //Едрпоу предприятия
    String outExtCode; //Номер улицы
    String outUslugID; //Сервис id
    String outUslugName; //Сервис имя
    String outCityID; //Номер города
    String outNumber; //Номер дома + буква
    String outLit; //Буква дома
    String outKorp; //Буква корпуса
    String outNomer; //Номер дома + наниматель + немного магии
    String outLicSh; //Номер лицевого счета
}

class ComboItem
{
    private String key;
    private String value;

    public ComboItem(String key, String value)
    {
        this.key = key;
        this.value = value;
    }

    @Override
    public String toString()
    {
        return key;
    }

    public String getKey()
    {
        return key;
    }

    public String getValue()
    {
        return value;
    }
}

public class FirebirdWorker {

    private final String USER_AGENT = "Mozilla/5.0";

    public Connection connection = null;
    public Statement statementAccruals = null;
    public Statement statementDecryption = null;
    public ResultSet accrualsResult = null;
    public ResultSet accrualsLength = null;
    public ResultSet paymentsLength = null;
    public ResultSet descriptionResult = null;
    public ResultSet countersResult = null;
    public ResultSet countersLength = null;
    public ResultSet paymentsResult = null;
    public int length = 0;

    public void Initialize(String ip, String port, String alias, String user, String password) {

        String dbURL = "jdbc:firebirdsql://" + ip + ":" + port + "/" + alias + "?encoding=WIN1251";

        try {
            Class.forName("org.firebirdsql.jdbc.FBDriver").newInstance();
        } catch (IllegalAccessException ex) {
            ex.printStackTrace();
        } catch (InstantiationException ex) {
            ex.printStackTrace();
        } catch (ClassNotFoundException ex) {
            ex.printStackTrace();
        }

        try {
            connection = DriverManager.getConnection(dbURL, user, password);
            if (connection == null) {
                System.err.println("Could not connect to database");
            }

            statementAccruals = connection.createStatement(
                    ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_READ_ONLY,
                    ResultSet.HOLD_CURSORS_OVER_COMMIT);
            statementDecryption = connection.createStatement(
                    ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_READ_ONLY);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public int getLength(String dateString, String OwnerId) {
        try {
            accrualsLength = statementAccruals.executeQuery("SELECT count(*) FROM \"PrKvartplataForBank\" ('" + dateString + "', " + OwnerId + ", 0, 1, 0);");

            while(accrualsLength.next())
            {
                length = Integer.parseInt(accrualsLength.getString("count"));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        try {
            countersLength = statementAccruals.executeQuery("SELECT count(*) FROM \"PrShowAllCounterPokazByDate\" (\'" + dateString + "\', " + OwnerId + ");");

            while(countersLength.next())
            {
                length += Integer.parseInt(countersLength.getString("count"));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        try {
            Date date = new SimpleDateFormat("yyyy-MM-dd",Locale.getDefault()).parse(dateString);
            int month = date.getMonth();
            SimpleDateFormat df = new SimpleDateFormat("yyyy");
            String year = df.format(date);
            paymentsLength = statementAccruals.executeQuery("SELECT count(*) FROM \"PrNachPG\" (" + year + ", " + month + ", " + OwnerId + ");");

            while(paymentsLength.next())
            {
                length += Integer.parseInt(paymentsLength.getString("count"));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return length;
    }

    public boolean prepareAccruals(String date, String OwnerId) {
        try {
            accrualsResult = statementAccruals.executeQuery("SELECT \n" +
                    "LSA, FAM, KOD_STR, DOM,\n" +
                    "IND, KORP, KV, DOLG, PREDPR,\n" +
                    "OKPO, MESYZ, GOD, NAZ, KOPLATE,\n" +
                    "OPL, SUBS, KOL, \"outCounterPokaz\",\n" +
                    "\"outIsCounter\", PLO, \"vLC_ID\", \"CityID\",\n" +
                    "\"Street\", \"DATEFirst\", \"vNachPoslug\", \"vNachPilg\",\n" +
                    "\"vRecalc\", \"DATELast\", \"ID_UslugGroup\", \"vFlatID\",\n" +
                    "\"vBuildingID\", \"MegaBankLC\", \"CodeERC\", TYPE_STR,\n" +
                    "\"CityCod\", \"StreetName\"\n" +
                    "FROM \"PrKvartplataForBank\" ('" + date + "', '" + OwnerId + "', 0, 1, 0);");
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean prepareAccrualDescription(String date, String LSA, String UslugId) {
        try {
            descriptionResult = statementDecryption.executeQuery("SELECT \"DateRecort\", LSA, FAM, KOD_STR, DOM, IND, KORP, KV, \n" +
                    "    \"Street\", \"ID_Uslug\", \"vFlatID\", \"vBuildingID\", \"NameUslug\", \"CodeUslug\",\n" +
                    "    \"NacCalcText\", \"NacPeriodText\", \"vLC_ID\", \"PilgiCalcText\",\n" +
                    "    \"PilgiPeriodText\", \"RecalcText\", \"RecalcPeriodText\", \"RecalcTaPilgiID\" \n" +
                    "FROM \"PrKvpltDetailText\" (\'" + date + "\', \'" + LSA + "\', " + UslugId + ");");
        } catch (SQLException ex) {
            ex.printStackTrace();
            return false;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean prepareCounters(String date, String OwnerId) {
        try {
            countersResult = statementAccruals.executeQuery("SELECT \"outNameKGP\", \"outExtCode\", \"outMesto\", \"outUslugName\", \"outValuePokaz\", \"outDatePokaz\", \"outOldPokaz\" , \"outCityID\",\n" +
                    "\"outNumber\", \"outLit\", \"outKorp\", \"outNomer\", \"ouDatePredPokaz\", \"outLicSh\", \"outIdKGP\", \"outUslugID\" \n" +
                    "FROM \"PrShowAllCounterPokazByDate\" (\'" + date + "\', " + OwnerId + ");");
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean preparePayments(String dateString, String OwnerId) {
        try {
            Date date = new SimpleDateFormat("yyyy-MM-dd",Locale.getDefault()).parse(dateString);
            int month = date.getMonth();
            SimpleDateFormat df = new SimpleDateFormat("yyyy");
            String year = df.format(date);
            paymentsResult = statementAccruals.executeQuery("SELECT \"CityID\", \"ExtCode\", \"Korp\", \"Build\", \"Flat\",\n" +
                    "    LC, \"RahunokSender\", \"RahunokRecipient\", \"GrUslugID\",\n" +
                    "    \"GrUslugName\", \"MFOSender\", \"MFORecipient\", \"OwnerEdrpou\", \"OwnerName\",\n" +
                    "    \"DatePay\", \"DateNach\", \"TransactID\", \"Summa\"\n" +
                    "FROM \"PrNachPG\" (\'" + year + "\', " + month + ", " + OwnerId + ");");
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return true;
    }


    public boolean getAccrual(Accrual accrual) {
        try {
            if (accrualsResult.next()) {
                if (accrualsResult.getObject(1) != null) {
                    accrual.LSA = accrualsResult.getObject(1).toString();
                } else {
                    accrual.LSA = null;
                }
                if (accrualsResult.getObject(2) != null) {
                    accrual.FAM = accrualsResult.getObject(2).toString();
                } else {
                    accrual.FAM = null;
                }
                if (accrualsResult.getObject(3) != null) {
                    accrual.KOD_STR = accrualsResult.getObject(3).toString();
                } else {
                    accrual.KOD_STR = null;
                }
                if (accrualsResult.getObject(4) != null) {
                    accrual.DOM = accrualsResult.getObject(4).toString();
                } else {
                    accrual.DOM = null;
                }
                if (accrualsResult.getObject(5) != null) {
                    accrual.IND = accrualsResult.getObject(5).toString();
                } else {
                    accrual.IND = null;
                }
                if (accrualsResult.getObject(6) != null) {
                    accrual.KORP = accrualsResult.getObject(6).toString();
                } else {
                    accrual.KORP = null;
                }
                if (accrualsResult.getObject(7) != null) {
                    accrual.KV = accrualsResult.getObject(7).toString();
                } else {
                    accrual.KV = null;
                }
                if (accrualsResult.getObject(8) != null) {
                    accrual.DOLG = accrualsResult.getObject(8).toString();
                } else {
                    accrual.DOLG = null;
                }
                if (accrualsResult.getObject(9) != null) {
                    accrual.PREDPR = accrualsResult.getObject(9).toString();
                } else {
                    accrual.PREDPR = null;
                }
                if (accrualsResult.getObject(10) != null) {
                    accrual.OKPO = accrualsResult.getObject(10).toString();
                } else {
                    accrual.OKPO = null;
                }
                if (accrualsResult.getObject(11) != null) {
                    accrual.MESYZ = accrualsResult.getObject(11).toString();
                } else {
                    accrual.MESYZ = null;
                }
                if (accrualsResult.getObject(12) != null) {
                    accrual.GOD = accrualsResult.getObject(12).toString();
                } else {
                    accrual.GOD = null;
                }
                if (accrualsResult.getObject(13) != null) {
                    accrual.NAZ = accrualsResult.getObject(13).toString();
                } else {
                    accrual.NAZ = null;
                }
                if (accrualsResult.getObject(14) != null) {
                    accrual.KOPLATE = accrualsResult.getObject(14).toString();
                } else {
                    accrual.KOPLATE = null;
                }
                if (accrualsResult.getObject(15) != null) {
                    accrual.OPL = accrualsResult.getObject(15).toString();
                } else {
                    accrual.OPL = null;
                }
                if (accrualsResult.getObject(16) != null) {
                    accrual.SUBS = accrualsResult.getObject(16).toString();
                } else {
                    accrual.SUBS = null;
                }
                if (accrualsResult.getObject(17) != null) {
                    accrual.KOL = accrualsResult.getObject(17).toString();
                } else {
                    accrual.KOL = null;
                }
                if (accrualsResult.getObject(18) != null) {
                    accrual.outCounterPokaz = accrualsResult.getObject(18).toString();
                } else {
                    accrual.outCounterPokaz = "";
                }
                if (accrualsResult.getObject(19) != null) {
                    accrual.outIsCounter = accrualsResult.getObject(19).toString();
                } else {
                    accrual.outIsCounter = null;
                }
                if (accrualsResult.getObject(20) != null) {
                    accrual.PLO = accrualsResult.getObject(20).toString();
                } else {
                    accrual.PLO = null;
                }
                if (accrualsResult.getObject(21) != null) {
                    accrual.vLC_ID = accrualsResult.getObject(21).toString();
                } else {
                    accrual.vLC_ID = null;
                }
                if (accrualsResult.getObject(22) != null) {
                    accrual.CityID = accrualsResult.getObject(22).toString();
                } else {
                    accrual.CityID = null;
                }
                if (accrualsResult.getObject(23) != null) {
                    accrual.Street = accrualsResult.getObject(23).toString();
                } else {
                    accrual.Street = null;
                }
                if (accrualsResult.getObject(24) != null) {
                    accrual.DATEFirst = accrualsResult.getObject(24).toString();
                } else {
                    accrual.DATEFirst = null;
                }
                if (accrualsResult.getObject(25) != null) {
                    accrual.vNachPoslug = accrualsResult.getObject(25).toString();
                } else {
                    accrual.vNachPoslug = null;
                }
                if (accrualsResult.getObject(26) != null) {
                    accrual.vNachPilg = accrualsResult.getObject(26).toString();
                } else {
                    accrual.vNachPilg = null;
                }
                if (accrualsResult.getObject(27) != null) {
                    accrual.vRecalc = accrualsResult.getObject(27).toString();
                } else {
                    accrual.vRecalc = null;
                }
                if (accrualsResult.getObject(28) != null) {
                    accrual.DATELast = accrualsResult.getObject(28).toString();
                } else {
                    accrual.DATELast = null;
                }
                if (accrualsResult.getObject(29) != null) {
                    accrual.ID_UslugGroup = accrualsResult.getObject(29).toString();
                } else {
                    accrual.ID_UslugGroup = null;
                }
                if (accrualsResult.getObject(30) != null) {
                    accrual.vFlatID = accrualsResult.getObject(30).toString();
                } else {
                    accrual.vFlatID = null;
                }
                if (accrualsResult.getObject(31) != null) {
                    accrual.vBuildingID = accrualsResult.getObject(31).toString();
                } else {
                    accrual.vBuildingID = null;
                }
                if (accrualsResult.getObject(32) != null) {
                    accrual.MegaBankLC = accrualsResult.getObject(32).toString();
                } else {
                    accrual.MegaBankLC = null;
                }
                if (accrualsResult.getObject(33) != null) {
                    accrual.CodeERC = accrualsResult.getObject(33).toString();
                } else {
                    accrual.CodeERC = null;
                }
                if (accrualsResult.getObject(34) != null) {
                    accrual.TYPE_STR = accrualsResult.getObject(34).toString();
                } else {
                    accrual.TYPE_STR = null;
                }
                if (accrualsResult.getObject(35) != null) {
                    accrual.CityCod = accrualsResult.getObject(35).toString();
                } else {
                    accrual.CityCod = null;
                }
                if (accrualsResult.getObject(36) != null) {
                    accrual.StreetName = accrualsResult.getObject(36).toString();
                } else {
                    accrual.StreetName = null;
                }
                return true;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return false;
    }

    public boolean getAccrualDecryption(DecryptionAccrual decryptionAccrual) {
        try {
            if (descriptionResult.next()) {
                if (descriptionResult.getObject(1) != null) {
                    decryptionAccrual.DateRecort = descriptionResult.getObject(1).toString();
                } else {
                    decryptionAccrual.DateRecort = null;
                }
                if (descriptionResult.getObject(2) != null) {
                    decryptionAccrual.LSA = descriptionResult.getObject(2).toString();
                } else {
                    decryptionAccrual.LSA = null;
                }
                if (descriptionResult.getObject(3) != null) {
                    decryptionAccrual.FAM = descriptionResult.getObject(3).toString();
                } else {
                    decryptionAccrual.FAM = null;
                }
                if (descriptionResult.getObject(4) != null) {
                    decryptionAccrual.KOD_STR = descriptionResult.getObject(4).toString();
                } else {
                    decryptionAccrual.KOD_STR = null;
                }
                if (descriptionResult.getObject(5) != null) {
                    decryptionAccrual.DOM = descriptionResult.getObject(5).toString();
                } else {
                    decryptionAccrual.DOM = null;
                }
                if (descriptionResult.getObject(6) != null) {
                    decryptionAccrual.IND = descriptionResult.getObject(6).toString();
                } else {
                    decryptionAccrual.IND = null;
                }
                if (descriptionResult.getObject(7) != null) {
                    decryptionAccrual.KORP = descriptionResult.getObject(7).toString();
                } else {
                    decryptionAccrual.KORP = null;
                }
                if (descriptionResult.getObject(8) != null) {
                    decryptionAccrual.KV = descriptionResult.getObject(8).toString();
                } else {
                    decryptionAccrual.KV = null;
                }
                if (descriptionResult.getObject(9) != null) {
                    decryptionAccrual.Street = descriptionResult.getObject(9).toString();
                } else {
                    decryptionAccrual.Street = null;
                }
                if (descriptionResult.getObject(10) != null) {
                    decryptionAccrual.ID_Uslug = descriptionResult.getObject(10).toString();
                } else {
                    decryptionAccrual.ID_Uslug = null;
                }
                if (descriptionResult.getObject(11) != null) {
                    decryptionAccrual.vFlatID = descriptionResult.getObject(11).toString();
                } else {
                    decryptionAccrual.vFlatID = null;
                }
                if (descriptionResult.getObject(12) != null) {
                    decryptionAccrual.vBuildingID = descriptionResult.getObject(12).toString();
                } else {
                    decryptionAccrual.vBuildingID = null;
                }
                if (descriptionResult.getObject(13) != null) {
                    decryptionAccrual.NameUslug = descriptionResult.getObject(13).toString();
                } else {
                    decryptionAccrual.NameUslug = null;
                }
                if (descriptionResult.getObject(14) != null) {
                    decryptionAccrual.CodeUslug = descriptionResult.getObject(14).toString();
                } else {
                    decryptionAccrual.CodeUslug = null;
                }
                if (descriptionResult.getObject(15) != null) {
                    decryptionAccrual.NacCalcText = descriptionResult.getObject(15).toString();
                } else {
                    decryptionAccrual.NacCalcText = null;
                }
                if (descriptionResult.getObject(16) != null) {
                    decryptionAccrual.NacPeriodText = descriptionResult.getObject(16).toString();
                } else {
                    decryptionAccrual.NacPeriodText = null;
                }
                if (descriptionResult.getObject(17) != null) {
                    decryptionAccrual.vLC_ID = descriptionResult.getObject(17).toString();
                } else {
                    decryptionAccrual.vLC_ID = null;
                }
                if (descriptionResult.getObject(18) != null) {
                    decryptionAccrual.PilgiCalcText = descriptionResult.getObject(18).toString();
                } else {
                    decryptionAccrual.PilgiCalcText = null;
                }
                if (descriptionResult.getObject(19) != null) {
                    decryptionAccrual.PilgiPeriodText = descriptionResult.getObject(19).toString();
                } else {
                    decryptionAccrual.PilgiPeriodText = null;
                }
                if (descriptionResult.getObject(20) != null) {
                    decryptionAccrual.RecalcText = descriptionResult.getObject(20).toString();
                } else {
                    decryptionAccrual.RecalcText = null;
                }
                if (descriptionResult.getObject(21) != null) {
                    decryptionAccrual.RecalcPeriodText = descriptionResult.getObject(21).toString();
                } else {
                    decryptionAccrual.RecalcPeriodText = null;
                }
                if (descriptionResult.getObject(22) != null) {
                    decryptionAccrual.RecalcTaPilgiID = descriptionResult.getObject(22).toString();
                } else {
                    decryptionAccrual.RecalcTaPilgiID = null;
                }
                return true;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return false;
    }

    public boolean getCounter(Counters counter) {
        try {
            if (countersResult.next()) {
                if (countersResult.getObject(1) != null) {
                    counter.outNameKGP = countersResult.getObject(1).toString();
                } else {
                    counter.outNameKGP = null;
                }
                if (countersResult.getObject(2) != null) {
                    counter.outExtCode = countersResult.getObject(2).toString();
                } else {
                    counter.outExtCode = null;
                }
                if (countersResult.getObject(3) != null) {
                    counter.outMesto = countersResult.getObject(3).toString();
                } else {
                    counter.outMesto = null;
                }
                if (countersResult.getObject(4) != null) {
                    counter.outUslugName = countersResult.getObject(4).toString();
                } else {
                    counter.outUslugName = null;
                }
                if (countersResult.getObject(5) != null) {
                    counter.outValuePokaz = countersResult.getObject(5).toString();
                } else {
                    counter.outValuePokaz = null;
                }
                if (countersResult.getObject(6) != null) {
                    counter.outDatePokaz = countersResult.getObject(6).toString();
                } else {
                    counter.outDatePokaz = null;
                }
                if (countersResult.getObject(7) != null) {
                    counter.outOldPokaz = countersResult.getObject(7).toString();
                } else {
                    counter.outOldPokaz = null;
                }
                if (countersResult.getObject(8) != null) {
                    counter.outCityID = countersResult.getObject(8).toString();
                } else {
                    counter.outCityID = null;
                }
                if (countersResult.getObject(9) != null) {
                    counter.outNumber = countersResult.getObject(9).toString();
                } else {
                    counter.outNumber = null;
                }
                if (countersResult.getObject(10) != null) {
                    counter.outLit = countersResult.getObject(10).toString();
                } else {
                    counter.outLit = null;
                }
                if (countersResult.getObject(11) != null) {
                    counter.outKorp = countersResult.getObject(11).toString();
                } else {
                    counter.outKorp = null;
                }
                if (countersResult.getObject(12) != null) {
                    counter.outNomer = countersResult.getObject(12).toString();
                } else {
                    counter.outNomer = null;
                }
                if (countersResult.getObject(13) != null) {
                    counter.outDatePredPokaz = countersResult.getObject(13).toString();
                } else {
                    counter.outDatePredPokaz = null;
                }
                if (countersResult.getObject(14) != null) {
                    counter.outLicSh = countersResult.getObject(14).toString();
                } else {
                    counter.outLicSh = null;
                }
                if (countersResult.getObject(15) != null) {
                    counter.outIdKGP = countersResult.getObject(15).toString();
                } else {
                    counter.outIdKGP = null;
                }
                if (countersResult.getObject(16) != null) {
                    counter.outUslugID = countersResult.getObject(16).toString();
                } else {
                    counter.outUslugID = null;
                }
                return true;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return false;
    }

    public boolean getPayment(Payment payment) {
        try {
            if (paymentsResult.next()) {
                if (paymentsResult.getObject(1) != null) {
                    payment.outCityID = paymentsResult.getObject(1).toString();
                } else {
                    payment.outCityID = null;
                }
                if (paymentsResult.getObject(2) != null) {
                    payment.outExtCode = paymentsResult.getObject(2).toString();
                } else {
                    payment.outExtCode = null;
                }
                if (paymentsResult.getObject(3) != null) {
                    payment.outKorp = paymentsResult.getObject(3).toString();
                } else {
                    payment.outKorp = null;
                }
                if (paymentsResult.getObject(4) != null) {
                    payment.outNumber = paymentsResult.getObject(4).toString();
                } else {
                    payment.outNumber = null;
                }
                if (paymentsResult.getObject(5) != null) {
                    payment.outNomer = paymentsResult.getObject(5).toString();
                } else {
                    payment.outNomer = null;
                }
                if (paymentsResult.getObject(6) != null) {
                    payment.outLicSh = paymentsResult.getObject(6).toString();
                } else {
                    payment.outLicSh = null;
                }
                if (paymentsResult.getObject(7) != null) {
                    payment.senderBankAccount = paymentsResult.getObject(7).toString();
                } else {
                    payment.senderBankAccount = null;
                }
                if (paymentsResult.getObject(8) != null) {
                    payment.recipientBankAccount = paymentsResult.getObject(8).toString();
                } else {
                    payment.recipientBankAccount = null;
                }
                if (paymentsResult.getObject(9) != null) {
                    payment.outUslugID = paymentsResult.getObject(9).toString();
                } else {
                    payment.outUslugID = null;
                }
                if (paymentsResult.getObject(10) != null) {
                    payment.outUslugName = paymentsResult.getObject(10).toString();
                } else {
                    payment.outUslugName = null;
                }
                if (paymentsResult.getObject(11) != null) {
                    payment.mfoSender = paymentsResult.getObject(11).toString();
                } else {
                    payment.mfoSender = null;
                }
                if (paymentsResult.getObject(12) != null) {
                    payment.mfoRecipient = paymentsResult.getObject(12).toString();
                } else {
                    payment.mfoRecipient = null;
                }
                if (paymentsResult.getObject(13) != null) {
                    payment.outEdrpouKGP = paymentsResult.getObject(13).toString();
                } else {
                    payment.outEdrpouKGP = null;
                }
                if (paymentsResult.getObject(14) != null) {
                    payment.outNameKGP = paymentsResult.getObject(14).toString();
                } else {
                    payment.outNameKGP = null;
                }
                if (paymentsResult.getObject(15) != null) {
                    payment.paymentDate = paymentsResult.getObject(15).toString();
                } else {
                    payment.paymentDate = null;
                }
                if (paymentsResult.getObject(16) != null) {
                    payment.dateOfEnrollment = paymentsResult.getObject(16).toString();
                } else {
                    payment.dateOfEnrollment = null;
                }
                if (paymentsResult.getObject(17) != null) {
                    payment.transactionId = paymentsResult.getObject(17).toString();
                } else {
                    payment.transactionId = null;
                }
                if (paymentsResult.getObject(18) != null) {
                    payment.amount = paymentsResult.getObject(18).toString();
                } else {
                    payment.amount = null;
                }

                return true;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return false;
    }

    public List<Owner> getOwners() {
        List<Owner> owners = new ArrayList<Owner>();
        ResultSet result = null;
        String query = "SELECT r.ID, r.\"Name\", r.\"NameFull\" FROM \"TaKGP\" r";

        try {
            result = statementAccruals.executeQuery(query);
            while(result.next())
            {
                Owner owner = new Owner();
                owner.id = result.getObject(1).toString();
                owner.name = result.getObject(2).toString();
                owners.add(owner);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return owners;
    }

    public boolean checkCloseDate(String chosenDate, String ownerId) {
        ResultSet result = null;
        String query = "SELECT \"Date\" FROM \"TaClosedPeriod\" where \"Owner_ID\"=" + ownerId + "and \"Type\"=0 and \"IsComplete\"=1"; // type: начисления, квартплата...
        boolean response = false;
        try {
            result = statementAccruals.executeQuery(query);
            while(result.next())
                try {
                    String closingDate = result.getObject(1).toString();
                    DateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
                    Date avaliableDate = format.parse(closingDate);
                    avaliableDate.setMonth(avaliableDate.getMonth() + 1);
                    if (format.parse(chosenDate).before(format.parse(closingDate)) || format.parse(chosenDate).equals(format.parse(closingDate))) {
                        response = true;
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                    return response;
                }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return response;
    }

    public Map<String, Service> getServices() {
        Map<String, Service> services = new HashMap<String, Service>();
        ResultSet servicesQuery = null;
        String query = "SELECT \"ID\", \"GroupName\" FROM \"TaUslugGroups\"";

        try {
            servicesQuery = statementAccruals.executeQuery(query);
            while(servicesQuery.next())
            {
                Service service = new Service();
                String key = servicesQuery.getObject(1).toString();
                service.name = servicesQuery.getObject(2).toString();
                services.put(key, service);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return services;
    }

    public void Release() {
        try {
            statementAccruals.close();
            statementDecryption.close();
            connection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

