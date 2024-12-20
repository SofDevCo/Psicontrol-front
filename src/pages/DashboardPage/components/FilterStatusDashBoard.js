import React from "react";

const FilterStatusDashBoard = ({ selectedStatus, onChangeStatus }) => {
  return (
    <div className="filter-container">
      <label htmlFor="filter-status">Filtrar por Status:</label>
      <select
        id="filter-status"
        value={selectedStatus}
        onChange={(e) => onChangeStatus(e.target.value)}
      >
        <option value="all">Todos</option>
        <option value="pago">Pago</option>
        <option value="parcial">Parcial</option>
        <option value="aberto">Aberto</option>
      </select>
    </div>
  );
};

export default FilterStatusDashBoard;
