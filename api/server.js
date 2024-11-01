// api/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.resolve(__dirname, 'data.json');
console.log("Resolved data file path:", dataFilePath);


// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // Allow required methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));

app.use(express.json());

function initializeDataFile() {
    if (!fs.existsSync(dataFilePath)) {
        console.log("data.json file not found, creating one...");
        fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8'); // Write an empty array
        console.log("data.json created successfully.");
    }
}

initializeDataFile();

// CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Respond OK to preflight OPTIONS requests
    }
    next();
});

// Utility function to read and write JSON file
function readData() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read data:", error);
        return []; // Return empty array or handle as needed
    }
}

function writeData(data) {
    try {
        console.log("Attempting to write data to file:", dataFilePath); // Check if this logs
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log("Data written successfully:", data);
    } catch (error) {
        console.error("Failed to write data:", error); // This should catch file permission or path issues
    }
}


// Initialize data file if not present
if (!fs.existsSync(dataFilePath)) {
    writeData([]); // Start with an empty array
}

// GET endpoint - Fetch all items
app.get('/api/items', (req, res) => {
    try {
        const items = readData();
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST endpoint - Add a new item
app.post('/api/items', (req, res) => {
    console.log("Received POST request with data:", req.body); // Check if data is received
    const items = readData();
    const newItem = { id: items.length + 1, ...req.body };
    items.push(newItem);
    writeData(items);
    res.status(201).json(newItem);
});



// PUT endpoint - Update an existing item by ID
app.put('/api/items/:id', (req, res) => {
    const items = readData();
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }

    items[itemIndex] = { ...items[itemIndex], ...req.body };
    writeData(items);
    res.json(items[itemIndex]);
});

// DELETE endpoint - Delete an item by ID
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
