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
        }; // Nome simples, sem alteração
      case "/income":
        return {
          title: (
            <>
              <span className="hidden md:inline">Receitas e Despesas</span>
              <span className="block md:hidden">
                Receitas
                <br />e Despesas
              </span>
            </>
          ),
          margin: "",
        };
      case "/user":
        return {
          title: (
            <>
              <span className="hidden md:inline">Minhas Configurações</span>
              <span className="block md:hidden">
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
              <span className="hidden md:inline">Página Não Encontrada</span>
              <span className="block md:hidden">
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
    <div className="fixed flex justify-between md:items-start w-full md:w-[calc(200vw-280px)] p-4 max-md:pt-12 md:drop-shadow-none drop-shadow-topbatShadow bg-bg1 items-center md:rounded-b-[0px] rounded-b-[35px] md:z-40 z-30">
      {/* Botão hambúrguer visível apenas em telas menores */}

      <button
        className="md:hidden md:p-5 "
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-primaria active:"
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

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img
          src={BaseIcon}
          alt="Base Icon"
          className="w-[55px] md:hidden opacity-100 mx-auto"
        />
      </div>
      {/* Nome da página */}
      <h2
        className={`md:text-[28px] text-[15px] text-primaria font-semibold ${pageInfo.margin}`}
      >
        {pageInfo.title}
      </h2>
    </div>
  );
};

export default TopBar;
