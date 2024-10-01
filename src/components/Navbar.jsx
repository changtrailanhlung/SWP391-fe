import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// import logo from "../img/logo.png";
import flagEnglish from "../assets/images/flagEnglish.png";
import flagVietnamese from "../assets/images/flagVietnamese.png";

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
        setShowMobileDropdown(false); // Close mobile dropdown as well
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
          <li>
            <Link className="text-black no-underline hover:underline" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link
              className="text-black no-underline hover:underline"
              to="/about"
            >
              About
            </Link>
          </li>

          {/* Logo centered between About and Products */}
          {/* <li className="mx-4">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-10 md:h-12" />
            </Link>
          </li> */}

          <li
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          ></li>
          <li>
            <Link
              className="text-black no-underline hover:underline"
              to="/contact"
            >
              contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="flex flex-col items-center p-4 md:hidden"
        >
          {/* <Link to="/" className="mb-4">
            <img src={logo} alt="Logo" className="h-10" />
          </Link> */}
          <ul className="flex flex-col items-center gap-4">
            <li>
              <Link className="text-black no-underline hover:underline" to="/">
                home
              </Link>
            </li>
            <li>
              <Link
                className="text-black no-underline hover:underline"
                to="/about"
              >
                about
              </Link>
            </li>

            <li>
              <Link
                className="text-black no-underline hover:underline"
                to="/contact"
              >
                contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
