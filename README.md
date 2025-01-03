# Webbase-sistemmonitoring-conveyor
🚀 Web Base untuk Sistem Monitoring Conveyor Otomatis

Web ini dikembangkan untuk memantau dan mengontrol sistem conveyor otomatis yang terintegrasi dengan ESP32. Menggunakan teknologi React.js untuk frontend dan Node.js + Express untuk backend.

📝 Fitur :
✅ Dashboard Monitoring: Menampilkan jumlah barang yang dihitung secara otomatis.
✅ Pengaturan RPM Conveyor: Mengontrol kecepatan conveyor langsung dari web.
✅ Notifikasi Real-time: Menggunakan Toast Notification untuk alert penting.
✅ Autentikasi Pengguna: Login dan registrasi user dengan JWT Authentication.
✅ Integrasi ESP32: Mengambil dan mengirim data ke microcontroller melalui API.

📦 Teknologi yang Digunakan :
🔹 Frontend: React.js + React Router + Axios
🔹 Backend: Node.js + Express.js + MongoDB
🔹 Database: MongoDB Atlas
🔹 Microcontroller: ESP32 (HTTP/MQTT Communication)
🔹 Version Control: Git & GitHub

📌 Instalasi dan Menjalankan Proyek :
1️⃣ Clone Repository
bash
Copy code
git clone https://github.com/username/WebBase-SistemMonitoring-ConveyorOtomatis.git
cd WebBase-SistemMonitoring-ConveyorOtomatis
2️⃣ Setup Backend
bash
Copy code
cd server
npm install
npm start
Backend akan berjalan di http://localhost:5000

3️⃣ Setup Frontend
bash
Copy code
cd client
npm install
npm start
Frontend akan berjalan di http://localhost:3000

⚙️ Konfigurasi Environment Variables :
Buat file .env di folder server/ dengan isi:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Untuk frontend (client/.env):
Copy code
REACT_APP_API_URL=http://localhost:5000


