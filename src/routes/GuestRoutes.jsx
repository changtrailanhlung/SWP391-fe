import React from "react";
import { Route, Routes } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import Home from "../pages/guest/Home";
import RegistrationForm from "../pages/guest/RegistrationForm";
import Contact from "../pages/guest/Contact";
import Pets from "../pages/guest/Pets";
import Profile from "../pages/guest/Profile/TabProfile";
import Donates from "../pages/guest/Donates";
import Events from "../pages/guest/Events";
import ChangePassword from "../pages/guest/Profile/ChangePassword";
import UpdateProfile from "../pages/guest/Profile/UpdateInfo";
import EventDetail from "../pages/guest/EventDetail";
import DonationForm from "../pages/guest/DonationForm"; // Adjust import path as necessary
import DonateWallet from "../pages/guest/Wallet";
import ScrollToTopButton from "../components/ScrollToTopButton";

const GuestRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/registration-form" element={<RegistrationForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/user-info" element={<Profile />} />
          <Route path="/donate" element={<Donates />} />
          <Route path="/event" element={<Events />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/donate-wallet" element={<DonateWallet />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/donate/:shelterId" element={<DonationForm />} />
        </Route>
      </Routes>
      <ScrollToTopButton />
    </>
  );
};

export default GuestRoutes;
