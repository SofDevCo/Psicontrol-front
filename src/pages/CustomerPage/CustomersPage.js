import React, { useEffect, useState, useRef } from "react";
import "../../index.css";
import CreateCustomerForm from "./components/CreateCustomerForm";
import {
  SearchIcon,
  AddIcon,
  ArchiveIcon,
  HamburguerIcon,
  ArrowLeftIcon,
  CloseIcon,
} from "../../icons/icons";
import { useOutsideClick } from "../../utils/OutsideClick/useOutsideClick";
import { useModal } from "../../utils/Modal/useModal";
import DropDonw from "./components/dropdownCustomerPage";
import { showErrorToast } from "../../utils/notification/toastify";
import { Link } from "react-router-dom";
import { ArchiveCustomer, deleteCustomer } from "../../service/pagesService/pagesService";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isModalOpen, openModal, closeModal } = useModal();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [customer, setCustomer] = useState({
    customer_name: "",
    customer_cpf_cnpj: "",
  });

  const dropdownRef = useRef();

  useOutsideClick(dropdownRef, () => setActiveDropdown(null));

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/events/customers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "authentication_token"
          )}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setError("Erro ao buscar clientes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers([]);
    } else {
      setFilteredCustomers(
        customers.filter((customer) =>
          customer.customer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, customers]);

  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
  };

  const handleUsePatientData = () => {
    setCustomer((prev) => ({
      ...prev,
      alternative_name: prev.customer_name,
      alternative_cpf_cnpj: prev.customer_cpf_cnpj,
    }));
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await deleteCustomer(customerId);

      if (response.ok) {
        fetchCustomers();
      } else {
        showErrorToast("Erro ao excluir cliente!");
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleArchiveCustomer = async (customerId) => {
    const response = await ArchiveCustomer(customerId);

    if (response.ok) {
      fetchCustomers();
    } else {
      showErrorToast("Erro ao excluir cliente!");
    }
  };

  const handleAddPatient = () => {
    setCustomer({
      customer_name: "",
      customer_cpf_cnpj: "",
      customer_phone: "",
      customer_email: "",
      consultation_fee: "",
      customer_dob: "",
      alternative_name: "",
      alternative_cpf_cnpj: "",
    });
    setIsEditing(false);
    openModal();
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setCustomer(patient);
    setIsEditing(true);
    openModal();
  };

  return (
    <div className="absolute left-[314px] top-[145px] box-border h-[544px] w-[1076px] overflow-auto [&::-webkit-scrollbar]:w-auto [&::-webkit-scrollbar-track]:bg-gray-100 rounded-[15px] border-[3px] border-solid border-cinza6 bg-bg1">
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

          {searchTerm.length > 0 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
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
          {searchTerm && filteredCustomers.length === 0 && (
            <p className="absolute top-full left-0 w-full px-4 py-2 bg-[#c7e0f7] rounded-b-[15px] shadow-md max-h-[200px] overflow-y-auto z-10 border border-t-texto2 text-center text-texto2">
              Paciente não encontrado
            </p>
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

        <div className="ml-[40px] flex justify-center">
          <button
            onClick={handleAddPatient}
            className="flex h-[41px] w-[200px] items-center justify-center rounded-[10px] border-2 border-solid border-[#0082BA] bg-bg1  text-center font-['Ubuntu'] text-sm font-semibold leading-[20px] tracking-[0.15px] text-primaria shadow-md hover:shadow-innerShadow hover:bg-bg1 hover:text-primaria space-x-2 px-4"
          >
            <AddIcon />
            <span>Adicionar paciente</span>
          </button>
        </div>

        <button className="whitespace-no-wrap left-[1191px] top-[194px] flex w-full gap-2 bg-bg1 text-sm font-medium not-italic leading-4 tracking-wider text-primaria underline hover:bg-bg1 hover:text-primaria/50">
          <ArchiveIcon />
          <Link to="/archived">Pacientes arquivados</Link>
        </button>
      </div>

      <div className="top-[275px] flex h-[21px] w-full  border-b-[1px] border-cinza6 pb-8 pl-8 pt-6 font-['Ubuntu'] text-lg font-medium not-italic leading-[21px] tracking-[0.09px] text-primaria">
        Paciente
        <div className="left-[1305px] top-[275px] ml-[893.5px] flex h-[21px] w-[52px] font-['Ubuntu'] text-lg font-medium not-italic leading-[21px] tracking-[0.09px] text-primaria">
          Ações
        </div>
      </div>

      <div className="mx-auto w-full font-sans">
        {error && <p className="mb-[20px] text-center text-red-500">{error}</p>}
        {isLoading ? (
          <p>Carregando clientes...</p>
        ) : (
          <ul className="list-none">
            {customers.map((customer) => (
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
                  <DropDonw
                    dropdownRef={dropdownRef}
                    customerId={customer.customer_id}
                    onDelete={handleDeleteCustomer}
                    setSelectedPatient={setSelectedPatient}
                    openModal={() => handleEditPatient(customer)}
                    customers={customers}
                    onArchive={handleArchiveCustomer}
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-[90%] md:max-w-[1070px] h-auto max-h-[90vh] rounded-[25px] bg-bg1 border-2 border-cinza6 p-8 shadow-lg overflow-y-auto">
              <div className="flex flex-wrap items-center mt-[20px] gap-4">
                <h2 className="ml-[20px] text-[20px] md:text-[25px] font-medium font-['Ubuntu'] text-primaria">
                  Adicionar Paciente
                </h2>
                <h3 className="text-primaria text-[20px] md:text-[25px] font-medium font-['Ubuntu'] ml-[262px]">
                  Dados para recibo
                </h3>
                <div className="ml-[20px] border-2 border-primaria rounded-[10px] w-full md:w-auto">
                  <button
                    onClick={handleUsePatientData}
                    className="w-full md:w-[181px] h-[58px] bg-bg1 hover:bg-bg1 rounded-[10px] text-center text-primaria text-sm font-medium font-['Ubuntu'] tracking-tight"
                  >
                    Usar dados do <br /> paciente
                  </button>
                </div>
              </div>

              <CreateCustomerForm
                onClose={closeModal}
                onSubmit={fetchCustomers}
                selectedPatient={selectedPatient}
                customer={customer}
                setCustomer={setCustomer}
                isEditing={isEditing}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
