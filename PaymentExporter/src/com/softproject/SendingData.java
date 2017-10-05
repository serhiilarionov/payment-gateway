package com.softproject;

import org.codehaus.jettison.json.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class SendingData {
    static {
        javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(
                new javax.net.ssl.HostnameVerifier(){

                    public boolean verify(String hostname, javax.net.ssl.SSLSession sslSession) {
                        return true;
                    }
                });
    }
    public static Map<String, String> Delete(String exportUrl, JSONObject json, String certificatePassword, String type) throws Exception {
        String keystore = "keystore.jks";
        System.setProperty("javax.net.ssl.trustStore", keystore);
        System.setProperty("javax.net.ssl.trustStorePassword", certificatePassword);
        System.setProperty("javax.net.ssl.keyStore", keystore);
        System.setProperty("javax.net.ssl.keyStorePassword", certificatePassword);

        Map<String, String> response = new HashMap<String, String>();
        String res = "";
        try {
            HttpsURLConnection con = null;
            try {
                URL url = new URL(exportUrl + "/delete/" + type);
                con = (HttpsURLConnection) url.openConnection();
            } catch (Exception e) {
                e.printStackTrace();
                if (con != null)
                    con.disconnect();
                throw e;
            }

            if (con == null) {
                throw new Exception("Failed to open HTTPS Conenction");
            }

            con.setRequestMethod("POST");
            con.setRequestProperty("User-Agent", "Mozilla/5.0");
            con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
            con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            con.setRequestProperty("Accept", "application/json");
            con.setDoInput(true);
            con.setDoOutput(true);
            OutputStream os = con.getOutputStream();

            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
            writer.write(json.toString());
            writer.flush();
            writer.close();
            os.close();

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream(), "UTF-8"));
            String line = null;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
                res += line;
            }
            in.close();
            response.put("true", res);
            return response;
        } catch (Exception t) {
            t.printStackTrace();
            response.put("false", t.toString());
            return response;
        }
    }

    public static Map<String, String> Add(String exportUrl, JSONObject json, String certificatePassword, String type) throws Exception {
        Map<String, String> response = new HashMap<String, String>();
        String res = "";

        try {
            HttpsURLConnection con = null;
            try {
                URL url = new URL(exportUrl+"/add/" + type);
                con = (HttpsURLConnection) url.openConnection();
            }catch(Exception e){
                e.printStackTrace();
                if(con != null)
                    con.disconnect();
                throw e;
            }

            if(con==null){
                throw new Exception ("Failed to open HTTPS Conenction");
            }
            con.setRequestMethod("POST");
            con.setRequestProperty("User-Agent", "Mozilla/5.0");
            con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
            con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            con.setRequestProperty("Accept", "application/json");
            con.setRequestProperty("Connection", "Keep-Alive");
            con.setRequestProperty("Keep-Alive", "header");
            con.setDoInput(true);
            con.setDoOutput(true);
            OutputStream os = con.getOutputStream();

            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));

            writer.write(json.toString());
            writer.flush();
            writer.close();
            os.close();
            json.remove("accruals");

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream(), "UTF-8"));
            String line = null;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
                res += line;
            }
            in.close();
            response.put("true", res);
            return response;
        } catch (Exception t) {
            t.printStackTrace();
            response.put("false", t.toString());
            return response;
        }
    }
}