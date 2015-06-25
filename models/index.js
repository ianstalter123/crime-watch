var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/crimewatch");
module.exports.User = require("./user");
module.exports.Crime = require("./crime");
module.exports.Comment = require("./comment");
