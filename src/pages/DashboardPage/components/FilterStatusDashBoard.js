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
      <div className="flex items-center gap-2 -ml-36">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-left text-primaria w-[85px] text-sm font-medium font-['Ubuntu-Medium', Helvetica] tracking-[0.15px] leading-normal underline "
        >
          Filtrar dados
        </button>
        {isOpen && (
          <div className="dropdown-menu absolute w-[211px] h-[355px] bg-clara4 border rounded shadow-md p-2">
            <p>Pagamento</p>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="pago"
                checked={selectedStatus.includes("pago")}
                onChange={() => handleCheckboxChange("pago")}
              />
              <label htmlFor="pago">Confirmado</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="parcial"
                checked={selectedStatus.includes("parcial")}
                onChange={() => handleCheckboxChange("parcial")}
              />
              <label htmlFor="parcial">Parciais</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="aberto"
                checked={selectedStatus.includes("aberto")}
                onChange={() => handleCheckboxChange("aberto")}
              />
              <label htmlFor="aberto">Não confirmados</label>
            </div>
            <p className="mt-4">Cobrança</p>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="realizada"
                checked={selectedStatus.includes("realizada")}
                onChange={() => handleCheckboxChange("realizada")}
              />
              <label htmlFor="realizada">Realizada</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="nao-realizada"
                checked={selectedStatus.includes("nao-realizada")}
                onChange={() => handleCheckboxChange("nao-realizada")}
              />
              <label htmlFor="nao-realizada">Não Realizada</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterStatusDashBoard;
