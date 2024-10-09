import React from "react";
import logo from "../../images/Psicontrol.png";

const Login = () => {
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/google");
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {}
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <img src={logo} alt="Logo" className="mb-4 w-64" />
      <div className="max-w-md rounded-lg border border-gray-300 bg-white p-8 text-center shadow-lg">
        <h1 className="mb-6 text-lg">
          Clique abaixo para fazer o login com sua conta do Google
        </h1>
        <button
          onClick={handleLogin}
          className="flex cursor-pointer justify-center rounded border border-black bg-gray-200 px-40 py-4 text-lg shadow-md transition-colors hover:bg-gray-300"
        >
          <span className="text-lg text-black">Google</span>
        </button>
      </div>
    </div>
  );
};

export { Login };
