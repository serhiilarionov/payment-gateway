var Promise = require('bluebird');
var Mailer = {};

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.mail.ru',
  secure: true,
  auth: {
    user: 'pg.mailer@mail.ru',
    pass: '123qweasd'
  }
});

Mailer.sendVerificationLink = function (userEmail, login, link, password) {

  var mailOptions = {
    from: 'Fred Foo <pg.mailer@mail.ru>', // sender address
    to: userEmail, // list of receivers
    subject: 'Вітаємо, ' + login, // Subject line
    html: '<b>Для продовження реєстрації та випуску нового сертифікату, перейдіть за посиланням:</b><p>' + '<a href="'+link+'">Перейти</a>' + '</p>'+'<p>Ваш пароль: '+password+'</p>' // html body
  };
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        console.log('Message sent: ' + info.response);
        resolve('Sent successfully');
      }
    });
  })
};
Mailer.sendCertificate = function (userEmail, userLogin, userPassword) {
  var mailOptions = {
    attachments: [
      {
        path: 'app/certificates/userCertificates/' + userLogin + '.p12'
      }
    ],
    from: 'Fred Foo <pg.mailer@mail.ru>', // sender address
    to: userEmail, // list of receivers
    subject: 'Вітаємо, ' + userLogin, // Subject line
    html: '<b>Пароль до сертифікату: </b><p>' + userPassword + '</p>' // html body
  };
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        console.log('Message sent: ' + info.response);
        resolve('Sent successfully');
      }
    });
  })
};
Mailer.sendCertificateTimeOver = function (userEmail, userlogin, fio, date) {
  var mailOptions = {
    from: 'Fred Foo <pg.mailer@mail.ru>', // sender address
    to: userEmail, // list of receivers
    subject: 'Вітаємо, ' + userlogin, // Subject line
    html: ' <p> Шановний(а) ' + '<b>'+ fio +'</b>' + ', термін дії Вашого сертифікату закінчуєтся: <p> ' + '<b>' + date + '</b>' + // html body
    ' <p> Зв\'яжіться будь ласка з адміністратором по почті, для продовження терміну дії Вашого сертифікату. </p> '
  };
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        console.log('Message sent: ' + info.response);
        resolve('Sent successfully');
      }
    });
  })
};

module.exports.Mailer = Mailer;