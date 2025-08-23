import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SummaryApi from "./common/index";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import Context from "./Context/context";
import PWABadge from "./PWABadge.jsx";
import "./App.css";
import Header from "./components/Header.jsx";

function App() {
  const dispatch = useDispatch();
  const fetchUserDetails = async () => {
    const response = await fetch(SummaryApi.userDetails.url, {
      method: SummaryApi.userDetails.method,
      credentials: "include",
    });
    const data = await response.json();
    console.log("In fetchuser Details : ", data);

    if (data.success) {
      console.log("USer dispatch : ", data);

      dispatch(setUserDetails(data.data));
    }
  };
  useEffect(() => {
    fetchUserDetails();
  });
  return (
    <>
      <Context.Provider value={{ fetchUserDetails }}>
        <ToastContainer position="top-center" />
        <main className=" bg-[#f8f9fa] scrollbar-none overflow-y-auto">
          <Header/>
          <Outlet />
        </main>
      </Context.Provider>
      <PWABadge />
    </>
  );
}

export default App;
