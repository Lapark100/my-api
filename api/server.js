// api/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware
app.use(cors({
    origin: 'https://your-frontend-url.com', // Replace with actual frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Utility function to read and write JSON file
function readData() {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Initialize data file if not present
if (!fs.existsSync(dataFilePath)) {
    writeData([]); // Start with an empty array
}

// GET endpoint - Fetch all items
app.get('/api/items', (req, res) => {
    const items = readData();
    res.json(items);
});

// POST endpoint - Add a new item
app.post('/api/items', (req, res) => {
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
