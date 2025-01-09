import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem("token"); // Ambil token dari localStorage
            if (!token) {
                navigate("/login"); // Jika tidak ada token, arahkan ke halaman login
                return;
            }

            try {
                const decoded = jwtDecode(token); // Decode token JWT
                const currentTime = Date.now() / 1000; // Waktu sekarang dalam detik
                
                if (decoded.exp < currentTime) { // Jika token expired
                    console.log("🚀 Token expired, logging out...");

                    alert("⚠️ Session Anda telah habis, silakan login kembali."); // Notifikasi alert

                    localStorage.removeItem("token"); // Hapus token dari localStorage
                    navigate("/login"); // Arahkan user ke halaman login
                }
            } catch (error) {
                console.error("❌ Invalid token:", error);
                localStorage.removeItem("token"); // Hapus token jika error
                alert("⚠️ Terjadi kesalahan pada sesi Anda, silakan login kembali."); // Alert error token
                navigate("/login"); // Arahkan user ke halaman login
            }
        };

        checkTokenExpiration(); // Cek langsung saat halaman pertama kali dimuat

        // Buat interval untuk cek token setiap 5 detik
        const interval = setInterval(checkTokenExpiration, 5000);

        return () => clearInterval(interval); // Hentikan interval saat komponen tidak digunakan
    }, [navigate]);

};

export default useAuthCheck;
