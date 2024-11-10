import React from "react";

const Testimonial = ({ name, position, message, image }) => {
  return (
    <div
      className="testimonial p-4 rounded-lg text-center"
      style={{ backgroundColor: "rgb(255, 240, 206)" }} // Apply background color here
    >
      {image && (
        <img
          src={image}
          alt={`${name}'s testimonial`}
          className="w-32 h-32 rounded-full mb-4 mx-auto" // Increased size to w-24 h-24
        />
      )}
      <p style={{ color: "rgb(107, 92, 51)" }} className="mb-2">
        "{message}"
      </p>
      <h4 style={{ color: "rgb(107, 92, 51)" }} className="font-semibold">
        {name}
      </h4>
      <h5 style={{ color: "rgb(107, 92, 51)" }} className="">
        {position}
      </h5>
    </div>
  );
};

export default Testimonial;
