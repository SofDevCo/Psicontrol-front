import React, { useEffect, useState, useRef } from "react";
import "../../index.css";
import CreateCustomerForm from "./components/CreateCustomerForm";
import {
  SearchIcon,
  AddIcon,
  ArchiveIcon,
  HamburguerIcon,
} from "../../icons/icons";
import { useOutsideClick } from "../../utils/OutsideClick/useOutsideClick";
import { useModal } from "../../utils/Modal/useModal";
import DropDonw from "./components/dropdownCustomerPage";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isModalOpen, openModal, closeModal } = useModal();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [customer, setCustomer] = useState({
    customer_name: "",
    customer_cpf_cnpj: "",
    // Adicione outros campos conforme necessário
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
      setError("Erro ao buscar clientes."); // Trate o erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

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

  return (
    <div className="absolute left-[314px] top-[145px] box-border h-[544px] w-[1076px] overflow-auto rounded-[15px] border-[3px] border-solid border-cinza6 bg-bg1">
      <div className="relative flex w-full items-center pl-7 pt-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar"
            className="h-[56px] w-[360px] rounded-[28px] border border-solid border-gray-300 bg-clara3 pl-10 text-texto3"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transform">
            <SearchIcon />
          </div>
        </div>

        <div className="ml-[40px] flex justify-center">
          <button
            onClick={openModal}
            className="flex h-[41px] w-[200px] items-center rounded-lg border-[3px] border-solid border-[#0082BA] bg-bg1 text-center font-['Ubuntu'] text-sm font-medium leading-[16px] tracking-[0.1px] text-primaria shadow-md hover:bg-primaria hover:text-bg1"
          >
            <AddIcon />
            Adicionar Paciente
          </button>
        </div>

        <button className="whitespace-no-wrap left-[1191px] top-[194px] ml-[220px] flex w-full bg-bg1 text-sm font-medium not-italic leading-4 tracking-wider text-primaria underline hover:bg-bg1">
          <ArchiveIcon />
          Pacientes arquivados
        </button>
      </div>

      <div className="top-[275px] flex h-[21px] w-full  border-b-[1px] border-cinza6 pb-8 pl-8 pt-6 font-['Ubuntu'] text-lg font-medium not-italic leading-[21px] tracking-[0.09px] text-primaria">
        Paciente
        <div className="left-[1305px] top-[275px] ml-[877.5px] flex h-[21px] w-[52px] font-['Ubuntu'] text-lg font-medium not-italic leading-[21px] tracking-[0.09px] text-primaria">
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
                <div className="ml-[20px] border-2 border-cinza6 rounded-[10px] w-full md:w-auto">
                  <button
                    onClick={handleUsePatientData}
                    className="w-full md:w-[181px] h-[58px] bg-bg1 hover:bg-bg1 rounded-[10px] text-center text-cinza6 text-sm font-medium font-['Ubuntu'] tracking-tight"
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
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
