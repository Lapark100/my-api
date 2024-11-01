const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample data storage
let items = [];

// GET endpoint
app.get('/api/items', (req, res) => {
    res.json(items);
});

// POST endpoint - Add a new item with ticket details
app.post('/api/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        studentTickets: req.body.studentTickets,
        parentTickets: req.body.parentTickets,
        tableTickets: req.body.tableTickets,
        studentNames: req.body.studentNames,
        parentNames: req.body.parentNames,
        total: req.body.total
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT and DELETE endpoints remain unchanged
app.put('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }

    items[itemIndex].name = req.body.name || items[itemIndex].name;
    res.json(items[itemIndex]);
});

app.delete('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found' });
    }

    const deletedItem = items.splice(itemIndex, 1)[0];
    res.json(deletedItem);
});

module.exports = app;
