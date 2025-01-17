import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import styles from "./styles.module.css";
import polmanLogo from "../../assets/logoPolman.png";
import jumlahBarangIcon from "../../assets/jumlah_barang_icon.png";
import pengaturanRpmIcon from "../../assets/pengaturan_rpm_icon.png";
import barangBelumDisortirIcon from "../../assets/barangBelumDisortirIcon.png";
import useAuthCheck from "../../hooks/useAuthCheck";
import { QRCodeCanvas } from "qrcode.react";

const socket = io("http://localhost:5000"); // WebSocket connection to backend

const BarangBelumDisortir = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [activePage, setActivePage] = useState("barangBelumDisortir");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator
    const navigate = useNavigate();
    useAuthCheck();

    // Function to fetch data from backend
    const fetchUnsortedItems = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/unsorted");
            if (!response.ok) throw new Error("Gagal mengambil data");

            const data = await response.json();
            setItems(data); // Update state with fetched data
        } catch (error) {
            console.error("❌ Error fetching data:", error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    useEffect(() => {
        // Fetch initial data when the component mounts
        fetchUnsortedItems();

        // WebSocket: Listen for real-time updates
        socket.on("update-unsorted", (updatedItems) => {
            console.log("🔄 Data barang belum disortir diperbarui:", updatedItems);
            setItems(updatedItems); // Update state with real-time data
        });

        // Cleanup: Remove WebSocket listener when component unmounts
        return () => {
            socket.off("update-unsorted");
        };
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handlePageChange = (page) => {
        setActivePage(page);
        if (page === "pengaturanRpm") navigate("/pengaturan-rpm");
        else if (page === "jumlahBarang") navigate("/");
        else if (page === "barangBelumDisortir") navigate("/barang-belum-disortir");
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
                    <li
                        className={`${styles.menu_item} ${
                            isSidebarOpen && activePage === "jumlahBarang" ? styles.menu_item_active : ""
                        }`}
                        onClick={() => handlePageChange("jumlahBarang")}
                    >
                        {isSidebarOpen ? "Barang yang Telah Disortir" : (
                            <img src={jumlahBarangIcon} alt="Jumlah Barang" className={styles.menu_icon} />
                        )}
                    </li>
                    <li
                        className={`${styles.menu_item} ${
                            isSidebarOpen && activePage === "barangBelumDisortir" ? styles.menu_item_active : ""
                        }`}
                        onClick={() => handlePageChange("barangBelumDisortir")}
                    >
                        {isSidebarOpen ? "Barang yang Belum Disortir" : (
                            <img src={barangBelumDisortirIcon} alt="Barang yang Belum Disortir" className={styles.menu_icon} />
                        )}
                    </li>
                    <li
                        className={`${styles.menu_item} ${
                            isSidebarOpen && activePage === "pengaturanRpm" ? styles.menu_item_active : ""
                        }`}
                        onClick={() => handlePageChange("pengaturanRpm")}
                    >
                        {isSidebarOpen ? "Pengaturan RPM" : (
                            <img src={pengaturanRpmIcon} alt="Pengaturan RPM" className={styles.menu_icon} />
                        )}
                    </li>
                </ul>
            </aside>

            <div className={styles.main_content}>
                <nav className={styles.navbar}>
                    <button className={styles.toggle_btn} onClick={toggleSidebar}>
                        {isSidebarOpen ? "←" : "→"}
                    </button>
                    <button className={styles.logout_btn} onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}>
                        Logout
                    </button>
                </nav>
                <div className={styles.content_area}>
                    <h2 className={styles.section_title}>Data Barang yang Belum Disortir</h2>
                    {loading ? (
                        <p>Loading data...</p> // Display loading indicator while fetching data
                    ) : (
                        <div className={styles.table_wrapper}>
                            <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>QR Code</th>
                                    <th>Nama Barang</th>
                                    <th>Wilayah</th>
                                    <th>Kode Pos</th>
                                    <th>Alamat Penerima</th>
                                    <th>No. Telepon Penerima</th>
                                    <th>Penerima</th>
                                    <th>No. Telepon Penerima</th>
                                    <th>Pengirim</th>
                                    <th>No. Telepon Pengirim</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {items.length > 0 ? (
                                        items.map((item, index) => {
                                            const qrData = `
                                Nama Barang: ${item.nama_barang}
                                Barcode: ${item.barcode}
                                Wilayah: ${item.wilayah}
                                Kode Pos: ${item.kode_pos}
                                Penerima: ${item.penerima}
                                Alamat Penerima: ${item.alamat}
                                No. Telepon Penerima: ${item.nomor_telepon_penerima}
                                Pengirim: ${item.pengirim}
                                No. Telepon Pengirim: ${item.nomor_telepon_pengirim}
                                            `.trim();

                                            return (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <QRCodeCanvas
                                                            value={qrData}
                                                            size={128}
                                                            includeMargin={true}
                                                        />
                                                    </td>
                                                    <td>{item.nama_barang}</td>
                                                    <td>{item.wilayah}</td>
                                                    <td>{item.kode_pos}</td>
                                                    <td>{item.alamat}</td>
                                                    <td>{item.nomor_telepon_penerima}</td>
                                                    <td>{item.penerima}</td>
                                                    <td>{item.nomor_telepon_penerima}</td>
                                                    <td>{item.pengirim}</td>
                                                    <td>{item.nomor_telepon_pengirim}</td>
                                                    <td>
                                                        <span className={styles.status_pending}>Menunggu Sortir</span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="12" className={styles.no_data}>Tidak ada data barang yang belum disortir</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarangBelumDisortir;
