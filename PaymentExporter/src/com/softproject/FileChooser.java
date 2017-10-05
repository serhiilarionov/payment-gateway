package com.softproject;

import javax.swing.*;
import javax.swing.filechooser.FileFilter;
import java.io.File;

public class FileChooser extends JFrame {
    private static File selectedFile;

    public File Choose() {
        setBounds(0, 0, 500, 500);
        JFileChooser chooser = new JFileChooser();
        chooser.setCurrentDirectory(new File("."));
        chooser.setDialogTitle("Вкажіть шлях до вашого сертифікату");
        chooser.setFileFilter(new FileFilter() {
            public boolean accept(File f) {
                return f.getName().toLowerCase().endsWith(".crt")
                        || f.isDirectory();
            }

            @Override
            public String getDescription() {
                return "Certificate keys (*.crt)";
            }
        });

        int result = chooser.showOpenDialog(this);
        if(result == JFileChooser.APPROVE_OPTION) {
            selectedFile = chooser.getSelectedFile();
            return selectedFile;
        } else {
            return null;
        }
    }
}
