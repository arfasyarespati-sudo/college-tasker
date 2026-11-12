const express = require('express');
const app = express();
const port= 3000;
const cors= require('cors');
app.use(cors());

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

app.get('/', (req, res) => {
    res.send('Express.js successfully connected!');
})

// read
app.get('/tugas', (req, res) => {
    const sql = "select * from task order by status asc, deadline asc";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        res.json({
            message: 'Berhasil mengambil daftar tugas',
            data: results
        })
    })
})

// create
app.post('/tugas', (req, res) => {
    const { mata_kuliah, judul_tugas, deadline } = req.body;
    const sql = "insert into task (mata_kuliah, judul_tugas, deadline) values (?,?,?)"

    db.query(sql, [mata_kuliah, judul_tugas, deadline], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: 'Tugas baru berhasil ditambahkan!',
            id_tugas: result.insertId 
        });
    });
})

// update
app.put('/tugas/:id', (req, res) => {
    const id = req.params.id;
    const { mata_kuliah, judul_tugas, deadline, status } = req.body;
  
    const sql = "UPDATE task SET mata_kuliah = ?, judul_tugas = ?, deadline = ?, status = ? WHERE id = ?";
  
    db.query(sql, [mata_kuliah, judul_tugas, deadline, status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
    
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    
        res.json({ message: `Tugas dengan ID ${id} berhasil diperbarui!` });
    });
});

// delete
app.delete('/tugas/:id', (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM task WHERE id = ?";
  
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
    
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    
        res.json({ message: `Tugas dengan ID ${id} berhasil dihapus!` });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})