import React from "react";
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
    <div className="flex h-screen">
      {/* Parte esquerda com a cor azul */}
      <div className="w-1/2 bg-primaria flex items-center justify-center">
        <img src={LoginText} alt="Text" className=" w-[263px] h-[40px] ml-[-590px] mt-[30px]" />
        {/* Conteúdo opcional na parte azul */}
      </div>

      <img src={BoxWhite} alt="Box" className=" w-[381px] h-[221px] mx-[-10%] mt-[17%]" />
      <button onClick={handleLogin} className="w-[196px] h-[40px] mx-[-5%] mt-[23.19%] focus:outline-none">
        <img src={EnterGoogle} alt="Enter" className="w-full h-full"/>
      </button>
      <img src={TextBox} alt="Text" className=" w-[283px] h-[24px] mx-[-150px] mt-[19%]" />
      <img src={PsiText} alt="Text" className=" w-[137px] h-[16px] mx-[-890px] mt-[40px]" />
      <img src={LetsGo} alt="Text" className=" w-[173px] h-[30px] mx-[752px] mt-[410px]" />

      <img src={BoxBlueCourt} alt="Text" className=" w-[475px] h-[544px] ml-[467px] mt-[160px] opacity-50" />
      <img src={BoxBlue} alt="Text" className=" w-[195px] h-[130px] opacity-50 ml-[-720px] mt-[80px]" />
      <img src={BoxBlue} alt="Text" className=" w-[195px] h-[130px] opacity-50 ml-[110px] mt-[680px]" />


      {/* Parte direita com a caixa de login */}
      <div>

      </div>
    </div>
  );
};

export { Login };
