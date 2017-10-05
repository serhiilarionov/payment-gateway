package com.softproject;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class DataProcessing {
    public static Map<String, String> AccrualProcessing(Accrual accrual, Map<String, Service> services) {
        Map<String, String> errors = new HashMap<String, String>();
        Map<String, String> accrualMap = new HashMap<String, String>();

        String fam = accrual.FAM;
        String idUslugGroup = accrual.ID_UslugGroup;
        String dolg = accrual.DOLG;
        String naz = accrual.NAZ;
        String koplate = accrual.KOPLATE;
        String opl = accrual.OPL;
        String lsa = accrual.LSA;

        if (lsa == null || lsa == "") {
            errors.put("error", "LSA");
            return errors;
        }

        if (dolg == null || dolg == "") {
            errors.put("error", "DOLG");
            return errors;
        }
        if (naz == null || naz == "") {
            errors.put("error", "NAZ");
            return errors;
        }
        if (koplate == null || koplate == "") {
            errors.put("error", "KOPLATE");
            return errors;
        }
        if (opl == null || opl == "") {
            errors.put("error", "OPL");
            return errors;
        }

        if (fam == null || fam == "") {
            accrualMap.put("lastName", "");
            accrualMap.put("firstName", "");
            accrualMap.put("patronymic", "");
        } else {
            String[] name = fam.trim().split("\\s+");
            if (name.length == 3) {
                accrualMap.put("lastName", name[0]);
                accrualMap.put("firstName", name[1]);
                accrualMap.put("patronymic", name[2]);
            } else {
                String FAM = accrual.FAM.replaceAll("  ", " ");
                int firstIndex = FAM.indexOf(' ');
                int secondIndex = FAM.indexOf(' ', firstIndex + 1);
                accrualMap.put("lastName", (FAM.substring(0, firstIndex)).replaceAll("\\'", "’"));
                accrualMap.put("firstName", (FAM.substring(firstIndex + 1, secondIndex)).replaceAll("\\'", "’"));
                accrualMap.put("patronymic", (FAM.substring(FAM.indexOf(' ', secondIndex) + 1)).replaceAll("\\'", "’"));
                ;
            }
        }
        if (idUslugGroup == null || idUslugGroup == "") {
            errors.put("error", "ID_UslugGroup");
            return errors;
        }
        String serviceName = services.get(idUslugGroup).name;
        if (serviceName == null || serviceName == "") {
            errors.put("error", "UslugGroupName");
            return errors;
        }
        accrualMap.put("number", lsa);
        accrualMap.put("serviceId", idUslugGroup);
        accrualMap.put("serviceName", serviceName);
        accrualMap.put("debt", dolg);
        accrualMap.put("accrual", naz);
        accrualMap.put("forPayment", koplate);
        accrualMap.put("paid", opl);
        return accrualMap;
    }

    public static String calC(String input) throws ScriptException {
        if(Objects.equals(input, "") || input == null)
            return "";
        double result = 0;
        ScriptEngineManager mgr = new ScriptEngineManager();
        ScriptEngine engine = mgr.getEngineByName("JavaScript");
        try {
            if (!input.matches("[а-яА-Я]+") && input.length() > 0) {
                result = (Double) engine.eval(input);
            }
            else
                return "";
        } catch (Exception e) {
            e.printStackTrace();
        }
        double finalValue = Math.round( result * 100.0 ) / 100.0;
        return " = " + finalValue;
    }

    public static String[] DecryptionAccrualProcessing(DecryptionAccrual decryptionAccruals) {
        String[] transcript = new String[4];
        if (Integer.parseInt(decryptionAccruals.DateRecort) == 0) {
            String NacCalcText = decryptionAccruals.NacCalcText;
            String NacPeriodText = decryptionAccruals.NacPeriodText;
            String NameUslug = decryptionAccruals.NameUslug;
            String RezultNacCalcText = "";
            try {
                RezultNacCalcText = calC(NacCalcText);
            } catch (ScriptException e) {
                e.printStackTrace();
            }

            if (NacCalcText != null || NacPeriodText != null || NameUslug != null) {
                transcript[0] = decryptionAccruals.DateRecort;
                transcript[1] = "";
                if (NacCalcText != null)
                    transcript[1] += NacCalcText + RezultNacCalcText;
                if (NacPeriodText != null)
                    transcript[1] += " (" + NacPeriodText + ").";
                transcript[2] = decryptionAccruals.ID_Uslug;
                transcript[3] = NameUslug;
            }
        } else {
            if (Integer.parseInt(decryptionAccruals.DateRecort) == 1) {
                String PilgiCalcText = decryptionAccruals.PilgiCalcText;
                String PilgiPeriodText = decryptionAccruals.PilgiPeriodText;
                String NameUslug = decryptionAccruals.NameUslug;
                String RezultPilgiCalcText = "";
                try {
                    RezultPilgiCalcText = calC(PilgiCalcText);
                } catch (ScriptException e) {
                    e.printStackTrace();
                }
                if (PilgiCalcText != null || PilgiPeriodText != null || NameUslug != null) {
                    transcript[0] = decryptionAccruals.DateRecort;
                    transcript[1] = "";
                    if (PilgiCalcText != null)
                        transcript[1] += PilgiCalcText + RezultPilgiCalcText;
                    if (PilgiPeriodText != null)
                        transcript[1] += " (" + PilgiPeriodText + ").";
                    transcript[2] = decryptionAccruals.ID_Uslug;
                    transcript[3] = NameUslug;

                }
            } else {
                if (Integer.parseInt(decryptionAccruals.DateRecort) == 3) {
                    String NacCalcText = decryptionAccruals.NacCalcText;
                    String NacPeriodText = decryptionAccruals.NacPeriodText;
                    String NameUslug = decryptionAccruals.NameUslug;
                    String RezultNacCalcText = "";
                    try {
                        RezultNacCalcText = calC(NacCalcText);
                    } catch (ScriptException e) {
                        e.printStackTrace();
                    }
                    if (NacCalcText != null || NacPeriodText != null || NameUslug != null) {
                        transcript[0] = decryptionAccruals.DateRecort;
                        transcript[1] = "";
                        if (NacCalcText != null)
                            transcript[1] += NacCalcText + RezultNacCalcText;
                        if (NacPeriodText != null)
                            transcript[1] += " (" + NacPeriodText + ").";
                        transcript[2] = decryptionAccruals.ID_Uslug;
                        transcript[3] = NameUslug;
                    }
                } else {
                    if (Integer.parseInt(decryptionAccruals.DateRecort) == 4) {
                        String RecalcText = decryptionAccruals.RecalcText;
                        String RecalcPeriodText = decryptionAccruals.RecalcPeriodText;
                        String NameUslug = decryptionAccruals.NameUslug;
                        String RezultRecalcText = "";
                        try {
                            RezultRecalcText = calC(RecalcText);
                        } catch (ScriptException e) {
                            e.printStackTrace();
                        }
                        if (RecalcText != null || RecalcPeriodText != null || NameUslug != null) {
                            transcript[0] = decryptionAccruals.DateRecort;
                            transcript[1] = "";
                            if (RecalcText != null)
                                transcript[1] += RecalcText + RezultRecalcText;
                            if (RecalcPeriodText != null)
                                transcript[1] += " (" + RecalcPeriodText + ").";
                            transcript[2] = decryptionAccruals.ID_Uslug;
                            transcript[3] = NameUslug;
                        }
                    }
                }
            }
        }
        return transcript;
    }

    public static Map<String, String> CounterProcessing(Counters counter) {
        Map<String, String> errors = new HashMap<String, String>();
        Map<String, String> counterMap = new HashMap<String, String>();

        counterMap.put("Mesto", counter.outMesto);
        counterMap.put("OldPokaz", counter.outOldPokaz);

        if(counter.outLicSh == null || counter.outLicSh == "") {
            errors.put("error", "outLicSh");
            return errors;
        }
        else
            counterMap.put("LicSh", counter.outLicSh);

        if(counter.outUslugID == null || counter.outUslugID == "") {
            errors.put("error", "outUslugID");
            return errors;
        }
        else
            counterMap.put("serviceId", counter.outUslugID);

        if(counter.outUslugName == null || counter.outUslugName == "") {
            errors.put("error", "outUslugName");
            return errors;
        }
        else
            counterMap.put("serviceName", counter.outUslugName);

        if(counter.outDatePokaz == null || counter.outDatePokaz == "") {
            errors.put("error", "outDatePokaz");
            return errors;
        }
        else
            counterMap.put("outDatePokaz", counter.outDatePokaz);

        return counterMap;

    }

    public static Map<String, String> PaymentProcessing(Payment payment) {
        Map<String, String> errors = new HashMap<String, String>();
        Map<String, String> counterMap = new HashMap<String, String>();

        counterMap.put("transactionId", payment.transactionId);
        counterMap.put("mfoRecipient", payment.mfoRecipient);
        counterMap.put("recipientBankAccount", payment.recipientBankAccount);

        if(payment.outLicSh == null || payment.outLicSh == "") {
            errors.put("error", "outLicSh");
            return errors;
        }
        else
            counterMap.put("personalAccount", payment.outLicSh);

        if(payment.amount == null || payment.amount == "") {
            errors.put("error", "amount");
            return errors;
        }
        else
            counterMap.put("amount", payment.amount);

        if(payment.senderBankAccount == null || payment.senderBankAccount == "") {
            errors.put("error", "senderBankAccount");
            return errors;
        }
        else
            counterMap.put("senderBankAccount", payment.senderBankAccount);

        if(payment.mfoSender == null || payment.mfoSender == "") {
            errors.put("error", "mfoSender");
            return errors;
        }
        else
            counterMap.put("mfoSender", payment.mfoSender);

        if(payment.paymentDate == null || payment.paymentDate == "") {
            errors.put("error", "paymentDate");
            return errors;
        }
        else
            counterMap.put("paymentDate", payment.paymentDate);

        if(payment.dateOfEnrollment == null || payment.dateOfEnrollment == "") {
            errors.put("error", "dateOfEnrollment");
            return errors;
        }
        else
            counterMap.put("dateOfEnrollment", payment.dateOfEnrollment);

        if(payment.outUslugID == null || payment.outUslugID == "") {
            errors.put("error", "outUslugID");
            return errors;
        }
        else
            counterMap.put("serviceId", payment.outUslugID);

        if(payment.outUslugName == null || payment.outUslugName == "") {
            errors.put("error", "outUslugName");
            return errors;
        }
        else
            counterMap.put("serviceName", payment.outUslugName);
        return counterMap;

    }
}
