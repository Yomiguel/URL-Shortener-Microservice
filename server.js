require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const shortid = require("shortid");
const port = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  const originalUrl = req.body.url;
  const urlPattern =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  if (urlPattern.test(originalUrl)) {
    const shortUrl = shortid.generate();

    const url = new Url({
      original_url: originalUrl,
      short_url: shortUrl,
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
  } else {
    res.json({
      error: "Invalid URL",
    });
  }
});

app.get("/api/shorturl/:shortUrl", async (req, res) => {
  const dataUrl = await Url.findOne({ short_url: req.params.shortUrl });
  const redirectUrl = dataUrl.original_url;
  res.redirect(redirectUrl);
});

var listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
