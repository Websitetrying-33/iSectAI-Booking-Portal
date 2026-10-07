const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clientName TEXT NOT NULL,
            serviceCategory TEXT NOT NULL,
            status TEXT NOT NULL,
            appointmentDate TEXT NOT NULL,
            timeSlot TEXT NOT NULL,
            notes TEXT
        )`, (createErr) => {
            if (!createErr) {
                // Insert a dummy row if table is empty
                db.get(`SELECT COUNT(*) as count FROM appointments`, (countErr, row) => {
                    if (row && row.count === 0) {
                        db.run(`INSERT INTO appointments (clientName, serviceCategory, status, appointmentDate, timeSlot, notes) VALUES (?, ?, ?, ?, ?, ?)`,
                            ['Marc Vaughn', 'TikTok Shop Operations', 'Confirmed', '2026-10-21', '03:30 PM', 'Initial Screening']);
                    }
                });
            }
        });
    }
});

// API Routes
app.get('/api/appointments', (req, res) => {
    db.all(`SELECT * FROM appointments ORDER BY id DESC`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/appointments', (req, res) => {
    const { clientName, serviceCategory, status, appointmentDate, timeSlot, notes } = req.body;
    const query = `INSERT INTO appointments (clientName, serviceCategory, status, appointmentDate, timeSlot, notes) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [clientName, serviceCategory, status, appointmentDate, timeSlot, notes], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, clientName, serviceCategory, status, appointmentDate, timeSlot, notes });
    });
});

app.put('/api/appointments/:id', (req, res) => {
    const { clientName, serviceCategory, status, appointmentDate, timeSlot, notes } = req.body;
    const query = `UPDATE appointments SET clientName = ?, serviceCategory = ?, status = ?, appointmentDate = ?, timeSlot = ?, notes = ? WHERE id = ?`;
    db.run(query, [clientName, serviceCategory, status, appointmentDate, timeSlot, notes, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updated: this.changes });
    });
});

app.delete('/api/appointments/:id', (req, res) => {
    db.run(`DELETE FROM appointments WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
