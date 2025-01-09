// Mengimpor useState untuk mengelola state dalam React
import { useState } from "react";
// Mengimpor axios untuk mengirim request ke backend API
import axios from "axios";
// Mengimpor Link untuk navigasi dan useNavigate untuk redirect setelah registrasi sukses
import { Link, useNavigate } from "react-router-dom";
// Mengimpor CSS module untuk styling halaman Signup
import styles from "./styles.module.css";
// Mengimpor gambar animasi conveyor untuk tampilan halaman
import animConveyor from "../../assets/animConveyor.png";


const Signup = () => {
    // State untuk menyimpan input user (Nama Depan, Nama Belakang, Email, Password)
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    // State untuk menyimpan pesan error jika registrasi gagal
    const [error, setError] = useState("");
    // State untuk mengontrol tampilan modal setelah registrasi berhasil
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Hook untuk navigasi ke halaman lain setelah registrasi sukses
    const navigate = useNavigate();
	// Fungsi untuk update input user
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault(); // Mencegah reload halaman setelah submit
		try {
			// URL API untuk registrasi user (diambil dari environment variable)
			const url = `${process.env.REACT_APP_API_URL}/api/users`;
	
			// Mengirim data registrasi ke server menggunakan Axios
			const { data: res } = await axios.post(url, data);
			console.log("Data dari server:", res);
	
			// Jika berhasil, tampilkan modal
			setIsModalOpen(true);
		} catch (error) {
			// Jika terjadi error, tampilkan pesan error
			if (error.response && error.response.status >= 400 && error.response.status <= 500) {
				setError(error.response.data.message);
			}
		}
	};
	

	const handleCloseModal = () => {
		setIsModalOpen(false); // Tutup modal
		navigate("/login"); // Arahkan ke halaman login
	};

	return (
		<div className={styles.signup_container}>
			<div className={styles.signup_form_container}>
				<div className={styles.left}>
					<img
						src={animConveyor}
						alt="Logo Anim Conveyor"
						className={styles.conveyor_image}
					/>
					<h2 className={styles.welcome_back}>
						Sistem Monitoring Conveyor Otomatis
					</h2>
					{/* <Link to="/login">
						<button type="button" className={styles.blue_btn}>
							Masuk
						</button>
					</Link> */}
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h2 className={styles.create_account}>Buat Akun Baru</h2>
						<input
							type="text"
							placeholder="Nama Depan"
							name="firstName"
							onChange={handleChange}
							value={data.firstName}
							required
							className={styles.input}
						/>
						<input
							type="text"
							placeholder="Nama Belakang"
							name="lastName"
							onChange={handleChange}
							value={data.lastName}
							required
							className={styles.input}
						/>
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
							placeholder="Kata Sandi"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.blue_btn}>
							Daftar
						</button>
						<p className={styles.signup_text}>
							Sudah buat akun?{" "}
							<Link to="/login" className={styles.signup_link}>
								Masuk
							</Link>
						</p>
					</form>
				</div>
			</div>
			{/* Modal */}
			{isModalOpen && (
				<div className={styles.modal_overlay}>
					<div className={styles.modal}>
						<h2>Anda sudah terdaftar!</h2>
						<p>Silakan masuk menggunakan akun Anda.</p>
						<button onClick={handleCloseModal} className={styles.modal_button}>
							OK
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Signup;
