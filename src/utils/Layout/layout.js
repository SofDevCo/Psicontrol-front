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
    <div className="layout-container flex h-screen">
      {/* Sidebar com estado controlado */}
      <Sidebar isOpen={isSidebarOpen} />

      <div className="main-content flex flex-col w-full h-screen bg-clara4">
        {/* Passando a função toggleSidebar para o TopBar */}
        <TopBar onMenuClick={toggleSidebar} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
