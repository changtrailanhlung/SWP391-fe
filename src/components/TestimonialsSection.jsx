import React from "react";
import Testimonial from "./Testimonial"; // Adjust the path as necessary
import { useTranslation } from "react-i18next";

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Nguyen Le",
      position: "Founder",
      message:
        "Adopting my dog was the best decision I ever made. They bring so much joy and unconditional love into my life.",
      image:
        "https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-1/349074284_811718277197222_4013644739331041702_n.jpg?stp=dst-jpg_s200x200&_nc_cat=107&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeEO1W-fWu-7d3X-tBr5SZEcI5F9uPdh9icjkX2492H2J8UYNVzDbtRyvEy3z2sInVHfbR2Tg7_AhHHTHF2u2rDZ&_nc_ohc=HEon8GbgCJUQ7kNvgH-lz8R&_nc_zt=24&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=Akms7mtGrLlznfFQVxFaba7&oh=00_AYCBfbjQCeooBNquxn0bgol2y8WrxkxZLmTMw3m5zKvIVw&oe=67391BBC",
    },
    {
      name: "Hung Tran",
      position: "Co-Founder",
      message:
        "Adopting a cat was the perfect addition to my home. They are such wonderful companions.",
      image:
        "https://cdn.discordapp.com/attachments/759776758374989838/1301199911240339496/255010705_571449934159817_6782480859281194870_n.png?ex=67341719&is=6732c599&hm=47c86978c52a533aa4def9bf5d3c6fcc937cbf493575627d4268fac139db93d8&",
    },
    {
      name: "Tai Pham",
      position: "Co-Founder",
      message:
        "I'm so grateful I chose to adopt. My new pet has made a huge positive impact and I couldn't imagine life without them.",
      image:
        "https://cdn.discordapp.com/attachments/759776758374989838/1301199911605239898/image.png?ex=6734171a&is=6732c59a&hm=4e1d6401e40fba45e15fb4678656b8ec4932e2598836a35f31819991b5a14d53&",
    },
  ];

  return (
    <main className="container mx-auto py-16 px-4">
      <section className="bg-white py-12 mt-10 p-10 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          {t("founder")}
        </h2>
        <div className="flex flex-col lg:flex-row justify-center items-center space-y-8 lg:space-y-0 lg:space-x-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-white text-center">
              <Testimonial
                name={testimonial.name}
                position={testimonial.position}
                message={testimonial.message}
                image={testimonial.image} // Pass the image prop
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TestimonialsSection;
