'use strict';

/**
 * @todo: Описать сервис GeneratorIdHouseService и каждую его функцию
 */

angular.module('userApp').service('GeneratorIdHouseService', function() {

  //1-3 - код город
  //4-7 - код улицы
  //8-10 - №дома
  //11-12 - корпус дома
  //13-14 - буква дома (01 -а, 02 - б...)
  //15-17 - №квартиры
  //18-19 - буква квартиры
  //20 - №нанимателя
  this.appendingZeros = function(number, length){
    var count = '' + number;
    while (count.length < length) {
      count = '0' + count;
    }
    return count;
  };
  this.genereteIdHouse = function(userDate) {
    var idHouse = "";
    for(var i=0; i<userDate.length;i++){
      switch (i) {
        case 0:
        {
          if (userDate[i]) {
            var city = this.appendingZeros(userDate[i].id, 3);
            idHouse += city;
          } else {
            return false;
          }
        } break;
        case 1:{
          if (userDate[i]) {
            var street = this.appendingZeros(userDate[i].id, 4);
            idHouse += street;
          } else {
            return false;
          }
        } break;
        case 2:{
          if (userDate[i]) {
            var building_number = this.appendingZeros(userDate[i], 3);
            idHouse += building_number;
          } else {
            return false;
          }
        } break;
        case 3:{
          if (userDate[i]) {
            var building_housing = this.appendingZeros(userDate[i], 2);
            idHouse += building_housing;
          } else {
            idHouse += "00";
          }
        } break;
        case 4:{
          if (userDate[i]) {
            var building_letter = this.appendingZeros(userDate[i], 2);
            idHouse += building_letter;
          } else {
            idHouse += "00";
          }
        } break;
        case 5:{
          if (typeof(userDate[i]) != 'undefined' && userDate[i] != null && userDate[i] != '') {
            var flats_number = this.appendingZeros(userDate[i], 3);
            idHouse += flats_number;
          } else {
            idHouse += '000';
          }
        } break;
        case 6:{
          if (userDate[i]) {
            var flats_letter = this.appendingZeros(userDate[i], 2);
            idHouse += flats_letter;
          } else {
            idHouse += "00";
          }
        } break;
        case 7:{
          if (userDate[i]) {
            idHouse += userDate[i];
          } else {
            idHouse += '0';
          }
        } break;
        default:
          alert('Помилка при введенні адреси')
      }
    }
    return idHouse;
  };
});