const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Pastikan ini ada di atas
require("dotenv").config();

router.post("/", async (req, res) => {
    try {
        // Tambahkan log untuk debugging
        console.log("Login request body:", req.body);

        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "logged in successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

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

router.post("/forgot-password", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send({ message: "Email tidak ditemukan" });

        // Buat token reset password
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken; // Jangan hash token
        user.resetTokenExpiry = new Date(Date.now() + 3600000); // Berlaku 1 jam
        await user.save();

        console.log("📌 Token yang disimpan:", resetToken);
        console.log("🔗 Link reset yang dikirim:", `http://localhost:3000/reset-password/${resetToken}`);
        console.log("⌛ Expiry Token:", user.resetTokenExpiry.toISOString());

        res.send({ message: "Gunakan link di email untuk reset password" });

    } catch (error) {
        console.error("🔥 Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        console.log("🛠 Token diterima:", req.body.token.trim()); // Trim untuk menghapus spasi
        console.log("⌛ Waktu Sekarang:", new Date().toISOString());

        // Lihat semua token yang tersimpan sebelum mencari
        const allUsers = await User.find({}, { resetToken: 1, _id: 0 });
        console.log("📌 Semua token dalam database:", allUsers);

        const user = await User.findOne({
            resetToken: req.body.token.trim(), // Pastikan token yang dicari sama dengan yang dikirim
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            console.log("❌ Token tidak ditemukan atau sudah expired");
            return res.status(400).send({ message: "Token tidak valid atau telah kedaluwarsa." });
        }

        console.log("✅ Token valid! Mengubah password...");
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.send({ message: "Password berhasil diubah!" });

    } catch (error) {
        console.error("🔥 Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
