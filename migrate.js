require('dotenv').config();
const { Client } = require('pg');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = path.join(__dirname, 'data', 'Contact Information.xlsx');

async function migrate() {
    if (!fs.existsSync(EXCEL_PATH)) {
        console.error('Excel file not found at:', EXCEL_PATH);
        return;
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL database.');

        // Read Excel data
        const workbook = xlsx.readFile(EXCEL_PATH);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const studentsData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

        if (studentsData.length === 0) {
            console.error('Excel file is empty.');
            return;
        }

        const headers = Object.keys(studentsData[0]);
        console.log(`Detected headers: ${headers.join(', ')}`);

        // Create table
        // We'll clean the headers to be SQL-safe (lowercase, replace spaces with underscores)
        const sqlHeaders = headers.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, '_'));
        const columns = sqlHeaders.map(h => `"${h}" TEXT`).join(', ');

        await client.query(`DROP TABLE IF EXISTS students`);
        await client.query(`CREATE TABLE students (${columns})`);
        console.log('Created "students" table.');

        // Insert data
        for (const student of studentsData) {
            const values = Object.values(student);
            const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
            const query = `INSERT INTO students (${sqlHeaders.map(h => `"${h}"`).join(', ')}) VALUES (${placeholders})`;
            await client.query(query, values);
        }

        console.log(`Successfully migrated ${studentsData.length} records.`);
    } catch (err) {
        console.error('Migration failed:', err.message);
        if (err.message.includes('database')) {
            console.log('\nTIP: Make sure the database exists. You might need to run:');
            console.log('CREATE DATABASE student_portal;');
        }
    } finally {
        await client.end();
    }
}

migrate();
