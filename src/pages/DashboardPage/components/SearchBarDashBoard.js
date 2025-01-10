import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftIcon, CloseIcon, SearchIcon } from "../../../icons/icons";
import { fetchCustomers } from "../../../service/pagesService/pagesService";

const SearchBarDashBoard = ({ patients, onConfirmPatient, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [remotePatients, setRemotePatients] = useState([]);
  const searchDropRef = useRef(null);

  useEffect(() => {
    const fetchRemotePatients = async () => {
      if (searchTerm) {
        const data = await fetchCustomers();
        setRemotePatients(data.customers || []);
      } else {
        setRemotePatients([]);
      }
    };

    fetchRemotePatients();
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPatients([]);
      setIsDropdownVisible(false);
    } else {
      // Filtro local
      const localFiltered = patients.filter((patient) =>
        patient?.Customer?.customer_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      // Filtro remoto, garantindo que não haja duplicados
      const remoteFiltered = remotePatients.filter(
        (remotePatient) =>
          !localFiltered.some(
            (local) => local.Customer?.customer_id === remotePatient.customer_id
          ) &&
          remotePatient?.customer_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

      // Combinar os dois resultados
      const combinedResults = [...localFiltered, ...remoteFiltered];

      setFilteredPatients(combinedResults);
      setIsDropdownVisible(true);
    }
  }, [searchTerm, patients, remotePatients]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setRemotePatients([]);
    setFilteredPatients([]);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="relative mx-auto max-w-[90%] md:-m-64 md:ml-2 md:top-2 -top-28 ml-2 md:w-[360px] z-30">
      <input
        type="text"
        placeholder={searchTerm ? "" : "Pesquisar paciente para vincular"}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`h-[35px] md:h-[56px] md:w-full w-[207px] md:rounded-[15px] rounded-lg  ${
          searchTerm ? "md:rounded-b-none rounded-b-none" : ""
        } bg-clara3 pl-11 text-texto2/50 md:text-base text-[11px] focus:outline-none focus:ring-0 caret-primaria`}
      />
      <div className="absolute left-2 top-1/2 -translate-y-1/2 transform">
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
          <p className="absolute top-full left-0 md:w-full w-[207px] md:px-4 md:py-2 bg-clara3 rounded-b-[15px] shadow-md text-center text-[8px] md:text-[12px] text-text2/50">
            Paciente não encontrado
          </p>
        )}

      {searchTerm && filteredPatients.length > 0 && (
        <ul
          ref={searchDropRef}
          className="absolute top-full left-0 md:w-full w-[207px] bg-clara3 rounded-b-[15px] shadow-md max-h-[200px] overflow-y-auto z-10 border"
        >
          {filteredPatients.map((customer) => (
            <li
              key={customer.customer_id || customer.id}
              className="px-4 py-2 hover:bg-d_medio3 cursor-pointer border-b-[1px] border-cinza6 md:text-base text-[8px]"
              onClick={() => {
                onConfirmPatient(customer);
              }}
            >
              {customer?.Customer?.customer_name ||
                customer?.customer_name ||
                "Nome não disponível"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarDashBoard;
