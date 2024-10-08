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
import { useModal, useSuccessModal } from "../components/useModal";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isModalOpen, openModal, closeModal } = useModal();
  // const { isSuccessModalOpen, openSuccessModal, closeSuccessModal } = useSuccessModal();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef();

  useOutsideClick(dropdownRef, () => setActiveDropdown(null));

  useEffect(() => {
    fetchCustomers();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  };



  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
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

      <div className="top-[275px] flex h-[21px] w-full border-b border-b-[1px] border-cinza6 pb-8 pl-8 pt-6 font-['Ubuntu'] text-lg font-medium not-italic leading-[21px] tracking-[0.09px] text-primaria">
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
                className="flex items-center justify-between border-b border-b-[1px] border-cinza6 pb-2 pl-8 pt-5"
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
                  <nav
                    className="absolute right-0 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default"
                    ref={dropdownRef}
                  >
                    <ul>
                      <li>
                        <button
                          className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2"
                          onClick={() =>
                            console.log("Conta do paciente clicada")
                          }
                        >
                          <UserIconBorder />
                          Conta do paciente
                        </button>
                      </li>
                      <li>
                        <button
                          className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2"
                          onClick={() => console.log("Editar paciente clicado")}
                        >
                          <EditIcon />
                          Editar paciente
                        </button>
                      </li>
                      <li>
                        <button
                          className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2"
                          onClick={() =>
                            console.log("Excluir paciente clicado")
                          }
                        >
                          <Trash />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative h-[717px] w-[1110px] overflow-y-auto rounded-[25px] bg-white p-8 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="ml-[20px] text-2xl font-bold text-[#0082BA]">
                  Adicionar Paciente
                </h2>
                <button
                  onClick={closeModal}
                  className="mb-[15px] flex items-center justify-between rounded-[5px] bg-white text-[#0082BA] hover:bg-primaria hover:text-white"
                >
                  Sair
                </button>
              </div>

              <CreateCustomerForm
                onClose={closeModal}
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
