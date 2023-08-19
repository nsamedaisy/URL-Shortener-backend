const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    original_url: String,
    short_url: Number,
  },
  {
    versionKey: false,
  }
);

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
