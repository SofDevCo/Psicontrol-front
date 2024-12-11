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
    try {
      console.log(process.env.REACT_APP_API_URL);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/google`);
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) { }
  };

  return (
    <div className="flex md:w-screen w-screen h-scree">
      {/* Lado esquerdo - Azul */}
      <div className="w-1/2 fixed h-screen bg-primaria">
        <img src={PsiText} alt="Text" className="w-[137px] h-[16px] md:mt-[40px] md:ml-[40px] mt-[48px] ml-[15px]" />
      </div>

      <div className=" md:mt-[425px] mt-[495px] [font-family:'Oswald-Bold',Helvetica] font-bold md:ml-[41px] ml-[16px] text-white z-10 md:text-[26px] text-[19px] md:flex flex scale-y-125">
        Vamos Começar!
      </div>

      <div className="flex md:flex text-white w-[150px] md:w-[293px] [font-family:'Questrial-Regular',Helvetica] font-normal text-variable-collection-bg-1 md:mt-[460px] mt-[520px] md:ml-[-213px] ml-[-153px] md:text-[16px] text-[12px] z-10 tracking-[1.10px] leading-6.50">
        Faça o login com seu e-mail profissional.
      </div>

      {/* Quadrado central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="w-[285px] h-[166px] md:w-[392px] md:h-[218px] rounded-[20px] bg-white shadow-lg flex flex-col items-center justify-center mb-6">
          <p className="font-semibold text-gray-700-4 text-10 md:text-lg md:w-[283px] w-[255px] mb-4 tracking-wide leading-normal text-center">
            Entrar com sua conta Google
          </p>

          {/* Botão Google */}
          <button
            onClick={handleLogin}
            className="flex items-center border-2 border-[#0082ba] my-2 mt-4 md:my-4 md:mt-7 rounded-full md:px-4 md:py-2 px-2 py-1 text-variable-collection-prim-ria hover:bg-gray-100 focus:outline-none shadow"
          >
            <span className="mr-2">
              <GoogleIcon className="w-[18px] h-[18px]" />
            </span>
            Entrar com o Google
          </button>
        </div>

      </div>

      <div className="absolute md:bottom-[200px] bottom-[400px] opacity-50 right-0">
        <img src={BoxBlueCourt} alt="logo" className="md:w-[520px] md:h-[566px] w-[210px] h-[210px]" />
      </div>
      <div className="absolute md:bottom-[700px] bottom-[320px] opacity-50 md:right-[150px] right-[-5px]">
        <img src={BoxBlue} alt="logo" className="md:w-[150px] md:h-[100px] w-[65px] h-[50px]" />
      </div>
      <div className="absolute md:bottom-[100px] bottom-[576px] opacity-50 md:right-[150px] right-[100px]">
        <img src={BoxBlue} alt="logo" className="md:w-[150px] md:h-[100px] w-[65px] h-[50px]" />
      </div>


    </div>

  );
};

export { Login };
