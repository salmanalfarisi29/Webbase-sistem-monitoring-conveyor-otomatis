import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import AturRpm from "./components/AturRpm/AturRpm";
// import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
// import ResetPassword from "./components/ResetPassword/ResetPassword"; // Pastikan ini diimport
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
      {/* <Route path="/forgot-password" exact element={<ForgotPassword />} />
      <Route path="/reset-password/:token" exact element={<ResetPassword />} /> */}
    </Routes>
  );
}

export default App;
