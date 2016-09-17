var mongoose = require('mongoose');
var User = require('../models/user');
var Event = require('../models/event');

mongoose.Promise = require('bluebird');

var databaseUri = require('../config/db')(process.env.NODE_ENV || "development");
mongoose.connect(databaseUri);


User.collection.drop();
Event.collection.drop();

var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();
var h = date.getHours();

User.create([{
  username: "Bob",
  email: "bob@test.com",
  password: "password",
  passwordConfirmation: "password",
  avatar: "https://www.fillmurray.com/50/50"
},
{
  username: "Olive",
  email: "olive@test.com",
  password: "password",
  passwordConfirmation: "password",
  avatar: "https://placebear.com/50/50"
},
{
  username: "Kitty",
  email: "kitty@test.com",
  password: "password",
  passwordConfirmation: "password",
  avatar: "https://placekitten.com/50/50"
},
{
  username: "John",
  email: "john@test.com",
  password: "password",
  passwordConfirmation: "password",
  avatar: "https://place-hoff.com/50/50"
}], function(err, users) {

  if(!err) console.log("Users created!");
  if(err) console.log(err);

  Event.create([{
    user: users[0],
    title: "Happy Hour",
    start: new Date(y, m, d, 17),
    end: new Date(y, m, d, 18),
    category: "very unproductive",
    completed: true
  },
  {
    user: users[0],
    title: "Coding furiously",
    start: new Date(y, m, d, 9),
    end: new Date(y, m, d, 12),
    category: "very productive",
    completed: true
  },
  {
    user: users[0],
    title: "Taking a nap",
    start: new Date(y, m, d, 13),
    end: new Date(y, m, d, 14),
    category: "unproductive",
    completed: true
  },
  {
    user: users[0],
    title: "Debugging my project",
    start: new Date(y, m, d, 15),
    end: new Date(y, m, d, 17),
    category: "unproductive",
    completed: false
  },
  {
    user: users[1],
    title: "Yoga",
    start: new Date(y, m, d, 9),
    end: new Date(y, m, d, 11),
    category: "very productive",
    completed: true
  },
  {
    user: users[1],
    title: "Boozy Lunch",
    start: new Date(y, m, d, 13),
    end: new Date(y, m, d, 14),
    category: "unproductive",
    completed: true
  },
  {
    user: users[1],
    title: "Laundry",
    start: new Date(y, m, d, 15),
    end: new Date(y, m, d, 16),
    category: "productive",
    completed: false
  },
  {
    user: users[2],
    title: "Mop the floors",
    start: new Date(y, m, d, 15),
    end: new Date(y, m, d, 16),
    category: "productive",
    completed: true
  },
  {
    user: users[2],
    title: "Watch Corination Street",
    start: new Date(y, m, d, 19),
    end: new Date(y, m, d, 19, 30),
    category: "unproductive",
    completed: false
  },
  {
    user: users[2],
    title: "Cook dinner",
    start: new Date(y, m, d, 18),
    end: new Date(y, m, d, 19),
    category: "productive",
    completed: false
  },
  {
    user: users[2],
    title: "Continue writing my novel",
    start: new Date(y, m, d, 9),
    end: new Date(y, m, d, 12),
    category: "very productive",
    completed: true
  }], function(err, events) {

    if(!err) console.log("Events created!");
    if(err) console.log(err);
    mongoose.connection.close();
  });

});