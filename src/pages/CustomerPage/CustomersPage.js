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
import {
  showArchiveToast,
  showDeleteToast,
} from "./components/notiificationCustomerPage";
import { useOutsideClick } from "../../utils/OutsideClick/useOutsideClick";
import { useModal } from "../../utils/Modal/useModal";
import DropDonw from "./components/dropdownCustomerPage";
import { showErrorToast } from "../../utils/notification/toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  ArchiveCustomer,
  deleteCustomer,
  fetchCustomers,
} from "../../service/pagesService/pagesService";

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isDropdownVisible] = useState(false);

  const [customer, setCustomer] = useState({
    customer_name: "",
    customer_cpf_cnpj: "",
  });

  const dropdownRef = useRef();
  const searchDropRef = useRef();
  const navigate = useNavigate();

  useOutsideClick(searchDropRef, () => setFilteredCustomers([]));
  useOutsideClick(dropdownRef, () => setActiveDropdown(null));

  const HandlefetchCustomers = async () => {
    setIsLoading(true);
    const data = await fetchCustomers().catch(() => {
      setError("Erro ao buscar clientes.");
      return null;
    });

    if (data && Array.isArray(data)) {
      setCustomers(data);
    } else if (data && data.customers) {
      setCustomers(data.customers);
    } else {
      setCustomers([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    HandlefetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers([]);
    } else {
      setFilteredCustomers(
        Array.isArray(customers)
          ? customers.filter((customer) =>
              customer.customer_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
          : []
      );
    }
  }, [searchTerm, customers]);

  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
  };

  const handleDeleteConfirmation = (customerId) => {
    setCustomerToDelete(customerId);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteCustomer = async () => {
    const response = await deleteCustomer(customerToDelete);

    if (response.ok) {
      HandlefetchCustomers();
      setIsConfirmModalOpen(false);
      setCustomerToDelete(null);
      showDeleteToast();
    } else {
      showErrorToast("Erro ao excluir cliente!");
    }
  };

  const handleArchiveCustomer = async (customerId) => {
    const response = await ArchiveCustomer(customerId);

    if (response.ok) {
      HandlefetchCustomers();
      showArchiveToast();
    } else {
      showErrorToast("Erro ao excluir cliente!");
    }
  };

  const handleAddPatient = () => {
    setCustomer({
      customer_name: "",
      customer_cpf_cnpj: "",
      customer_second_name: "",
      customer_calendar_name: "",
      customer_phone: "",
      customer_email: "",
      consultation_fee: "",
      customer_dob: "",
      alternative_name: "",
      alternative_cpf_cnpj: "",
      customer_emergency_contact: "",
      customer_emergency_name: "",
      customer_emergency_relationship: "",
      customer_personal_message: "",
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

  const handleNavigateClick = (customerId) => {
    navigate(`/customers/${customerId}/profile`);
  };

  return (
    <div className="relative mx-auto mt-36 box-border lg:w-[calc(95vw-280px)] max-w-[95%] rounded-[15px] border-[3px] border-solid border-cinza6 bg-bg1 z-10">
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-start bg-bgM/30 backdrop-blur-[6px] z-30 overflow-y-auto">
          <div className="w-full max-w-[90%] lg:max-w-[60%] h-auto mb-8 mt-32 lg:ml-64 rounded-[25px] bg-bg1 border-2 border-cinza6 p-8 shadow-lg z-30">
            <CreateCustomerForm
              onClose={closeModal}
              onSubmit={HandlefetchCustomers}
              selectedPatient={selectedPatient}
              customer={customer}
              setCustomer={setCustomer}
              isEditing={isEditing}
            />
          </div>
        </div>
      )}
      <div className="relative w-full items-center pl-7 pt-6">
        <div className="relative flex items-center lg:gap-4 gap-1 w-full lg:w-auto md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder={searchTerm ? "" : "Pesquisar pacientes"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`h-[35px] lg:h-[56px] lg:w-[360px] md:w-[calc(95vw-300px)] sm:w-[calc(95vw-260px)] w-[calc(125vw-260px)] lg:rounded-[15px] rounded-lg ${searchTerm ? "rounded-b-none" : ""} placeholder:text-xs lg:placeholder:text-base bg-clara3 lg:pl-11 pl-7 text-texto3 focus:outline-none focus:ring-0 caret-primaria`}
            />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 transform">
              {searchTerm.length > 0 ? (
                <div
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredCustomers([]);
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
                className="absolute top-full left-0 w-full bg-[#c7e0f7] rounded-b-[15px] shadow-md max-h-[200px]  z-10 border border-t-texto2 overflow-auto"
              >
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.customer_id}
                    className="px-4 py-2 hover:bg-d_medio3 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(customer.customer_name);
                      setFilteredCustomers([]);
                      handleNavigateClick(customer.customer_id);
                    }}
                  >
                    {customer.customer_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleAddPatient}
            className="flex lg:h-[41px] md:h-[41px] w-auto lg:w-[200px] md:w-[100px] md:ml-3 items-center justify-center lg:rounded-[10px] md:rounded-[10px] lg:border-2 md:border-2 lg:border-solid md:border-solid lg:border-primaria md:border-primaria lg:bg-bg1 md:bg-bg1  text-center font-['Ubuntu'] text-sm font-semibold leading-[20px] tracking-[0.15px] text-primaria lg:shadow-md active:shadow-innerShadow hover:bg-bg1 hover:text-primaria space-x-2 px-4"
          >
            <AddIcon />
            <span className="hidden sm:hidden lg:inline md:inline ">
              Adicionar paciente
            </span>
          </button>

          <button className="group md:ml-3 whitespace-no-wrap flex gap-2 items-center bg-bg1 text-sm font-medium not-italic leading-4 tracking-wider text-primaria underline hover:bg-bg1 active:text-primaria/50">
            <Link
              to="/archived"
              className="group flex items-center gap-2  w-auto md:w-[100px] bg-bg1 text-sm font-medium not-italic leading-4 tracking-wider text-primaria underline hover:text-primaria active:text-primaria/50"
            >
              <ArchiveIcon />
              <span className="hidden lg:inline md:inline">
                Pacientes arquivados
              </span>
            </Link>
          </button>
        </div>
      </div>

      <div className="top-[275px] flex h-[21px] w-full  border-b-[1px] border-cinza6 pb-8 pl-8 pt-6 font-['Ubuntu'] lg:text-lg text-sm  font-medium not-italic leading-[21px] tracking-[0.09px] text-primaria">
        Paciente
        <div className="  ml-auto lg:mr-4 mr-2 flex h-[21px] w-[52px] font-['Ubuntu'] lg:text-lg text-sm font-medium not-italic leading-[21px] tracking-[0.09px] text-primaria">
          Ações
        </div>
      </div>

      <div className="mx-auto w-full font-sans">
        {error && <p className="mb-[20px] text-center text-red-500">{error}</p>}
        {isLoading ? (
          <p>Carregando clientes...</p>
        ) : (
          <ul className="list-none">
            {customers
              .filter((customer) =>
                customer.customer_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((customer) => (
                <li
                  key={`customer-${customer.customer_id}`}
                  className="flex items-center justify-between  border-b-[1px] border-cinza6 pb-2 pl-8 pt-5"
                >
                  <span
                    className="lg:text-xl text-sm text-texto1"
                    onClick={() => handleNavigateClick(customer.customer_id)}
                  >
                    {`${customer.customer_name} ${customer.customer_second_name}`}
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
                      onDelete={handleDeleteConfirmation}
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
      </div>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-destaque bg-opacity-30 backdrop-blur-[6px] z-30 ">
          <div className="bg-bg1 p-6 rounded-lg w-[335px] h-[228px] border border-cinza6 text-center transform -translate-y-52 translate-x-32">
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

export default CustomersPage;
