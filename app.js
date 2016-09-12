var express = require("express");
var app = express();

var environment = app.get('env');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require('cors');

var port = process.env.PORT || 3000;
var routes = require('./config/routes');
var databaseUri = require('./config/db')(environment);

mongoose.Promise = require('bluebird');

mongoose.connect(databaseUri);

// Use morgan for logging
if('test' !== environment) {
  app.use(require('morgan')('dev'));
}

// Setup body-parser to read HTTP body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.use(express.static('public'));

app.use('/api', routes);

// listen on port
app.listen(port, function(){
  console.log("Express is listening to port " + port);
});

module.exports = app;