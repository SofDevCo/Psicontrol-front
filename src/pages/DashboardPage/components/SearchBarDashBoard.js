import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftIcon, CloseIcon, SearchIcon } from "../../../icons/icons";

const SearchBarDashBoard = ({ patients, onSelectPatient, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchDropRef = useRef(null);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPatients([]);
      setIsDropdownVisible(false);
    } else {
      const filtered = patients.filter((patient) =>
        patient?.Customer?.customer_name
          .toLowerCase()
          .startsWith(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
      setIsDropdownVisible(true);
    }
  }, [searchTerm, patients]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredPatients([]);
    if(onClose){
      onClose();
    }
  };

  return (
    <div className="relative mx-auto -m-64 ml-72 w-[360px] z-30">
      <input
        type="text"
        placeholder={searchTerm ? "" : "Pesquisar paciente para vincular"}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`h-[56px] w-full rounded-[15px] ${
          searchTerm ? "rounded-b-none" : ""
        } bg-clara3 pl-11 text-texto3 focus:outline-none focus:ring-0 caret-primaria`}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 transform">
        {searchTerm.length > 0 ? (
          <div onClick={handleClearSearch} className="cursor-pointer">
            <ArrowLeftIcon />
          </div>
        ) : (
          <SearchIcon />
        )}
      </div>

      {searchTerm.length > 0 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div onClick={handleClearSearch} className="cursor-pointer">
            <CloseIcon />
          </div>
        </div>
      )}

      {searchTerm.length > 0 &&
        filteredPatients.length === 0 &&
        isDropdownVisible && (
          <p className="absolute top-full left-0 w-full px-4 py-2 bg-clara3 rounded-b-[15px] shadow-md text-center text-gray-500">
            Paciente não encontrado
          </p>
        )}

      {searchTerm && filteredPatients.length > 0 && (
        <ul
          ref={searchDropRef}
          className="absolute top-full left-0 w-full bg-clara3 rounded-b-[15px] shadow-md max-h-[200px] overflow-y-auto z-10 border"
        >
          {filteredPatients.map((patient) => (
            <li
              key={patient.customer_id}
              className="px-4 py-2 hover:bg-d_medio3 cursor-pointer border-b-[1px] border-cinza6"
              onClick={() => {
                setSearchTerm(patient.Customer.customer_name);
                setFilteredPatients([]);
                onSelectPatient(patient.customer_id);
                setIsDropdownVisible(false);
              }}
            >
              {patient.Customer?.customer_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarDashBoard;
