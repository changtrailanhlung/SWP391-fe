import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import logo from "../img/logo.png";
import flagEnglish from "../assets/images/flagEnglish.png";
import flagVietnamese from "../assets/images/flagVietnamese.png";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Retrieve username from localStorage
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.clear();
    // Redirect to login or home page after logout if needed
    window.location.href = "/"; // Change this if you have a different route
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-b from-gray-50/90 to-gray-300/90 backdrop-blur-lg shadow-md z-50 md:h-[100px]">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Hamburger icon for mobile */}
        <button
          className="text-black md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="pi pi-bars text-2xl"></i>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-4 items-center w-full justify-center">
          <li className="mx-4">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-20" />
            </Link>
          </li>
          <li>
            <Link className="text-black no-underline hover:underline" to="/">
              {t("home")}
            </Link>
          </li>
          <li>
            <Link
              className="text-black no-underline hover:underline"
              to="/event"
            >
              {t("event")}
            </Link>
          </li>
          <li>
            <Link
              className="text-black no-underline hover:underline"
              to="/pets"
            >
              {t("pets")}
            </Link>
          </li>
          <li>
            <Link
              className="text-black no-underline hover:underline"
              to="/donate"
            >
              {t("donate")}
            </Link>
          </li>
          <li>
            <Link
              className="text-black no-underline hover:underline"
              to="/contact"
            >
              {t("contact")}
            </Link>
          </li>
          {/* Display username with logout option */}
          {username ? (
            <li className="relative flex items-center">
              <span
                className="text-black cursor-pointer"
                onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown on click
              >
                <i className="pi pi-user text-lg mr-1"></i>
                {username}
              </span>
              {isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)} // Keep dropdown open when hovered
                  onMouseLeave={() => setIsDropdownOpen(false)} // Close dropdown when mouse leaves
                  className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg"
                >
                  <Link
                    to="/user-info" // Adjust the route as necessary
                    className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                  >
                    {t("userinformation")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="/admin/login" className="flex items-center">
                <i className="pi pi-user text-lg mr-1"></i>
                {t("login")}
              </Link>
            </li>
          )}
          {/* Language buttons */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => changeLanguage("en")}
              className="flex items-center"
            >
              <img src={flagEnglish} alt="English" className="h-6 mr-1" />
            </button>
            <button
              onClick={() => changeLanguage("vi")}
              className="flex items-center"
            >
              <img src={flagVietnamese} alt="Vietnamese" className="h-6 mr-1" />
            </button>
          </div>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="flex flex-col items-center p-4 md:hidden"
        >
          <Link to="/" className="mb-4">
            <img src={logo} alt="Logo" className="h-24" />
          </Link>
          <ul className="flex flex-col items-center gap-4">
            <li>
              <Link className="text-black no-underline hover:underline" to="/">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                className="text-black no-underline hover:underline"
                to="/event"
              >
                {t("event")}
              </Link>
            </li>
            <li>
              <Link
                className="text-black no-underline hover:underline"
                to="/pets"
              >
                {t("pets")}
              </Link>
            </li>
            <li>
              <Link
                className="text-black no-underline hover:underline"
                to="/donate"
              >
                {t("donate")}
              </Link>
            </li>
            <li>
              <Link
                className="text-black no-underline hover:underline"
                to="/contact"
              >
                {t("contact")}
              </Link>
            </li>
            {/* Display username with logout option */}
            {isMobileMenuOpen && (
              <div
                ref={mobileMenuRef}
                className="flex flex-col items-center p-4 md:hidden"
              >
                <Link to="/" className="mb-4">
                  <img src={logo} alt="Logo" className="h-24" />
                </Link>
                <ul className="flex flex-col items-center gap-4">
                  <li>
                    <Link
                      className="text-black no-underline hover:underline"
                      to="/"
                    >
                      {t("home")}
                    </Link>
                  </li>
                  {/* Other links... */}
                  {/* Display username with logout option */}
                  {username ? (
                    <li className="relative flex items-center">
                      <span
                        className="text-black cursor-pointer"
                        onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown on click
                      >
                        <i className="pi pi-user text-lg mr-1"></i>
                        {username}
                      </span>
                      {isDropdownOpen && (
                        <div
                          onMouseEnter={() => setIsDropdownOpen(true)} // Keep dropdown open when hovered
                          onMouseLeave={() => setIsDropdownOpen(false)} // Close dropdown when mouse leaves
                          className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg"
                        >
                          <Link
                            to="/user-info" // Adjust the route as necessary
                            className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                          >
                            {t("userinformation")}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                          >
                            {t("logout")}
                          </button>
                        </div>
                      )}
                    </li>
                  ) : (
                    <li>
                      <Link to="/admin/login" className="flex items-center">
                        <i className="pi pi-user text-lg mr-1"></i>
                        {t("login")}
                      </Link>
                    </li>
                  )}
                  {/* Language buttons for mobile */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => changeLanguage("en")}
                      className="flex items-center"
                    >
                      <img
                        src={flagEnglish}
                        alt="English"
                        className="h-6 mr-1"
                      />
                    </button>
                    <button
                      onClick={() => changeLanguage("vi")}
                      className="flex items-center"
                    >
                      <img
                        src={flagVietnamese}
                        alt="Vietnamese"
                        className="h-6 mr-1"
                      />
                    </button>
                  </div>
                </ul>
              </div>
            )}
            {/* Language buttons for mobile */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => changeLanguage("en")}
                className="flex items-center"
              >
                <img src={flagEnglish} alt="English" className="h-6 mr-1" />
              </button>
              <button
                onClick={() => changeLanguage("vi")}
                className="flex items-center"
              >
                <img
                  src={flagVietnamese}
                  alt="Vietnamese"
                  className="h-6 mr-1"
                />
              </button>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
