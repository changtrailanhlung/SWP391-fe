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
        "https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-1/349074284_811718277197222_4013644739331041702_n.jpg?stp=dst-jpg_s200x200&_nc_cat=107&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeEO1W-fWu-7d3X-tBr5SZEcI5F9uPdh9icjkX2492H2J8UYNVzDbtRyvEy3z2sInVHfbR2Tg7_AhHHTHF2u2rDZ&_nc_ohc=u4vPv4YhXQ8Q7kNvgG7hzzU&_nc_zt=24&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=AgLP7DC6SUoa4j8VF95bwla&oh=00_AYC_HFYzo5duLPrDuKtPam9awcaznqp_wPR_ytyXG1i0Sw&oe=6728307C", // Use colon instead of equals sign
    },
    {
      name: "Hung Tran",
      position: "Co-Founder",
      message:
        "Adopting a cat was the perfect addition to my home. They are such wonderful companions.",
      image:
        "https://cdn.discordapp.com/attachments/759776758374989838/1301199911240339496/255010705_571449934159817_6782480859281194870_n.png?ex=67239c59&is=67224ad9&hm=8a7632aa3ebb73b2e06e23abe26e42e5b249b58280bf4f4e112477ceab8fbcee&", // Add an image for this testimonial
    },
    {
      name: "Tai Pham",
      position: "Co-Founder",
      message:
        "I'm so grateful I chose to adopt. My new pet has made a huge positive impact and I couldn't imagine life without them.",
      image:
        "https://cdn.discordapp.com/attachments/759776758374989838/1301199911605239898/image.png?ex=67239c5a&is=67224ada&hm=383b5e2683c93dba1f0cc8415e3438f44ff329471f1bfa70f5cdc94333ba8a5f&", // Add an image for this testimonial
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
