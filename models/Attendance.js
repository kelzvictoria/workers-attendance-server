const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    date_created: {
        type: Date,
        default: Date.now,
        // required: true,
    },
    date_modified: {
        type: Date,
    },
    modifier: {
        type: String,
    },
    user_id: {
        type: String,
        required: true
    },

    worker_id: {
        type: String,
        required: true,
        // unique: true,
    },

    worker_details: {
        type: Object,
        required: true
    }
});

module.exports = Attendance = mongoose.model("attendance", AttendanceSchema);
