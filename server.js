require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const shortid = require('shortid');

//Conect whith data base
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 5500;

//Schema 
const Schema = mongoose.Schema;
const urlShortenerSchema = new Schema({
  original_url: String,
  short_url: String
});

//model
const Url = mongoose.model("Url", urlShortenerSchema);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  
  const url = new Url ({
    original_url: req.body.url,
    short_url: 1
  });
  
  url.save((err) => {
    if(err) {
      return handlerError(err);
    };
  });

  res.json({
    original_url: req.body.url
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});