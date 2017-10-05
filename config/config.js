var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'payment-gateway'
    },
    port: 3000,
    db: {
      connString: 'postgres://postgres:test123@localhost/payment',
      options: {
        logging: console.log,
        timezone: '+0:00'
      }
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'payment-gateway'
    },
    port: 3000,
    db: {
      connString: 'postgres://postgres:test123@192.168.1.67/payment',
      options: {
        logging: false,
        timezone: '+0:00'

      }
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'payment-gateway'
    },
    port: 3000,
    db: {
      connString: 'postgres://postgres:test123@localhost/payment',
      options: {
        logging: false,
        timezone: '+0:00'
      }
    }
  }
};

module.exports = config[env];
