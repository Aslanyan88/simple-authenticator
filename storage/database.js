const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFilePath = path.join(__dirname, 'userSecrets.db');

const db = new sqlite3.Database(dbFilePath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      secret TEXT NOT NULL
    )
  `);
});

module.exports = db;
