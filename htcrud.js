#!/usr/bin/env node
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const baseDir = './'; // Base directory for file operations

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// Create a file
app.post('/:filename', (req, res) => {
  const filePath = path.join(baseDir, req.params.filename);
  fs.writeFile(filePath, JSON.stringify(req.body), (err) => {
    if (err) return res.status(500).send('Error creating file');
    res.status(201).send('File created');
  });
});

// Read a file
app.get('/:filename', (req, res) => {
  const filePath = path.join(baseDir, req.params.filename);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.send(data);
  });
});

// Update a file
app.put('/:filename', (req, res) => {
  const filePath = path.join(baseDir, req.params.filename);
  fs.writeFile(filePath, JSON.stringify(req.body), (err) => {
    if (err) return res.status(500).send('Error updating file');
    res.send('File updated');
  });
});

// Delete a file
app.delete('/:filename', (req, res) => {
  const filePath = path.join(baseDir, req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).send('File not found');
    res.send('File deleted');
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`File server running at http://localhost:${port}`));