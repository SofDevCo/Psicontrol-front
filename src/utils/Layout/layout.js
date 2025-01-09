import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./components/topbar";
import Sidebar from "./components/sidebar";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // No início do componente Layout
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  return (
    <div className="layout-container flex h-screen overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-[#BDE3ED] bg-opacity-40 backdrop-blur-md z-20 pointer-events-auto"
          onClick={toggleSidebar} 
        ></div>
      )}

      {(!isMobile || !isModalOpen) && (
        <div className="relative z-30">
          <TopBar onMenuClick={toggleSidebar} />
        </div>
      )}

      <div className="main-content flex flex-col w-full h-full bg-clara4 z-10">
        <main className="flex-1 overflow-auto">
          <Outlet context={{ setIsModalOpen }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
