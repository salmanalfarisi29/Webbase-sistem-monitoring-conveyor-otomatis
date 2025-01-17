const mongoose = require("mongoose");

const wilayahSchema = new mongoose.Schema({
    wilayah: { type: String, required: true },
    jumlah: { type: Number, default: 0 },
});

module.exports = mongoose.model("Wilayah", wilayahSchema);
