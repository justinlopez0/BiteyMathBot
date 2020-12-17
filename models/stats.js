'use strict';

module.exports = class Stats {
    constructor(db) {
        this.db = db;
    }

    getTopScore() {
        return 'Justin';
    }

    addScore(user, question, answer) {
        let sql = `INSERT INTO stats(user, question, answer, datetime) 
                   VALUES(?, ?, ?, CURRENT_TIMESTAMP)`;

        this.db.run(sql, [user, question, answer], (err) => {
            if (err) {
                console.log("DB Error: "+err);
            }
        });
    }

    getTopScores(howMany, callback) {
        let sql = `SELECT user, count(user) AS score 
                   FROM stats
                   GROUP BY user
                   ORDER BY score DESC 
                   LIMIT ` + howMany;

        this.db.all(sql, [], (err, rows) => {
            if (err) {
                console.log("DB Error: "+err);
            } else {
                callback(rows);
            }
        });
    }
}
