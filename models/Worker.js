const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String
  },
  last_name: {
    type: String,
    required: true,
  },
  phone_num: {
    type: String,
    required: true,
    unique: true,
  },
  ministry_arm: {
    type: Array,
    // required: true
  },
  role: {
    type: Array,
    required: true
  },
  email_address: {
    type: String,
    unique: true,
  },
  user_id: {
    type: String,
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

module.exports = Worker = mongoose.model("worker", WorkerSchema);
