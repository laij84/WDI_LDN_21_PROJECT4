var User = require('../models/user');

function usersIndex(req, res) {
  User.find()
    .then(function(users) {
      res.status(200).json(users)
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
}

module.exports = {
  index: usersIndex
}