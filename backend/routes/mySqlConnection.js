var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT, //important
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

function promiseQuery(statement, statementArguments, args) {
    return new Promise((resolve, reject) => {
        const sql = mysql.format(statement, statementArguments);
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