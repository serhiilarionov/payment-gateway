module.exports = {
  post: {
    //dweller resources
    '/get/accruals': ['dweller_resource', 'employee_resource', 'admin_resource'],
    '/get/accruals/year/minimal': ['dweller_resource', 'employee_resource', 'admin_resource'],
    '/get/payments': ['dweller_resource', 'employee_resource','admin_resource'],
    '/get/payments/year/minimal': ['dweller_resource', 'employee_resource', 'admin_resource'],
    '/to/pay': ['dweller_resource', 'employee_resource','admin_resource'],
    '/get/counters': ['dweller_resource', 'employee_resource','admin_resource'],
    '/create/payment/document': ['dweller_resource', 'employee_resource','admin_resource'],
    '/choice/payment/system': ['dweller_resource','employee_resource', 'admin_resource'],
    '/create/payment/form': ['dweller_resource','employee_resource', 'admin_resource'],

    //employee resource'
    '/get/authorized/info': ['employee_resource','admin_resource'],
    '/add/accruals': ['employee_resource', 'admin_resource'],
    '/add/counters': ['employee_resource', 'admin_resource'],
    '/add/payments': ['employee_resource', 'admin_resource'],
    '/delete/accruals': ['employee_resource', 'admin_resource'],
    '/delete/counters': ['employee_resource', 'admin_resource'],
    '/delete/payments': ['employee_resource', 'admin_resource'],
    '/get/renter/byAddress': ['employee_resource', 'admin_resource'],
    '/generate/pinCode': ['employee_resource', 'admin_resource'],
    '/get/employee/info':['employee_resource', 'admin_resource'],

    //admin resource
    '/admin/cli/gencert': 'admin_resource',
    '/admin/employees/getallemployees': 'admin_resource',
    '/admin/mailer/sendpass': 'admin_resource',
    '/admin/mailer/sendcertificate': 'admin_resource',
    '/admin/cli/revokecert': 'admin_resource',
    '/admin/employees/addnewemployee': 'admin_resource',
    '/admin/manage/accrual/closingDate/set': 'admin_resource',
    '/admin/cli/recreatecert': 'admin_resource',
    '/admin/manage/paymentSystem/liqpay/set/params': 'admin_resource'
  },
  get: {
    //admin resource
    '/admin/employees/check': 'admin_resource',
    '/admin': 'admin_resource',
    '/admin/transactions': 'admin_resource',

    //employee resource
    '/employee': ['employee_resource', 'admin_resource'],
    '/generate/pinCode': ['employee_resource', 'admin_resource'],
    '/employee/accruals': ['employee_resource', 'admin_resource'],

    //dweller resource
    '/payment/data/online': ['dweller_resource', 'employee_resource', 'admin_resource'],

    //anyone
    '/admin/manage/paymentSystem/liqpay/get/params': ['dweller_resource', 'employee_resource', 'admin_resource'],
    '/callback/from/liqpay': ['dweller_resource', 'employee_resource', 'admin_resource']
  }
};
