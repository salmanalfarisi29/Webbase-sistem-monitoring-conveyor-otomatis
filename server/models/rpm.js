const mongoose = require("mongoose");

const rpmSchema = new mongoose.Schema({
    rpmValue: {
        type: Number,
        required: true,
        default: 0, // Nilai default RPM
    },
}, { timestamps: true });

module.exports = mongoose.model("Rpm", rpmSchema);
