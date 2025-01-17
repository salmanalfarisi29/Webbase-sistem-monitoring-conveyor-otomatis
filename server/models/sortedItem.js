const mongoose = require("mongoose");

const sortedItemSchema = new mongoose.Schema({
    wilayah: { type: String, required: true },
    data_barang: [
        {
            nama_barang: { type: String, required: true },
            barcode: { type: String, required: true },
            alamat: { type: String, required: true },
            nomor_telepon: { type: String, required: true },
            pengirim: { type: String, required: true },
            penerima: { type: String, required: true },
            sortedAt: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model("SortedItem", sortedItemSchema);
