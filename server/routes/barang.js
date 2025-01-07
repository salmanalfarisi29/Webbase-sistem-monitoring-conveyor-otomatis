const express = require("express");
const Barang = require("../models/barang");
const mongoose = require("mongoose");

const router = express.Router();

// API: Ambil jumlah barang di semua wilayah
router.get("/", async (req, res) => {
    try {
        console.log("Debugging API /api/barang...");

        // Log untuk melihat database yang digunakan
        console.log("Database in use:", mongoose.connection.name);
        
        // Log untuk melihat daftar koleksi dalam database
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Koleksi dalam database:", collections.map(col => col.name));

        // Query data dari koleksi 'barangs'
        const data = await Barang.find({});
        console.log("Data diambil dari MongoDB:", data);

        res.json(data);
    } catch (err) {
        console.error("Error saat mengambil data:", err);
        res.status(500).json({ error: err.message });
    }
});

// API: Reset jumlah barang di wilayah tertentu
router.post("/reset/:wilayah", async (req, res) => {
    const { wilayah } = req.params;
    try {
        // Reset jumlah barang di database
        await Barang.updateOne({ wilayah }, { jumlah: 0 });

        // Kirim update ke semua client melalui WebSocket
        const updatedData = await Barang.find({});
        req.app.io.emit("update-dashboard", updatedData);

        console.log(`🔄 Jumlah barang di ${wilayah} telah direset.`);
        res.json({ message: `Jumlah barang di wilayah ${wilayah} telah direset.` });
    } catch (error) {
        console.error("Error resetting barang:", error);
        res.status(500).json({ message: "Gagal mereset barang." });
    }
});


// API: Atur kecepatan conveyor
router.post("/atur-kecepatan", async (req, res) => {
    const { speed } = req.body;
    req.io.emit("update-speed", speed);  // Kirim ke WebSocket
    res.json({ message: "Kecepatan conveyor diperbarui", speed });
});

module.exports = router;
