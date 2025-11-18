import React from "react";
import { useNavigate } from "react-router-dom";
import { BackgroundBeamsWithCollision } from "./BackgroundBeamsWithCollision";

import solarlogo from "../assets/images/MNRE_India1(1).png";
import solarlogo_1 from "../assets/images/Niesbud-High-Resolution-Logo(1).png";
import solarlogo_2 from "../assets/images/REC_logo.svg (1) (1).png";
import solarlogo_3 from "../assets/images/Skill-India(1).webp";

import mainweb_logo from "../assets/images/highbtlogo white- tm.png";
import background_image from "../assets/images/renewable-power-generation-through-hybrid-energy-farm-with-wind-turbines-solar-panels-concept-renewable-energy-power-generation-hybrid-energy-farm-wind-turbines-solar-panels.jpg";

function Demo() {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${background_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]"></div>

      <BackgroundBeamsWithCollision className="relative z-20 px-4 md:px-6 w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-12 md:py-20">

          {/* Partner Logos (Top) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12 w-full max-w-2xl">
            {[solarlogo, solarlogo_1, solarlogo_2, solarlogo_3].map(
              (logo, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 flex justify-center items-center"
                >
                  <img
                    src={logo}
                    alt={`partner-logo-${index}`}
                    className="h-12 md:h-16 object-contain"
                  />
                </div>
              )
            )}
          </div>

          {/* Main Logo */}
          <img
            src={mainweb_logo}
            alt="Main Logo"
            className="w-28 md:w-40 lg:w-48 mb-6 drop-shadow-2xl"
          />

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
            Power the Future
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl drop-shadow-md px-2">
            Join India’s clean-energy revolution. Upskill, earn certifications,
            and grow with the government-backed{" "}
            <span className="font-bold text-orange-400">
              Solar Entrepreneurship Program
            </span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2 ">
            {/* Admin Login */}
          {/* Admin Login */}
<button
  onClick={() => navigate("/login?type=admin")}
  className="cta cta-blue"
>
  <span>Admin Login</span>
  <svg width="15px" height="10px" viewBox="0 0 13 10">
    <path d="M1,5 L11,5"></path>
    <polyline points="8 1 12 5 8 9"></polyline>
  </svg>
</button>

{/* Coordinator Login */}
<button
  onClick={() => navigate("/login?type=coordinator")}
  className="cta cta-green"
>
  <span>Coordinator Login</span>
  <svg width="15px" height="10px" viewBox="0 0 13 10">
    <path d="M1,5 L11,5"></path>
    <polyline points="8 1 12 5 8 9"></polyline>
  </svg>
</button>

{/* Registration */}
<button
  onClick={() => navigate("/registration")}
  className="cta cta-orange"
>
  <span>Register Now</span>
  <svg width="15px" height="10px" viewBox="0 0 13 10">
    <path d="M1,5 L11,5"></path>
    <polyline points="8 1 12 5 8 9"></polyline>
  </svg>
</button>

          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export default Demo;
