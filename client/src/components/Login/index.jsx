// Mengimpor React hook `useState` untuk mengelola state dalam komponen
import { useState } from "react";

// Mengimpor axios untuk mengirim request ke API backend
import axios from "axios";

// Mengimpor `Link` dari react-router-dom untuk navigasi tanpa reload halaman
import { Link } from "react-router-dom";

// Mengimpor file CSS module untuk styling halaman login
import styles from "./styles.module.css";

// Mengimpor gambar animasi conveyor untuk tampilan login
import animConveyor from "../../assets/animConveyor.png";


const Login = () => {
	// State untuk menyimpan input email dan password dari pengguna
    const [data, setData] = useState({ email: "", password: "" });

    // State untuk menyimpan pesan error jika login gagal
    const [error, setError] = useState("");

	// Saat pengguna mengetik di input email atau password, fungsi ini akan mengupdate state data
	const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

	const handleSubmit = async (e) => {
        e.preventDefault(); // Mencegah reload halaman saat form dikirim
        try {
            // Mengambil URL API dari variabel environment
            const url = `${process.env.REACT_APP_API_URL}/api/auth`;
            // Mengirim data login ke backend menggunakan axios
            const { data: res } = await axios.post(url, data);
            // Jika login berhasil, simpan token ke localStorage
            localStorage.setItem("token", res.data);
            // Arahkan pengguna ke halaman utama setelah login sukses
            window.location = "/";
        } catch (error) {
            // Jika terjadi error (misalnya email/password salah)
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message); // Tampilkan pesan error dari server
            }
        }
    };

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h2>Masuk ke Akun Anda</h2>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.blue_btn}>
							Masuk
						</button>
						<p className={styles.signup_text}>
							Belum punya akun?{" "}
							<Link to="/signup" className={styles.signup_link}>
								Daftar di sini
							</Link>
						</p>
						{/* <p className={styles.signup_text}>
						<a href="/forgot-password" className={styles.signup_link}>
							Lupa Password?
						</a>
						</p> */}
					</form>
				</div>
				<div className={styles.right}>
					<div className={styles.conveyor_container}>
						<img
							src={animConveyor}
							alt="Sortir Conveyor"
							className={styles.conveyor_image}
						/>
						<h1 className={styles.welcome_text}>Selamat Datang</h1>
						<p className={styles.subtext}>di Sistem Monitoring Conveyor Otomatis!</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
