import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useOutsideClick } from "../../../utils/OutsideClick/useOutsideClick";

const FilterStatusProfilePage = ({ selectedStatus, onChangeStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(selectedStatus || []);
  const filterRef = useRef(null);

  useOutsideClick(filterRef, () => setIsOpen(false));

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

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
    <div className="relative flex items-center z-20 mt-6">
      <div className="flex md:mr-14 mr-2 mb-5 gap-2 md:mt-0">
        <button
          type="button"
          onClick={toggleDropdown}
          className="group md:text-left text-primaria active:text-primaria/50 w-[85px] md:text-sm text-[10px] font-medium font-['Ubuntu-Medium', Helvetica] md:tracking-[0.15px] tracking-tight  leading-normal underline  "
        >
          Filtrar dados
        </button>
        {isOpen && (
          <div
            ref={filterRef}
            className="absolute top-6 -right-1 w-[151px] h-[271px] md:w-[211px] md:h-[355px] bg-clara4 border border-cinza6 rounded-md shadow-md p-4 z-[9999] "
          >
            <p className="md:w-[93px] text-texto2 md:text-[17px] text-[10px] font-normal font-['Open Sans'] tracking-tight underline mt-1">
              Pagamentos
            </p>
            <div className="flex items-center md:w-auto text-texto2 md:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight mt-1">
              <input
                type="checkbox"
                id="aberto"
                checked={selectedFilter.includes("aberto")}
                onChange={() => handleCheckboxChange("aberto")}
                className="w-[11.45px] h-[11.44px] md:w-[16px] md:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="aberto">
                Não confirmados
              </label>
            </div>
            <div className="flex items-center md:w-auto text-texto2 md:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight md:mt-0 mt-2">
              <input
                type="checkbox"
                id="pago"
                checked={selectedFilter.includes("pago")}
                onChange={() => handleCheckboxChange("pago")}
                className="w-[11.45px] h-[11.44px] md:w-[16px] md:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="pago">
                Confirmados
              </label>
            </div>
            <div className="flex items-center md:w-auto text-texto2 md:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tights md:mt-0 mt-1">
              <input
                type="checkbox"
                id="parcial"
                checked={selectedFilter.includes("parcial")}
                onChange={() => handleCheckboxChange("parcial")}
                className="w-[11.45px] h-[11.44px] md:w-[16px] md:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2 mt-0" htmlFor="parcial">
                Parciais
              </label>
            </div>

            <p className="md:mt-4 mt-2 md:w-[93px] text-texto2 md:text-[17px] text-[10px] font-normal font-['Open Sans'] tracking-tight underline ">
              Cobrança
            </p>
            <div className="flex items-center md:w-automd:w-[124px] text-texto2 md:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight md:mt-1 mt-2">
              <input
                type="checkbox"
                id="nao-realizada"
                checked={selectedFilter.includes("nao-realizada")}
                onChange={() => handleCheckboxChange("nao-realizada")}
                className="w-[11.45px] h-[11.44px] md:w-[16px] md:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="nao-realizada">
                Não Realizada
              </label>
            </div>
            <div className="flex items-center md:w-auto text-texto2 md:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight md:mt-0 mt-1">
              <input
                type="checkbox"
                id="realizada"
                checked={selectedFilter.includes("realizada")}
                onChange={() => handleCheckboxChange("realizada")}
                className="w-[11.45px] h-[11.44px] md:w-[16px] md:h-[16px] appearance-none mt-1 border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2 mt-1" htmlFor="realizada">
                Realizada
              </label>
            </div>
            <p className="md:mt-4 mt-2 md:w-[93px] text-texto2 md:text-[17px] text-[10px] font-normal font-['Open Sans'] tracking-tight underline ">
              Recibos
            </p>
            <div className="flex items-center md:w-auto text-texto2 md:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight md:mt-1 mt-2">
              <input
                type="checkbox"
                id="nao-emitidos"
                checked={selectedFilter.includes("nao-emitidos")}
                onChange={() => handleCheckboxChange("nao-emitidos")}
                className="w-[11.45px] h-[11.44px] md:w-[16px] md:h-[16px] appearance-none border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2" htmlFor="nao-emitidos">
                Não Emitidos
              </label>
            </div>
            <div className="flex items-center md:w-auto text-texto2 md:text-[15px] text-[10px] font-normal font-['Open Sans'] tracking-tight md:mt-0 mt-1">
              <input
                type="checkbox"
                id="emitidos"
                checked={selectedFilter.includes("emitidos")}
                onChange={() => handleCheckboxChange("emitidos")}
                className="w-[11.45px] h-[11.44px] md:w-[16px] md:h-[16px] appearance-none mt-1 border-2 border-primaria rounded-sm bg-white checked:bg-primaria checked:border-primaria inline-flex cursor-pointer relative checked:after:content-['✔'] checked:after:text-white checked:after:absolute checked:after:top-[-4px] checked:after:left-[0px] checked:after:font-bold"
              />
              <label className="ml-2 mt-1" htmlFor="emitidos">
                Emitidos
              </label>
            </div>
            <button
              type="submit"
              onClick={apllyFIlter}
              className="flex mt-3 mx-auto md:h-6 h-[17.16px] px-6 md:py-0.5 py-1 bg-primaria rounded-[100px] text-white md:text-sm text-[8px] font-semibold  shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30)]"
            >
              Filtrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterStatusProfilePage;
