const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATABASE = 'memory.json';

// Load memory
app.get('/api/v1/memory/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const db = fs.existsSync(DATABASE) ? JSON.parse(fs.readFileSync(DATABASE, 'utf8')) : {};
  res.json(db[playerId] || {});
});

// Save memory
app.post('/api/v1/memory/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const db = fs.existsSync(DATABASE) ? JSON.parse(fs.readFileSync(DATABASE, 'utf8')) : {};
  db[playerId] = req.body;
  fs.writeFileSync(DATABASE, JSON.stringify(db, null, 2));
  res.sendStatus(200);
});

// Update a character's relationship
app.patch('/api/v1/memory/:playerId/relationships/:characterName', (req, res) => {
  const { playerId, characterName } = req.params;
  const db = fs.existsSync(DATABASE) ? JSON.parse(fs.readFileSync(DATABASE, 'utf8')) : {};
  if (!db[playerId]) db[playerId] = { relationships: {}, flags: {} };
  if (!db[playerId].relationships[characterName]) {
    db[playerId].relationships[characterName] = { affection: 0, trust: 0, rivalry: 0 };
  }
  Object.assign(db[playerId].relationships[characterName], req.body);
  fs.writeFileSync(DATABASE, JSON.stringify(db, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Memory server listening on port ${PORT}`);
});
