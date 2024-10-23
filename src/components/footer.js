import React, { useState } from "react";
import logo from "../assets/logo2.png";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import gmail from "../assets/gmail.png";
import twitter from "../assets/twitter.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer className="swasthya-footer bg-[#010851] w-full lg:px-12 lg:py-5 text-white">
      <div className="swasthya-footer-container max-w-screen-2xl mx-auto">
        <div className="swasthya-footer-content flex flex-col md:flex-row justify-between">
          <div className="swasthya-footer-left md:w-1/2 space-y-4">
            <a
              href="/"
              className="swasthya-footer-logo text-2xl font-semibold flex items-center space-x-3 text-white"
            >
              <img src={logo} alt="logo" className="w-16 h-15 inline-block" />
              <span className="text-white">Swasthya Setu</span>
            </a>

            <p className="swasthya-footer-description text-justify px-7">
              Subscribe to be updated with the important alerts, and exclusive insights delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="swasthya-footer-form flex items-center">
              <input
                type="email"
                name="email"
                id="swasthya-footer-email"
                placeholder="Your email"
                className="swasthya-footer-input bg-white py-2 px-7 rounded-md focus:outline-none w-full md:w-auto text-black"
                style={{ width: "280px", marginLeft: "25px", zIndex: 10 }}

                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="submit"
                value="Submit"
                className="swasthya-footer-submit bg-[#f9a826] py-2 px-4 rounded-md -ml-2 cursor-pointer bg-white text-black transition duration-300 relative overflow-hidden"
                style={{
                  marginLeft: "10px",
                  width: "90px",
                  textAlign: "center",
                  backgroundColor: "#f9a826",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  color: "black",
                  transition: "transform 0.2s, background-color 0.3s",
                  position: "relative",
                }}
              />
            </form>
          </div>
          <div className="swasthya-footer-right md:w-1/2 space-y-4 mt-4 ml-6 md:mt-0 flex flex-col items-start">
            <div className="swasthya-footer-contact space-y-2 text-right">
              <div className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>info@swasthyasetu.com</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-2" />
                <span>+91-7668291228</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>INDIA</span>
              </div>
            </div>
            <div className="mt-4" />
            <div className="swasthya-footer-social flex space-x-4 mt-4">
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="swasthya-footer-social-link"
              >
                <img src={facebook} alt="Facebook" className="w-10 h-10" />
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="swasthya-footer-social-link"
              >
                <img src={instagram} alt="Instagram" className="w-10 h-10" />
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="swasthya-footer-social-link"
              >
                <img src={gmail} alt="Gmail" className="w-10 h-10" />
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="swasthya-footer-social-link"
              >
                <img src={twitter} alt="Twitter" className="w-10 h-10" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {isSubmitted && (
        <div
          className="swasthya-footer-popup"
          style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            color: "black",
            padding: "1rem 2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          Subscription Submitted!
          <button
            onClick={() => setIsSubmitted(false)}
            className="swasthya-footer-popup-close"
            style={{
              marginLeft: "10px",
              backgroundColor: "#f9a826",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              color: "white",
            }}
          >
            Close
          </button>
        </div>
      )}
    </footer>
  );
};

export default Footer;
