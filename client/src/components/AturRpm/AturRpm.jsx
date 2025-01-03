import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import polmanLogo from "../../assets/logoPolman.png";
import jumlahBarangIcon from "../../assets/jumlah_barang_icon.png";
import pengaturanRpmIcon from "../../assets/pengaturan_rpm_icon.png";

const AturRpm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("pengaturanRpm");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
      navigate("/pengaturan-rpm");
    } else if (page === "jumlahBarang") {
      navigate("/");
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
          <button className={styles.logout_btn} onClick={toggleModal}>
            Logout
          </button>
        </nav>

        <div className={styles.content_area}>
          <h2 className={styles.section_title}>Ganti RPM Konveyor</h2>
          <div className={styles.card_container}>
            <input
              type="text"
              className={styles.input_field}
              placeholder="Masukkan Nilai RPM"
            />
            <div className={styles.button_group}>
              <button className={styles.confirm_btn}>Edit RPM</button>
              <button className={styles.cancel_btn}>Reset Count</button>
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

export default AturRpm;
