const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const CommentSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users" },
  ads_id: { type: Schema.Types.ObjectId, ref: "ads" },
  date: { type: Date, default: Date.now },
  comment: { type: String, default: "" },
  visitor: { type: String, default: "" },
  agent: { type: String, default: "" }
});

module.exports = Comment = mongoose.model("comment", CommentSchema);
