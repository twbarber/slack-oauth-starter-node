var sqlite3 = require('sqlite3').verbose();

var path = require('path');
var dbPath = path.resolve(__dirname, 'data/slack.db');
var db = new sqlite3.Database(dbPath);

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

exports.db = db;

exports.db.saveSlackAuthorization = function (authResponse) {
    return db.serialize(function () {
        return db.run(
            `
                INSERT INTO subscriber (ACCESS_TOKEN, USER_ID, TEAM_ID, TEAM_NAME, CHANNEL, CHANNEL_ID, CONFIGURATION_URL, URL) 
                VALUES (?,?,?,?,?,?,?,?)
            `,
            [
                authResponse.access_token,
                authResponse.user_id,
                authResponse.team_id,
                authResponse.team_name,
                authResponse.incoming_webhook.channel,
                authResponse.incoming_webhook.channel_id,
                authResponse.incoming_webhook.configuration_url,
                authResponse.incoming_webhook.url
            ]
        );
    });
};