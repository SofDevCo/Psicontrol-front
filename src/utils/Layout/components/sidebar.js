import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../../../images/Psicontrol.png";
import { HomeIcon, RecDespIcon, UserIcon, ConfigIcon, GoogleCalendarIcon, BorderIcon } from "../components/icons/sidebarIcons";

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

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="flex w-[265px] flex-col bg-bg1 p-5 text-gray-800 z-50">
      <div>
        <img src={logo} alt="Logo" className=" w-[155px] h-[95px] ml-[22px] mt-[18px]" />
        <nav className="text-right">
          <ul className="mt-[67px] ml-[11px]">
            {/* Item do Dashboard */}
            <li
              className={`mb-[27px] -mx-8 ${location.pathname.startsWith("/create-event-form") ? "text-[#0082ba]" : ""}`}
            >
              <button
                onClick={handleProceed}
                className={`group flex items-center w-full ${location.pathname.startsWith("/create-event-form") ? "" : "hover:text-[#0082ba]"}`}
              >
                <BorderIcon isSelected={location.pathname.startsWith("/create-event-form")} />
                <HomeIcon
                  className={location.pathname.startsWith("/create-event-form")
                    ? "text-[#0082ba]"
                    : "text-texto2 group-hover:text-[#0082ba]"
                  }
                />
                <span
                  className={`py-1 text-lg font-medium font-['Ubuntu'] tracking-tight ${location.pathname.startsWith("/create-event-form") ? "text-[#0082ba]" : "text-texto2 group-hover:text-[#0082ba]"}`}
                >
                  Página Inicial
                </span>
              </button>
            </li>

            {/* Item de Receitas e Despesas */}
            <li
              className={`side-menu -mx-8 mb-[27px] ${location.pathname === "/income" ? "text-[#0082ba]" : ""}`}
            >
              <Link
                to="/income"
                className={`group flex items-center w-full ${location.pathname === "/income" ? "" : "hover:text-[#0082ba]"}`}
              >
                <BorderIcon isSelected={location.pathname === "/income"} />
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
              className={`side-menu -mx-8 mb-[27px] ${location.pathname === "/customers" ? "text-[#0082ba]" : ""}`}
            >
              <Link
                to="/customers"
                className={`group flex items-center w-full ${location.pathname === "/customers" ? "" : "hover:text-[#0082ba]"}`}
              >
                <BorderIcon isSelected={location.pathname === "/customers"} />
                <UserIcon
                  className={location.pathname === "/customers"
                    ? "text-[#0082ba]"
                    : "text-texto2 group-hover:text-[#0082ba]"
                  }
                />
                <div
                  className={`text-lg font-medium font-['Ubuntu'] tracking-tight ${location.pathname === "/customers" ? "text-[#0082ba]" : "text-texto2 group-hover:text-[#0082ba]"}`}
                >
                  Pacientes
                </div>
              </Link>
            </li>

            {/* Item de Minhas Configurações */}
            <li
              className={`side-menu -mx-8 mb-[27px] ${location.pathname === "/user" ? "text-[#0082ba]" : ""}`}
            >
              <Link
                to="/user"
                className={`group flex items-center w-full ${location.pathname === "/user" ? "" : "hover:text-[#0082ba]"}`}
              >
                <BorderIcon isSelected={location.pathname === "/user"} />
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

          {/* Item do Google Calendar */}
          <ul>
            <li className="mb-[40px] border-t border-[#5c5c5c]/50 pt-4">
              <button className="group flex items-center w-full hover:text-[#0082ba]">
                <GoogleCalendarIcon className="h-6 w-6 mr-2 text-[#0082ba]" />
                <a
                  href="https://calendar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium font-['Ubuntu'] ml-3 tracking-tight drop-shadow-addShadow text-[#0082ba] underline"
                >
                  Ir para Google Agenda
                </a>
              </button>

              <button onClick={handleLogout} className="text-primaria flex  fixed font-medium font-['Ubuntu'] underline mt-[255px] mr-[170px]">
                Sair
              </button>
            </li>
          </ul>

        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
