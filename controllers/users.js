var User = require('../models/user');
var Event = require('../models/event');

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

// function pointTotal(req, res) {
//   Event.totalById(req.user._id)
//     .then(function(total) {
//       res.status(200).send(total);
//     })
//     .catch(function(err) {
//       res.status(500).send(err);
//     });
// }

module.exports = {
  index: usersIndex
  // pointTotal: pointTotal
}