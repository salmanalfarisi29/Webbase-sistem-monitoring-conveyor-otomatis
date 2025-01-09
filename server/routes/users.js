const router = require("express").Router(); // Membuat instance router
const { User, validate } = require("../models/user"); // Mengimpor model User dan fungsi validasi
const bcrypt = require("bcrypt"); // Mengimpor bcrypt untuk enkripsi password

// API: Registrasi pengguna baru
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body); // Validasi data pengguna
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email }); // Periksa apakah email sudah digunakan
        if (user) return res.status(409).send({ message: "User dengan email tersebut sudah terdaftar!" });

        const salt = await bcrypt.genSalt(10); // Buat salt untuk enkripsi password
        const hashPassword = await bcrypt.hash(req.body.password, salt); // Hash password

        await new User({ ...req.body, password: hashPassword }).save(); // Simpan pengguna ke database
        res.status(201).send({ message: "User berhasil dibuat" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" }); // Kirim response error
    }
});

// API: Ambil daftar semua pengguna
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Ambil semua user kecuali password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" }); // Kirim response error
    }
});

module.exports = router; // Mengekspor router untuk digunakan di aplikasi utama
