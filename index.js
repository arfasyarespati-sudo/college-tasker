const express = require('express');
const app = express();
const port= 3000;

require('dotenv').config();
const mysql = require('mysql2');

app.use(express.json())

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) {
        console.error('Failed to connect database:', err);
        return;
    }
    console.log('Connection success!')
})

app.get('/tugas', (req, res) => {
    const sql = "select * from "
})

app.get('/', (req, res) => {
    res.send('Express.js successfully connected!');
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})