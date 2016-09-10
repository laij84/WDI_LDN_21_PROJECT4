var User = require('../models/user');
var request = require('request-promise');
var jwt = require('jsonwebtoken');
var secret = require("../config/tokens").secret;
var qs = require("qs");

function login(req, res) {
  if (!req.body.oauth_token || !req.body.oauth_verifier) {

    request.post({
      url: "https://api.twitter.com/oauth/request_token",
      oauth: {
        consumer_key: process.env.TWIT_WDIPROJECT4_API_KEY,
        consumer_secret: process.env.TWIT_WDIPROJECT4_API_SECRET,
        callback: req.body.redirectUri
      },
      json: true
    })
    .then(function(response){
      var token = qs.parse(response);
      console.log("this is the token: " + token);
      res.status(200).send(token);
    })
    .catch(function(err){
      console.log("IF STATEMENT " +err);
      res.status(500).json(err);
    });
  } 

  else {
    request.post({
      url: "https://api.twitter.com/oauth/access_token",
      form: {
        oauth_token: req.body.oauth_token,
        oauth_verifier: req.body.oauth_verifier
      }
    })
    .then(function(token){
      var token = qs.parse(token);
      console.log("this is the token: " + token);
      return request.get({
        url: "https://api.twitter.com/1.1/users/show.json",
        qs: {screen_name: token.screen_name},
        oauth: {
          consumer_key: process.env.TWIT_WDIPROJECT4_API_KEY,
          consumer_secret: process.env.TWIT_WDIPROJECT4_API_SECRET,
          oauth_token: token.oauth_token
          },
        json: true
        });
    })
    .then(function(profile){
      // console.log(profile);
      return User.findOne({ twitterId: profile.id })
      .then(function(user){
        if(user){
          user.twitterId = profile.id;
          user.avatar = profile.profile_image_url;
          console.log("this is the user: " + user);
        }

        else{
          user = new User({
            username: profile.name,
            twitterId: profile.id,
            avatar: profile.profile_image_url
          });
        }
        return user.save();  
      })
    })
    .then(function(user) {
      var payload = {
        _id: user._id,
        username: user.username,
        avatar: user.avatar
      };

      var token = jwt.sign(payload, secret, { expiresIn: '24h' });

      res.status(200).json({ token: token });
    })
    .catch(function(err){
      console.log(err);
      res.status(500).json(err);
    });

  }

} //end of login

module.exports = {
  login: login
}