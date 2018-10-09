var express = require('express');
var router = express.Router();
var slack = require('../services/slack');

router.get('/add', function (req, res, next) {
  var authUrl = slack.buildAuthUrl();
  var button = slack.addToSlackButton;
  res.render('slack.pug', {
    slackOauthUrl: authUrl,
    button: button
  });
});

router.get('/authorized', function (req, res, next) {
  slack.authorize(req, function(error, authResponse) {
    if(error) { res.send("Error: " + error); }
    res.send("Success! " + authResponse.access_token);
  });
});

module.exports = router;