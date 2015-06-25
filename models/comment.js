var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
                    name: String,
                    comment: String,
                    crime: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Crime"
                    }
                  });


var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;