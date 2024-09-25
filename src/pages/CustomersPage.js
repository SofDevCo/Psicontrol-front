import React, { useEffect, useState, useRef } from "react";
import "../index.css";
import CreateCustomerForm from "./CreateCustomerForm";
import {
  SearchIcon,
  AddIcon,
  ArchiveIcon,
  HamburguerIcon,
  Trash,
  UserIconBorder,
  EditIcon,
} from "../icons/icons";
import { useOutsideClick } from "../components/useOutsideClick";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef();

  useOutsideClick(dropdownRef, () => setActiveDropdown(null));

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/events/customers");
      if (!response.ok) {
        throw new Error("Erro ao carregar os clientes");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setError("Erro ao carregar clientes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
  };

  return (
    <div className="box-border absolute w-[1076px] h-[544px] left-[314px] top-[145px] bg-bg1 border-solid border-[3px] border-cinza6 rounded-[15px] overflow-auto">
      <div className="relative flex items-center w-full pl-7 pt-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-[360px] h-[56px] bg-clara3 border border-solid border-gray-300 rounded-[28px] pl-10 text-texto3"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <SearchIcon />
          </div>
        </div>

        <div className="flex justify-center ml-[40px]">
          <button
            onClick={handleOpenModal}
            className="flex items-center w-[200px] h-[41px] bg-bg1 border-solid border-[3px] border-[#0082BA] text-primaria font-medium text-sm font-['Ubuntu'] text-center leading-[16px] tracking-[0.1px] rounded-lg hover:text-bg1 hover:bg-primaria shadow-md"
          >
            <AddIcon />
            Adicionar Paciente
          </button>
        </div>

        <button className="flex w-full left-[1191px] top-[194px] ml-[220px] not-italic font-medium text-sm leading-4 tracking-wider whitespace-no-wrap text-primaria underline bg-bg1 hover:bg-bg1">
          <ArchiveIcon />
          Pacientes arquivados
        </button>
      </div>

      <div className="flex w-full h-[21px] top-[275px] font-['Ubuntu'] not-italic font-medium text-lg leading-[21px] tracking-[0.09px] text-primaria border-b-[1px] border-b border-cinza6 pl-8 pt-6 pb-8 ">
        Paciente
        <div className="flex w-[52px] h-[21px] left-[1305px] top-[275px] ml-[877.5px] font-['Ubuntu'] not-italic font-medium text-lg leading-[21px] tracking-[0.09px] text-primaria ">
          Ações
        </div>
      </div>

      <div className="w-full mx-auto font-sans">
        {error && <p className="text-center mb-[20px] text-red-500">{error}</p>}
        {isLoading ? (
          <p>Carregando clientes...</p>
        ) : (
          <ul className="list-none">
            {customers.map((customer) => (
              <li
                key={`customer-${customer.customer_id}`}
                className="pl-8 pt-5 pb-2 border-b-[1px] border-b border-cinza6 flex justify-between items-center"
              >
                <span className="text-xl text-texto1">
                  {customer.customer_name}
                </span>
                <button
                  onClick={() => toggleDropdown(customer.customer_id)}
                  className="bg-bg1 hover:bg-bg1 flex items-center justify-end pr-8"
                >
                  <HamburguerIcon />
                </button>
                {activeDropdown === customer.customer_id && (
                  <nav className="absolute right-0 box-border border-solid border-[1px] border-cinza6 shadow-default bg-bg2"
                  ref={dropdownRef}>
                    <ul>
                      <li>
                        <button
                          className="flex item-center bg-bg2 text-texto2 underline font-['Open Sans'] not-italic font-normal text-[15px] leading-5 tracking-normal hover:bg-bg2"
                          onClick={() =>  
                            console.log("Conta do paciente clicada")  
                          }
                        >
                          <UserIconBorder/>
                          Conta do paciente
                        </button>
                      </li>
                      <li>    
                        <button
                          className="flex item-center bg-bg2 text-texto2 underline font-['Open Sans'] not-italic font-normal text-[15px] leading-5 tracking-normal hover:bg-bg2"
                          onClick={() => console.log("Editar paciente clicado")}
                        >
                          <EditIcon/>
                          Editar paciente
                        </button>
                      </li>
                      <li>
                        <button
                          className="flex item-center bg-bg2 text-texto2 underline font-['Open Sans'] not-italic font-normal text-[15px] leading-5 tracking-normal hover:bg-bg2"
                          onClick={() =>
                            console.log("Excluir paciente clicado")
                          }
                        >
                          <Trash/>
                          Excluir paciente
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </li>
            ))}
          </ul>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative w-[1110px] h-[717px] bg-white p-8 rounded-[25px] shadow-lg overflow-y-auto">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#0082BA] ml-[20px]">
                  Dados do Paciente
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="flex justify-between items-center mb-[15px] bg-white text-[#0082BA] rounded-[5px] hover:bg-primaria hover:text-white"
                >
                  Sair
                </button>
              </div>

              <CreateCustomerForm
                onClose={handleCloseModal}
                onSubmit={fetchCustomers}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
