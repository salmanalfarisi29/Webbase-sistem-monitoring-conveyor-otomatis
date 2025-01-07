const mongoose = require("mongoose");

const BarangSchema = new mongoose.Schema({
    wilayah: { type: String, required: true },
    jumlah: { type: Number, required: true }
});

module.exports = mongoose.model("Barang", BarangSchema, "barangs");

