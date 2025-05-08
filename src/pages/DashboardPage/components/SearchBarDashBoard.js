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
      const localFiltered = patients.filter((patient) =>
        patient?.Customer?.customer_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      const remoteFiltered = remotePatients.filter(
        (remotePatient) =>
          !localFiltered.some(
            (local) => local.Customer?.customer_id === remotePatient.customer_id
          ) &&
          remotePatient?.customer_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

      const combinedResults = [...localFiltered, ...remoteFiltered];

      setFilteredPatients(combinedResults);
      setIsDropdownVisible(true);
    }
  }, [searchTerm, patients, remotePatients]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setRemotePatients([]);
    setFilteredPatients([]);
    setIsDropdownVisible(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropRef.current && !searchDropRef.current.contains(event.target)) {
        handleClearSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchDropRef}
      className="relative mx-auto max-w-[90%] lg:-m-64 lg:ml-2 lg:top-2 -top-28 ml-2 lg:w-[360px] z-10"
    >
      <input
        type="text"
        placeholder="Pesquisar paciente para vincular"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`h-[35px] lg:h-[56px] lg:w-full w-[207px] lg:rounded-[15px] rounded-lg ${
          searchTerm ? "lg:rounded-b-none rounded-b-none" : ""
        } bg-clara3 pl-11 pr-10 text-texto2/50 lg:text-base text-[11px] focus:outline-none focus:ring-0 caret-primaria`}
      />

      <div className="absolute transform -translate-y-1/2 left-2 top-1/2">
        {searchTerm.length > 0 ? (
          <div onClick={handleClearSearch} className="cursor-pointer">
            <ArrowLeftIcon />
          </div>
        ) : (
          <SearchIcon />
        )}
      </div>

      {/* Ícone "X" sempre visível */}
      <div
        className="absolute transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
        onClick={handleClearSearch}
      >
        <CloseIcon />
      </div>

      {searchTerm.length > 0 && filteredPatients.length === 0 && isDropdownVisible && (
        <p className="absolute top-full left-0 lg:w-full w-[207px] lg:px-4 lg:py-2 bg-clara3 rounded-b-[15px] shadow-md text-center text-[8px] lg:text-[12px] text-text2/50">
          Paciente não encontrado
        </p>
      )}

      {searchTerm && filteredPatients.length > 0 && (
        <ul className="absolute top-full left-0 lg:w-full w-[207px] bg-clara3 rounded-b-[15px] shadow-md max-h-[200px] overflow-y-auto z-10 border">
          {filteredPatients.map((customer) => (
            <li
              key={customer.customer_id || customer.id}
              className="px-4 py-2 hover:bg-d_medio3 cursor-pointer border-b-[1px] border-cinza6 lg:text-base text-[8px]"
              onClick={() => onConfirmPatient(customer)}
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
