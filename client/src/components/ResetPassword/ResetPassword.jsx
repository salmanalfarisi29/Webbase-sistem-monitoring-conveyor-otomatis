import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.css";

const ResetPassword = () => {
  const { token } = useParams(); // Ambil token dari URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📌 Token dari URL:", token);
    if (!token) {
      setError("Token tidak valid atau sudah kadaluarsa.");
    }
  }, [token]);

  // 🔵 Fungsi untuk mengubah password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Token reset tidak ditemukan!");
      return;
    }
    if (!validatePassword(newPassword)) {
      setError("Password harus memiliki minimal 8 karakter, termasuk huruf kecil, huruf besar, angka, dan simbol.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    try {
      console.log("📌 Token yang dikirim ke server:", token);
      const url = `${process.env.REACT_APP_API_URL}/api/auth/reset-password`;
      await axios.post(url, { token, newPassword });

      setSuccessMessage("Password berhasil diubah! Silakan login.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError("Token tidak valid atau telah kedaluwarsa.");
    }
  };

  // ✅ Validasi password agar aman
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        {/* Bagian Kiri: Info atau Ilustrasi */}
        <div className={styles.left}>
          <h2 className={styles.welcome_back}>Reset Password</h2>
          <p className={styles.signup_text}>
            Masukkan password baru Anda dan pastikan password kuat.
          </p>
        </div>

        {/* Bagian Kanan: Form */}
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleResetPassword}>
            <h2 className={styles.create_account}>Reset Password</h2>
            <input
              type="password"
              placeholder="Masukkan Password Baru"
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Konfirmasi Password Baru"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {successMessage && <div className={styles.success_msg}>{successMessage}</div>}
            <button type="submit" className={styles.blue_btn}>Ubah Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
 