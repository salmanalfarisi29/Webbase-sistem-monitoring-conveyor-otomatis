const mongoose = require("mongoose");

const UnsortedItemSchema = new mongoose.Schema({
    barcode: { type: String, required: true, unique: true }, // Identitas unik barang
    nama_barang: { type: String, required: true }, // Nama deskriptif barang
    wilayah: { type: String, required: true }, // Wilayah tujuan
    kode_pos: { type: String, required: true }, // Kode pos tujuan
    alamat: { type: String, required: true }, // Alamat lengkap penerima
    nomor_telepon: { type: String, required: true }, // Kontak penerima
    pengirim: { type: String, required: true }, // Nama pengirim barang
    penerima: { type: String, required: true }, // Nama penerima barang
    status: { type: String, enum: ["Belum Disortir", "Tersortir"], default: "Belum Disortir" }, // Status barang
    waktu_masuk: { type: Date, default: Date.now }, // Waktu barang masuk ke sistem
});

module.exports = mongoose.model("UnsortedItem", UnsortedItemSchema);
