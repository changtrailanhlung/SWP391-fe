import React, { useEffect, useState } from "react";

const Banner = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const transitionDuration = 5000; // Time between transitions

  // Function to import all images from the specified directory
  const importAll = (r) => {
    return r.keys().map(r); // Returns an array of image paths
  };

  useEffect(() => {
    // Dynamically import all images in assets/banner
    const bannerImages = importAll(
      require.context("../assets/banner", false, /\.(png|jpe?g|svg)$/)
    );
    setImages(bannerImages);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, transitionDuration);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images]);

  return (
    <div className="relative w-full h-[60rem] overflow-hidden">
      {" "}
      {/* Increased height to h-[64rem] */}
      {images.length > 0 ? (
        <div
          className="absolute inset-0 transition-transform duration-500 ease-in-out flex"
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      ) : (
        <p>No images found</p> // Message if no images are loaded
      )}
      {/* Navigation buttons */}
      {/* <div className="absolute inset-0 flex justify-between items-center">
        <button
          onClick={() =>
            setCurrentImageIndex(
              currentImageIndex === 0
                ? images.length - 1
                : currentImageIndex - 1
            )
          }
          className="bg-black bg-opacity-50 text-white px-3 py-2 rounded"
        >
          Prev
        </button>
        <button
          onClick={() =>
            setCurrentImageIndex(
              currentImageIndex === images.length - 1
                ? 0
                : currentImageIndex + 1
            )
          }
          className="bg-black bg-opacity-50 text-white px-3 py-2 rounded"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default Banner;
