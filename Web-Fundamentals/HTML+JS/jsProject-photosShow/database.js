const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pang84153061*',
  database: 'party1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
 
async function queryDatabase() {
  try {
    const [rows] = await pool.execute('SELECT * FROM user');
    console.log('查询结果:', rows);
  } catch (err) {
    console.error('数据库错误:', err);
  }
}

queryDatabase();