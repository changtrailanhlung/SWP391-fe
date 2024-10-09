import React from "react";
import { Route, Routes } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import Home from "../pages/guest/Home";
import RegistrationForm from "../pages/guest/RegistrationForm";
import About from "../pages/guest/About";
import Contact from "../pages/guest/Contact";
import Pets from "../pages/guest/Pets";
import Profile from "../pages/guest/Profile";
import ScrollToTopButton from "../components/ScrollToTopButton";

const GuestRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/registration-form" element={<RegistrationForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/user-info" element={<Profile />} />
        </Route>
      </Routes>
      <ScrollToTopButton />
    </>
  );
};

export default GuestRoutes;
