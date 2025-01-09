const mongoose = require("mongoose"); // Mengimpor mongoose untuk mengelola model database
const jwt = require("jsonwebtoken"); // Mengimpor JWT untuk membuat token autentikasi
const Joi = require("joi"); // Mengimpor Joi untuk validasi data pengguna
const passwordComplexity = require("joi-password-complexity"); // Validasi password agar lebih aman

// Membuat schema (struktur data) untuk menyimpan informasi user dalam database
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, // Nama depan user (wajib diisi)
    lastName: { type: String, required: true }, // Nama belakang user (wajib diisi)
    email: { type: String, required: true, unique: true }, // Email user (wajib unik dan diisi)
    password: { type: String, required: true }, // Password user (wajib diisi dan akan di-hash sebelum disimpan)
    resetToken: { type: String, default: null }, // Token reset password jika user lupa password
    resetTokenExpiry: { type: Date, default: null }, // Waktu kadaluarsa token reset password
});

// **Membuat metode untuk menghasilkan JWT (JSON Web Token)**
userSchema.methods.generateAuthToken = function () {
    console.log("Generating token with JWTPRIVATEKEY:", process.env.JWTPRIVATEKEY); // Debugging log
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { // Membuat token berbasis user ID
        expiresIn: "7d", // Token berlaku selama 7 hari
    });
    return token; // Mengembalikan token
};

// Membuat model `User` berdasarkan schema `userSchema`
const User = mongoose.model("user", userSchema);

// **Fungsi Validasi Data Registrasi**
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"), // Nama depan wajib diisi
        lastName: Joi.string().required().label("Last Name"), // Nama belakang wajib diisi
        email: Joi.string().email().required().label("Email"), // Email wajib diisi dan harus dalam format email
        password: passwordComplexity().required().label("Password"), // Password harus kompleks (huruf besar, kecil, angka, dan simbol)
    });
    return schema.validate(data); // Mengembalikan hasil validasi
};

// Mengekspor model `User` dan fungsi validasi agar bisa digunakan di aplikasi lain
module.exports = { User, validate };
