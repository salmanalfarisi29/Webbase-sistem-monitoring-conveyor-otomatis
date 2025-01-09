const router = require("express").Router(); // Mengimpor Router dari Express untuk menangani rute API
const { User } = require("../models/user"); // Mengimpor model User dari database
const bcrypt = require("bcrypt"); // Mengimpor bcrypt untuk hashing password
const Joi = require("joi"); // Mengimpor Joi untuk validasi input
const nodemailer = require("nodemailer"); // Mengimpor nodemailer untuk mengirim email
const crypto = require("crypto"); // Mengimpor crypto untuk membuat token reset password
require("dotenv").config(); // Memuat variabel lingkungan dari file .env

// **API: Login pengguna**
router.post("/", async (req, res) => {
    try {
        console.log("Login request body:", req.body); // Debugging: mencetak data request login

        const { error } = validate(req.body); // Validasi input email dan password
        if (error)
            return res.status(400).send({ message: error.details[0].message }); // Jika validasi gagal, kirim status 400

        const user = await User.findOne({ email: req.body.email }); // Cari user berdasarkan email di database
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" }); // Jika user tidak ditemukan, kirim status 401

        const validPassword = await bcrypt.compare(req.body.password, user.password); // Bandingkan password yang diinput dengan yang ada di database
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" }); // Jika password salah, kirim status 401

        const token = user.generateAuthToken(); // Membuat token autentikasi untuk sesi pengguna
        res.status(200).send({ data: token, message: "Logged in successfully" }); // Kirim token ke client sebagai tanda login sukses
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" }); // Jika terjadi kesalahan server, kirim status 500
    }
});

// **Fungsi validasi input login menggunakan Joi**
const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"), // Email harus berformat email dan wajib diisi
		password: Joi.string().required().label("Password"), // Password wajib diisi
	});
	return schema.validate(data); // Jalankan validasi dan kembalikan hasilnya
};

// **API: Lupa password**
router.post("/forgot-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); // Cari user berdasarkan email
        if (!user) return res.status(400).send({ message: "Email tidak ditemukan" }); // Jika tidak ditemukan, kirim status 400

        const resetToken = crypto.randomBytes(32).toString("hex"); // Buat token reset password acak
        user.resetToken = resetToken; // Simpan token dalam database
        user.resetTokenExpiry = new Date(Date.now() + 3600000); // Berlaku selama 1 jam
        await user.save(); // Simpan perubahan di database

        console.log("📌 Token yang disimpan:", resetToken); // Debugging: mencetak token di console
        console.log("🔗 Link reset yang dikirim:", `http://localhost:3000/reset-password/${resetToken}`); // Debugging: mencetak link reset

        res.send({ message: "Gunakan link di email untuk reset password" }); // Kirim response ke client
    } catch (error) {
        console.error("🔥 Error:", error); // Jika terjadi error, tampilkan di console
        res.status(500).send({ message: "Internal Server Error" }); // Kirim status 500 jika terjadi error
    }
});

// **API: Reset password menggunakan token**
router.post("/reset-password", async (req, res) => {
    try {
        console.log("🛠 Token diterima:", req.body.token.trim()); // Debugging: mencetak token yang diterima dari request
        console.log("⌛ Waktu Sekarang:", new Date().toISOString()); // Debugging: mencetak waktu sekarang

        const user = await User.findOne({
            resetToken: req.body.token.trim(), // Cari user berdasarkan token reset
            resetTokenExpiry: { $gt: new Date() } // Token harus masih berlaku
        });

        if (!user) {
            console.log("❌ Token tidak ditemukan atau sudah expired"); // Jika token tidak valid atau expired, tampilkan pesan di console
            return res.status(400).send({ message: "Token tidak valid atau telah kedaluwarsa." }); // Kirim status 400
        }

        console.log("✅ Token valid! Mengubah password..."); // Jika token valid, lanjut ke proses reset password
        const salt = await bcrypt.genSalt(10); // Buat salt untuk enkripsi password
        user.password = await bcrypt.hash(req.body.newPassword, salt); // Hash password baru
        user.resetToken = null; // Hapus token reset setelah digunakan
        user.resetTokenExpiry = null; // Hapus waktu kedaluwarsa token
        await user.save(); // Simpan perubahan di database

        res.send({ message: "Password berhasil diubah!" }); // Kirim response sukses
    } catch (error) {
        console.error("🔥 Error:", error); // Jika terjadi error, tampilkan di console
        res.status(500).send({ message: "Internal Server Error" }); // Kirim status 500
    }
});

module.exports = router; // Mengekspor router agar dapat digunakan di aplikasi utama


// router.post("/forgot-password", async (req, res) => {
//     try {
//         console.log("🔍 Menerima request lupa password:", req.body.email); // Debug

//         if (!req.body.email) {
//             return res.status(400).send({ message: "Email tidak boleh kosong" });
//         }

//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             console.log("❌ Email tidak ditemukan:", req.body.email);
//             return res.status(400).send({ message: "Email tidak ditemukan" });
//         }

//         // Buat token reset password
//         const resetToken = crypto.randomBytes(32).toString("hex");
//         user.resetToken = resetToken;
//         user.resetTokenExpiry = Date.now() + 3600000; // Berlaku 1 jam
//         await user.save();
//         console.log("✅ Token reset dibuat:", resetToken);

//         // Kirim email ke user (Sementara kita bisa print ke console dulu)
//         console.log("📧 Mengirim email reset ke:", user.email);
//         console.log(`🔗 Link reset: http://localhost:3000/reset-password/${resetToken}`);

//         res.status(200).send({
//             message: "Gunakan token ini untuk reset password",
//             resetToken: resetToken // Beri token ke response untuk debug
//         });

//     } catch (error) {
//         console.error("🔥 Error Internal Server:", error);
//         res.status(500).send({ message: "Internal Server Error", error: error.message });
//     }
// });

// // KHUSUS RESET PASSWORD MENGGUNAKAN TOKEN
// router.post("/reset-password", async (req, res) => {
//     try {
//         // Validasi password baru sebelum update
//         const { error } = validatePassword(req.body.newPassword);
//         if (error) {
//             return res.status(400).send({ message: error.details[0].message });
//         }

//         const user = await User.findOne({
//             resetToken: req.body.token,
//             resetTokenExpiry: { $gt: Date.now() }
//         });

//         if (!user) return res.status(400).send({ message: "Token tidak valid atau telah kedaluwarsa" });

//         // Hash password baru
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(req.body.newPassword, salt);
//         user.resetToken = undefined;
//         user.resetTokenExpiry = undefined;
//         await user.save();

//         res.send({ message: "Password berhasil diubah" });

//     } catch (error) {
//         res.status(500).send({ message: "Internal Server Error" });
//     }
// });

// Validasi password dengan aturan: minimal 8 karakter, ada huruf kecil, huruf besar, angka, dan simbol
// const validatePassword = (password) => {
//     const schema = Joi.object({
//         password: Joi.string()
//             .min(8) // Minimal 8 karakter
//             .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"))
//             .required()
//             .messages({
//                 "string.pattern.base": "Password harus memiliki minimal 8 karakter, termasuk huruf kecil, huruf besar, angka, dan simbol",
//                 "string.empty": "Password tidak boleh kosong",
//                 "string.min": "Password harus minimal 8 karakter"
//             }),
//     });

//     return schema.validate({ password });
// };
// KHUSUS RESET PASSWORD MENGGUNAKAN TOKEN

