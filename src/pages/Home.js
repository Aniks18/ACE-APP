import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Carousel } from "flowbite-react";
import { useNavigate } from "react-router-dom";

import "../App.css";
// import banner from "../assets/banner_1_bgrm.png";
// import banner2 from "../assets/banner_2_bgrm.png";
import aboutpic from "../assets/aboutpic1.png";
import {
  FaTools,
  FaClipboardList,
  FaMedkit,
  FaBell,
  FaSyringe,
  FaUsers,
  FaHospital,
} from "react-icons/fa";
import Lottie from "lottie-react";
import icon1 from "../med.json";
import icon2 from "../animatedicon2.json";
import icon3 from "../animatedicon3.json";
import b1 from "../assets/Med2.json";
import b2 from "../assets/Med4.json";
import h1 from "../assets/h1.png";
import v1 from "../assets/v2.png";
import c2 from "../assets/c2.png";
import ms2 from "../assets/ms2.png";
import bt from "../assets/bluetick.png";
import h2 from "../assets/h2.png";
import ms1 from "../assets/ml1.png";
import c1 from "../assets/c1.png";

const data = [
  {
    icon: FaTools,
    title: "City Administration Tools",
    para: "Monitor pandemic response, manage resources, and track city-wide health data.",
  },
  {
    icon: FaClipboardList,
    title: "Resource Management",
    para: "Smart Resources Distribution",
  },
  {
    icon: FaMedkit,
    title: "Medical Shop Integration",
    para: "Locate nearby pharmacies, check medicine availability, and place orders",
  },
  {
    icon: FaBell,
    title: "Real-Time Health Updates",
    para: "Real-Time Epidemic News & Alerts",
  },
  {
    icon: FaSyringe,
    title: "Medication Reminders",
    para: "Medication Adherence Alerts",
  },
  {
    icon: FaUsers,
    title: "Volunteer Assistance",
    para: "Volunteer Support & Services",
  },
  {
    icon: FaHospital,
    title: "Hospital Dashboard",
    para: "Track patient data, hospital capacity, and essential supplies",
  },
];

const packages = [
  {
    name: "Citizen",
    description: "Stay informed, access care, and manage your health with ease",
    features: [
      "AI-driven disease prediction",
      "Real-time epidemic updates",
      "Check hospital bed availability",
      "Set medication reminders",
      "Access and store medical reports",
    ],
    blue: bt,
    iconImage: c1,
  },
  {
    name: "Hospital",
    description:
      "Streamline patient care, give real-time updates, resource tracking",
    features: [
      "Track patient admissions",
      "Manage bed availability and capacity",
      "Update essential medical supplies",
      "Monitor pandemic response",
      "Real-time health data for efficient decision-making",
    ],
    blue: bt,
    iconImage: h2,
  },
  {
    name: "Pharmacy",
    description:
      "Manage inventory and serve your community during health crises.",
    features: [
      "Update available medicine stock",
      "Manage orders and discounts",
      "Provide real-time stock visibility",
      "Receive city-wide emergency alerts",
      "Assist in managing health supplies",
    ],
    blue: bt,
    iconImage: ms1,
  },
];

const Home = () => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="md:px-12 p-4 max-w-screen-2xl mx-auto mt-3">
        <div className="gradientBg rounded-xl rounded-br-[80px] md:p-9 px-4 py-9 mb-10">
          <Carousel className="h-[450px] sm:h-[500px] md:h-[550px]">
            {/* First Slide */}
            <div className="flex flex-col md:flex-row justify-between items-center h-full px-4 md:px-10">
              <div className="md:w-1/2 text-left">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                  Empowering Health, Prioritizing Lives
                </h2>
                <p className="text-white text-base md:text-lg mb-6">
                  Seamlessly connect with hospitals, pharmacies, and volunteers
                  to fight epidemics together, while accessing vital health
                  information, medication reminders, and outbreak
                  predictions—all at your fingertips.
                </p>
                <button onClick = {() => navigate('/login')} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl">
                  Get Started
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end mt-3 md:mt-0">
                <Lottie
                  animationData={b1}
                  className="w-36 h-36 sm:w-40 sm:h-40 lg:w-96 lg:h-96 xl:w-116 xl:h-116"
                />
              </div>
            </div>

            {/* Second Slide */}
            <div className="flex flex-col md:flex-row justify-between items-center h-full px-4 md:px-10 mb-10">
              <div className="md:w-1/2 text-left">
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                  Stay Informed, Stay Healthy
                </h2>
                <p className="text-white text-base md:text-lg mb-6">
                  Stay ahead of the curve with real-time updates on health
                  epidemics, weather conditions, and disease outbreaks. We help
                  you keep your family safe.
                </p>
                <button onClick={() => navigate('/about')} className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-xl">
                  Learn More
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end mt-4 md:mt-0">
                <Lottie
                  animationData={b2}
                  className="w-30 h-30 sm:w-36 sm:h-36 lg:w-96 lg:h-96"
                />
              </div>
            </div>
          </Carousel>
        </div>

        <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-16 rounded-xl rounded-br-[80px] mb-10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-500 text-center mb-6">
              Our Services & Features
            </h2>
            <p className="text-xl text-center mb-10">
              Discover our innovative solutions designed to enhance health
              management, empower communities, and streamline access to
              essential resources.
            </p>
            <Slider {...settings}>
              {data.map((item, index) => (
                <div key={index} className="px-2">
                  <div className="bg-white p-6 rounded-xl flex flex-col justify-between items-center border-b-[8px] border-blue-600 h-[300px] shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="bg-yellow-400 p-6 rounded-full hover:bg-yellow-500 cursor-pointer mb-4">
                      {item.icon && <item.icon className="w-[40px] h-[40px]" />}
                    </div>
                    <h3 className="text-xl text-black font-bold text-center mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-center mb-4">{item.para}</p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-16 rounded-xl rounded-br-[80px] mb-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="w-full lg:w-[45%]">
                <img
                  src={aboutpic}
                  alt="About Us"
                  className="rounded-lg  w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover"
                />
              </div>
              <div className="w-full lg:w-[45%]">
                <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-blue-500 hover:border-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out">
                  <h3 className="text-2xl font-bold mb-4">
                    About <span className="text-blue-500">Our Software</span>
                  </h3>
                  <p className="text-lg text-gray-700 mb-6">
                    Our platform is designed to streamline epidemic management,
                    integrating hospitals, pharmacies, volunteers, and
                    government services for a unified response. With advanced
                    real-time data tracking, resource management tools, and
                    alert systems, we empower communities to stay informed and
                    act quickly during health crises.
                  </p>
                  <div className="flex justify-between items-center">
                    <Lottie animationData={icon2} className="w-24 h-24" />
                    <Lottie animationData={icon1} className="w-24 h-24" />
                    <Lottie animationData={icon3} className="w-24 h-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 rounded-xl rounded-br-[80px] mb-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:pl-10">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-semibold text-gray-600 mb-6">
                  Connecting Care
                  <br />
                  <span className="text-blue-500">Our Health Network!</span>
                </h2>
                <p className="text-lg mb-6">
                  Join us in celebrating our incredible network of hospitals,
                  medical shops, and volunteers! Together, we are shaping a
                  community where health is a priority and care is always within
                  reach.
                </p>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-8">
                <StatsItem icon={h1} number="3000" text="Hospitals" />
                <StatsItem icon={ms2} number="6000" text="Pharmacies" />
                <StatsItem icon={v1} number="20000" text="Volunteers" />
                <StatsItem icon={c2} number="250000" text="Users" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 rounded-xl rounded-br-[80px]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-950 mb-4">
                How <span className="text-blue-500">We Work!</span>
              </h2>
              <p className="text-xl">
                Connecting people, healthcare, and resources for a healthier
                tomorrow.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <PackageCard key={index} {...pkg} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsItem = ({ icon, number, text }) => (
  <div className="flex items-center gap-4">
    <img src={icon} alt="" className="w-10 h-10" />
    <div>
      <h4 className="text-2xl font-semibold text-gray-600">{number}</h4>
      <p>{text}</p>
    </div>
  </div>
);
const PackageCard = ({ name, description, features, blue, iconImage }) => (
  <div
    className="bg-white border py-10 px-6 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 ease-in-out"
    style={{ boxShadow: "0 0 15px rgba(0, 0, 255, 0.1)" }}
  >
    <div className="flex justify-center mb-4">
      <img src={iconImage} alt={name} className="w-16 h-16" />
    </div>
    <h3 className="text-3xl font-bold text-center text-blue-900 mb-4">
      {name}
    </h3>
    <p className="text-center mb-6">{description}</p>
    <ul className="mt-4 space-y-2 px-4">
      {features.map((feature, featureIndex) => (
        <li
          key={featureIndex}
          className="flex items-center gap-2 text-blue-500"
        >
          <img src={blue} alt="" className="w-5 h-5 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Home;