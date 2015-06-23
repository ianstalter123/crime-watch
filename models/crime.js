var mongoose = require("mongoose");

var crimeSchema = new mongoose.Schema({
  name: String,
  crime: String,
  resolution: String,
  vote:String,
  lng: Number,
  lat: Number
});

var Crime = mongoose.model("Crime", crimeSchema);

module.exports = Crime;