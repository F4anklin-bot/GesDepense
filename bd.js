const mysql = require("mysql2")


// MySQL Connection
const bd = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'frfrfrfr',
  database: 'gesDepense'
});
// Connect to MySQL
bd.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + bd.threadId);
});

module.exports = bd;