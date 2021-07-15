const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MinistryArmSchema = new Schema({

    date_created: {
        type: Date,
        default: Date.now,
        // required: true,
    },
    user_id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true,
        unique: true,
    },
    directorate_id: {
        type: String,
        required: true,
    },

    ministry_head: {
        type: String,
        required: true,
    },
});

module.exports = MinistryArm = mongoose.model("ministry_arm", MinistryArmSchema);
