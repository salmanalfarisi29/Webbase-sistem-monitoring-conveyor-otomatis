// Koneksi ke database MongoDB menggunakan Mongoose
const mongoose = require("mongoose"); // Mengimpor mongoose untuk mengelola koneksi ke MongoDB

// Mengekspor fungsi untuk menghubungkan ke database
module.exports = () => {
    
    // Konfigurasi parameter koneksi MongoDB
    const connectionParams = {
        useNewUrlParser: true, // Menggunakan parser URL baru agar kompatibel dengan MongoDB terbaru
        useUnifiedTopology: true, // Menggunakan sistem monitoring koneksi baru agar lebih stabil
    };

    try {
        // Mencoba melakukan koneksi ke database MongoDB
        mongoose.connect(process.env.DB, connectionParams);
        console.log("Connected to database successfully"); // Jika berhasil, tampilkan pesan sukses
    } catch (error) {
        console.log(error); // Jika ada error, tampilkan error di console
        console.log("Could not connect database!"); // Tampilkan pesan kegagalan koneksi
    }

    // Menjalankan fungsi sekali saja setelah koneksi berhasil terbuka
    mongoose.connection.once('open', async () => {
        console.log("Connected to database:", mongoose.connection.name); // Tampilkan nama database yang terhubung

        // Cek daftar koleksi dalam database dan tampilkan di console
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Koleksi dalam database:", collections.map(col => col.name));
    });
};
