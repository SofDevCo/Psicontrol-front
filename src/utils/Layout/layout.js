import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./components/topbar";
import Sidebar from "./components/sidebar";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className={`layout-container flex h-screen relative ${isSidebarOpen ? "overflow-hidden" : "overflow-auto"}`}>
      {/* Sidebar com estado controlado */}
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* Overlay para blur com cor personalizada */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#BDE3ED] bg-opacity-40 backdrop-blur-md z-20"
          onClick={toggleSidebar} // Fecha o sidebar ao clicar no fundo
        ></div>
      )}

      {/* Topbar sempre visível */}
      <div className="relative z-30">
        <TopBar onMenuClick={toggleSidebar} />
      </div>

      <div className="main-content flex flex-col w-full overflow-auto bg-clara4 z-10">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
