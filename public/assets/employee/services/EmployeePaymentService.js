'use strict';

angular.module('employeeApp')
  .service('employeePaymentService', function($http, $q, uiGridConstants) {

    this.getPayments = function (idHouse, year, month, companyId) {
      var deferred = $q.defer();
      $http.post('/get/payments', {
        year: year,
        month: month,
        idHouse: idHouse,
        companyId: companyId
      })
        .success(function (data) {
          var payments = [];
          for(var i= 0; i < data.length; i++) {
            var paymentDate = new Date(data[i].paymentDate),
            dateOfEnrollment = new Date(data[i].dateOfEnrollment),
            paymentMonth = paymentDate.getMonth() + 1,
            monthOfEnrollment = dateOfEnrollment.getMonth() + 1,
            dayOfPayment = paymentDate.getDate(),
            dayOfEnrollment = dateOfEnrollment.getDate();
            if (paymentMonth < 10) {
              paymentMonth = '0' + paymentMonth;
            }
            if (monthOfEnrollment < 10) {
              monthOfEnrollment = '0' + monthOfEnrollment;
            }
            if (paymentDate.getDate() < 10) {
              dayOfPayment = '0' + paymentDate.getDate();
            }
            if (dateOfEnrollment.getDate() < 10) {
              dayOfEnrollment = '0' + dateOfEnrollment.getDate();
            }
            var paymentTextDate = dayOfPayment + '.' + paymentMonth + '.' + paymentDate.getFullYear();
            var textDateOfEnrollment = dayOfEnrollment + '.' + monthOfEnrollment + '.' + dateOfEnrollment.getFullYear();
            payments.push({
              "Особовий рахунок": data[i].personalAccount,
              "Підприємство": data[i].companyName,
              "Послуга": data[i].serviceName,
              "Банк": data[i].bankName,
              "Сума": data[i].amount,
              "Дата платежу": paymentTextDate,
              "Дата зарахування": textDateOfEnrollment
            });
          }
          deferred.resolve(payments);
        })
        .error(function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.minYear = function (idHouse) {
      var deferred = $q.defer();
      $http.post('/get/payments/year/minimal', {
        idHouse: idHouse
      })
        .success(function (minYear) {
          if(minYear != null) {
            var years = [], yearNow = new Date().getFullYear();
            for(var i = minYear; i <= yearNow; i++) {
              years.push(i);
            }
            deferred.resolve(years);
          } else {
            deferred.resolve([]);
          }
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.getEmployeeData = function() {
      var deferred = $q.defer();
      $http.post('/get/employee/info')
        .success(function (employee) {
          if(employee != null) {
            deferred.resolve(employee);
          } else {
            deferred.resolve([]);
          }
        })
        .error(function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  });