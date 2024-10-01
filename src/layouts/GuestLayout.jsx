import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <div>
      <Navbar />
      {/* <main className="p-4"> */}
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
