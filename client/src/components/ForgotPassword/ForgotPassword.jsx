import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // 🟢 Kirim permintaan untuk mendapatkan link reset password
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`;
      const { data } = await axios.post(url, { email });

      setSuccessMessage("Silakan cek email Anda untuk link reset password.");

      // 🚀 Buka MailDev di tab baru setelah 2 detik
      setTimeout(() => {
        window.open("http://localhost:1080", "_blank");
      }, 2000);

    } catch (error) {
      setError("Email tidak ditemukan atau server bermasalah.");
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        {/* Bagian Kiri: Info atau Ilustrasi */}
        <div className={styles.left}>
          <h2 className={styles.welcome_back}>Lupa Password?</h2>
          <p className={styles.signup_text}>
            Tidak masalah! Masukkan email Anda, dan kami akan mengirimkan tautan untuk mereset password Anda.
          </p>
        </div>

        {/* Bagian Kanan: Form */}
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleEmailSubmit}>
            <h2 className={styles.create_account}>Lupa Password</h2>
            <input
              type="email"
              placeholder="Masukkan Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {successMessage && <div className={styles.success_msg}>{successMessage}</div>}
            <button type="submit" className={styles.blue_btn}>Kirim Link Reset</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
