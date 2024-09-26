import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./topbar";
import Sidebar from "./sidebar";

const Layout = () => {  
    return (
        <div className="layout-container flex h-screen">
            <Sidebar />
            <div className="main-content flex flex-col w-full overflow-auto bg-clara4"> 
                <TopBar />
                <main className="flex-1 p-6">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default Layout;
