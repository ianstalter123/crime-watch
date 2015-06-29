var mongoose = require("mongoose");
mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/crimewatch")
//mongoose.connect("mongodb://localhost/crimewatch");
module.exports.User = require("./user");
module.exports.Crime = require("./crime");
module.exports.Comment = require("./comment");
