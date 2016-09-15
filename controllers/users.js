var User = require('../models/user');
var Event = require('../models/event');
var _ = require('underscore');

function usersIndex(req, res) {
  User.find()
    .then(function(users) {
      res.status(200).json(users)
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
}

function leaderboard(req, res) {

  var usersArray = [];

  User.find()
    .then(function(users) {
      usersArray = users.map(function(user) {
        var user = user.toJSON();
        user._id = user._id.toString();
        user.totals = 0;
        return user;
      });

      return Event.find({ completed: true })
    })
    .then(function(events) {
      events.forEach(function(event) {
        var idx = _.findIndex(usersArray, { _id: event.user.toString() });
        usersArray[idx].totals += event.value;
      });
      return res.status(200).json(usersArray);
    });
}

module.exports = {
  index: usersIndex,
  leaderboard: leaderboard
}