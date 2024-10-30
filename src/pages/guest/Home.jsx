import React from "react";
import { FaFacebookF, FaInstagram, FaTimes } from "react-icons/fa";
import userabout from "../../assets/images/user-meo.jpg";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <main className="container mx-auto py-16 px-4">
        <section className="about-us flex flex-col lg:flex-row items-center justify-between bg-white p-10 rounded-lg shadow-md">
          {/* Image Section */}
          <div className="mb-8 lg:mb-0">
            <img
              src={userabout}
              alt="userabout"
              className="rounded-full w-80 h-80 object-cover shadow-lg"
            />
          </div>

          {/* About Us Text Section */}
          <div className="lg:ml-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("aboutus")}
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg">
              {t("desctiptionhome")}
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-center items-center space-x-6 text-2xl text-gray-600">
              <a href="#" className="hover:text-gray-800">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-gray-800">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-gray-800">
                <FaTimes />
              </a>
            </div>
          </div>
        </section>
        <section className="bg-white py-12 mt-10 p-10 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4 ">
            {t("function")}
          </h2>
          <div className="flex flex-col lg:flex-row justify-center items-center space-y-8 lg:space-y-0 lg:space-x-56 text-center">
            <div className="text-gray-600">
              <i className="fas fa-calendar-days text-9xl mb-4"></i>
              <h3 className="text-xl font-semibold">{t("function1")}</h3>
            </div>

            <div className="text-gray-600">
              <i className="fas fa-paw text-9xl mb-4"></i>
              <h3 className="text-xl font-semibold">{t("function2")}</h3>
            </div>

            <div className="text-gray-600">
              <i className="fas fa-money-bill text-9xl mb-4"></i>
              <h3 className="text-xl font-semibold">{t("function3")}</h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
