import React, { useState } from "react";

const EditConsultationFeeModal = ({ isOpen, onClose, onConfirm }) => {
  const [updateOption, setUpdateOption] = useState("current");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-bgM bg-opacity-30 backdrop-blur-sm md:z-30 z-50 ">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] border border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
          Confirmar Alteração
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Deseja modificar o valor da consulta a partir de qual mês?
        </p>

        <div className="flex flex-col space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="current"
              checked={updateOption === "current"}
              onChange={() => setUpdateOption("current")}
            />
            <span>Modificar a partir do mês atual</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
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
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(updateOption)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConsultationFeeModal;
