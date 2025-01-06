import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../../../images/Psicontrol.png";
import {
  HomeIcon,
  RecDespIcon,
  UserIcon,
  ConfigIcon,
  GoogleCalendarIcon,
  BorderIcon,
} from "../components/icons/sidebarIcons";

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCalendarIds, setSelectedCalendarIds] = useState(new Set());
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY); // Atualiza a posição do scroll
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const savedIds =
      JSON.parse(localStorage.getItem("selectedCalendars")) || [];
    setSelectedCalendarIds(new Set(savedIds));
  }, []);

  const handleProceed = () => {
    const ids = Array.from(selectedCalendarIds);
    localStorage.setItem("selectedCalendars", JSON.stringify(ids));
    navigate(`/create-event-form?calendarIds=${ids.join(",")}`);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <aside
        className={`max-md:fixed top-0 z-40 left-0 h-full w-[265px] bg-bg1 p-5 text-gray-800 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:flex-shrink-0`}
      >
        <div>
          {/* Botão Hambúrguer para Fechar */}
          <button
            className="md:hidden p-5"
            onClick={onToggle} // Usando a função passada como prop
            aria-label="Fechar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mx-[-20px] mb-[-40px] my-[12px] text-primaria"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <img
            src={logo}
            alt="Logo"
            className="md:w-[155px] md:h-[95px] w-[1px] h-[1px] md:opacity-100 opacity-0  z-50 ml-[22px] md:mt-[18px]"
          />
          <nav className="text-right">
            <ul className="md:mt-[70px] mt-[53px] ml-[11px]">
              {/* Página Inicial */}
              <li
                className={`mb-[27px] -mx-8 ${
                  location.pathname.startsWith("/create-event-form")
                    ? "text-[#0082ba]"
                    : ""
                }`}
              >
                <button
                  onClick={handleProceed}
                  className={`group flex items-center w-full ${
                    location.pathname.startsWith("/create-event-form")
                      ? ""
                      : "hover:text-[#0082ba]"
                  }`}
                >
                  <BorderIcon
                    isSelected={location.pathname.startsWith(
                      "/create-event-form"
                    )}
                  />
                  <HomeIcon
                    className={
                      location.pathname.startsWith("/create-event-form")
                        ? "text-[#0082ba]"
                        : "text-texto2 group-hover:text-[#0082ba]"
                    }
                  />
                  <span
                    className={`py-1 text-lg font-medium font-['Ubuntu'] tracking-tight ${
                      location.pathname.startsWith("/create-event-form")
                        ? "text-[#0082ba]"
                        : "text-texto2 group-hover:text-[#0082ba]"
                    }`}
                  >
                    Página Inicial
                  </span>
                </button>
              </li>

              {/* Receitas e Despesas */}
              <li
                className={`side-menu -mx-8 mb-[27px] ${
                  location.pathname === "/income" ? "text-[#0082ba]" : ""
                }`}
              >
                <Link
                  to="/income"
                  className={`group flex items-center w-full ${
                    location.pathname === "/income"
                      ? ""
                      : "hover:text-[#0082ba]"
                  }`}
                >
                  <BorderIcon isSelected={location.pathname === "/income"} />
                  <RecDespIcon
                    className={`h-8 w-8 ${
                      location.pathname === "/income"
                        ? "text-[#0082ba]"
                        : "text-texto2 group-hover:text-[#0082ba]"
                    }`}
                  />
                  <div
                    className={`text-lg font-medium font-['Ubuntu'] tracking-tight ${
                      location.pathname === "/income"
                        ? "text-[#0082ba]"
                        : "text-texto2 group-hover:text-[#0082ba]"
                    }`}
                  >
                    <span className="flex">Receitas e</span>
                    <span className="flex">Despesas</span>
                  </div>
                </Link>
              </li>

              {/* Pacientes */}
              <li
                className={`side-menu -mx-8 mb-[27px] ${
                  location.pathname === "/customers" ? "text-[#0082ba]" : ""
                }`}
              >
                <Link
                  to="/customers"
                  className={`group flex items-center w-full ${
                    location.pathname === "/customers"
                      ? ""
                      : "hover:text-[#0082ba]"
                  }`}
                >
                  <BorderIcon isSelected={location.pathname === "/customers"} />
                  <UserIcon
                    className={
                      location.pathname === "/customers"
                        ? "text-[#0082ba]"
                        : "text-texto2 group-hover:text-[#0082ba]"
                    }
                  />
                  <div
                    className={`text-lg font-medium font-['Ubuntu'] tracking-tight ${
                      location.pathname === "/customers"
                        ? "text-[#0082ba]"
                        : "text-texto2 group-hover:text-[#0082ba]"
                    }`}
                  >
                    Pacientes
                  </div>
                </Link>
              </li>

              {/* Minhas Configurações */}
              <li
                className={`side-menu -mx-8 mb-[27px] ${
                  location.pathname === "/user" ? "text-[#0082ba]" : ""
                }`}
              >
                <Link
                  to="/user"
                  className={`group flex items-center w-full ${
                    location.pathname === "/user" ? "" : "hover:text-[#0082ba]"
                  }`}
                >
                  <BorderIcon isSelected={location.pathname === "/user"} />
                  <ConfigIcon
                    className={`h-8 w-8 ${
                      location.pathname === "/user"
                        ? "text-[#0082ba]"
                        : "text-texto2 group-hover:text-[#0082ba]"
                    }`}
                  />
                  <div
                    className={`text-lg font-medium font-['Ubuntu'] tracking-tight ${
                      location.pathname === "/user"
                        ? "text-[#0082ba]"
                        : "text-texto2 group-hover:text-[#0082ba]"
                    }`}
                  >
                    <span className="flex">Minhas</span>
                    <span className="flex">Configurações</span>
                  </div>
                </Link>
              </li>
            </ul>

            {/* Google Agenda */}
            <ul>
              <li className="mb-[190px] border-t border-[#5c5c5c]/50 pt-4">
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
              </li>
            </ul>
            <button
              onClick={handleLogout}
              className="text-primaria font-medium font-['Ubuntu'] underline justify-between flex items-center absolute bottom-4 left-4"
            >
              Sair
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
