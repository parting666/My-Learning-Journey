const mysql = require('mysql2/promise');

 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pang84153061*',
  database: 'party1',
  connectionLimit: 10
});

 
async function getAllUsers() {
  try {
     
    const sql = 'SELECT * FROM user';
    
     
    const [rows] = await pool.execute(sql);
    
    console.log('查询到', rows.length, '条数据：');
    console.log(rows);  
    
    return rows; 
  } catch (err) {
    console.error('查询失败：', err.message);
  }
}
 
getAllUsers();
