package com.softproject;


import java.util.HashMap;
import java.util.Map;

public class AddressParser {
    public static String parse(String city, String street,String buildingNumber,String addressHousing, String flatNumber, String flatLetter) {
        String buildingLetter = null;
        String idHouse = "";
        Integer buildingLetterIndex = 0;
        Integer flatLetterIndex = 0;
        String renter = "0";
        String charFlatNumber = "";
        String charBuildingNumber = "";
        String charAddressHousing = "";
        if(city == null || city == "") {
            return null;
        }
        if(street == null || street == "") {
            return null;
        }
        if(buildingNumber == null || buildingNumber == "") {
            return null;
        }
        if(addressHousing == null || addressHousing == "") {
            addressHousing = "0";
        }
        if(flatNumber == null || flatNumber == "") {
            flatNumber="0";
        }
        Map<String, Letter> letters = new HashMap<String, Letter>();
        letters.put(" ", new Letter(0, " "));
        letters.put("a", new Letter(1, "a"));
        letters.put("б", new Letter(2, "б"));
        letters.put("в", new Letter(3, "в"));
        letters.put("г", new Letter(4, "г"));
        letters.put("д", new Letter(5, "д"));
        letters.put("е", new Letter(6, "е"));
        letters.put("ж", new Letter(7, "ж"));
        letters.put("з", new Letter(8, "з"));
        letters.put("л", new Letter(9, "л"));
        letters.put("к", new Letter(10, "к"));
        letters.put("а", new Letter(1, "а"));
        int buildindSlash = buildingNumber.indexOf('/');
        int buildingLength = buildingNumber.length();
        for(int l = 0; l < buildingLength; l++) {
            String index = Character.toString(buildingNumber.charAt(l));
            if(l < 3 && !index.replaceAll("\\D","").equals("")) {
                charBuildingNumber+=index;
            } else { break; }
        }
        if(buildingNumber.indexOf('/') > -1) {
            if(addressHousing == null) {
                addressHousing = buildingNumber.substring(buildindSlash + 1);
            }
            if(addressHousing.length() > 2) {
                for (int l = buildindSlash + 1; l < buildindSlash + 3; l++) {
                    String index = Character.toString(buildingNumber.charAt(l));
                    if (!index.replaceAll("\\D","").equals("")) {
                        charAddressHousing+=index;
                    } else { break; }
                }
            }
        }
        buildingLetter = buildingNumber.replaceAll("[^A-zА-я]|_","");
        buildingNumber = charBuildingNumber;
        if(!buildingLetter.isEmpty()) {
            try {
                buildingLetterIndex = letters.get(buildingLetter.toLowerCase()).id;
            } catch (Exception e){
                e.printStackTrace();
            }
        }
        int flatSlash = flatNumber.indexOf('/');
        int flatLength = flatNumber.length();
        for(int l = 0; l < flatLength; l++) {
            String index = Character.toString(flatNumber.charAt(l));
            if(l < 3 && !index.replaceAll("\\D","").equals("")) {
                charFlatNumber+=index;
            } else { break; }
        }
        if(flatNumber.indexOf('/') > -1) {
            renter = flatNumber.substring(flatSlash + 1);
            if(renter.length() > 1) {
                if(!flatNumber.substring(flatSlash + 1, flatSlash + 2).replaceAll("\\D", "").equals("") &&
                        (flatNumber.substring(flatSlash + 2, flatSlash + 3).replaceAll("\\D", "").equals(""))) {
                    renter = flatNumber.substring(flatSlash + 1, flatSlash + 2).replaceAll("\\D", "");
                } else { renter = "0"; }
            }
        }
        flatLetter = flatNumber.replaceAll("[^A-zА-я]|_","");
        flatNumber = charFlatNumber;
        if(!flatLetter.isEmpty()) {
            try {
                flatLetterIndex = letters.get(flatLetter.toLowerCase()).id;
            } catch (Exception e){
                e.printStackTrace();
            }
        }
        try {
            Integer address[] = {Integer.parseInt(city), Integer.parseInt(street), Integer.parseInt(buildingNumber),
                    Integer.parseInt(addressHousing), buildingLetterIndex, Integer.parseInt(flatNumber),
                    flatLetterIndex, Integer.parseInt(renter)};
            idHouse = GeneratorIdHouse.generateIdHouse(address);
        } catch(Exception e) {
            e.printStackTrace();
        }
        return idHouse;
    }
}
