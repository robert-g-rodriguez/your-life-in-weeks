var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: '127.0.0.1',
    user: 'root',
    password: 'mysqltestpassword',
    database: 'life_in_weeks',
    debug: false
});
exports.connectionPool = pool;