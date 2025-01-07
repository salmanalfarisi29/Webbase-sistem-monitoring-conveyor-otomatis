const express = require("express");
const router = express.Router();
const Rpm = require("../models/rpm");

// API untuk update RPM
router.post("/update", async (req, res) => {
    const { rpmValue } = req.body;

    if (rpmValue === undefined || rpmValue < 0) {
        return res.status(400).json({ message: "RPM value must be a positive number." });
    }

    try {
        // Update atau buat RPM baru jika belum ada
        const updatedRpm = await Rpm.findOneAndUpdate(
            {},
            { rpmValue },
            { new: true, upsert: true }
        );

        // Kirim update ke semua client melalui WebSocket
        const io = req.app.get("io");
        if (io) {
            io.emit("update-rpm", updatedRpm);
            console.log(`🔄 RPM updated to ${rpmValue}`);
        }

        res.json({ message: "RPM updated successfully.", data: updatedRpm });
    } catch (error) {
        console.error("Error updating RPM:", error);
        res.status(500).json({ message: "Failed to update RPM." });
    }
});

// API untuk mendapatkan nilai RPM saat ini
router.get("/", async (req, res) => {
    try {
        const rpmData = await Rpm.findOne();
        res.json(rpmData || { rpmValue: 0 }); // Jika belum ada data, default 0
    } catch (error) {
        console.error("Error fetching RPM:", error);
        res.status(500).json({ message: "Failed to fetch RPM." });
    }
});

module.exports = router;
