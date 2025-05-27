import React from "react";
import { useLocation } from "react-router-dom";
import "../../../index.css";
import BaseIcon from "./images/BaseIcon.png";

const TopBar = ({ onMenuClick }) => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.startsWith("/customers")) {
      return {
        title: "Pacientes",
        margin: "",
      };
    }

    switch (location.pathname) {
      case "/create-event-form":
        return { title: "Página Inicial", margin: "" };

      case "/customers":
        return {
          title: "Pacientes",
          margin: "",
        }; 
        case "/income":
        return {
          title: (
            <>
              <span className="hidden lg:inline">Receitas e Despesas</span>
              <span className="block lg:hidden">
                Receitas
                <br />e Despesas
              </span>
            </>
          ),
          margin: "",
        };
      case "/archived":
        return {
          title: (
            <>
              <span className="hidden lg:inline">Pacientes Arquivados</span>
              <span className="block lg:hidden">
                Pacientes
                <br />Arquivados
              </span>
            </>
          ),
          margin: "",
        };
      case "/user":
        return {
          title: (
            <>
              <span className="hidden lg:inline">Minhas Configurações</span>
              <span className="block lg:hidden">
                Minhas
                <br />
                Configurações
              </span>
            </>
          ),
          margin: "",
        };
      default:
        return {
          title: (
            <>
              <span className="hidden lg:inline">Página Não Encontrada</span>
              <span className="block lg:hidden">
                Página
                <br />
                Não Encontrada
              </span>
            </>
          ),
          margin: "",
        };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <div className="fixed flex justify-between w-full  p-4 max-lg:pt-12 bg-bg1 items-center lg:rounded-b-[0px] rounded-b-[35px] lg:z-40 z-40">

      <button
        className="lg:hidden lg:p-5 "
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-primaria active:"
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

      <div className="absolute transform -translate-x-1/2 left-1/2">
        <img
          src={BaseIcon}
          alt="Base Icon"
          className="w-[55px] lg:hidden opacity-100 mx-auto"
        />
      </div>

      <h2
        className={`lg:text-[28px] text-[15px] text-primaria font-ubuntu font-medium ${pageInfo.margin}`}
      >
        {pageInfo.title}
      </h2>
    </div>
  );
};

export default TopBar;
