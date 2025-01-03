import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./styles.module.css";
import polmanLogo from "../../assets/logoPolman.png";
import jumlahBarangIcon from "../../assets/jumlah_barang_icon.png";
import pengaturanRpmIcon from "../../assets/pengaturan_rpm_icon.png";

const PengaturRpm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("jumlahBarang");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Tambahkan useNavigate

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
    if (page === "pengaturanRpm") {
      navigate("/pengaturan-rpm"); // Navigasi ke halaman Pengaturan RPM
    } else if (page === "jumlahBarang") {
      navigate("/"); // Navigasi kembali ke halaman utama
    }
  };

  return (
    <div className={styles.dashboard_container}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebar_open : styles.sidebar_closed
        }`}
      >
        <div className={styles.logo_section}>
          {isSidebarOpen ? (
            <h2 className={styles.logo_text}>Sistem Monitoring</h2>
          ) : (
            <img src={polmanLogo} alt="Polman Logo" className={styles.logo_image} />
          )}
        </div>
        <ul className={styles.sidebar_menu}>
          <li
            className={`${styles.menu_item} ${
              isSidebarOpen && activePage === "jumlahBarang"
                ? styles.menu_item_active
                : ""
            }`}
            onClick={() => handlePageChange("jumlahBarang")}
          >
            {isSidebarOpen ? (
              "Jumlah Barang"
            ) : (
              <img
                src={jumlahBarangIcon}
                alt="Jumlah Barang"
                className={styles.menu_icon}
              />
            )}
          </li>
          <li
            className={`${styles.menu_item} ${
              isSidebarOpen && activePage === "pengaturanRpm"
                ? styles.menu_item_active
                : ""
            }`}
            onClick={() => handlePageChange("pengaturanRpm")}
          >
            {isSidebarOpen ? (
              "Pengaturan RPM"
            ) : (
              <img
                src={pengaturanRpmIcon}
                alt="Pengaturan RPM"
                className={styles.menu_icon}
              />
            )}
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className={styles.main_content}>
        <nav className={styles.navbar}>
          <button className={styles.toggle_btn} onClick={toggleSidebar}>
            {isSidebarOpen ? "←" : "→"}
          </button>
          {/* Tombol Logout */}
          <button className={styles.logout_btn} onClick={toggleModal}>
            Logout
          </button>
        </nav>

        <div className={styles.content_area}>
          <h2 className={styles.section_title}>Jumlah Data Barang</h2>
          {/* Jawa Timur */}
          <div className={styles.card_container}>
            <div className={styles.card_header}>Jawa Timur</div>
            <div className={styles.card_body}>23</div>
          </div>

          {/* Jawa Barat */}
          <div className={styles.card_container}>
            <div className={styles.card_header}>Jawa Barat</div>
            <div className={styles.grid_container}>
              <div className={`${styles.grid_item} ${styles.equal_height}`}>
                <h4>Bandung</h4>
                <p>35</p>
              </div>
              <div className={`${styles.grid_item} ${styles.equal_height}`}>
                <h4>Tasikmalaya</h4>
                <p>20</p>
              </div>
              <div className={`${styles.grid_item} ${styles.equal_height}`}>
                <h4>Garut</h4>
                <p>15</p>
              </div>
              <div className={`${styles.grid_item} ${styles.equal_height}`}>
                <h4>Cimahi</h4>
                <p>10</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Logout */}
      {isModalOpen && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <h2>Konfirmasi Logout</h2>
            <p>Apakah Anda yakin ingin logout?</p>
            <div className={styles.modal_buttons}>
              <button className={styles.confirm_btn} onClick={confirmLogout}>
                Ya
              </button>
              <button className={styles.cancel_btn} onClick={toggleModal}>
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PengaturRpm;
