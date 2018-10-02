var sqlite3 = require('sqlite3').verbose();

var path = require('path');
var dbPath = path.resolve(__dirname, 'data/slack.db');
var db = new sqlite3.Database(dbPath);

exports.db = db;