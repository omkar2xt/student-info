require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

let nameKey = '';
let emailKey = '';

async function findKeys() {
    try {
        const res = await pool.query('SELECT * FROM students LIMIT 1');
        if (res.rows.length > 0) {
            const keys = Object.keys(res.rows[0]);

            // Search for name and email columns
            nameKey = keys.find(k => /\bname\b/i.test(k)) ||
                keys.find(k => k.toLowerCase().includes('name')) ||
                keys[0];

            emailKey = keys.find(k => /\bemail\b/i.test(k)) ||
                keys.find(k => k.toLowerCase().includes('email'));

            console.log(`Database connected. Keys identified -> Name: "${nameKey}", Email: "${emailKey}"`);
        }
    } catch (error) {
        console.error('Error connecting to database:', error.message);
    }
}

findKeys();

// API to login and get specific student data
app.post('/api/login', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Both Name and Email are required for secure login' });
    }

    try {
        // Fetch all students to perform a highly robust Javascript-based comparison
        // This avoids any SQL regex escaping issues with Excel's invisible characters
        const result = await pool.query('SELECT * FROM students');

        // Helper function to strip all whitespace and lowercase a string
        const normalize = (str) => String(str || '').replace(/\s+/g, '').toLowerCase();

        const targetName = normalize(name);
        const targetEmail = normalize(email);

        console.log(`\n--- LOGIN ATTEMPT ---`);
        console.log(`Target Name: '${targetName}', Target Email: '${targetEmail}'`);
        console.log(`Database rows count: ${result.rows.length}`);
        console.log(`Active Name Key: '${nameKey}', Active Email Key: '${emailKey}'`);

        const matchedStudent = result.rows.find(student => {
            const dbName = normalize(student[nameKey]);
            const dbEmail = normalize(student[emailKey]);
            const match = dbName === targetName && dbEmail === targetEmail;

            if (dbName.includes('deshmukh') || targetName.includes('deshmukh')) {
                console.log(`\n  Checking Row -> Raw Name: '${student[nameKey]}', Raw Email: '${student[emailKey]}'`);
                console.log(`  Normalized -> Name: '${dbName}', Email: '${dbEmail}'`);
                console.log(`  Match Result: ${match}`);
            }

            return match;
        });

        if (matchedStudent) {
            res.json({ success: true, student: matchedStudent, nameKey });
        } else {
            res.status(401).json({ success: false, error: 'Incorrect Name or Email. Please try again.' });
        }
    } catch (error) {
        console.error('Database query error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin API to reload data (Basic security)
app.post('/api/admin/reload', async (req, res) => {
    try {
        const result = await pool.query('SELECT count(*) FROM students');
        res.json({ success: true, count: result.rows[0].count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
