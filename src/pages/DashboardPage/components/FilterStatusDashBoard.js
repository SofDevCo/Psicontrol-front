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
    <div className="filter-container">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="dropdown-button"
        >
          Filtrar dados
        </button>
        {isOpen && (
          <div className="dropdown-menu absolute bg-white border rounded shadow-md p-2">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterStatusDashBoard;
