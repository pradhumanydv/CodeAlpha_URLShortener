const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./urls.db", (err) => {

    if (err) {
        console.log("Database Error:", err.message);
    } else {

        console.log("SQLite Database Connected");

        db.run(`
            CREATE TABLE IF NOT EXISTS urls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                shortCode TEXT UNIQUE,
                longUrl TEXT NOT NULL,
                clicks INTEGER DEFAULT 0
            )
        `);

    }
});

module.exports = db;