package com.softproject;
    //1-3 - код город
    //4-7 - код улицы
    //8-10 - №дома
    //11-12 - корпус дома
    //13-14 - буква дома (01 -а, 02 - б...)
    //15-17 - №квартиры
    //18-19 - буква квартиры
    //20 - №нанимателя
public class GeneratorIdHouse {


    private static String appendingZeros(Integer number, Integer length) {
        String count = "" + number;
        while (count.length() < length) {
            count = '0' + count;
        }
        return count;
    }

    public static String generateIdHouse(Integer[] userDate) {
        String idHouse = "";
        for (int i = 0; i < userDate.length; i++) {
            switch (i) {
                case 0: {
                    if (userDate[i] != null) {
                        String city = GeneratorIdHouse.appendingZeros(userDate[i], 3);
                        idHouse += city;
                    } else {
                        System.out.println("city error");
                    }
                }
                break;
                case 1: {
                    if (userDate[i] != null) {
                        String street = GeneratorIdHouse.appendingZeros(userDate[i], 4);
                        idHouse += street;
                    } else {
                        System.out.println("street error");
                    }
                }
                break;
                case 2: {
                    if (userDate[i] != null) {
                        String building_number = GeneratorIdHouse.appendingZeros(userDate[i], 3);
                        idHouse += building_number;
                    } else {
                        System.out.println("street error");
                    }
                }
                break;
                case 3: {
                    if (userDate[i] != null) {
                        String building_housing = GeneratorIdHouse.appendingZeros(userDate[i], 2);
                        idHouse += building_housing;
                    } else {
                        System.out.println("building_housing error");
                    }
                }
                break;
                case 4: {
                    if (userDate[i] != null) {
                        String building_letter = GeneratorIdHouse.appendingZeros(userDate[i], 2);
                        idHouse += building_letter;
                    } else {
                        System.out.println("building_letter error");
                    }
                }
                break;
                case 5: {
                    if (userDate[i] != null) {
                        String flats_number = GeneratorIdHouse.appendingZeros(userDate[i], 3);
                        idHouse += flats_number;
                    } else {
                        System.out.println("building_letter error");
                    }
                }
                break;
                case 6: {
                    if (userDate[i] != null) {
                        String flats_letter = GeneratorIdHouse.appendingZeros(userDate[i], 2);
                        idHouse += flats_letter;
                    } else {
                        System.out.println("building_letter error");
                    }
                }
                break;
                case 7: {
                    if (userDate[i] != null) {
                        idHouse += userDate[i];
                    } else {
                        System.out.println("renter error");
                    }
                }
                break;
                default:
                    System.out.println("address error");
            }
        }
        return idHouse;
    }
}