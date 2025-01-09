const jwt = require("jsonwebtoken"); // Mengimpor JWT untuk verifikasi token

// Middleware autentikasi untuk memeriksa token JWT di setiap request
const auth = (req, res, next) => {
    const token = req.header("x-auth-token"); // Mengambil token dari header request

    if (!token) return res.status(401).send("Access Denied. No token provided."); // Jika token tidak ada, kirim status 401

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY); // Verifikasi token dengan kunci rahasia di .env
        req.user = decoded; // Menyimpan data pengguna yang terverifikasi dalam request
        next(); // Melanjutkan request ke handler berikutnya
    } catch (ex) {
        return res.status(401).send({ message: "Token expired or invalid." }); // Jika token tidak valid atau kadaluarsa
    }
};

module.exports = auth; // Mengekspor middleware agar bisa digunakan di route lain
