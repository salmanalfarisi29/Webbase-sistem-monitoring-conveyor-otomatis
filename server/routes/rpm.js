const express = require("express"); // Mengimpor framework Express.js
const router = express.Router(); // Membuat instance router
const Rpm = require("../models/rpm"); // Mengimpor model RPM dari database

// API: Update nilai RPM
router.post("/update", async (req, res) => {
    const { rpmValue } = req.body; // Mengambil nilai RPM dari request body

    // Validasi: Pastikan nilai RPM ada dan tidak negatif
    if (rpmValue === undefined || rpmValue < 0) {
        return res.status(400).json({ message: "RPM value must be a positive number." });
    }

    try {
        const updatedRpm = await Rpm.findOneAndUpdate(
            {}, // Tidak ada filter karena hanya ada satu dokumen RPM
            { rpmValue }, // Update nilai RPM
            { new: true, upsert: true } // Jika belum ada, buat baru
        );

        const io = req.app.get("io"); // Mengambil WebSocket dari `app`
        if (io) {
            io.emit("update-rpm", updatedRpm); // Kirim update ke semua client melalui WebSocket
            console.log(`🔄 RPM updated to ${rpmValue}`);
        }

        res.json({ message: "RPM updated successfully.", data: updatedRpm }); // Kirim response sukses
    } catch (error) {
        console.error("Error updating RPM:", error);
        res.status(500).json({ message: "Failed to update RPM." }); // Kirim response error
    }
});

// API: Ambil nilai RPM saat ini
router.get("/", async (req, res) => {
    try {
        const rpmData = await Rpm.findOne(); // Mengambil nilai RPM dari database
        res.json(rpmData || { rpmValue: 0 }); // Jika belum ada data, kembalikan 0 sebagai default
    } catch (error) {
        console.error("Error fetching RPM:", error);
        res.status(500).json({ message: "Failed to fetch RPM." }); // Kirim response error
    }
});

module.exports = router; // Mengekspor router untuk digunakan di aplikasi utama
