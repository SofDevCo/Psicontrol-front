import React, { useState } from "react";

const EditConsultationFeeModal = ({ isOpen, onConfirm }) => {
  const [updateOption, setUpdateOption] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-[1200px] flex items-start justify-center bg-bgM bg-opacity-30 backdrop-blur-sm z-50 overflow-x">
      <div className="bg-white rounded-lg  p-6 lg:h-[338px] h-auto lg:w-[475px] w-[280px] lg:mt-28 mt-32 lg:ml-28 ">
        <p className="text-texto2 lg:text-[21px] text-sm text-center lg:mb-4 mb-6 lg:mt-12">
          Houve uma alteração no valor de <br /> atendimento.
        </p>

        <div className="flex flex-col space-y-2">
          <label
            className={`flex items-center justify-center space-x-2 cursor-pointer lg:text-[15px] text-sm ${updateOption === "current_month" ? "text-texto3" : "text-texto3/50"}`}
          >
            <input
              type="radio"
              value="current_month"
              checked={updateOption === "current_month"}
              onChange={() => setUpdateOption("current_month")}
            />
            <span>Modificar a partir do mês atual</span>
          </label>

          <label
            className={`flex items-center  justify-center space-x-2 cursor-pointer lg:ml-6 ml-[9.5px] lg:text-[15px] text-sm ${updateOption === "next" ? "text-texto3" : "text-texto3/50"}`}
          >
            <input
              type="radio"
              value="next"
              checked={updateOption === "next"}
              onChange={() => setUpdateOption("next")}
            />
            <span>Modificar a partir do mês seguinte</span>
          </label>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => {
              if (!updateOption) {
                alert("Por favor, selecione uma opção antes de continuar.");
                return;
              }
              onConfirm(updateOption);
            }}
            className="lg:h-10 px-6 py-2.5 bg-primaria rounded-[100px] text-texto4 text-sm font-semibold tracking-tight shadow-buttom"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConsultationFeeModal;
