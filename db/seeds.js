var mongoose = require('mongoose');
var User = require('../models/user');
var Event = require('../models/event');
var bluebird = require('bluebird');

var databaseUri = require('../config/db')(process.env.NODE_ENV || "development");
mongoose.connect(databaseUri);
mongoose.Promise = bluebird;

User.collection.drop();
Event.collection.drop();

var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();
var h = date.getHours();

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
    start: new Date(y, m, d, 16),
    end: new Date(y, m, d, 17),
    className: "party",
    stick: true
  }], function(err, events) {

    if(!err) console.log("Events created!");
    if(err) console.log(err);
    mongoose.connection.close();
  });

});