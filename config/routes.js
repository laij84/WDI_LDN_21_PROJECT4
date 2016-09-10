var router = require('express').Router();
var jwt = require('jsonwebtoken');
var secret = require('../config/tokens').secret;

var authController = require("../controllers/authentications");
var facebookController = require("../controllers/facebookoauth");

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' });

  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, user) {
    if(!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/oauth/facebook', facebookController.login)

// export the router
module.exports = router;