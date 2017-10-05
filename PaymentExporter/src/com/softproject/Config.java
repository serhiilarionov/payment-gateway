package com.softproject;

import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

public class Config {
    Properties properties;

    public Config() {
        properties = new Properties();
        try {
            properties.load(new FileInputStream("./config.properties"));
        } catch (IOException e) {
            String time = new SimpleDateFormat("HH:mm:ss yyyy-MM-dd").format(new Date());
            FileWorker.write("./logs.txt", time + ' ' + e + "\n");
            System.out.println(e);
        }
    }

    public String getProperty(String key) {
        String value = properties.getProperty(key);
        return value;
    }
}
