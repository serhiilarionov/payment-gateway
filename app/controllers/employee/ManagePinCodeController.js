'use strict';

var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  iz = require('iz'),
  isAllow = require('../../policies/isAllow.js'),
  Promise = require("bluebird"),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');

module.exports = function(app) {
  app.use('/', router);
};

router.post('/get/renter/byAddress', isAllow, function(req, res) {
  var idHouse = req.param('idHouse');

  var idHouseRegExp = new RegExp('^[0-9]{20,20}$');

  if(!idHouseRegExp.test(idHouse)) {
    return res.status(400).json($rg(RC.INVALID_ADDRESS))
  }

  db.PinCode.getRenter(idHouse)
    .then(function(data) {
      if(data.length) {
        var numbers = [];
        data.forEach(function(number) {
          numbers.push(number.idHouse.substring(19, 20));
        });
        res.status(200).json(numbers);
      } else {
        res.status(400).json($rg(RC.RENTER_NOT_FOUND));
      }
    })
    .catch(function(err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.post('/generate/pinCode', isAllow, function(req, res) {
  var idHouse = req.param('idHouse'),
      address = req.param('addressObj'),
      whenIssuedPassport = req.param('whenIssuedPassport'),
      issuedPassport = req.param('issuedPassport'),
      passportNumber = req.param('passportNumber'),
      firstName = req.param('firstName'),
      lastName = req.param('lastName'),
      patronymic = req.param('patronymic');
  var idHouseRegExp = new RegExp('^[0-9]{20,20}$');

  if(!idHouseRegExp.test(idHouse)) {
    return res.status(400).json($rg(RC.INVALID_ADDRESS))
  }
  if(!address) {
    return res.status(400).json($rg(RC.INVALID_ADDRESS))
  }
  if(!whenIssuedPassport) {
    return res.status(400).json($rg(RC.EMPTY_WHEN_ISSUED_PASSPORT))
  }
  if(!issuedPassport) {
    return res.status(400).json($rg(RC.EMPTY_ISSUED_PASSPORT))
  }
  if(!passportNumber) {
    return res.status(400).json($rg(RC.EMPTY_PASSPORT_NUMBER))
  }
  if(!firstName) {
    return res.status(400).json($rg(RC.EMPTY_FIRST_NAME))
  }
  if(!lastName) {
    return res.status(400).json($rg(RC.EMPTY_LAST_NAME))
  }
  if(!patronymic) {
    return res.status(400).json($rg(RC.EMPTY_PATRONYMIC))
  }

  var dateOfGeneratedPin = new Date(),
      textMonth = (dateOfGeneratedPin.getMonth() + 1),
      textDay = dateOfGeneratedPin.getDate();

  if(textMonth < 10) {
    textMonth = '0' + textMonth;
  }
  if(textDay < 10) {
    textDay = '0' + textDay;
  }
  var textDate = textDay + '.' + textMonth + '.' + dateOfGeneratedPin.getFullYear();
  var pinCode = Math.round((Math.random() * 8999) + 1000);
  db.PinCode.addPinCode(idHouse, pinCode, whenIssuedPassport, issuedPassport, passportNumber, firstName, lastName, patronymic)
    .then(function(data) {
      req.session.user.pinCodeData = {
        address: address,
        whenIssuedPassport: whenIssuedPassport,
        issuedPassport: issuedPassport,
        passportNumber: passportNumber,
        firstName: firstName,
        lastName: lastName,
        patronymic: patronymic,
        pinCode: pinCode,
        date: textDate,
        number: data.id
      };
      res.status(200).json(data.count);
    })
    .catch(function(err) {
      return res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});

router.get('/generate/pinCode', isAllow, function(req, res) {
  if(req.session.user.pinCodeData !== undefined) {
    var pinCodeData = req.session.user.pinCodeData;
    delete req.session.user.pinCodeData;
    res.render('PinCodePrint', {
      address: pinCodeData.address,
      whenIssuedPassport: pinCodeData.whenIssuedPassport,
      issuedPassport: pinCodeData.issuedPassport,
      passportNumber: pinCodeData.passportNumber,
      firstName: pinCodeData.firstName,
      lastName: pinCodeData.lastName,
      patronymic: pinCodeData.patronymic,
      pinCode: pinCodeData.pinCode,
      date: pinCodeData.date,
      number: pinCodeData.number
    });
  } else {
    return res.status(404).json($rg(RC.NOT_FOUND));
  }
});