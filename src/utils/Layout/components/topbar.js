import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../index.css";
import BaseIcon from "./images/BaseIcon.png";

const TopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/create-event-form":
        return "Página Inicial";
      case "/customers":
        return "Pacientes";
      case "/income":
        return "Receitas e Despesas";
      case "/user":
        return "Minhas Configurações";
      default:
        return "Página Não Encontrada";
    }
  };

  return (
    <header
      className="flex items-center bg-bg1 z-49"
      style={{
        height: "100px",
        position: "fixed",
        top: 0,
        width: "100%",
      }}
    >
      {/* Botão hambúrguer visível apenas em telas menores */}
      <button
        className="md:hidden p-4"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-primaria"
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

      {/* Logo centralizada no mobile e alinhada à esquerda no desktop */}
      <img
        src={BaseIcon}
        alt="Base Icon"
        className="w-[36px] h-[39px] mx-auto md:mx-0 md:ml-[20px]"
      />

      {/* Nome da página */}
      <h2
        className="text-[20px] text-primaria font-semibold hidden md:block md:ml-4"
      >
        {getPageTitle()}
      </h2>

      {/* Nome da página no mobile */}
      <h2 className="text-[20px] text-primaria font-semibold md:hidden pr-4">
        {getPageTitle()}
      </h2>
    </header>
  );
};

export default TopBar;
