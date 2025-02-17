import React, { useState } from "react";

const EditConsultationFeeModal = ({ isOpen, onConfirm }) => {
  const [updateOption, setUpdateOption] = useState("current");

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-[1200px] flex items-start justify-center bg-bgM bg-opacity-30 backdrop-blur-sm z-50 overflow-x">
      <div className="bg-white rounded-lg  p-6 h-[338px] w-[475px] mt-28 ml-28 ">
        <p className="text-texto2 text-[21px] text-center mb-4 mt-12">
          Houve uma alteração no valor de <br /> atendimento.
        </p>

        <div className="flex flex-col space-y-2">
          <label
            className={`flex items-center justify-center space-x-2 cursor-pointer ${updateOption === "current" ? "text-texto3" : "text-texto3/50"}`}
          >
            <input
              type="radio"
              value="current"
              checked={updateOption === "current"}
              onChange={() => setUpdateOption("current")}
            />
            <span>Modificar a partir do mês atual</span>
          </label>

          <label
            className={`flex items-center  justify-center space-x-2 cursor-pointer ml-7 ${updateOption === "next" ? "text-texto3" : "text-texto3/50"}`}
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
            onClick={() => onConfirm(updateOption)}
            className="md:h-10 px-6 py-2.5 bg-primaria rounded-[100px] text-texto4 text-sm font-semibold tracking-tight shadow-buttom"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConsultationFeeModal;
