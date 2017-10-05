var setupACL = require('../.././acl-knex/lib/databaseTasks').createTables;
var Acl = require('acl');
var AclKnexBackend = require('acl-knex');
var setup = setupACL([
  'payment',
  'postgres',
  'test123',
  'acl_',
  'localhost',
  5432
], function (err, db) {
  acl = new Acl(new AclKnexBackend(db, 'acl_'));
  acl.addUserRoles('dweller', 'dweller');
});


