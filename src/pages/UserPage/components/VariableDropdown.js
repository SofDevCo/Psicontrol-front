import React from "react";

const VariableDropdown = ({ onSelectVariable }) => {
  const variables = [
    { label: "Nome do paciente", value: "{{nome}}" },
    { label: "Mês", value: "{{mes}}" },
    { label: "Dias", value: "{{dias}}" },
    { label: "Valor", value: "{{valor_total}}" },
  ];

  return (
    <div className="absolute top-10 right-0 bg-white border border-gray-300 shadow-lg rounded-md w-56">
      <ul>
        {variables.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => onSelectVariable(item.value)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VariableDropdown;
