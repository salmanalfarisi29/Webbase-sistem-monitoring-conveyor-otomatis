require('dotenv').config();
const path = require("path");
console.log("DEBUG - Env Path:", path.resolve(__dirname, ".env"));
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const barangRoutes = require("./routes/barang");
const Rpm = require("./models/rpm");
const Barang = require("./models/barang");
const rpmRoutes = require("./routes/rpm");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// **Tambahkan WebSocket `io` ke dalam `app`**
app.set("io", io);

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/rpm", rpmRoutes);


// Middleware agar API bisa mengakses WebSocket
app.use((req, res, next) => {
    req.io = io;
    next();
});

// WebSocket untuk real-time update dari ESP32
io.on("connection", (socket) => {
    console.log("ESP32 Connected");

    // Kirim data awal ke client untuk Barang
    Barang.find().then(data => {
        socket.emit("update-dashboard", data);
    });

    // Kirim data awal untuk RPM
    Rpm.findOne().then((rpmData) => {
        socket.emit("update-rpm", rpmData || { rpmValue: 0 });
    });

    socket.on("barang-update", async (data) => {
        await Barang.updateOne({ wilayah: data.wilayah }, { jumlah: data.jumlah }, { upsert: true });
        const updatedData = await Barang.find();
        io.emit("update-dashboard", updatedData);
    });

    // Handle Reset Counting
    socket.on("reset-counting", async ({ wilayah }) => {
        await Barang.updateOne({ wilayah }, { $set: { jumlah: 0 } });
        const updatedData = await Barang.find();
        io.emit("update-dashboard", updatedData);
    });

    socket.on("disconnect", () => {
        console.log("ESP32 Disconnected");
    });
});

// Change Stream untuk Barang
const barangChangeStream = Barang.watch();

barangChangeStream.on("change", (change) => {
    if (change.operationType === "update") {
        Barang.find({}).then((barangs) => {
            const io = app.get("io");
            if (io) {
                io.emit("update-dashboard", barangs);
                console.log("🔄 WebSocket Emit: Data Barang diperbarui dari MongoDB!");
            } else {
                console.error("❌ WebSocket (io) tidak tersedia di app");
            }
        });
    }
});

// API untuk Update RPM
app.post("/api/rpm/update", async (req, res) => {
    const { rpmValue } = req.body;

    if (rpmValue === undefined || rpmValue < 0) {
        return res.status(400).json({ message: "RPM value must be a positive number." });
    }

    try {
        const updatedRpm = await Rpm.findOneAndUpdate(
            {},
            { rpmValue },
            { new: true, upsert: true }
        );

        // Emit event ke semua client via WebSocket
        io.emit("update-rpm", updatedRpm);
        console.log(`🔄 RPM updated to ${rpmValue}`);

        res.json({ message: "RPM updated successfully.", data: updatedRpm });
    } catch (error) {
        console.error("Error updating RPM:", error);
        res.status(500).json({ message: "Failed to update RPM." });
    }
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}...`));
