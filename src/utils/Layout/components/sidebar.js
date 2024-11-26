import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../../../images/Psicontrol.png";
import { HomeIcon, RecDespIcon, UserIcon, ConfigIcon } from "../../../icons/icons";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCalendarIds, setSelectedCalendarIds] = useState(new Set());

  useEffect(() => {
    
    const savedIds = JSON.parse(localStorage.getItem("selectedCalendars")) || [];
    setSelectedCalendarIds(new Set(savedIds));
  }, []);

  const handleProceed = () => {
    const ids = Array.from(selectedCalendarIds);
    
    localStorage.setItem("selectedCalendars", JSON.stringify(ids));
    console.log("Calendários selecionados salvos no localStorage:", ids); 
  
    navigate(`/create-event-form?calendarIds=${ids.join(",")}`);
  };

  return (
    <aside className="flex w-[265px] flex-col bg-bg1 p-5 text-gray-800 z-50">
      <div>
        <img src={logo} alt="Logo" className="mb-[78px] w-64" />
        <nav className="text-right">
          <ul className="mt-[100px]">
            <li
              className={`mb-[40px] ${location.pathname.startsWith("/create-event-form") ? "ativo" : ""}`}
            >
              <button
                onClick={handleProceed}
                className={`group flex items-center ${location.pathname.startsWith("/create-event-form") ? "active" : ""}`}
              >
                <HomeIcon />
                <span className="py-1 text-2xl text-texto2 group-hover:text-primaria">
                  Dashboard
                </span>
              </button>
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
              className={`side-menu mb-[40px] ${location.pathname === "/user" ? "ativo" : ""}`}
            >
              <Link
                to="/user"
                className={`group flex items-center ${location.pathname === "/user" ? "active" : ""}`}
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
