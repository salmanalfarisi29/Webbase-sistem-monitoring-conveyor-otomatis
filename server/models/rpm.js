const mongoose = require("mongoose"); // Mengimpor mongoose untuk mengelola model dan koneksi MongoDB

// Membuat schema (struktur data) untuk menyimpan nilai RPM dalam database
const rpmSchema = new mongoose.Schema({
    rpmValue: { // Menyimpan nilai RPM conveyor
        type: Number, // Tipe data adalah angka
        required: true, // Wajib diisi, tidak boleh kosong
        default: 0, // Jika tidak diberikan nilai, akan diset ke 0
    },
}, { timestamps: true }); // Menambahkan `createdAt` dan `updatedAt` otomatis pada dokumen

// Mengekspor model `Rpm` agar bisa digunakan di bagian lain aplikasi
module.exports = mongoose.model("Rpm", rpmSchema);
