var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: '127.0.0.1',
    user: 'root',
    password: 'mysqltestpassword',
    database: 'life_in_weeks',
    debug: false
});

function promiseQuery(sql, args) {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

exports.query = promiseQuery;
exports.connectionPool = pool;
exports.mysql = mysql;