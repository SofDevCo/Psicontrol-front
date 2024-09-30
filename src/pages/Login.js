import React from "react";
import logo from "../images/Psicontrol.png";

const Login = () => {
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/google");
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        console.error("URL de autenticação do Google não encontrada.");
      }
    } catch (error) {
      console.error("Erro ao iniciar o login com o Google:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <img src={logo} alt="Logo" className="w-64 mb-4" />
      <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-lg mb-6">
          Clique abaixo para fazer o login com sua conta do Google
        </h1>
        <button
          onClick={handleLogin}
          className="flex justify-center bg-gray-200 border border-black py-4 px-40 rounded cursor-pointer transition-colors text-lg shadow-md hover:bg-gray-300"
        >
          <span className="text-lg text-black">Google</span>
        </button>
      </div>
    </div>
  );
};

export { Login };
