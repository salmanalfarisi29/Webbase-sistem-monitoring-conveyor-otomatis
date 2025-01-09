const mongoose = require("mongoose"); // Mengimpor mongoose untuk mengelola model database MongoDB

// Membuat schema (struktur data) untuk menyimpan informasi barang dalam database
const BarangSchema = new mongoose.Schema({
    wilayah: { type: String, required: true }, // Field 'wilayah' menyimpan lokasi barang (wajib diisi)
    jumlah: { type: Number, required: true } // Field 'jumlah' menyimpan jumlah barang di wilayah tersebut (wajib diisi)
});

// Mengekspor model `Barang` agar bisa digunakan di bagian lain aplikasi
// Parameter ketiga `"barangs"` menentukan nama koleksi dalam database MongoDB
module.exports = mongoose.model("Barang", BarangSchema, "barangs");
