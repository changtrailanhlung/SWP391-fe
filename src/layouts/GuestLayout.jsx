import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Banner from "../components/Banner";
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      {/* <main className="p-4"> */}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
