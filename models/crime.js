var mongoose = require("mongoose");

var crimeSchema = new mongoose.Schema({
  name: String,
  crime: String,
  resolution: String,
  vote:String,
  lng: Number,
  lat: Number,
  image:String,
   comments: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Comment"
                    }]
});

crimeSchema.pre('remove', function(callback) {
    Comment.remove({crime_id: this._id}).exec();
    callback();
});

var Crime = mongoose.model("Crime", crimeSchema);

module.exports = Crime;