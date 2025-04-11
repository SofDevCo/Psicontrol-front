import React from "react";

const VariableDropdown = ({ onSelectVariable }) => {
  const variables = [
    { label: "Nome do paciente", value: "{{nome}}" },
    { label: "Mês", value: "{{mês}}" },
    { label: "Dias", value: "{{dias}}" },
    { label: "Valor", value: "{{valor_total}}" },
    { label: "Numero total de consultas", value: "{{numero_de_consultas}}" },
  ];

  return (
    <div className="absolute lg:top-14 lg:right-0 right-6  bg-clara4 border shadow-lg rounded-md lg:w-[243px] w-[186px] h-auto">
      <ul>
        <h1 className="text-primaria lg:text-[15px] text-sm font-semibold tracking-tight ml-2 p-2 border border-b-cinza6/50">
          <span>{`{ }`}</span> Selecionar variável
        </h1>
        {variables.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 cursor-pointer border border-b-cinza6/50 text-texto2 lg:text-[15px] text-xs hover:bg-bgM/30"
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
