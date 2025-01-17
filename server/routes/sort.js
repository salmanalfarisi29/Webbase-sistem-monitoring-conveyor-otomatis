// routes/sort.js

const express = require("express");
const UnsortedItem = require("../models/unsortedItem"); // Model untuk barang yang belum disortir
const Barang = require("../models/barang"); // Model untuk barang yang sudah disortir
const Wilayah = require("../models/wilayah");
const SortedItem = require("../models/sortedItem");

const router = express.Router();

// Endpoint untuk memproses barang setelah discan
// router.post("/sort", async (req, res) => {
//     const { barcode } = req.body; // Barcode barang yang discan

//     try {
//         // Cari barang di unsortedItems berdasarkan barcode
//         const item = await UnsortedItem.findOne({ barcode });

//         if (!item) {
//             return res.status(404).json({ message: "Barang tidak ditemukan dalam daftar belum disortir." });
//         }

//         // Tentukan wilayah berdasarkan barcode (contoh sederhana)
//         const wilayah = determineRegionFromBarcode(barcode);

//         // Pindahkan barang ke tabel Barang (sudah disortir)
//         const sortedItem = new Barang({
//             barcode: item.barcode,
//             name: item.name,
//             region: wilayah,
//             sortedAt: new Date()
//         });

//         await sortedItem.save(); // Simpan ke database barang sudah disortir
//         await item.remove(); // Hapus dari database barang belum disortir

//         res.status(200).json({
//             message: "Barang berhasil disortir.",
//             data: sortedItem
//         });
//     } catch (err) {
//         console.error("Error saat menyortir barang:", err);
//         res.status(500).json({ message: "Terjadi kesalahan saat menyortir barang." });
//     }
// });

// router.post("/sort", async (req, res) => {
//     const { barcode } = req.body;

//     try {
//         const item = await UnsortedItem.findOne({ barcode });

//         if (!item) {
//             return res.status(404).json({ message: "Barang tidak ditemukan dalam daftar belum disortir." });
//         }

//         const wilayah = determineRegionFromBarcode(barcode);

//         const sortedItem = new Barang({
//             barcode: item.barcode,
//             nama_barang: item.nama_barang || "Tidak Diketahui",
//             wilayah: wilayah || "Wilayah Tidak Diketahui",
//             kode_pos: item.kode_pos || "00000",
//             alamat: item.alamat || "Alamat Tidak Diketahui",
//             nomor_telepon: item.nomor_telepon || "Nomor Tidak Diketahui",
//             pengirim: item.pengirim || "Pengirim Tidak Diketahui",
//             nomor_telepon_pengirim: item.nomor_telepon_pengirim || "Nomor Tidak Diketahui",
//             penerima: item.penerima || "Penerima Tidak Diketahui",
//             nomor_telepon_penerima: item.nomor_telepon_penerima || "Nomor Tidak Diketahui",
//             sortedAt: new Date(),
//         });

//         await sortedItem.save();
//         await item.remove();

//         res.status(200).json({
//             message: "Barang berhasil disortir.",
//             data: sortedItem,
//         });
//     } catch (err) {
//         console.error("Error saat menyortir barang:", err);
//         res.status(500).json({ message: "Terjadi kesalahan saat menyortir barang." });
//     }
// });

router.post("/sort", async (req, res) => {
    const { barcode } = req.body;

    try {
        // Cari barang di unsortedItems
        const item = await UnsortedItem.findOne({ barcode });

        if (!item) {
            return res.status(404).json({ message: "Barang tidak ditemukan dalam daftar belum disortir." });
        }

        // Tentukan wilayah berdasarkan barcode
        const wilayah = determineRegionFromBarcode(barcode);

        // Simpan barang ke tabel SortedItem
        const sortedData = {
            nama_barang: item.nama_barang,
            barcode: item.barcode,
            alamat: item.alamat,
            nomor_telepon: item.nomor_telepon,
            pengirim: item.pengirim,
            penerima: item.penerima,
            sortedAt: new Date(),
        };

        await SortedItem.findOneAndUpdate(
            { wilayah },
            { $push: { data_barang: sortedData } }, // Tambahkan data_barang ke array
            { new: true, upsert: true } // Jika dokumen tidak ada, buat baru
        );

        // Hapus barang dari koleksi unsortedItems
        await item.remove();

        res.status(200).json({
            message: "Barang berhasil disortir dan disimpan.",
            data: sortedData,
        });
    } catch (error) {
        console.error("Error saat menyortir barang:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat menyortir barang." });
    }
});

// Fungsi untuk menentukan wilayah berdasarkan barcode
function determineRegionFromBarcode(barcode) {
    console.log("Proses barcode:", barcode); // Debugging

    // Ekstrak angka dari barcode setelah prefix "BARCODE-"
    const cleanBarcode = barcode.replace("BARCODE-", "").trim();

    // Tentukan wilayah berdasarkan prefix barcode
    if (barcode.startsWith("JTM-")) return "Jawa Timur";
    if (barcode.startsWith("BDG-")) return "Bandung";
    if (barcode.startsWith("CMH-")) return "Cimahi";
    if (barcode.startsWith("TSM-")) return "Tasikmalaya";
    if (barcode.startsWith("GRT-")) return "Garut";

    return "Wilayah Tidak Dikenal"; // Default jika tidak ada kecocokan
}


module.exports = router;
