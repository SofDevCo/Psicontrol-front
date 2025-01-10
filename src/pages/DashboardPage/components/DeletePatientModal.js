import React from "react";

const DeletePatientModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-destaque bg-opacity-30 backdrop-blur-[6px] z-50">
      <div className="bg-bg1 md:p-12 p-6 rounded-lg md:w-[335px]  w-auto md:h-[228px] h-[146px] border border-cinza6 text-center md:mt-64 md:ml-64  mt-[20vh]">
        <p className="md:text-[21px] text-[12px] mb-4 text-texto2 font-medium font-ubuntu leading-6 tracking-tight">
          Você tem certeza que deseja <br />
          <span className="text-primaria"> excluir </span>
          este paciente
        </p>
        <div className="flex justify-around">
          <button
            onClick={onClose}
            className="w-[71px] md:w-[74px] md:h-[40px] h-[31px] font-openSans md:text-sm text-F10 border border-primaria md:rounded-[100px] rounded-[50px] shadow flex justify-center items-center text-primaria"
          >
            Não
          </button>
          <button
            onClick={onConfirm}
            className="w-[71px] md:w-[74px] md:h-[40px]  h-[31px]  font-openSans md:text-sm text-F10 bg-primaria md:rounded-[100px] rounded-[50px] shadow flex justify-center items-center text-texto4"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePatientModal;
