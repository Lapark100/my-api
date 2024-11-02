// api/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn’t exist
function initializeDataFile() {
    if (!fs.existsSync(dataFilePath)) {
        console.log("data.json file not found, creating one...");
        fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8'); // Write an empty array
        console.log("data.json created successfully.");
    }
}

// Call initializeDataFile to create the file on startup if needed
initializeDataFile();

// Utility functions to read and write JSON data
function readData() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read data:", error);
        return [];
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log("Data written successfully");
    } catch (error) {
        console.error("Failed to write data:", error);
    }
}

// REST API Endpoints

// GET - Fetch all items
app.get('/api/items', (req, res) => {
    try {
        const items = readData();
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST - Add a new item
app.post('/api/items', (req, res) => {
    const items = readData();
    const newItem = { id: items.length + 1, ...req.body };
    items.push(newItem);
    writeData(items);
    res.status(201).json(newItem);
});

// DELETE - Remove an item by ID
app.delete('/api/items/:id', (req, res) => {
    const items = readData();
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }

    const deletedItem = items.splice(itemIndex, 1)[0];
    writeData(items);
    res.json(deletedItem);
});

module.exports = app;
