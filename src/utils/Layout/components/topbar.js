import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../index.css";

const TopBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="flex h-[100px] w-full left-[1440.25px] top-[0.39px] items-center justify-between bg-bg1 p-4">
      <h1 className="text-xl font-semibold">Pacientes</h1>
      <button onClick={handleLogout} className="text-primaria hover:underline">
        Sair
      </button>
    </header>
  );
};

export default TopBar;
