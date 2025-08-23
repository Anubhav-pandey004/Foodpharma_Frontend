import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Context from "../Context/context";
import { Link } from "react-router-dom";
import {
  FaQrcode,
  FaHeart,
  FaGlobe,
  FaUsers,
  FaExchangeAlt,
} from "react-icons/fa";
import { LuSquareDashed } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user1);
  const { fetchUserDetails } = useContext(Context);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] relative overflow-hidden flex flex-col items-center">
      {/* Decorative background circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] opacity-30 rounded-full blur-2xl z-0"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#dee2e6] opacity-20 rounded-full blur-2xl z-0"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center mt-12 mb-8">
        <h1
          className="text-5xl font-extrabold text-[#4f772d] mb-4 tracking-tight flex items-center gap-2"
          style={{
            textShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
          FoodPharma
        </h1>
        <p className="px-2 text-center text-xl text-gray-700 max-w-2xl mb-6 font-medium">
          Scan packaged food. Know what’s inside. Make informed, healthy, and
          safe choices for your body.
        </p>
        <Link
          to="/scan"
          className="animate-bounce-scan mt-4 px-8 py-4 bg-gradient-to-br from-[#b5e48c] to-[#73a942] text-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-3 text-lg font-semibold"
        >
          <LuSquareDashed />
          Start Scanning Now
          <FaArrowRightLong />
        </Link>
      </div>

      {/* Features Section */}
      <div className="relative z-10 mt-6 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        <FeatureCard
          icon={<FaHeart className="text-red-400 text-3xl drop-shadow" />}
          title="Personalized Insights"
          desc="Get alerts tailored to your allergies, fitness goals, and health conditions."
        />
        <FeatureCard
          icon={<FaGlobe className="text-blue-400 text-3xl drop-shadow" />}
          title="Global Ingredient Check"
          desc="Discover where food additives are banned or restricted worldwide."
        />
        <FeatureCard
          icon={<FaUsers className="text-yellow-400 text-3xl drop-shadow" />}
          title="Community Reports"
          desc="Read feedback from others or share your own experience."
        />
        <FeatureCard
          icon={
            <FaExchangeAlt className="text-green-500 text-3xl drop-shadow" />
          }
          title="Live Alternatives"
          desc="Instantly get safer, healthier options while scanning."
        />
      </div>
    </div>
  );
};

// Glassmorphism Feature Card
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#e9ecef] backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-green-100 flex flex-col gap-2 transition-transform hover:scale-105 hover:shadow-2xl">
    <div className="flex items-center gap-4 mb-2">
      <div
        className="bg-[#dde5b6] rounded-full p-3 shadow-inner"
        style={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), inset 0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-green-800">{title}</h3>
    </div>
    <p className="text-base text-gray-700">{desc}</p>
  </div>
);

// Custom animation for scan button
// Add this to your global CSS or Tailwind config if not present:
/*
@keyframes bounce-scan {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-8px);}
}
.animate-bounce-scan {
  animation: bounce-scan 1.5s infinite;
}
*/

export default Home;
