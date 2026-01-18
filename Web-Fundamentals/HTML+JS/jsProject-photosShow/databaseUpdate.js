const mysql = require('mysql2/promise');

 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pang84153061*',
  database: 'party1',
  connectionLimit: 10
});
 
async function updateUserEmail(userId, newAge) {
  try {
    const sql = `
      UPDATE user
      SET age = ?
      WHERE id = ?
    `;
     
    const [result] = await pool.execute(sql, [newAge, userId]);
    
    // 解析结果
    if (result.affectedRows > 0) {
      console.log(`成功更新 ID=${userId} 的用户邮箱`);
      console.log('受影响的行数：', result.affectedRows);
    } else {
      console.log(`未找到 ID=${userId} 的用户，无数据更新`);
    }
  } catch (err) {
    console.error('更新失败：', err.message);
  }
}

// 更新ID=1的用户邮箱
updateUserEmail(12, '24');
