// Entry point aplikasi backend

require('dotenv').config(); // Memuat variabel lingkungan dari file .env untuk konfigurasi
const path = require("path"); // Mengimpor modul bawaan 'path' untuk mengelola path file
console.log("DEBUG - Env Path:", path.resolve(__dirname, ".env")); // Debugging: Menampilkan lokasi file .env

const express = require("express"); // Mengimpor Express.js untuk membuat server HTTP
const http = require("http"); // Mengimpor modul HTTP bawaan Node.js untuk membuat server
const { Server } = require("socket.io"); // Mengimpor WebSocket Server dari 'socket.io' untuk komunikasi real-time
const cors = require("cors"); // Mengimpor middleware CORS agar server bisa diakses dari domain lain
const connection = require("./db"); // Mengimpor konfigurasi koneksi ke MongoDB dari file 'db.js'

const userRoutes = require("./routes/users"); // Mengimpor routes untuk pengguna (user)
const authRoutes = require("./routes/auth"); // Mengimpor routes untuk autentikasi user
const barangRoutes = require("./routes/barang"); // Mengimpor routes untuk data barang
const Rpm = require("./models/rpm"); // Mengimpor model database untuk menyimpan data RPM conveyor
const Barang = require("./models/barang"); // Mengimpor model database untuk menyimpan data barang
const rpmRoutes = require("./routes/rpm"); // Mengimpor routes untuk mengelola data RPM

const app = express(); // Membuat instance aplikasi Express.js
const server = http.createServer(app); // Membuat server HTTP menggunakan Express
const io = new Server(server, { cors: { origin: "*" } }); // Inisialisasi WebSocket Server dengan izin akses dari semua domain

app.set("io", io); // Menyimpan instance WebSocket (`io`) di dalam Express agar bisa digunakan di API lain

connection(); // Memanggil fungsi untuk menghubungkan server ke database MongoDB

// Middleware
app.use(express.json()); // Mengizinkan server menerima request dengan format JSON
app.use(cors()); // Mengaktifkan CORS agar API dapat diakses dari frontend atau ESP32

// Menghubungkan route API dengan endpoint yang sesuai
app.use("/api/users", userRoutes); // Menggunakan route user pada endpoint '/api/users'
app.use("/api/auth", authRoutes); // Menggunakan route autentikasi pada endpoint '/api/auth'
app.use("/api/barang", barangRoutes); // Menggunakan route barang pada endpoint '/api/barang'
app.use("/api/rpm", rpmRoutes); // Menggunakan route RPM pada endpoint '/api/rpm'

// Middleware untuk menyisipkan WebSocket `io` ke dalam setiap request API
app.use((req, res, next) => {  
    req.io = io; // Menambahkan instance WebSocket ke dalam `req`
    next(); // Melanjutkan ke middleware berikutnya
});

// WebSocket: Menangani komunikasi real-time dengan ESP32
io.on("connection", (socket) => {
    console.log("ESP32 Connected"); // Log saat ESP32 terhubung ke server

    // Mengirimkan data barang terbaru saat client pertama kali terhubung
    Barang.find().then(data => {
        socket.emit("update-dashboard", data); // Kirim data barang ke client
    });

    // Mengirimkan data RPM terbaru saat client pertama kali terhubung
    Rpm.findOne().then((rpmData) => {
        socket.emit("update-rpm", rpmData || { rpmValue: 0 }); // Kirim data RPM ke client
    });

    // Event ketika ESP32 mengirimkan update jumlah barang
    socket.on("barang-update", async (data) => {
        await Barang.updateOne({ wilayah: data.wilayah }, { jumlah: data.jumlah }, { upsert: true }); // Update jumlah barang di database
        const updatedData = await Barang.find(); // Ambil data barang terbaru dari database
        io.emit("update-dashboard", updatedData); // Kirim data terbaru ke semua client
    });

    // Event untuk reset jumlah barang ke 0 untuk wilayah tertentu
    socket.on("reset-counting", async ({ wilayah }) => {
        await Barang.updateOne({ wilayah }, { $set: { jumlah: 0 } }); // Reset jumlah barang ke 0 di database
        const updatedData = await Barang.find(); // Ambil data terbaru dari database
        io.emit("update-dashboard", updatedData); // Kirim data terbaru ke semua client
    });

    // Event ketika ESP32 atau client terputus dari server
    socket.on("disconnect", () => {
        console.log("ESP32 Disconnected"); // Log bahwa ESP32 telah terputus
    });
});

// **MongoDB Change Stream untuk Barang**
// Memantau perubahan data di koleksi 'Barang' secara real-time
const barangChangeStream = Barang.watch(); 

// Event listener: Akan dipicu ketika ada perubahan dalam koleksi 'Barang'
barangChangeStream.on("change", (change) => {
    if (change.operationType === "update") { // Hanya menangani perubahan yang berupa update
        Barang.find({}).then((barangs) => { // Ambil data barang terbaru dari database
            const io = app.get("io"); // Mengambil instance WebSocket dari Express app
            if (io) {
                io.emit("update-dashboard", barangs); // Kirim data barang terbaru ke semua client
                console.log("WebSocket Emit: Data Barang diperbarui dari MongoDB!"); // Log saat data diperbarui
            } else {
                console.error("WebSocket (io) tidak tersedia di app"); // Jika WebSocket tidak tersedia, tampilkan error
            }
        });
    }
});

// **API untuk Update RPM**
app.post("/api/rpm/update", async (req, res) => {    
    const { rpmValue } = req.body; // Mengambil nilai RPM dari request body

    // Validasi: Pastikan nilai RPM tidak kosong dan harus angka positif
    if (rpmValue === undefined || rpmValue < 0) { 
        return res.status(400).json({ message: "RPM value must be a positive number." }); // Kirim response error 400 jika data tidak valid
    }

    try {
        // Mencari satu dokumen RPM di database dan memperbaruinya dengan nilai baru
        const updatedRpm = await Rpm.findOneAndUpdate(
            {}, // Cari satu dokumen RPM di database
            { rpmValue }, // Update nilai RPM
            { new: true, upsert: true } // Jika belum ada, buat baru
        );

        io.emit("update-rpm", updatedRpm); // Kirim event WebSocket ke semua client dengan data terbaru
        console.log(`🔄 RPM updated to ${rpmValue}`); // Log perubahan RPM

        res.json({ message: "RPM updated successfully.", data: updatedRpm }); // Kirim respons sukses ke client

    } catch (error) {
        console.error("Error updating RPM:", error); // Log error jika terjadi kesalahan
        res.status(500).json({ message: "Failed to update RPM." }); // Kirim respons error ke client
    }
});

const port = process.env.PORT || 5000; // Menggunakan port dari .env atau default ke 5000
server.listen(port, () => console.log(`Listening on port ${port}...`)); // Menjalankan server pada port yang telah ditentukan
