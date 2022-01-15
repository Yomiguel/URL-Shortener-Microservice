require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mogoose = require('mongoose');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  res.json({
    original_url: req.body.url,
    short_url: "hola"
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
