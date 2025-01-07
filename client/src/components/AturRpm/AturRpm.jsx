import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import styles from "./styles.module.css";
import polmanLogo from "../../assets/logoPolman.png";
import jumlahBarangIcon from "../../assets/jumlah_barang_icon.png";
import pengaturanRpmIcon from "../../assets/pengaturan_rpm_icon.png";

const socket = io("http://localhost:5000");

const AturRpm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [activePage, setActivePage] = useState("pengaturanRpm");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rpmValue, setRpmValue] = useState(0);
  const [inputRpm, setInputRpm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
        const handleResize = () => {
          setIsSidebarOpen(window.innerWidth > 768);
        };
        window.addEventListener("resize", handleResize);

        // Fetch data awal RPM dari API
        const fetchInitialRpm = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/rpm");
                const data = await response.json();
                if (response.ok && data.rpmValue !== undefined) {
                    setRpmValue(data.rpmValue);
                }
            } catch (error) {
                console.error("Error fetching initial RPM:", error);
            }
        };

        fetchInitialRpm(); // Panggil API untuk mendapatkan RPM saat pertama kali halaman dibuka

        // Listen for WebSocket updates
        socket.on("update-rpm", (data) => {
            if (data && data.rpmValue !== undefined) {
                setRpmValue(data.rpmValue);
            }
        });

        return () => {
          window.removeEventListener("resize", handleResize);
          socket.off("update-rpm");
        };
    }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(page === "pengaturanRpm" ? "/pengaturan-rpm" : "/");
  };

  const updateRpm = async (event) => {
    event.preventDefault();
    const newRpm = parseInt(inputRpm, 10);
    if (!isNaN(newRpm) && newRpm >= 0) {
      try {
        const response = await fetch("http://localhost:5000/api/rpm/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rpmValue: newRpm }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("RPM updated:", data);
          setInputRpm(""); // Reset input field after update
        } else {
          console.error("Error updating RPM:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className={styles.dashboard_container}>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebar_open : styles.sidebar_closed}`}>
        <div className={styles.logo_section}>
          {isSidebarOpen ? (
            <h2 className={styles.logo_text}>Sistem Monitoring</h2>
          ) : (
            <img src={polmanLogo} alt="Polman Logo" className={styles.logo_image} />
          )}
        </div>
        <ul className={styles.sidebar_menu}>
          <li className={`${styles.menu_item} ${isSidebarOpen && activePage === "jumlahBarang" ? styles.menu_item_active : ""}`} onClick={() => handlePageChange("jumlahBarang")}>
            {isSidebarOpen ? "Jumlah Barang" : <img src={jumlahBarangIcon} alt="Jumlah Barang" className={styles.menu_icon} />}
          </li>
          <li className={`${styles.menu_item} ${isSidebarOpen && activePage === "pengaturanRpm" ? styles.menu_item_active : ""}`} onClick={() => handlePageChange("pengaturanRpm")}>
            {isSidebarOpen ? "Pengaturan RPM" : <img src={pengaturanRpmIcon} alt="Pengaturan RPM" className={styles.menu_icon} />}
          </li>
        </ul>
      </aside>

      <div className={styles.main_content}>
        <nav className={styles.navbar}>
          <button className={styles.toggle_btn} onClick={toggleSidebar}>{isSidebarOpen ? "←" : "→"}</button>
          <button className={styles.logout_btn} onClick={toggleModal}>Logout</button>
        </nav>

        <div className={styles.content_area}>
          <h2 className={styles.section_title}>Atur RPM Konveyor</h2>
          <div className={styles.card_container}>
            <p className={styles.rpm_display}>RPM Saat Ini: <span>{rpmValue}</span></p>
            <form onSubmit={updateRpm} className={styles.rpm_form}>
              <input type="number" name="rpmInput" value={inputRpm} onChange={(e) => setInputRpm(e.target.value)} className={styles.input_field} placeholder="Masukkan Nilai RPM" />
              <div className={styles.button_group}>
                <button type="submit" className={styles.confirm_btn}>Update RPM</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <h2>Konfirmasi Logout</h2>
            <p>Apakah Anda yakin ingin logout?</p>
            <div className={styles.modal_buttons}>
              <button className={styles.confirm_btn} onClick={confirmLogout}>Ya</button>
              <button className={styles.cancel_btn} onClick={toggleModal}>Tidak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AturRpm;
