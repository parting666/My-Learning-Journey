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
 

/**
 * 异步函数：向 users 表中插入一条新数据
 * @param {object} userData - 要插入的用户数据对象，例如 { name: 'John Doe', email: 'john.doe@example.com' }
 */
async function insertUser(userData) {
  let connection;
  try {
    // --- 2. 定义 SQL 插入语句 ---
    // 使用 ? 作为占位符可以防止 SQL 注入，这是一个非常重要的安全措施。
    const sql = 'INSERT INTO user (name, age) VALUES (?, ?)';
    const values = [userData.name, userData.age];

    // --- 3. 执行 SQL 查询 ---
    // pool.execute() 会自动获取一个连接、执行查询然后释放连接。
    // execute 方法返回一个包含结果和字段信息的数组 [results, fields]。
    const [result] = await pool.execute(sql, values);

    // --- 4. 处理并返回结果 ---
    console.log('数据插入成功！');
    console.log(`影响的行数: ${result.affectedRows}, 新插入的 ID: ${result.insertId}`);
    
    return { success: true, insertId: result.insertId };

  } catch (error) {
    // --- 5. 错误处理 ---
    console.error('数据库插入操作失败:', error);
    return { success: false, error: error };

  } 
  // 注意：使用连接池时，通常不需要手动关闭单个连接，连接池会自动管理。
  // 我们只在应用程序关闭时才需要关闭整个连接池。
}

// --- 主执行函数 ---
async function main() {
  console.log('开始执行插入操作...');

  // 准备要插入的数据
  const newUser = {
    name: 'Jane Doe',
    age: '11'
  };

  // 调用插入函数
  await insertUser(newUser);

  // 假设我们完成了所有数据库操作，现在可以关闭连接池了。
  // 在一个真实的 Web 应用中，连接池通常会一直运行，直到应用进程结束。
  await pool.end();
  console.log('数据库连接池已关闭。');
}

// --- 运行主函数 ---
main();

async function  insertWithPool() {
  try {
    const sql = `
    insert into user (name,id)
    values(?,?)
    `;
    const result = await pool.execute(sql,['ppppp','12']);
    console.log('连接池插入成功，ID：', result);
  } catch (err) {
    console.error('插入失败：', err.message);
  }finally{
    //await pool.end();
  }
}

// insertWithPool();