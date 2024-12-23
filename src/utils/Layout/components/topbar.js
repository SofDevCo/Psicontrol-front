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
        return { title: "Página Inicial", margin: "md:mx-[400px] mr-[-81px]" };
      case "/customers":
        return { title: "Pacientes", margin: "md:mx-[400px] mr-[-108px]" };
      case "/income":
        return { title: "Receitas e Despesas", margin: "md:mx-[400px] mr-[-34px]" };
      case "/user":
        return { title: "Minhas Configurações", margin: "md:mx-[400px] mr-[-21px] " };
      default:
        return { title: "Página Não Encontrada", margin: "mx-auto" };
    }
  };
  
 const pageInfo = getPageTitle();

  return (
    <div className="fixed h-[100px] md:drop-shadow-none drop-shadow-topbatShadow w-screen bg-bg1 items-center md:rounded-b-[0px] rounded-b-[35px]">
      {/* Botão hambúrguer visível apenas em telas menores */}
      <div className="mt-[32px]">
        <button
          className="md:hidden p-5 "
          onClick={onMenuClick}
          aria-label="Abrir menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-primaria active:"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      
        <img
          src={BaseIcon}
          alt="Base Icon"
          className="w-[55px] h-[40px] ml-[37%] md:my-[-30px] my-[-60px]  md:opacity-0 opacity-100"
        />
      


      {/* Nome da página */}
      <h2
        className={`md:text-[28px] md:w-screen w-[200px] text-[15px] text-primaria font-semibold md:my-[28px] my-[35px] mx-auto ${pageInfo.margin}`}>
        {pageInfo.title}
      </h2>

    </div>



  );
};

export default TopBar;
