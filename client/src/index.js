// Mengimpor React, yang merupakan pustaka utama untuk membuat komponen UI
import React from "react";
// Mengimpor ReactDOM, yang digunakan untuk merender (menampilkan) elemen React ke dalam halaman HTML
import ReactDOM from "react-dom";
// Mengimpor BrowserRouter dari react-router-dom, yang digunakan untuk menangani navigasi (routing) dalam aplikasi React
import { BrowserRouter } from "react-router-dom";
// Mengimpor file CSS untuk styling global
import "./index.css";
// Mengimpor komponen utama aplikasi, yaitu App.js
import App from "./App";

// Merender (menampilkan) komponen <App /> ke dalam elemen HTML dengan id "root"
ReactDOM.render(
    // React.StrictMode adalah fitur untuk membantu mendeteksi potensi masalah dalam aplikasi
    <React.StrictMode> 
        {/* BrowserRouter membungkus seluruh aplikasi untuk mendukung navigasi antar halaman */}
        <BrowserRouter>
            {/* Menampilkan komponen utama aplikasi */}
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    // Menghubungkan React ke elemen dengan id "root" dalam index.html agar tampil di halaman web
    document.getElementById("root")
);
