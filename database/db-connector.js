// ./database/db-connector.js
// 11/18/2024
// Based on nodejs-starter-app 
// Example shell was used, with the remainder based on our project
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%201%20-%20Connecting%20to%20a%20MySQL%20Database/README.md


// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_kims7',
    password        : '7343',
    database        : 'cs340_kims7'
})

// Export it for use in our applicaiton
module.exports.pool = pool;
