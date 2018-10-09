var request = require('request');
var db = require('./database').db;

exports.authorize = function (req, callback) {
    var options = {
        uri: 'https://slack.com/api/oauth.access?code=' +
            req.query.code +
            '&client_id=' + process.env.SLACK_CLIENT_ID +
            '&client_secret=' + process.env.SLACK_CLIENT_SECRET +
            '&redirect_uri=' + process.env.SLACK_REDIRECT_URI,
        method: 'GET'
    };

    return request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body);
        if (!JSONresponse.ok) {
            console.log(JSONresponse);
            callback(error);
        } else {
            console.log(JSONresponse);
            db.saveSlackAuthorization(JSONresponse);
        }
        callback(null, JSONresponse);
    });
};

exports.buildAuthUrl = function () {
    return 'https://slack.com/oauth/authorize?' +
        'scope=' + 'incoming-webhook' +
        '&client_id=' + process.env.SLACK_CLIENT_ID +
        '&redirect_uri=' + process.env.SLACK_REDIRECT_URI;
};

exports.addToSlackButton = {
    alt: "Add to Slack",
    height: "40",
    width: "139",
    src: "https://platform.slack-edge.com/img/add_to_slack.png",
    srcset: "https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
};