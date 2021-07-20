const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  register_date: {
    type: Date,
    default: Date.now,
    // required: true,
  },

  role: {
    type: Array,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_modified: {
    type: Date,
  },
  modifier: {
    type: String,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
