const express = require("express");
const Barang = require("../models/barang"); // Model Barang
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const router = express.Router(); 

// ✅ API: Ambil jumlah barang per wilayah untuk monitoring
router.get("/", async (req, res) => {
    try {
        console.log("🔍 Mengambil data barang yang telah disortir...");

        // 🔄 Aggregate jumlah barang berdasarkan wilayah
        const aggregateData = await Barang.aggregate([
            { $group: { _id: "$wilayah", jumlah: { $sum: 1 } } }
        ]);

        // 🔄 Format data untuk response
        const formattedData = aggregateData.map(({ _id, jumlah }) => ({
            wilayah: _id,
            jumlah
        }));

        console.log("📦 Data barang yang telah disortir:", formattedData);
        res.json(formattedData);
    } catch (err) {
        console.error("❌ Error saat mengambil data barang:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ API: Reset jumlah barang di wilayah tertentu
router.post("/reset/:wilayah", auth, async (req, res) => {
    const { wilayah } = req.params;

    try {
        // 🔄 Menghapus semua barang di wilayah tersebut
        await Barang.deleteMany({ wilayah });

        // 🔄 WebSocket Broadcast: Update ke Dashboard
        const io = req.app.get("io");
        if (io) {
            const updatedData = await Barang.aggregate([
                { $group: { _id: "$wilayah", jumlah: { $sum: 1 } } }
            ]);
            io.emit("update-dashboard", updatedData);
            console.log(`🔄 Data barang di wilayah ${wilayah} telah direset.`);
        } else {
            console.error("❌ WebSocket (io) tidak tersedia di req.app");
        }

        res.json({ message: `Barang di wilayah ${wilayah} telah direset.` });
    } catch (error) {
        console.error("❌ Error saat reset barang:", error);
        res.status(500).json({ message: "Gagal mereset barang." });
    }
});

// ✅ API: WebSocket untuk Update Barang Real-time
router.post("/update", async (req, res) => {
    const { barcode, nama_barang, wilayah, kode_pos, alamat, nomor_telepon, pengirim, penerima } = req.body;

    try {
        // 🔄 Tambahkan barang ke dalam koleksi MongoDB
        const newBarang = new Barang({
            barcode,
            nama_barang,
            wilayah,
            kode_pos,
            alamat,
            nomor_telepon,
            pengirim,
            penerima,
        });

        await newBarang.save();

        // 🔄 WebSocket Broadcast: Update ke semua client
        const io = req.app.get("io");
        if (io) {
            const updatedData = await Barang.aggregate([
                { $group: { _id: "$wilayah", jumlah: { $sum: 1 } } }
            ]);
            io.emit("update-dashboard", updatedData);
            console.log("📡 Barang baru ditambahkan dan update dikirim:", newBarang);
        } else {
            console.error("❌ WebSocket (io) tidak tersedia di req.app");
        }

        res.json({ message: "Barang berhasil ditambahkan.", data: newBarang });
    } catch (error) {
        console.error("❌ Error menambahkan barang:", error);
        res.status(500).json({ message: "Gagal menambahkan barang." });
    }
});

module.exports = router;
