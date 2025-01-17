const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UnsortedItemSchema = new mongoose.Schema({
    barcode: { type: String, unique: true, default: () => `BARCODE-${uuidv4()}` }, // Barcode otomatis
    nama_barang: { type: String, required: true },
    wilayah: { type: String, required: true },
    kode_pos: { type: String, required: true },
    alamat: { type: String, required: true },
    nomor_telepon: { type: String, required: true },
    pengirim: { type: String, required: true },
    nomor_telepon_pengirim: { type: String, required: true },
    penerima: { type: String, required: true },
    nomor_telepon_penerima: { type: String, required: true },
    status: { type: String, enum: ["Belum Disortir", "Tersortir"], default: "Belum Disortir" },
    waktu_masuk: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UnsortedItem", UnsortedItemSchema);
