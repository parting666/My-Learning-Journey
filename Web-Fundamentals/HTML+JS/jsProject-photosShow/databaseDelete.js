const mysql = require('mysql2/promise');

 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pang84153061*',
  database: 'party1',
  connectionLimit: 10
});
async function deleteUserById(userId) {
  try {
   
    const sql = `
      DELETE FROM user
      WHERE id = ?
    `;
    
    
    const [result] = await pool.execute(sql, [userId]);
     
    if (result.affectedRows > 0) {
      console.log(`成功删除 ID=${userId} 的用户`);
      console.log('受影响的行数：', result.affectedRows);
    } else {
      console.log(`未找到 ID=${userId} 的用户，无需删除`);
    }
  } catch (err) {
    console.error('删除失败：', err.message);
  }
}
 
deleteUserById(11);