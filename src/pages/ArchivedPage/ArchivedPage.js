import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeftIcon,
  SearchIcon,
  CloseIcon,
  HamburguerIcon,
} from "../../icons/icons";
import { useOutsideClick } from "../../utils/OutsideClick/useOutsideClick";
import DropDown from "../ArchivedPage/components/DropDownArchive";
import { deleteCustomer } from "../../service/pagesService/pagesService";
import { showErrorToast } from "../../utils/notification/toastify";
import { showDeleteToast } from "../CustomerPage/components/notiificationCustomerPage";

const ArchivedPage = () => {
  const [archivedCustomers, setArchivedCustomers] = useState([]);
  const [customers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isDropdownVisible] = useState(false);

  const dropdownRef = useRef();
  const searchDropRef = useRef();

  useOutsideClick(dropdownRef, () => setActiveDropdown(null));
  useOutsideClick(searchDropRef, () => setFilteredCustomers([]));

  const fetchArchivedCustomers = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/customers/archived`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setArchivedCustomers(data);
    } else {
      setError("Erro ao buscar pacientes arquivados.");
    }
    setIsLoading(false);
  };

  const handleUnarchiveCustomer = async (customerId) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/customers/${customerId}/archive`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archived: false }),
      }
    );

    if (response.ok) {
      fetchArchivedCustomers();
    } else {
      setError("Erro ao desarquivar paciente!");
    }
  };

  useEffect(() => {
    fetchArchivedCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers([]);
    } else {
      setFilteredCustomers(
        archivedCustomers.filter((customer) =>
          customer.customer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, archivedCustomers]);

  const handleDeleteConfirmation = (customerId) => {
    setCustomerToDelete(customerId);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteCustomer = async () => {
    const response = await deleteCustomer(customerToDelete);

    if (response.ok) {
      fetchArchivedCustomers();
      setIsConfirmModalOpen(false);
      setCustomerToDelete(null);
      showDeleteToast();
    } else {
      showErrorToast("Erro ao excluir cliente!");
    }
  };

  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-2 bg-bg2 sm:px-6 md:px-10">
      <div
        className="
            w-full
            max-w-[1076px]
            mx-auto
            bg-bg1
            rounded-[15px]
            border-[3px]
            border-solid
            border-cinza6
            shadow-default
            px-4
            py-8
            sm:px-6
            md:px-10
            lg:px-14
          "
      >
        <div className="flex flex-col items-center w-full gap-4 pt-2 pb-4 sm:flex-row">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={searchTerm ? "" : "Pesquisar"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`h-[56px] w-full rounded-[15px] ${searchTerm ? "rounded-b-none" : ""
                } bg-clara3 pl-11 text-texto3 focus:outline-none focus:ring-0 caret-primaria`}
            />
            <div className="absolute -translate-y-1/2 left-3 top-1/2">
              {searchTerm.length > 0 ? (
                <div
                  onClick={() => {
                    setSearchTerm("");
                  }}
                  className="cursor-pointer"
                >
                  <ArrowLeftIcon />
                </div>
              ) : (
                <SearchIcon />
              )}
            </div>
            {searchTerm.length > 0 && (
              <div className="absolute -translate-y-1/2 right-3 top-1/2">
                <div
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredCustomers([]);
                  }}
                  className="cursor-pointer"
                >
                  <CloseIcon />
                </div>
              </div>
            )}
            {searchTerm &&
              filteredCustomers.length === 0 &&
              isDropdownVisible && (
                <p className="absolute top-full left-0 w-full px-4 py-2 bg-[#c7e0f7] rounded-b-[15px] shadow-md max-h-[200px] overflow-y-auto z-10 border border-t-texto2 text-center text-texto2">
                  Paciente não encontrado
                </p>
              )}
            {searchTerm && filteredCustomers.length > 0 && (
              <ul
                ref={searchDropRef}
                className="absolute top-full left-0 w-full bg-[#c7e0f7] rounded-b-[15px] shadow-md max-h-[200px] overflow-y-auto z-10 border border-t-texto2"
              >
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.customer_id}
                    className="px-4 py-2 cursor-pointer hover:bg-d_medio3"
                    onClick={() => {
                      setSearchTerm(customer.customer_name);
                      setFilteredCustomers([]);
                    }}
                  >
                    {customer.customer_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center border-b-[1px] border-cinza6 pb-4 font-ubuntu text-lg font-medium text-primaria">
          <span>Pacientes Arquivados</span>
          <div className="flex items-center mt-2 sm:mt-0">
            <span>Ações</span>
          </div>
        </div>
        <div className="w-full pt-4 mx-auto font-sans">
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
          {isLoading ? (
            <p>Carregando clientes...</p>
          ) : (
            <ul className="list-none">
              {archivedCustomers.map((customer) => (
                <li
                  key={`customer-${customer.customer_id}`}
                  className="flex items-center justify-between border-b-[1px] border-cinza6 py-4"
                >
                  <span className="text-base md:text-xl text-texto1">
                    {customer.customer_name}
                  </span>
                  <button
                    onClick={() => toggleDropdown(customer.customer_id)}
                    className="flex items-center justify-end bg-bg1 hover:bg-bg1"
                  >
                    <HamburguerIcon />
                  </button>
                  {activeDropdown === customer.customer_id && (
                    <DropDown
                      dropdownRef={dropdownRef}
                      customerId={customer.customer_id}
                      onDelete={handleDeleteConfirmation}
                      customers={customers}
                      onUnarchive={handleUnarchiveCustomer}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-destaque bg-opacity-30 z-30 backdrop-blur-[6px]">
            <div className="bg-bg1 p-6 rounded-lg w-[335px] h-[228px] border border-cinza6 text-center flex flex-col justify-center items-center">
              <p className="mb-4 text-lg font-semibold text-texto2">
                Você tem certeza que <br /> deseja
                <span className="text-primaria"> excluir </span>
                este <br /> paciente de forma <br /> permanente?
              </p>
              <div className="flex justify-around w-full">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="w-[74px] h-[40px] border border-primaria rounded-[100px] shadow flex-col justify-center items-center gap-2 text-primaria"
                >
                  Não
                </button>
                <button
                  onClick={handleDeleteCustomer}
                  className="w-[74px] h-[40px] bg-primaria rounded-[100px] shadow flex-col justify-center items-center gap-2 text-texto4"
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedPage;
