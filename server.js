const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// To parse JSON and large base64 payloads
app.use(express.json({ limit: '10mb' }));

// Allow CORS for dev and cross-device testing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Endpoint to receive image data
app.post('/api/save', (req, res) => {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ error: 'No imageData' });

  // Extract base64, create filename
  const base64 = imageData.replace(/^data:image\/png;base64,/, '');
  const filename = `art_${Date.now()}.png`;
  const filePath = path.join(__dirname, filename);

  fs.writeFile(filePath, base64, 'base64', (err) => {
    if (err) {
      console.error('Failed to save image:', err);
      return res.status(500).json({ error: 'Failed to save image' });
    }
    res.json({ message: 'Image saved', filename });
  });
});

app.listen(PORT, () => {
  console.log(`Art backend running at http://localhost:${PORT}`);
});
