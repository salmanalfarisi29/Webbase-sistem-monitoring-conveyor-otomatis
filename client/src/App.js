import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import AturRpm from "./components/AturRpm/AturRpm";
// import PengaturanRpm from "./components/PengaturanRpm/PengaturanRpm";

function App() {
  const user = localStorage.getItem("token");

  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      {user && <Route path="/pengaturan-rpm" exact element={<AturRpm />} />}
      {/* {user && <Route path="/pengaturan-rpm" exact element={<PengaturRpm />} />} */}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
