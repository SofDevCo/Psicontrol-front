import React from "react";
import { useState } from "react";

const FilterStatusDashBoard = ({ selectedStatus, onChangeStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (status) => {
    if (selectedStatus.includes(status)) {
      onChangeStatus(selectedStatus.filter((item) => item !== status));
    } else {
      onChangeStatus([...selectedStatus, status]);
    }
  };

  return (
    <div className="flex items-center ">
      <div className="flex items-center gap-2 md:-ml-36 -ml-[107px] md:mt-0 ">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:text-left text-primaria w-[85px] md:text-sm text-[10px] font-medium font-['Ubuntu-Medium', Helvetica] tracking-[0.15px] leading-normal underline "
        >
          Filtrar dados
        </button>
        {isOpen && (
          <div className="dropdown-menu absolute md:w-[211px] md:h-[355px] bg-clara4 border border-cinza6 rounded shadow-md p-2 md:mt-[388px] -ml-[55px]">
            <p className="md:w-[93px] text-texto2 md:text-[17px] font-normal font-['Open Sans'] tracking-tight underline">
              Pagamentos
            </p>
            <div className="flex items-center md:w-auto text-texto2 md:text-[15px] font-normal font-['Open Sans'] tracking-tight mt-1">
              <input
                type="checkbox"
                id="aberto"
                checked={selectedStatus.includes("aberto")}
                onChange={() => handleCheckboxChange("aberto")}
                className="w-[16px] h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"

              />
              <label className="ml-2" htmlFor="aberto">
                Não confirmados
              </label>
            </div>
            <div className="md:w-[124px] text-texto2 md:text-[15px] font-normal font-['Open Sans'] tracking-tight">
              <input
                type="checkbox"
                id="pago"
                checked={selectedStatus.includes("pago")}
                onChange={() => handleCheckboxChange("pago")}
                className="w-[16px] h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"              />
              <label className="ml-2" htmlFor="pago">
                Confirmados
              </label>
            </div>
            <div className="md:w-[124px] text-texto2 md:text-[15px] font-normal font-['Open Sans'] tracking-tights">
              <input
                type="checkbox"
                id="parcial"
                checked={selectedStatus.includes("parcial")}
                onChange={() => handleCheckboxChange("parcial")}
                className="w-[16px] h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"              />
              <label className="ml-2" htmlFor="parcial">
                Parciais
              </label>
            </div>

            <p className="md:mt-4 md:w-[93px] text-texto2 md:text-[17px] font-normal font-['Open Sans'] tracking-tight underline ">
              Cobrança
            </p>
            <div className="md:w-[124px] text-texto2 md:text-[15px] font-normal font-['Open Sans'] tracking-tight mt-1">
              <input
                type="checkbox"
                id="nao-realizada"
                checked={selectedStatus.includes("nao-realizada")}
                onChange={() => handleCheckboxChange("nao-realizada")}
                className="w-[16px] h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"              />
              <label className="ml-2" htmlFor="nao-realizada">
                Não Realizada
              </label>
            </div>
            <div className="md:w-[124px] text-texto2 md:text-[15px] font-normal font-['Open Sans'] tracking-tight ">
              <input
                type="checkbox"
                id="realizada"
                checked={selectedStatus.includes("realizada")}
                onChange={() => handleCheckboxChange("realizada")}
                className="w-[16px] h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"              />
              <label className="ml-2" htmlFor="realizada">
                Realizada
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterStatusDashBoard;
