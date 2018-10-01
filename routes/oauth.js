var express = require('express');
var request = require('request');
var router = express.Router();

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
      res.send("Success!");
    }
  });

});

module.exports = router;