// Mengimpor komponen Route, Routes, dan Navigate dari react-router-dom
import { Route, Routes, Navigate } from "react-router-dom";

// Mengimpor komponen yang digunakan sebagai halaman utama aplikasi
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import AturRpm from "./components/AturRpm/AturRpm";
import BarangBelumDisortir from "./components/BarangUnsorted/unsortedItemList";

// Komponen utama React yang mengatur navigasi dan halaman utama.
function App() {
  // Mengambil token pengguna dari localStorage (digunakan untuk mengecek apakah user sudah login)
  const user = localStorage.getItem("token");

  return (
    <Routes>
      {/* Jika user sudah login, maka halaman utama ("/") akan menampilkan komponen Main */}
      {user && <Route path="/" exact element={<Main />} />}

      {/* Jika user sudah login, maka halaman "/pengaturan-rpm" akan menampilkan komponen AturRpm */}
      {user && <Route path="/pengaturan-rpm" exact element={<AturRpm />} />}

      {user && <Route path="/barang-belum-disortir" exact element={<BarangBelumDisortir />} />}

      {/* Jika user belum login, maka diarahkan ke halaman "/login" */}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />

      {/* Jika user mencoba mengakses halaman utama ("/") tanpa login, maka diarahkan ke "/login" */}
      <Route path="/" element={<Navigate replace to="/login" />} />

      {/* Rute ini dikomentari, artinya fitur lupa password & reset password belum diaktifkan */}
      {/* <Route path="/forgot-password" exact element={<ForgotPassword />} />
      <Route path="/reset-password/:token" exact element={<ResetPassword />} /> */}
    </Routes>
  );
}

// Mengekspor komponen App agar bisa digunakan di file lain
export default App;
