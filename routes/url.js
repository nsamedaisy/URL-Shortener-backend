var express = require("express");
var Url = require("../models/url");

var router = express.Router();

router.post("/url/api/shorturl", async (req, res) => {
  // using regex to validate the submitted URL
  const urlExpression =
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/;

  let regExp = new RegExp(urlExpression);

  const originalUrl = req.body.originalUrl;
  let shortUrl = Math.floor(Math.random() * 10000) + 1;

  try {
    if (originalUrl.match(regExp)) {
      let Urls = await Url.find({});
      Urls.map((url) => {
        if (url.original_url === originalUrl) {
          shortUrl = url.short_url;
          console.log("correct");
        }
      });

      const object = await Url.create({
        original_url: originalUrl,
        short_url: shortUrl,
      });

      res.json(object);
    } else {
      res.json({ error: "Invalid Url" });
      return;
    }
  } catch (error) {
    console.log("An error occurred;", error);
  }
});

router.get("/url/api/shorturl/:id", async (req, res) => {
  const { id } = req.params;

  // Find the URL with the matching short ID
  await Url.findOne({ short_url: id })
    .then((doc) => {
      if (doc) {
        console.log(doc)
        // If the URL exists, redirect to the original URL
        res.redirect(doc.original_url);
      } else {
        // If the URL doesn't exist, return an error message
        res.json({ error: "URL not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ error: "Internal Server Error" });
    });
});

module.exports = router;
