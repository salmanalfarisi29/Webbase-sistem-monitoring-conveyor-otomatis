import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import animConveyor from "../../assets/animConveyor.png";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = `${process.env.REACT_APP_API_URL}/api/auth`;
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
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
