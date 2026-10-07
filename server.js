<<<<<<< HEAD
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database Setup
const dbFile = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create Appointments Table with status and notes columns
db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT NOT NULL,
    serviceCategory TEXT NOT NULL,
    date TEXT NOT NULL,
    timeSlot TEXT NOT NULL,
    status TEXT,
    notes TEXT
)`, (err) => {
    if (!err) {
        console.log('Appointments table ready (with status & notes).');
    }
});

// API Endpoint: Get all appointments (Dashboard)
app.get('/api/appointments', (req, res) => {
    db.all(`SELECT * FROM appointments ORDER BY id DESC`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ appointments: rows });
    });
});

// API Endpoint: Create a new appointment (Save to Database)
app.post('/api/appointments', (req, res) => {
    const { clientName, serviceCategory, date, timeSlot, status, notes } = req.body;
    
    const finalClientName = clientName || 'Anonymous Client';
    const finalService = serviceCategory || 'General Service';
    const finalDate = date || new Date().toISOString().split('T')[0];
    const finalTime = timeSlot || '09:00 AM';
    const finalStatus = status || 'Confirmed';
    const finalNotes = notes || '';

    const query = `INSERT INTO appointments (clientName, serviceCategory, date, timeSlot, status, notes) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [finalClientName, finalService, finalDate, finalTime, finalStatus, finalNotes], function(err) {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Appointment saved successfully!',
            id: this.lastID
        });
    });
});

// API Endpoint: Update an appointment (EDIT)
app.put('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    const { clientName, serviceCategory, date, timeSlot, status, notes } = req.body;

    const query = `UPDATE appointments SET clientName = ?, serviceCategory = ?, date = ?, timeSlot = ?, status = ?, notes = ? WHERE id = ?`;
    db.run(query, [clientName, serviceCategory, date, timeSlot, status || 'Confirmed', notes || '', id], function(err) {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Appointment updated successfully!',
            changes: this.changes
        });
    });
});

// API Endpoint: Delete an appointment
app.delete('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM appointments WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Deleted successfully', changes: this.changes });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
=======
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database Setup
const dbFile = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create Appointments Table with status and notes columns
db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT NOT NULL,
    serviceCategory TEXT NOT NULL,
    date TEXT NOT NULL,
    timeSlot TEXT NOT NULL,
    status TEXT,
    notes TEXT
)`, (err) => {
    if (!err) {
        console.log('Appointments table ready (with status & notes).');
    }
});

// API Endpoint: Get all appointments (Dashboard)
app.get('/api/appointments', (req, res) => {
    db.all(`SELECT * FROM appointments ORDER BY id DESC`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ appointments: rows });
    });
});

// API Endpoint: Create a new appointment (Save to Database)
app.post('/api/appointments', (req, res) => {
    const { clientName, serviceCategory, date, timeSlot, status, notes } = req.body;
    
    const finalClientName = clientName || 'Anonymous Client';
    const finalService = serviceCategory || 'General Service';
    const finalDate = date || new Date().toISOString().split('T')[0];
    const finalTime = timeSlot || '09:00 AM';
    const finalStatus = status || 'Confirmed';
    const finalNotes = notes || '';

    const query = `INSERT INTO appointments (clientName, serviceCategory, date, timeSlot, status, notes) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [finalClientName, finalService, finalDate, finalTime, finalStatus, finalNotes], function(err) {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Appointment saved successfully!',
            id: this.lastID
        });
    });
});

// API Endpoint: Update an appointment (EDIT)
app.put('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    const { clientName, serviceCategory, date, timeSlot, status, notes } = req.body;

    const query = `UPDATE appointments SET clientName = ?, serviceCategory = ?, date = ?, timeSlot = ?, status = ?, notes = ? WHERE id = ?`;
    db.run(query, [clientName, serviceCategory, date, timeSlot, status || 'Confirmed', notes || '', id], function(err) {
        if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Appointment updated successfully!',
            changes: this.changes
        });
    });
});

// API Endpoint: Delete an appointment
app.delete('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM appointments WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Deleted successfully', changes: this.changes });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
>>>>>>> dc3c3caef2db5477739f4dd00cd5d2c0c723b598
});