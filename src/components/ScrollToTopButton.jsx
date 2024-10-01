import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import backtotop from "../assets/images/back-to-top-button.png";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <Button
        className="fixed bottom-10 right-10 p-button-rounded p-button-primary flex justify-center items-center w-6 h-6 sm:w-8 sm:h-8"
        onClick={scrollToTop}
        aria-label="Scroll to Top"
        style={{ zIndex: 1000, width: "50px", height: "50px" }}
      >
        <img
          src={backtotop}
          alt="Scroll to Top"
          className="w-full h-full object-contain"
        />
      </Button>
    )
  );
};

export default ScrollToTopButton;
