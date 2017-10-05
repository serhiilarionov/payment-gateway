var Promise = require("bluebird");
var policy = require('./Policy.js');
module.exports = function isAllow (req, res, next) {
  var user = (req.session === undefined
  || req.session.user === undefined
  || req.session === null
  || req.session.user === null) ? null : req.session.user;
  if(user){
    var method = req.method.toLowerCase(),
        url = req.route.path || req.originalUrl,
        resource = policy[method][url],
        resources = [],
        access = false;
    if (!Array.isArray(resource)) {
      resources.push(resource);
    } else {
      resources = resource;
    }
    Promise.each(resources, function(roleResource) {
      return new Promise(function(resolve, reject) {
        acl.isAllowed(user.login, roleResource, 'access', function(err, allowed) {
          if (allowed) {
            access = true;
          }
          resolve(true);
        });
      });
    })
      .then(function(data) {
        console.log(data);
        if(access) {
          next();
        } else {
          return res.status(403).json('Ви не маєте доступу до цього ресурсу.');
        }
      })
      .catch(function(err) {
        return res.status(500).json('Server Error');
      });
  } else {
    return res.status(403).json('Ви не маєте доступу до цього ресурсу.');
  }
};