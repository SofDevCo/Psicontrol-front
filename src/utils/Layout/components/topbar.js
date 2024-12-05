import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../index.css";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  // Função para definir o título baseado no caminho da URL
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
        return "Página Não Encontrada"; // Caso o caminho não seja reconhecido
    }
  };

  return (
    <header className="flex h-[100px]  items-center  bg-bg1 z-50">
      <h2 className="text-[26px] ml-[50px] text-primaria font-semibold">{getPageTitle()}</h2>
      {/* <div class="text-[#0082ba] text-[28px] font-normal font-['Ubuntu']">{getPageTitle()}</div> */}
    </header>
  );
};

export default TopBar;
