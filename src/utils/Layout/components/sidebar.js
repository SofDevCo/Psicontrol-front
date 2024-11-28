import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../../../images/Psicontrol.png";
import { HomeIcon, RecDespIcon, UserIcon, ConfigIcon } from "../components/icons/sidebarIcons";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCalendarIds, setSelectedCalendarIds] = useState(new Set());

  useEffect(() => {
    // Recuperar IDs de calendários salvos no localStorage
    const savedIds = JSON.parse(localStorage.getItem("selectedCalendars")) || [];
    setSelectedCalendarIds(new Set(savedIds));
  }, []);

  const handleProceed = () => {
    // Salvar os IDs selecionados no localStorage
    const ids = Array.from(selectedCalendarIds);
    localStorage.setItem("selectedCalendars", JSON.stringify(ids));
    console.log("Calendários selecionados salvos no localStorage:", ids);

    // Navegar para o formulário de criação de eventos
    navigate(`/create-event-form?calendarIds=${ids.join(",")}`);
  };

  return (
    <aside className="flex w-[265px] flex-col bg-bg1 p-5 text-gray-800 z-50">
      <div>
        <img src={logo} alt="Logo" className="mb-[78px] w-64" />
        <nav className="text-right">
          <ul className="mt-[100px]">
            {/* Item do Dashboard */}
            <li
              className={`mb-[40px] ${location.pathname.startsWith("/create-event-form") ? "text-[#0082ba]" : ""
                }`}
            >
              <button
                onClick={handleProceed}
                className={`group flex items-center w-full ${location.pathname.startsWith("/create-event-form") ? "" : "hover:text-[#0082ba]"
                  }`}
              >
                <HomeIcon
                  className={
                    location.pathname.startsWith("/create-event-form")
                      ? "text-[#0082ba]"
                      : "text-texto2 group-hover:text-[#0082ba]"
                  }
                />
                <span
                  className={`py-1 text-lg font-medium font-['Ubuntu'] tracking-tight ${location.pathname.startsWith("/create-event-form")
                    ? "text-[#0082ba]"
                    : "text-texto2 group-hover:text-[#0082ba]"
                    }`}
                >
                  Dashboard
                </span>
              </button>
            </li>

            {/* Item de Receitas e Despesas */}
            <li
              className={`side-menu mb-[40px] ${location.pathname === "/income" ? "text-[#0082ba]" : ""}`}
            >
              <Link
                to="/income"
                className={`group flex items-center w-full ${location.pathname === "/income" ? "" : "hover:text-[#0082ba]"}`}
              >
                <RecDespIcon
                  className={`h-8 w-8 ${location.pathname === "/income" ? "text-[#0082ba]" : "text-texto2 group-hover:text-[#0082ba]"}`}
                />
                <div
                  className={`text-lg font-medium font-['Ubuntu'] tracking-tight ${location.pathname === "/income" ? "text-[#0082ba]" : "text-texto2 group-hover:text-[#0082ba]"}`}
                >
                  <span className="flex">Receitas e</span>
                  <span className="flex">Despesas</span>
                </div>
              </Link>
            </li>

            {/* Item de Pacientes */}
            <li
              className={`side-menu mb-[40px] ${location.pathname === "/customers" ? "text-[#0082ba]" : ""
                }`}
            >
              <Link
                to="/customers"
                className={`group flex items-center w-full ${location.pathname === "/customers" ? "" : "hover:text-[#0082ba]"
                  }`}
              >
                <UserIcon
                  className={
                    location.pathname === "/customers"
                      ? "text-[#0082ba]"
                      : "text-texto2 group-hover:text-[#0082ba]"
                  }
                />
                <div
                  className={`text-lg font-medium font-['Ubuntu'] tracking-tight ${location.pathname === "/customers"
                    ? "text-[#0082ba]"
                    : "text-texto2 group-hover:text-[#0082ba]"
                    }`}
                >
                  Pacientes
                </div>
              </Link>
            </li>

            {/* Item de Minhas Configurações */}
            <li
              className={`side-menu mb-[40px] ${location.pathname === "/user" ? "text-[#0082ba]" : ""}`}
            >
              <Link
                to="/user"
                className={`group flex items-center w-full ${location.pathname === "/user" ? "" : "hover:text-[#0082ba]"}`}
              >
                <ConfigIcon
                  className={`h-8 w-8 ${location.pathname === "/user" ? "text-[#0082ba]" : "text-texto2 group-hover:text-[#0082ba]"}`}
                />
                <div
                  className={`text-lg font-medium font-['Ubuntu'] tracking-tight ${location.pathname === "/user" ? "text-[#0082ba]" : "text-texto2 group-hover:text-[#0082ba]"}`}
                >
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
