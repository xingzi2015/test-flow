const express = require('express');
const fs = require('fs').promises; // 使用 fs.promises 来利用 Promise 特性
const cors = require('cors');
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
const port = 8888;

// 中间件用于解析请求体中的 JSON 数据
app.use(express.json());

const path='src/back_end/'
// 路由处理程序：读取 JSON 文件内容并返回
app.get('/api/menu_bar', async (req, res) => {
    try {
        // 读取文件内容
        const data = await fs.readFile(path+'inner_data/menu_bar.json', 'utf-8');

        // 将文件内容解析为 JSON
        const jsonData = JSON.parse(data);

        // 发送 JSON 响应
        res.json(jsonData);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const db = new Database(path+'inner_data/task.db', { verbose: console.log });
db.pragma('journal_mode = WAL');

app.post('/api/tasks_db', (req, res) => {
    // 从请求中获取 SQL 查询语句和参数，这里简单演示
    const { sql, params} = req.body;
    if (!sql || !params) {
        return res.status(400).json({ error: 'Missing SQL query or parameters' });
    }

    try {
        // 使用参数化查询来防止 SQL 注入
        const stmt = db.prepare(sql);
        const result = stmt.all(...params);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error executing SQL query' });
    }
});
app.put('/api/tasks_db', (req, res) => {
    try {
        const { task_id, task_name, task_status, task_content, task_date, task_additional_text } = req.body;
        console.log(req.body);

        if (task_id) {
            // 如果有 id，执行更新操作
            const updateQuery = `
                UPDATE task_tracker
                SET task_name = ?, task_status = ?, task_content = ?, task_date = ?, task_additional_text = ?
                WHERE id = ?
            `;

            const updateStmt = db.prepare(updateQuery);
            const updateResult = updateStmt.run(task_name, task_status, task_content, task_date, task_additional_text, task_id);

            console.log('Data successfully updated in the database:', updateResult);
        } else {
            // 如果没有 id，执行插入操作
            const insertQuery = `
                INSERT INTO task_tracker (task_name, task_status, task_content, task_date, task_additional_text)
                VALUES (?, ?, ?, ?, ?)
            `;

            const insertStmt = db.prepare(insertQuery);
            const insertResult = insertStmt.run(task_name, task_status, task_content, task_date, task_additional_text);

            console.log('Data successfully inserted into the database:', insertResult);
        }

        // 返回成功状态
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error processing the PUT request:', error);
        // 返回错误状态
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
