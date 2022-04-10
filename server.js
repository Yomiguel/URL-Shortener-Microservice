require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const shortid = require("shortid");
const port = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

const Schema = mongoose.Schema;
const urlShortenerSchema = new Schema({
  original_url: String,
  short_url: String,
});

const Url = mongoose.model("Url", urlShortenerSchema);

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", (req, res) => {
  let originalUrl = req.body.url;
  let shortUrl = shortid.generate();

  const url = new Url({
    original_url: originalUrl,
    short_url: __dirname + "/api/shorturl/" + shortUrl,
  });

  url.save((err) => {
    if (err) {
      return handlerError(err);
    }
  });

  res.json({
    original_url: url.original_url,
    short_url: url.short_url,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
