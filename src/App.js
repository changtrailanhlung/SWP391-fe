import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GuestRoutes from "./routes/GuestRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import "./style/tailwind.css";
import "primeicons/primeicons.css"; // Import PrimeIcons CSS globally
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/*" element={<GuestRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
