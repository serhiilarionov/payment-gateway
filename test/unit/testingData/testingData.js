'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {
  nonexistentLogin: 'nonexistentLogin',
  idHouse: '00000000010200003004',
  newUserInfo: {
    id: null,
    userLogin: "test" + Math.floor((Math.random() * 100000)),
    userFio: "test test test",
    userEmail: "sdfsdfdsf_1999@mail.ru",
    userCity: {
      id: 0
    },
    userCompany: {
      id: 0
    },
    userRole: 'administrator',
    userCertTerm: 30
  },
  url: 'https://localhost:3000',
  verificationLink: 'id=o4zn0zfr',
  confirmRegistrationData: {
    id: 'o4zn0zfr',
    userMailPass: 'esvy4x6r',
    userNewPass2: '123321'
  },
  certificateData: {
    userLogin: Math.floor(Math.random() * 100000) + "test" + Math.floor(Math.random() * 100000),
    userFio: "Test\\ Test\\ Test",
    userEmail: "mail.user.pg@mail.ru",
    days: 30,
    userPass: 123123
  },
  mailData: {
    userEmail: 'mupah@alivance.com',
    userLogin: 'test',
    userPassword: 'qwerty123',
    userLink: 'google.com'
  },
  PdOpt: {
    id: null,
    idHouse: "00000000010200003004",
    hash: '11111',
    date: '2015.11.01',
    sum: 1,
    payer: {
      id: "168281",
      value: "Надточій Василь Тимофійович"
    },
    payments: [
      {
        accrual: "8.07",
        companyName: "КП «Новозаводське» ЧМР",
        counters: [
          {
            date: "2014-11-01T09:55:01.707Z",
            id: 1,
            idHouse: "00000000010200003004",
            meterReading: null,
            position: null
          }
        ],
        debt: "8.07",
        fio: "Лазаренко Ольга Тимофіївна",
        forPayment: "8.07",
        id: 168272,
        leftToPay: "6.14",
        number: "030002-1",
        paid: "10",
        serviceName: "Електроенергія",
        startDate: "2014-11-01",
        endDate: "2014-11-30",
        toPay: "123",
        transcript: "Нарахування..."
      }
    ]
  },
  paymentsPaymentDocument: {
  },
  serverOptions: {
    key: fs.readFileSync('app/certificates/CA/ca.key'),
    cert: fs.readFileSync('app/certificates/CA/ca.crt'),
    ca: fs.readFileSync('app/certificates/CA/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false,
    crl: fs.readFileSync('app/certificates/configs/ca.crl')
  },
  payment: {
    personalAccount: '123123123',
    idHouse: '00000000010200003004',
    mfoSender: 300002,
    mfoRecipient: 300005,
    amount: 12.5,
    paymentDate: '11.11.2014',
    dateOfEnrollment: '11.11.2014',
    year: 2014,
    month: 11,
    recipientBankAccount: 123,
    senderBankAccount: 123123,
    transactionId: '34534'
  },
  incorrectPayment: {
    personalAccount: 12312,
    idHouse: true,
    companyId: 'Microsoft',
    mfo: false,
    amount: 'So much money',
    paymentDate: 'Дата оплаты',
    dateOfEnrollment: 'Дата начисления',
    serviceId: 'Not this time'
  },
  city: {
    id: null,
    nameRus: "Кривой Рог",
    nameUk: "Кривий Ріг"
  },
  incorrectCity: {
    id: 't'
  },
  street: {
    id: null,
    nameRus: "Кривой Рог",
    nameUk: "Кривий Ріг"
  },
  company: {
    id: null,
    companyName: 'Софтпроект',
    companyId: '12345',
    closingDate: '01.01.2015',
    year: 2015,
    month: 2
  },
  wrongCityId: -2,
  counter: {
    id: null,
    date: '2014.11.01',
    idHouse: "00000000010200003004",
    month: 11,
    year: 2014,
    position: 'Санвузол',
    meterReading: 111
  },
  CpdOpt: {
    id: null,
    date: '2014.11.01',
    idHouse: '00000000010200003004',
    position: 'Санвузол',
    meterReading: 111
  },
  service: {
    id: null,
    serviceName: 'Електроенергія',
    serviceId: '9'
  },
  accrualsOptions: {
    id: null,
    idHouse: '00000000010200003004',
    number: '12345678',
    companyId: null,
    companyName: 'Софтпроект',
    serviceId: null,
    serviceName: 'Создание мегосайта',
    debt: 0,
    accrual: 12,
    forPayment: 213,
    paid: 12,
    dateOfAccrued: '01.11.2014',
    lastName: 'Пупкин',
    firstName: 'Коля',
    patronymic: 'Петрович',
    year: 2014,
    month: 11,
    transcript: '2+2=4'
  },
  incorrectAccrualsOpt: {
    idHouse: true,
    number: false,
    companyName: true,
    serviceName: true,
    debt: true,
    accrual: 'sdfsdfsdf',
    forPayment: 'fdfgdf',
    paid: 'dfgdfgdfg',
    dateOfAccrued: 3.14,
    year: 'year',
    month: 'month'
  },
  TrOpt: {
    id: null,
    accrual: 1,
    hash: '1',
    receiptOfThePaymentSystem: 1,
    senderName: '1',
    senderEdrpoy: 1,
    senderMfo: 1,
    senderBankAccount: '1',
    recipientName: '2',
    recipientEdrpoy: 2,
    recipientMfo: 2,
    recipientBankAccount: '2',
    status: '1'
  },
  pinCode: {
    id: null,
    idHouse: '00000000010200003004',
    whenIssuedPassport: '2000-11-11',
    issuedPassport: 'Жовтневий РУВД ',
    passportNumber: 'ПР123123',
    firstName: 'Евгений',
    lastName: 'Акимов',
    patronymic: 'Сергеевич',
    pinCode: '1234'
  },
  incorrectPinCode: {
    idHouse: 't',
    whenIssuedPassport: 'вчера',
    issuedPassport: true,
    passportNumber: 'number',
    firstName: null,
    lastName: null,
    patronymic: null
  },
  liqPayData: {
    signature: '1l7dxoNWkxliQziL96zbkDsq3IQ=',
    data: 'eyJ2ZXJzaW9uIjozLCJwdWJsaWNfa2V5IjoiaTEzNTIzNzA0OTgyIiwiYW1vdW50IjoiMS4wMCIsImN1cnJlbmN5IjoiVUFIIiwiZGVzY3JpcHRpb24iOiLQkNC00YDQtdGB0LA6INC80ZbRgdGC0L4g0JrRgNC40LLQuNC5INCg0ZbQsywg0LLRg9C70LjRhtGPINCf0LXRgNC10LzQvtCz0LgsINCx0YPQtC4xLCDQui4yLCDQutCyLjMsINCd0LDQudC80LDRhzo0IiwidHlwZSI6ImJ1eSIsIm9yZGVyX2lkIjoiMTUiLCJsaXFwYXlfb3JkZXJfaWQiOiI2MjQ3MTY3dTE0MzUzMjIyNTg3NDc3MDUiLCJzdGF0dXMiOiJzYW5kYm94IiwiZXJyX2NvZGUiOm51bGwsInRyYW5zYWN0aW9uX2lkIjo2MTI1NzE4NCwic2VuZGVyX3Bob25lIjoiMzgwOTgzNjMxNzI5Iiwic2VuZGVyX2NvbW1pc3Npb24iOjAsInJlY2VpdmVyX2NvbW1pc3Npb24iOjAuMDMsImFnZW50X2NvbW1pc3Npb24iOjAuMH0='
  },
  //  Certificates
  cert_admin_test: {
    pkcs12: fs.readFileSync(path.resolve(__dirname, 'certificates/ADMIN_TEST.p12')),
    passphrase: 'qwe123'
  },
  cert_employee_test: {
    pkcs12: fs.readFileSync(path.resolve(__dirname, 'certificates/EMPLOYEE_TEST.p12')),
    passphrase: 'qwe123'
  }
};