const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectorateSchema = new Schema({

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

    name: {
        type: String,
        required: true,
        unique: true,
    },
    director: {
        type: String,
        required: true,
    },
    director_details: {
        type: Object,
        required: true
    }
});

module.exports = Directorate = mongoose.model("directorate", DirectorateSchema);
