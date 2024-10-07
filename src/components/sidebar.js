import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/Psicontrol.png";
import { HomeIcon, RecDespIcon, UserIcon, ConfigIcon } from "../icons/icons";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-[250px] flex-col bg-bg1 p-5 text-gray-800">
      <div>
        <img src={logo} alt="Logo" className="mb-4 mb-[78px] w-64" />
        <nav className="text-right">
          <ul className="mt-[100px]">
            <li
              className={`mb-[40px] ${location.pathname === "/create-event-form" ? "ativo" : ""}`}
            >
              <Link
                to="/create-event-form"
                className={`group flex items-center ${location.pathname === "/create-event-form" ? "active" : ""}`}
              >
                <HomeIcon/>
                <span className="py-1 text-2xl text-texto2 group-hover:text-primaria">
                  Dashboard
                </span>
              </Link>
            </li>
            <li
              className={`side-menu mb-[40px] ${location.pathname === "/income" ? "ativo" : ""}`}
            >
              <Link
                to="/income"
                className={`group flex items-center ${location.pathname === "/income" ? "active" : ""}`}
              >
                <RecDespIcon />
                <div className="text-2xl text-texto2 group-hover:text-primaria leading-none">
                  <span className="flex">Receitas e</span>
                  <span className="flex">Despesas</span>
                </div>
              </Link>
            </li>
            <li
              className={`side-menu mb-[40px] ${location.pathname === "/customers" ? "ativo" : ""}`}
            >
              <Link
                to="/customers"
                className={`group flex items-center ${location.pathname === "/customers" ? "active" : ""}`}
              >
                <UserIcon />
                <span className="text-2xl text-texto2 group-hover:text-primaria">Pacientes</span>
              </Link>
            </li>
            <li
              className={`side-menu mb-[40px] ${location.pathname === "/configuracoes" ? "ativo" : ""}`}
            >
              <Link
                to="/configuracoes"
                className={`group flex items-center ${location.pathname === "/configuracoes" ? "active" : ""}`}
              >
                <ConfigIcon />
                <div className="text-2xl text-texto2 group-hover:text-primaria leading-none">
                  <span className="flex">Minhas</span>
                  <span className="block">Configurações</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
