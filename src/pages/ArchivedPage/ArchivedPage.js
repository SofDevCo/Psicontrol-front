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
import {showDeleteToast} from "../CustomerPage/components/notiificationCustomerPage";

const ArchivedPage = () => {
  const [archivedCustomers, setArchivedCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const dropdownRef = useRef();

  useOutsideClick(dropdownRef, () => setActiveDropdown(null));

  const fetchArchivedCustomers = async () => {
    setIsLoading(true);
    const response = await fetch(
      "http://localhost:3000/events/customers/archived",
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
      `http://localhost:3000/events/customers/${customerId}/archive`,
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
    try {
      const response = await deleteCustomer(customerToDelete);

      if (response.ok) {
        fetchArchivedCustomers();
        setIsConfirmModalOpen(false);
        setCustomerToDelete(null);
        showDeleteToast();
      } else {
        showErrorToast("Erro ao excluir cliente!");
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
  };

  return (
    <div className="relative mx-auto box-border h-[544px] w-[1076px] overflow-auto [&::-webkit-scrollbar]:w-auto [&::-webkit-scrollbar-track]:bg-gray-100 rounded-[15px] border-[3px] border-solid border-cinza6 bg-bg1">
      <div className="relative flex w-full items-center pl-7 pt-6">
        <div className="relative">
          <input
            type="text"
            placeholder={searchTerm ? "" : "Pesquisar"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`h-[56px] w-[360px] rounded-[15px] ${searchTerm ? "rounded-b-none" : ""} bg-clara3 pl-11 text-texto3 focus:outline-none focus:ring-0 caret-primaria`}
          />
          <div className="absolute left-1 top-1/2 -translate-y-1/2 transform">
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

          {searchTerm && filteredCustomers.length === 0 && (
            <p className="absolute top-full left-0 w-full px-4 py-2 bg-[#c7e0f7] rounded-b-[15px] shadow-md max-h-[200px] overflow-y-auto z-10 border border-t-texto2 text-center text-texto2">
              Paciente não encontrado
            </p>
          )}

          {searchTerm.length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
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
          {searchTerm && filteredCustomers.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-[#c7e0f7] rounded-b-[15px] shadow-md max-h-[200px] overflow-y-auto z-10 border border-t-texto2">
              {filteredCustomers.map((customer) => (
                <li
                  key={customer.customer_id}
                  className="px-4 py-2 hover:bg-d_medio3 cursor-pointer"
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

      <div className="flex justify-between mt-9 items-center h-[21px] w-full border-b-[1px] border-cinza6 pb-8 pl-8 pt-6 font-['Ubuntu'] text-lg font-medium not-italic leading-[21px] tracking-[0.09px] text-primaria">
        <span>Pacientes Arquivados</span>
        <div className="flex mr-4 items-center h-[21px] w-[52px]">
          <span>Ações</span>
        </div>
      </div>

      <div className="mx-auto w-full font-sans">
        {error && <p className="mb-[20px] text-center text-red-500">{error}</p>}
        {isLoading ? (
          <p>Carregando clientes...</p>
        ) : (
          <ul className="list-none">
            {archivedCustomers.map((customer) => (
              <li
                key={`customer-${customer.customer_id}`}
                className="flex items-center justify-between  border-b-[1px] border-cinza6 pb-2 pl-8 pt-5"
              >
                <span className="text-xl text-texto1">
                  {customer.customer_name}
                </span>
                <button
                  onClick={() => toggleDropdown(customer.customer_id)}
                  className="flex items-center justify-end bg-bg1 pr-8 hover:bg-bg1"
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
          <div className="bg-bg1 p-6 rounded-lg w-[335px] h-[228px] border border-cinza6 text-center transform -translate-y-64 translate-x-32">
            <p className="text-lg font-semibold mb-4 text-texto2">
              Você tem certeza que <br /> deseja
              <span className="text-primaria"> excluir </span>
              este <br /> paciente de forma <br /> permanente?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-[74px] h-[40px] border border-primaria rounded-[100px] shadow flex-col justify-center items-center gap-2 inline-flex text-primaria"
              >
                Não
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="w-[74px] h-[40px] bg-primaria rounded-[100px] shadow flex-col justify-center items-center gap-2 inline-flex text-texto4"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivedPage;
