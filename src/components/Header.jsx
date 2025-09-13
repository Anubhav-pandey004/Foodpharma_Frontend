import React, { useContext, useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { GiHealthIncrease } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Context from "../Context/context";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { logout as logoutAction } from "../store/userSlice"; // adjust path as needed

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigater = useNavigate();
  const tempuser = useSelector((state) => state.user.user1);
  const { fetchUserDetails } = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    const response = await fetch(SummaryApi.logout.url, {
      method: SummaryApi.logout.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const result = await response.json();
    if (result.success) {
      toast.success("Logout !");
      dispatch(logoutAction()); // <-- clear user from Redux
      fetchUserDetails();
      navigate("/");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  console.log(tempuser);
  
  return (
    <header
      className="sticky top-6 left-0 right-0 w-[95%] mx-auto rounded-4xl z-50 bg-[#dde5b6] shadow-2xl backdrop-blur-md border-b border-gray-100 "
      style={{
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), inset 0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex cursor-pointer items-center space-x-2"
            onClick={() => {
              navigater("/");
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#b5e48c] to-[#99d98c] rounded-lg flex items-center justify-center">
              <GiHealthIncrease className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FoodPharma</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              onClick={() => {
              navigater("/");
            }}
            >
              Dashboard
            </a>
            <button
              onClick={() => navigater('/history')}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"

            >
              History
            </button>
 
            {tempuser != null ? (
              <button
                onClick={logout}
                className="bg-gradient-to-br from-[#b5e48c] to-[#73a942] cursor-pointer text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigater("/login");
                }}
                className="bg-gradient-to-br from-[#b5e48c] to-[#73a942] cursor-pointer text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Login
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <RxCross2 className="w-6 h-6" />
            ) : (
              <CiMenuFries className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <button
                onClick={() => { setIsMenuOpen(false); navigater('/history'); }}
                className="text-gray-600 hover:text-gray-900 transition-colors text-left"
              >
                History
              </button>
              {tempuser != null ? (
              <button
                onClick={()=>{
                  logout
                  setIsMenuOpen(!isMenuOpen)
                }}
                className="bg-gradient-to-br from-[#b5e48c] to-[#73a942] cursor-pointer text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen)
                  navigater("/login");
                }}
                className="bg-gradient-to-br from-[#b5e48c] to-[#73a942] cursor-pointer text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Login
              </button>
            )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
