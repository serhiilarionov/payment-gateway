'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require('./unit/models/TransactionLog.test.js').run();
//require('./unit/models/Street.test.js').run();
require('./unit/models/City.test.js').run();
require('./unit/models/PinCode.test.js').run();
//require('./unit/models/PersonalAccount.test.js').run();
require('./unit/models/Company.test.js').run();
require('./unit/models/Service.test.js').run();
//require('./unit/models/Employee.test.js').run();
require('./unit/models/Payment.test.js').run();
//require('./unit/models/PaymentDocument.test.js').run();
//require('./unit/models/PaymentsPaymentDocument.test.js').run();
//require('./unit/models/Counter.test.js').run();
//require('./unit/models/CounterPaymentDocument.test.js').run();

//require('./unit/controllers/ManagePaymentSystemController.test.js').run();
//require('./unit/controllers/ManagePaymentDocumentController.test.js').run();
//require('./unit/controllers/UserController.test.js').run();
//require('./unit/controllers/PersonalAccountController.test.js').run();
require('./unit/controllers/CityController.test.js').run();
require('./unit/controllers/CompanyController.test.js').run();
//require('./unit/controllers/ManageEmployeeController.test.js').run();
//require('./unit/controllers/RoleController.test.js').run();
//require('./unit/controllers/MailerController.test.js').run();
//require('./unit/controllers/CliController.test.js').run();
//require('./unit/controllers/PaymentController.test.js').run();
//require('./unit/controllers/ManagePinCodeController.test.js').run();
//require('./unit/controllers/ManageAccrualController.test.js').run();
//require('./unit/controllers/SessionController.test.js').run();
//require('./unit/controllers/StreetController.test.js').run();

require('./unit/services/CommandLineService.test.js').run();
//require('./unit/services/MailerService.test.js').run();

