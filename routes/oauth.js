var express = require('express');
var request = require('request');
var router = express.Router();
var db = require('../database').db;

db.serialize(function () {
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriber (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      ACCESS_TOKEN CHAR(255) NOT NULL,
      USER_ID CHAR(255) NOT NULL,
      TEAM_NAME CHAR(255) NOT NULL,
      TEAM_ID CHAR(255) NOT NULL,
      CHANNEL CHAR(255) NOT NULL,
      CHANNEL_ID CHAR(255) NOT NULL,
      CONFIGURATION_URL CHAR(255) NOT NULL,
      URL CHAR(255) NOT NULL
    )`);
});

router.get('/add', function (req, res, next) {
  var authUrl = 'https://slack.com/oauth/authorize?' +
    'scope=' + 'incoming-webhook' +
    '&client_id=' + process.env.SLACK_CLIENT_ID +
    '&redirect_uri=' + process.env.SLACK_REDIRECT_URI;
  var button = {
    alt: "Add to Slack",
    height: "40",
    width: "139",
    src: "https://platform.slack-edge.com/img/add_to_slack.png",
    srcset: "https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
  };
  res.render('slack.pug', {
    slackOauthUrl: authUrl,
    button: button
  });
});

router.get('/authorized', function (req, res, next) {

  var options = {
    uri: 'https://slack.com/api/oauth.access?code=' +
      req.query.code +
      '&client_id=' + process.env.SLACK_CLIENT_ID +
      '&client_secret=' + process.env.SLACK_CLIENT_SECRET +
      '&redirect_uri=' + process.env.SLACK_REDIRECT_URI,
    method: 'GET'
  };

  request(options, (error, response, body) => {
    var JSONresponse = JSON.parse(body);
    if (!JSONresponse.ok) {
      console.log(JSONresponse);
      res.send("Error encountered: \n" + JSON.stringify(JSONresponse)).status(200).end();
    } else {
      console.log(JSONresponse);
      db.serialize(function() {
        db.run(
          `
            INSERT INTO subscriber (ACCESS_TOKEN, USER_ID, TEAM_ID, TEAM_NAME, CHANNEL, CHANNEL_ID, CONFIGURATION_URL, URL) 
            VALUES (?,?,?,?,?,?,?,?)
          `, 
          [
            JSONresponse.access_token, 
            JSONresponse.user_id,
            JSONresponse.team_id,
            JSONresponse.team_name,
            JSONresponse.incoming_webhook.channel,
            JSONresponse.incoming_webhook.channel_id,
            JSONresponse.incoming_webhook.configuration_url,
            JSONresponse.incoming_webhook.url
          ]
        );
      });
      res.send("Success!");
    }
  });

});

module.exports = router;