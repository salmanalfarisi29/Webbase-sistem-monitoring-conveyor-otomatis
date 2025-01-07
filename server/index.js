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
const Barang = require("./models/barang");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/barang", barangRoutes);

// Middleware agar API bisa mengakses WebSocket
app.use((req, res, next) => {
    req.io = io;
    next();
});

// WebSocket untuk real-time update dari ESP32
io.on("connection", (socket) => {
    console.log("ESP32 Connected");
    
    socket.on("barang-update", async (data) => {
        await Barang.updateOne({ wilayah: data.wilayah }, { jumlah: data.jumlah }, { upsert: true });
        io.emit("update-dashboard", data);
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}...`));
