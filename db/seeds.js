var mongoose = require('mongoose');
var User = require('../models/user');
var Event = require('../models/event');
var bluebird = require('bluebird');

var databaseUri = require('../config/db')(process.env.NODE_ENV || "development");
mongoose.connect(databaseUri);
mongoose.Promise = bluebird;

User.collection.drop();
Event.collection.drop();

User.create([{
  username: "laij84",
  email: "jase_lai@hotmail.com",
  password: "password",
  passwordConfirmation: "password"
}], function(err, users) {

  if(!err) console.log("Users created!");
  if(err) console.log(err);

  Event.create([{
    user: users[0],
    title: "Happy Hour",
    start: new Date(),
    className: "party",
    stick: true
  }], function(err, events) {

    if(!err) console.log("Events created!");
    if(err) console.log(err);
    mongoose.connection.close();
  });

});