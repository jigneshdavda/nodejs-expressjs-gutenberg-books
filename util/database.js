const configs = require('./config');

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: configs.DB_HOST,
    user: configs.DB_USER,
    database: configs.DB_NAME,
    password: configs.DB_PASSWORD
});

module.exports = pool.promise();