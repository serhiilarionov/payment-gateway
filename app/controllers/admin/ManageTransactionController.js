var express = require('express'),
  router = express.Router(),
  db = require('../../models/index'),
  $rg = require('../../services/ResponseGenerator'),
  RC = require('../../../config/internalResponseCodes.js');
var isAllow = require('../../policies/isAllow.js');

module.exports = function (app) {
  app.use('/', router);
};


router.get('/admin/transactions', isAllow, function (req, res) {
  var date = req.param('date');

  if(!date) {
    return res.status(400).send('Empty date');
  }

  db.TransactionLog.getTransactions(date)
    .then(function(data) {
      res.status(200).json(data);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json($rg(RC.INTERNAL_SERVER_ERROR, err));
    });
});
