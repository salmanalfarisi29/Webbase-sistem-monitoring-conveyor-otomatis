const mongoose = require("mongoose"); // Mengimpor mongoose untuk mengelola model database MongoDB

// Membuat schema (struktur data) untuk menyimpan informasi barang dalam database
// const BarangSchema = new mongoose.Schema({
//     wilayah: { type: String, required: true }, // Field 'wilayah' menyimpan lokasi barang (wajib diisi)
//     jumlah: { type: Number, required: true } // Field 'jumlah' menyimpan jumlah barang di wilayah tersebut (wajib diisi)
// });

const BarangSchema = new mongoose.Schema({
    barcode: { type: String, required: true },
    nama_barang: { type: String, default: "Tidak Diketahui" },
    wilayah: { type: String, default: "Wilayah Tidak Diketahui" },
    kode_pos: { type: String, default: "00000" },
    alamat: { type: String, default: "Alamat Tidak Diketahui" },
    nomor_telepon: { type: String, default: "Nomor Tidak Diketahui" },
    pengirim: { type: String, default: "Pengirim Tidak Diketahui" },
    nomor_telepon_pengirim: { type: String, default: "Nomor Tidak Diketahui" },
    penerima: { type: String, default: "Penerima Tidak Diketahui" },
    nomor_telepon_penerima: { type: String, default: "Nomor Tidak Diketahui" },
    sortedAt: { type: Date, default: Date.now },
});

// Mengekspor model `Barang` agar bisa digunakan di bagian lain aplikasi
// Parameter ketiga `"barangs"` menentukan nama koleksi dalam database MongoDB
module.exports = mongoose.model("Barang", BarangSchema, "barangs");
