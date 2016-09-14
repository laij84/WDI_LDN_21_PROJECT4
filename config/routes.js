var router = require('express').Router();
var jwt = require('jsonwebtoken');
var secret = require('../config/tokens').secret;

var authController = require("../controllers/authentications");
var facebookController = require("../controllers/facebookoauth");
var githubController = require("../controllers/githuboauth");
var twitterController = require("../controllers/twitteroauth");
var eventsController = require('../controllers/events');
var usersController = require('../controllers/users');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: 'Secure Route Unauthorized' });

  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, user) {
    if(!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/oauth/facebook', facebookController.login);
router.post('/oauth/github', githubController.login);
router.post('/oauth/twitter', twitterController.login);

// router.route('/users/total')
//   .get(usersController.pointTotal);

router.route('/users')
  .get(usersController.index);

router.route('/events')
  .all(secureRoute)
  .get(eventsController.index)
  .post(eventsController.create);

router.route('/events/:id')
  .all(secureRoute)
  .get(eventsController.show)
  .put(eventsController.update)
  .delete(eventsController.delete);

// export the router
module.exports = router;