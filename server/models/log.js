const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now }, // Waktu log dibuat
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID pengguna yang melakukan aktivitas
    action: { type: String, required: true }, // Tipe aktivitas (contoh: "ADD", "SORT", "DELETE")
    details: { type: Object, required: true }, // Informasi tambahan tentang aktivitas
});

module.exports = mongoose.model("Log", logSchema);
