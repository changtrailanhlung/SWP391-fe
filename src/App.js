// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GuestRoutes from "./routes/GuestRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import EventDetail from "./pages/guest/EventDetail";
import { AuthProvider } from "./context/AuthContext"; // Import your AuthProvider
import "./style/tailwind.css";
import "primeicons/primeicons.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/*" element={<GuestRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
