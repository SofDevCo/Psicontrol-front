import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./components/topbar";
import Sidebar from "./components/sidebar";

const Layout = () => {
  return (
    <div className="layout-container flex h-screen">
      <Sidebar />
      <div className="main-content flex flex-col w-full h-screen bg-clara4">
        <TopBar className="ml-0"/> 
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
