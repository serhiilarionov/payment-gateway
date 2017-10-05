'use strict';

/**
 * Внутрисистемные коды ошибок с описанием
  */
module.exports = {
  //  Info
  OK: {
    code: 2000,
    message: 'OK'
  },
  ALREADY_REGISTERED_OR_URL_EXPIRED: {
    code: 2001,
    message: 'User already registered or url expired'
  },
  OPERATION_COMPLETE: {
    code: 2002,
    message: 'Operation complete'
  },
  ACCRUALS_SUCCESSFULLY_ADDED: {
    code: 2003,
    message: 'Accrual successfully added'
  },
  ACCRUALS_SUCCESSFULLY_DELETED: {
    code: 2004,
    message: 'Month accruals successfully deleted'
  },
  PAYMENT_INFO_SUCCESSFULLY_ADDED: {
    code: 2005,
    message: 'Payment info successfully added'
  },
  CERTIFICATE_REVOKED: {
    code: 2006,
    message: 'Certificate successfully revoked'
  },
  CERTIFICATE_RECREATED: {
    code: 2007,
    message: 'Certificate successfully recreated'
  },
  COUNTERS_SUCCESSFULLY_ADDED: {
    code: 2008,
    message: 'Counter successfully added'
  },
  COUNTERS_SUCCESSFULLY_DELETED: {
    code: 2009,
    message: 'Month counters successfully deleted'
  },
  PAYMENTS_SUCCESSFULLY_ADDED: {
    code: 2010,
    message: 'Accrual successfully added'
  },
  PAYMENTS_SUCCESSFULLY_DELETED: {
    code: 2011,
      message: 'Month accruals successfully deleted'
  },

  //  Bad requests
  BAD_REQUEST: {
    code: 4000,
    message: 'Bad request'
  },
  INVALID_ADDRESS: {
    code: 4001,
    message: 'Incorrect address'
  },
  INVALID_PIN_CODE: {
    code: 4002,
    message: 'Incorrect pin code'
  },
  INVALID_CITY: {
    code: 4003,
    message: 'Incorrect city'
  },
  INVALID_EMPLOYEE_ID: {
    code: 4004,
    message: 'Not found employee ID'
  },
  EMPTY_EMPLOYEE_ID: {
    code: 4005,
    message: 'Empty employee ID'
  },
  MONTH_ALREADY_CLOSED: {
    code: 4006,
    message: 'Month already closed'
  },
  NO_ACCESS_TO_CAMPAIGN: {
    code: 4007,
    message: 'No access to company'
  },
  NOT_FOUND: {
    code: 4008,
    message: 'Not found'
  },
  RENTER_NOT_FOUND: {
    code: 4009,
    message: 'Renter not found'
  },
  EMPLOYEE_NOT_FOUND: {
    code: 4010,
    message: 'Employee not found'
  },
  EMPTY_NEW_CERTIFICATE_TERM: {
    code: 4011,
    message: 'No term for new certificate'
  },
  INVALID_EMAIL: {
    code: 4012,
    message: 'Incorrect email'
  },
  INVALID_LOGIN: {
    code: 4013,
    message: 'Incorrect login'
  },
  EMPTY_PASSWORD: {
    code: 4014,
    message: 'Empty password'
  },
  INVALID_COMPANY_ID: {
    code: 4015,
    message: 'Invalid company id'
  },
  INVALID_DATE: {
    code: 4016,
    message: 'Invalid date'
  },
  INVALID_PAYMENT_ID: {
    code: 4017,
    message: 'Invalid payment id'
  },
  EMPTY_PAYMENT_SANDBOX: {
    code: 4018,
    message: 'Empty payment sandbox option'
  },
  EMPTY_PAYMENT_NAME: {
    code: 4018,
    message: 'Empty payment name'
  },
  EMPTY_PAYMENT_PUBLIC_KEY: {
    code: 4019,
    message: 'Empty payment public key option'
  },
  EMPTY_PAYMENT_PRIVATE_KEY: {
    code: 4020,
    message: 'Empty payment private key option'
  },
  EMPTY_USER_FIO: {
    code: 4021,
    message: 'Empty user fio'
  },
  EMPTY_USER_ROLE: {
    code: 4021,
    message: 'Empty user role'
  },
  EMPTY_USER_CERT_TERM: {
    code: 4022,
    message: 'Empty user certificate term'
  },
  EMPTY_USER_NEW_PASS: {
    code: 4023,
    message: 'Empty user new password'
  },
  EMPTY_USER_MAIL_PASS: {
    code: 4024,
    message: 'Empty user mail password'
  },
  EMPTY_ACCRUAL_YEAR: {
    code: 4025,
    message: 'Empty user mail password'
  },
  EMPTY_COMPANY_NAME: {
    code: 4026,
    message: 'Empty company name'
  },
  EMPTY_ACCRUALS_PARAM: {
    code: 4027,
    message: 'Empty accruals parameter'
  },
  EMPTY_PAYMENTS_PARAM: {
    code: 4028,
    message: 'Empty payment parameters'
  },
  EMPTY_WHEN_ISSUED_PASSPORT: {
    code: 4029,
    message: 'Empty when issued passport'
  },
  EMPTY_ISSUED_PASSPORT: {
    code: 4030,
    message: 'Empty issued passport'
  },
  EMPTY_PASSPORT_NUMBER: {
    code: 4031,
    message: 'Empty passport number'
  },
  EMPTY_FIRST_NAME: {
    code: 4032,
    message: 'Empty first name'
  },
  EMPTY_LAST_NAME: {
    code: 4033,
    message: 'Empty last name'
  },
  EMPTY_PATRONYMIC: {
    code: 4034,
    message: 'Empty patronymic'
  },
  USER_UNAUTHORIZED: {
    code: 4035,
    message: 'User unauthorized'
  },
  PARAMS_MISSING: {
    code: 4036,
    message: 'Some of params are missing'
  },
  //  Errors
  INTERNAL_SERVER_ERROR: {
    code: 5000,
    message: 'Internal server error'
  },
  CITIES_LOADING_ERROR: {
    code: 5001,
    message: 'Error loading of cities'
  },
  COMPANIES_LOADING_ERROR: {
    code: 5002,
    message: 'Error loading of companies'
  },
  CERTIFICATE_REVOKING_ERROR: {
    code: 5003,
    message: 'Error while certificate revoking'
  },
  CERTIFICATE_RECREATION_ERROR: {
    code: 5004,
    message: 'Error while certificate recreating'
  },
  CERTIFICATE_FILE_NOT_FOUND: {
    code: 5005,
    message: 'Certificate file not found for this user'
  },
  REVOCATION_LIST_UPDATE_ERROR: {
    code: 5006,
    message: 'Error while revocation list updating'
  },
  EMPLOYEE_DISABLING_ERROR: {
    code: 5007,
    message: 'Error while employee disabling'
  },
  REVOKED_CERTIFICATES_DELETING_ERROR: {
    code: 5008,
    message: 'Error while certificate deleting'
  },
  EMPLOYEE_DATA_RETRIEVING_ERROR: {
    code: 5009,
    message: 'Error while retrieving employee data'
  },
  RENEWAL_LINK_GENERATING_ERROR: {
    code: 5010,
    message: 'Error while renewal link generation'
  },
  VERIFICATION_LINK_SENDING_ERROR: {
    code: 5011,
    message: 'Error sending mail with verification link. Check your email address'
  },
  CERTIFICATE_RECREATING_REQUEST_FORMED: {
    code: 5012,
    message: 'Request to recreating was formed'
  }
};