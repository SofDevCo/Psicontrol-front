import React, { useState } from "react";

const SearchBarDashBoard = ({ patients, onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative mx-auto mt-4 p-2 bg-blue-100 rounded shadow-lg">
      <input
        type="text"
        placeholder="Pesquisar paciente para vincular"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 rounded"
      />
      <div className="mt-2 bg-white rounded shadow-lg max-h-60 overflow-y-auto">
        {filteredPatients.map((patient) => (
          <div
            key={patient.customer_id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              console.log("Paciente clicado:", patient.customer_id);
              onSelectPatient(patient.customer_id);
            }}
          >
            {patient.customer_name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBarDashBoard;
