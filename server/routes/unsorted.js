const express = require("express");
const UnsortedItem = require("../models/unsortedItem");
const router = express.Router();
const Barang = require("../models/barang");

// GET: Ambil semua barang yang belum disortir
router.get("/", async (req, res) => {
    console.log("API /api/unsorted dipanggil!");
    try {
        const items = await UnsortedItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST: Tambah barang baru
router.post("/", async (req, res) => {
    const { barcode, nama_barang, wilayah, kode_pos, alamat, nomor_telepon, pengirim, penerima } = req.body;
    try {
        const newItem = new UnsortedItem({
            barcode, nama_barang, wilayah, kode_pos, alamat, nomor_telepon, pengirim, penerima
        });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Ubah status barang menjadi "Tersortir"
router.put("/sort/:id", async (req, res) => {
    try {
        const item = await UnsortedItem.findByIdAndUpdate(
            req.params.id,
            { status: "Tersortir" },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// API untuk menangani pemindahan barang setelah barcode discan
router.put("/sort/:barcode", async (req, res) => {
    try {
        const barcode = req.params.barcode;
        const item = await UnsortedItem.findOne({ barcode });

        if (!item) {
            return res.status(404).json({ message: "Barang tidak ditemukan" });
        }

        // Pindahkan ke koleksi `barangs`
        const newBarang = new Barang({ ...item.toObject(), status: "Telah Disortir" });
        await newBarang.save();

        // Hapus dari `unsorteditems`
        await UnsortedItem.deleteOne({ barcode });

        // Emit event WebSocket ke frontend untuk memperbarui UI secara real-time
        req.io.emit("barang-sorted", { barcode, wilayah: item.wilayah });

        res.json({ message: "Barang berhasil disortir", data: newBarang });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error });
    }
});

// Fungsi untuk mendapatkan jumlah barang per wilayah
const getBarangCountByWilayah = async () => {
    const aggregateData = await Barang.aggregate([
        { $group: { _id: "$wilayah", jumlah: { $sum: 1 } } }
    ]);
    return aggregateData.map(({ _id, jumlah }) => ({ wilayah: _id, jumlah }));
};

// API untuk menangani pemindahan barang setelah barcode discan
router.put("/sort/:barcode", async (req, res) => {
    try {
        const barcode = req.params.barcode;
        const item = await UnsortedItem.findOne({ barcode });

        if (!item) {
            return res.status(404).json({ message: "Barang tidak ditemukan" });
        }

        // Pindahkan ke koleksi `barangs`
        const newBarang = new Barang({ ...item.toObject(), status: "Telah Disortir" });
        await newBarang.save();

        // Hapus dari `unsorteditems`
        await UnsortedItem.deleteOne({ barcode });

        // Dapatkan jumlah barang terbaru setelah update
        const updatedBarangCount = await getBarangCountByWilayah();

        // Emit event WebSocket ke frontend untuk memperbarui UI secara real-time
        req.io.emit("update-dashboard", updatedBarangCount);

        res.json({ message: "Barang berhasil disortir", data: newBarang });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error });
    }
});

// Tambahkan endpoint untuk memproses hasil scan
router.post('/scan', (req, res) => {
    const { barcode, penerima, alamat_penerima, nomor_telepon_penerima, pengirim, nomor_telepon_pengirim } = req.body;

    // Format respons untuk rapi
    const formattedResult = `
        Barcode: ${barcode}
        Penerima: ${penerima}
        Alamat Penerima: ${alamat_penerima}
        No. Telepon Penerima: ${nomor_telepon_penerima}
        Pengirim: ${pengirim}
        No. Telepon Pengirim: ${nomor_telepon_pengirim}
    `;
    
    res.status(200).send(formattedResult); // Kirim respons yang sudah diformat
});


// Endpoint untuk membuat data dummy
router.post("/generate-dummy", async (req, res) => {
    const dummyData = [
        {
            nama_barang: "Paket Elektronik",
            wilayah: "Bandung",
            kode_pos: "40281",
            alamat: "Jl. Sukajadi No. 45",
            nomor_telepon: "089876543210",
            pengirim: "Toko Elektronik Jaya",
            nomor_telepon_pengirim: "081234567890",
            penerima: "Budi Santoso",
            nomor_telepon_penerima: "081234567891",
        },
        {
            nama_barang: "Buku Pelajaran",
            wilayah: "Cimahi",
            kode_pos: "40511",
            alamat: "Jl. Raya Barat No. 10",
            nomor_telepon: "087123456789",
            pengirim: "Gramedia Bandung",
            nomor_telepon_pengirim: "089912345678",
            penerima: "Siti Aisyah",
            nomor_telepon_penerima: "085678901234",
        },
        {
            nama_barang: "Sepatu Sneakers",
            wilayah: "Tasikmalaya",
            kode_pos: "46111",
            alamat: "Jl. Diponegoro No. 12",
            nomor_telepon: "081234567892",
            pengirim: "Adidas Store",
            nomor_telepon_pengirim: "081345678901",
            penerima: "Rizky Hidayat",
            nomor_telepon_penerima: "081987654321",
        },
    ];

    try {
        const result = await UnsortedItem.insertMany(dummyData);
        res.status(201).json({ message: "Data dummy berhasil dibuat", data: result });
    } catch (error) {
        console.error("❌ Error creating dummy data:", error);
        res.status(500).json({ message: "Gagal membuat data dummy", error });
    }
});

module.exports = router;

module.exports = router;
