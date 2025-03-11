import React from "react";
import { GoogleIcon } from "./components/LoginIcons";
import BoxWhite from "./images/BoxWhite.png";
import EnterGoogle from "./images/EnterGoogle.png";
import TextBox from "./images/TextBox.png";
import PsiText from "./images/PsiText.png";
import LetsGo from "./images/LetsGo.png";
import LoginText from "./images/LoginText.png";
import BoxBlue from "./images/BoxBlue.png";
import BoxBlueCourt from "./images/BoxBlueCourt.png";

const Login = () => {
  const handleLogin = async () => {
    console.log(process.env.REACT_APP_API_URL);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/google`);
    const data = await response.json();

    if (data.authUrl) {
      window.location.href = data.authUrl;
    }
  };

  return (
    <div className="flex lg:w-full w-screen h-scree">
      {/* Lado esquerdo - Azul */}
      <div className="w-1/2 fixed h-screen bg-primaria">
        <img
          src={PsiText}
          alt="Text"
          className="w-[137px] h-[16px] lg:mt-[40px] lg:ml-[40px] mt-[48px] ml-[15px]"
        />
      </div>

      {/* Lado direito (box branca) */}
      <div className="flex flex-col my-[-90px] justify-center items-center h-screen w-screen bg-white">
        <div className="w-[285px] lg:w-[392px] h-[166px] lg:h-[218px] bg-white z-50 rounded-[20px] drop-shadow-loginShadow flex flex-col lg:mb-0 mb-[290px] items-center justify-center">
          <p className="font-semibold text-gray-700-4 text-[14px] lg:text-[20px] w-[255px] lg:w-[303px] mb-4 tracking-wide leading-normal text-center">
            Entrar com sua conta Google
          </p>

          {/* Botão Google */}
          <button
            onClick={handleLogin}
            className="flex items-center border-2 border-[#0082ba] my-2 mt-4 lg:my-4 lg:mt-7 rounded-full px-2 py-1 lg:px-4 lg:py-2 text-variable-collection-prim-ria hover:bg-gray-100 focus:outline-none shadow"
          >
            <span className="mr-2">
              <GoogleIcon className="w-[18px] h-[18px]" />
            </span>
            Entrar com o Google
          </button>
        </div>

        <div className="w-[90%] lg:w-[95%] lg:my-[-130px] my-[-270px]">
          <div className="[font-family:'Oswald-Bold',Helvetica] font-bold text-white text-[19px] lg:text-[26px] scale-y-125 ">
            Vamos Começar!
          </div>

          {/* Subtítulo */}
          <div className="[font-family:'Questrial-Regular',Helvetica] lg:w-[240px] w-[140px] font-normal text-white text-[14px] lg:text-[19px] scale-y-100 mb-4">
            Faça o login com seu e-mail profissional.
          </div>
        </div>
      </div>

      <div className="absolute lg:bottom-[200px] bottom-[400px] opacity-50 right-0">
        <img
          src={BoxBlueCourt}
          alt="logo"
          className="lg:w-[520px] lg:h-[566px] w-[210px] h-[210px]"
        />
      </div>
      <div className="absolute lg:bottom-[700px] bottom-[320px] opacity-50 lg:right-[470px] right-[5px]">
        <img
          src={BoxBlue}
          alt="logo"
          className="lg:w-[150px] lg:h-[100px] w-[65px] h-[50px]"
        />
      </div>
      <div className="absolute lg:bottom-[100px] bottom-[576px] opacity-50 lg:right-[150px] right-[100px]">
        <img
          src={BoxBlue}
          alt="logo"
          className="lg:w-[150px] lg:h-[100px] w-[65px] h-[50px]"
        />
      </div>
    </div>
  );
};

export { Login };
