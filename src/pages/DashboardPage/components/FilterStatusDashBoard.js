import React from "react";
import { useState } from "react";

const FilterStatusDashBoard = ({ selectedStatus, onChangeStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(selectedStatus || []);

  const handleCheckboxChange = (status) => {
    setSelectedFilter((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  const apllyFIlter = () => {
    onChangeStatus(selectedFilter);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center z-30">
      <div className="flex items-center gap-2 lg:-ml-[150px] -ml-[107px] lg:mt-0">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group lg:text-left text-primaria active:text-primaria/50 w-[85px] lg:text-sm text-[10px] font-medium font-['Ubuntu-Medium', Helvetica] lg:tracking-[0.15px] tracking-tight  leading-normal underline "
        >
          Filtrar dados
        </button>
        {isOpen && (
          <div className="dropdown-menu absolute w-[151px] h-[271px] lg:w-[211px] lg:h-[355px] bg-clara4 border border-cinza6 rounded-l-md shadow-md p-2 mt-[300px] lg:mt-[388px] lg:-ml-[55px] -ml-[50px]">
            <p className="lg:w-[93px] text-texto2 lg:text-[17px] text-[10px] font-normal font-['Open Sans'] tracking-tight underline">
              Pagamentos
            </p>
            <div className="flex items-center lg:w-auto text-texto2 lg:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight mt-1">
              <input
                type="checkbox"
                id="aberto"
                checked={selectedFilter.includes("aberto")}
                onChange={() => handleCheckboxChange("aberto")}
                className="w-[11.45px] h-[11.44px] lg:w-[16px] lg:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="aberto">
                Não confirmados
              </label>
            </div>
            <div className="lg:w-[124px] text-texto2 lg:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight lg:mt-0 mt-2">
              <input
                type="checkbox"
                id="pago"
                checked={selectedFilter.includes("pago")}
                onChange={() => handleCheckboxChange("pago")}
                className="w-[11.45px] h-[11.44px] lg:w-[16px] lg:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="pago">
                Confirmados
              </label>
            </div>
            <div className="lg:w-[124px] text-texto2 lg:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tights lg:mt-0 mt-1">
              <input
                type="checkbox"
                id="parcial"
                checked={selectedFilter.includes("parcial")}
                onChange={() => handleCheckboxChange("parcial")}
                className="w-[11.45px] h-[11.44px] lg:w-[16px] lg:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="parcial">
                Parciais
              </label>
            </div>

            <p className="lg:mt-4 mt-2 lg:w-[93px] text-texto2 lg:text-[17px] text-[10px] font-normal font-['Open Sans'] tracking-tight underline ">
              Cobrança
            </p>
            <div className="lg:w-[124px] text-texto2 lg:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight lg:mt-1 mt-2">
              <input
                type="checkbox"
                id="nao-realizada"
                checked={selectedFilter.includes("nao-realizada")}
                onChange={() => handleCheckboxChange("nao-realizada")}
                className="w-[11.45px] h-[11.44px] lg:w-[16px] lg:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="nao-realizada">
                Não Realizada
              </label>
            </div>
            <div className="lg:w-[124px] text-texto2 lg:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight lg:mt-0 mt-1">
              <input
                type="checkbox"
                id="realizada"
                checked={selectedFilter.includes("realizada")}
                onChange={() => handleCheckboxChange("realizada")}
                className="w-[11.45px] h-[11.44px] lg:w-[16px] lg:h-[16px] appearance-none mt-1 border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="realizada">
                Realizada
              </label>
            </div>
            <p className="lg:mt-4 mt-2 lg:w-[93px] text-texto2 lg:text-[17px] text-[10px] font-normal font-['Open Sans'] tracking-tight underline ">
              Recibos
            </p>
            <div className="flex items-center lg:w-auto text-texto2 lg:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight lg:mt-1 mt-2">
              <input
                type="checkbox"
                id="nao-emitidos"
                checked={selectedFilter.includes("nao-emitidos")}
                onChange={() => handleCheckboxChange("nao-emitidos")}
                className="w-[11.45px] h-[11.44px] lg:w-[16px] lg:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="nao-emitidos">
                Não Emitidos
              </label>
            </div>
            <div className="flex items-center lg:w-auto text-texto2 lg:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight lg:mt-0 mt-1">
              <input
                type="checkbox"
                id="emitidos"
                checked={selectedFilter.includes("emitidos")}
                onChange={() => handleCheckboxChange("emitidos")}
                className="w-[11.45px] h-[11.44px] lg:w-[16px] lg:h-[16px] appearance-none mt-1 border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2 mt-1" htmlFor="emitidos">
                Emitidos
              </label>
            </div>
            <button
              type="submit"
              onClick={apllyFIlter}
              className="flex mt-3 mx-auto lg:h-6 px-6 py-0.5 bg-primaria rounded-[100px] text-white text-sm font-semibold  shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30)]"
            >
              Filtrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterStatusDashBoard;
