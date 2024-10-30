import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import logo from "../img/logo.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-stone-300 to-white py-6 md:h-[200px]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Logo and Contact Information */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 md:ml-0">
          <img src={logo} alt="Logo" className="w-24 h-auto md:w-32" />

          {/* Vertical line (only on larger screens) */}
          <div className="hidden md:block border-l-2 h-32 border-black mx-4"></div>

          {/* Contact Information */}
          <div className="text-center md:text-left space-y-1">
            <p className="flex items-center justify-center md:justify-start text-sm">
              <FaMapMarkerAlt className="mr-2" /> Lô E2a-7, Đường D1, Đ. D1,
              Long Thạnh Mỹ, Thành Phố Thủ Đức, HCM
            </p>
            <p className="flex items-center justify-center md:justify-start text-sm">
              <FaGlobe className="mr-2" /> abandonedpets.ddns.net
            </p>
            <p className="flex items-center justify-center md:justify-start text-sm">
              <FaEnvelope className="mr-2" /> infor@abandonedpets.ddns.net
            </p>
            <p className="flex items-center justify-center md:justify-start text-sm">
              <FaPhone className="mr-2" /> xxxx.xxxx.xx
            </p>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center space-x-4 mt-4 md:mt-0 md:pr-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-gradient-to-l from-slate-900 to-zinc-700 hover:bg-sky-950 p-3 rounded-full"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-gradient-to-l from-slate-900 to-zinc-700 hover:bg-sky-950 p-3 rounded-full"
          >
            <FaInstagram />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-gradient-to-l from-slate-900 to-zinc-700 hover:bg-sky-950 p-3 rounded-full"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-gray-500">copyright</div>
    </footer>
  );
};

export default Footer;
