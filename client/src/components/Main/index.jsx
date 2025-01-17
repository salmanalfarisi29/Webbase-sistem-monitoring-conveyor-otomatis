import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import styles from "./styles.module.css";
import polmanLogo from "../../assets/logoPolman.png";
import jumlahBarangIcon from "../../assets/jumlah_barang_icon.png";
import pengaturanRpmIcon from "../../assets/pengaturan_rpm_icon.png";
import barangBelumDisortirIcon from "../../assets/barangBelumDisortirIcon.png";
import { FaRedo, FaMapMarkerAlt } from "react-icons/fa";
import useAuthCheck from "../../hooks/useAuthCheck"; // Gunakan path relatif dari folder `components`

const socket = io("http://localhost:5000");

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [activePage, setActivePage] = useState("jumlahBarang");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [barangData, setBarangData] = useState({});
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedWilayah, setSelectedWilayah] = useState("");
    const navigate = useNavigate();
    useAuthCheck(); // Cek apakah token masih valid sebelum render halaman

    const openResetModal = (wilayah) => {
      setSelectedWilayah(wilayah);
      setIsResetModalOpen(true);
    };

    const closeResetModal = () => {
      setIsResetModalOpen(false);
      setSelectedWilayah("");
    };

    const confirmResetCounting = () => {
      if (!selectedWilayah) return;
  
      fetch(`http://localhost:5000/api/barang/reset/${selectedWilayah}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token") // Tambahkan token
            }
        })
          .then((response) => response.json())
          .then((data) => {
              console.log("Reset sukses:", data);
  
              // Update jumlah barang ke 0 setelah reset
              setBarangData((prevData) => ({
                  ...prevData,
                  [selectedWilayah]: 0,
              }));
          })
          .catch((error) => console.error("Error:", error))
          .finally(() => {
              // Tutup modal setelah proses selesai
              closeResetModal();
          });
    };
  

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth > 768);
        };
        window.addEventListener("resize", handleResize);
    
        // Fetch data barang saat halaman dimuat
        const fetchInitialBarang = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/barang");
                const data = await response.json();
                console.log("📦 Data barang diterima:", data); // Debugging log
                if (response.ok) {
                    const formattedData = {};
                    data.forEach(({ wilayah, jumlah }) => {
                        formattedData[wilayah] = jumlah;
                    });
                    setBarangData(formattedData);
                }
            } catch (error) {
                console.error("❌ Error fetching barang:", error);
            }
        };
    
        fetchInitialBarang();
    
        // WebSocket Update
        socket.on("update-dashboard", (data) => {
            console.log("🔄 WebSocket Update:", data);
            if (data) {
                const updatedData = {};
                data.forEach(({ wilayah, jumlah }) => {
                    updatedData[wilayah] = jumlah;
                });
                setBarangData(updatedData);
            }
        });
    
        return () => {
            window.removeEventListener("resize", handleResize);
            socket.off("update-dashboard");
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
        if (page === "pengaturanRpm") {
            navigate("/pengaturan-rpm");
        } else if (page === "jumlahBarang") {
            navigate("/");
        } else if (page === "barangBelumDisortir") {
            navigate("/barang-belum-disortir"); 
        }
    };
    

    const resetCounting = (wilayah) => {
        socket.emit("reset-counting", { wilayah });
    };

    return (
        <div className={styles.dashboard_container}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebar_open : styles.sidebar_closed}`}>
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
                            isSidebarOpen && activePage === "jumlahBarang" ? styles.menu_item_active : ""
                        }`}
                        onClick={() => handlePageChange("jumlahBarang")}
                    >
                        {isSidebarOpen ? "Barang yang Telah Disortir" : <img src={jumlahBarangIcon} alt="Jumlah Barang" className={styles.menu_icon} />}
                    </li>
                    <li
                        className={`${styles.menu_item} ${
                            isSidebarOpen && activePage === "barangBelumDisortir" ? styles.menu_item_active : ""
                        }`}
                        onClick={() => handlePageChange("barangBelumDisortir")}
                    >
                        {isSidebarOpen ? "Barang yang Belum Disortir" : <img src={barangBelumDisortirIcon} alt="Barang yang Belum Disortir" className={styles.menu_icon} />}
                    </li>
                    <li
                        className={`${styles.menu_item} ${
                            isSidebarOpen && activePage === "pengaturanRpm" ? styles.menu_item_active : ""
                        }`}
                        onClick={() => handlePageChange("pengaturanRpm")}
                    >
                        {isSidebarOpen ? "Pengaturan RPM" : <img src={pengaturanRpmIcon} alt="Pengaturan RPM" className={styles.menu_icon} />}
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <div className={styles.main_content}>
                <nav className={styles.navbar}>
                    <button className={styles.toggle_btn} onClick={toggleSidebar}>
                        {isSidebarOpen ? "←" : "→"}
                    </button>
                    <button className={styles.logout_btn} onClick={toggleModal}>Logout</button>
                </nav>

                <div className={styles.content_area}>
                    <h2 className={styles.section_title}>Barang yang Telah Disortir</h2>
                    <div className={styles.card_section}>
                        {/* Jawa Timur */}
                        <div className={`${styles.card_container} ${styles.interactive_card}`}>
                            <div className={styles.card_header}>
                                <FaMapMarkerAlt className={styles.icon} /> Jawa Timur
                            </div>
                            <div className={styles.card_body}>{barangData["Jawa Timur"] || 0}</div>
                            <button className={styles.reset_btn} onClick={() => openResetModal("Jawa Timur")}>
                              <FaRedo /> Reset Counting
                            </button>
                        </div>
                    </div>
                    
                    {/* Jawa Barat */}
                    <div className={styles.card_container}>
                        <div className={styles.card_header}>Jawa Barat</div>
                        <div className={styles.grid_container}>
                            {["Bandung", "Cimahi", "Tasikmalaya", "Garut"].map((city) => (
                                <div key={city} className={`${styles.grid_item} ${styles.interactive_card}`}>
                                    <h4 className={styles}>
                                        <FaMapMarkerAlt className={styles.icon} /> {city}
                                    </h4>
                                    <div className={styles.card_body}>{barangData[city] || 0}</div>
                                    <button className={styles.reset_btn} onClick={() => openResetModal(city)}>
                                        <FaRedo /> Reset Counting
                                    </button>
                                </div>
                            ))}
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
                            <button className={styles.confirm_btn} onClick={confirmLogout}>Ya</button>
                            <button className={styles.cancel_btn} onClick={toggleModal}>Tidak</button>
                        </div>
                    </div>
                </div>
            )}
            {isResetModalOpen && (
                <div className={styles.modal_overlay}>
                    <div className={styles.modal}>
                        <h2>Konfirmasi Reset</h2>
                        <p>Apakah Anda yakin ingin mereset jumlah barang di {selectedWilayah}?</p>
                        <div className={styles.modal_buttons}>
                            <button className={styles.confirm_btn} onClick={confirmResetCounting}>Ya</button>
                            <button className={styles.cancel_btn} onClick={closeResetModal}>Tidak</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
