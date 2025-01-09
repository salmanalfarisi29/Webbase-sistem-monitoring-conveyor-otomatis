const express = require("express"); // Mengimpor framework Express.js
const Barang = require("../models/barang"); // Mengimpor model Barang dari database
const mongoose = require("mongoose"); // Mengimpor mongoose untuk koneksi ke MongoDB

const router = express.Router(); // Membuat instance router untuk menangani rute barang

// API: Ambil semua barang dari database
router.get("/", async (req, res) => {
    try {
        console.log("Debugging API /api/barang..."); // Debugging: mencetak log saat API dipanggil
        console.log("Database in use:", mongoose.connection.name); // Debugging: mencetak nama database yang digunakan

        // Menampilkan daftar koleksi dalam database untuk debugging
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Koleksi dalam database:", collections.map(col => col.name));

        // Mengambil data barang dari MongoDB
        const data = await Barang.find({});
        console.log("Data diambil dari MongoDB:", data);

        res.json(data); // Mengembalikan data barang dalam format JSON
    } catch (err) {
        console.error("Error saat mengambil data:", err); // Log jika ada kesalahan
        res.status(500).json({ error: err.message }); // Kirim response error ke client
    }
});

// API: Reset jumlah barang di wilayah tertentu
router.post("/reset/:wilayah", async (req, res) => {
    const { wilayah } = req.params; // Mengambil parameter wilayah dari URL

    try {
        await Barang.updateOne({ wilayah }, { jumlah: 0 }); // Mengatur jumlah barang menjadi 0 untuk wilayah tertentu

        const io = req.app.get("io"); // Mengambil WebSocket dari `app`
        if (io) {
            const updatedData = await Barang.find({});
            io.emit("update-dashboard", updatedData); // Mengirim update ke semua client melalui WebSocket
            console.log(`Jumlah barang di ${wilayah} telah direset.`);
        } else {
            console.error("WebSocket (io) tidak tersedia di req.app");
        }

        res.json({ message: `Jumlah barang di wilayah ${wilayah} telah direset.` }); // Kirim response sukses
    } catch (error) {
        console.error("Error resetting barang:", error);
        res.status(500).json({ message: "Gagal mereset barang." }); // Kirim response error
    }
});

// API: Atur kecepatan conveyor
router.post("/atur-kecepatan", async (req, res) => {
    const { speed } = req.body; // Mengambil nilai kecepatan dari request body
    req.io.emit("update-speed", speed); // Mengirim kecepatan baru ke semua client melalui WebSocket
    res.json({ message: "Kecepatan conveyor diperbarui", speed }); // Kirim response sukses
});

module.exports = router; // Mengekspor router untuk digunakan di aplikasi utama
