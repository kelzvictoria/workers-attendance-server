const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectorateSchema = new Schema({

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
    director: {
        type: String,
        required: true,
    }
});

module.exports = Directorate = mongoose.model("directorate", DirectorateSchema);
