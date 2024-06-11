const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/waterMonitoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema and model for the data
const dataSchema = new mongoose.Schema({
  tds: Number,
  turbidity: Number,
  timestamp: { type: Date, default: Date.now }
});

const Data = mongoose.model('Data', dataSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/data', (req, res) => {
  const { tds, turbidity } = req.body;

  const newData = new Data({
    tds,
    turbidity
  });

  newData.save((err, savedData) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(savedData);
  });
});

app.get('/data', (req, res) => {
  Data.find({}, (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

