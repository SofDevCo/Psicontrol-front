import React, { useEffect, useState } from "react";
import "../index.css";
import CreateCustomerForm from "./CreateCustomerForm";
import { SearchIcon, AddIcon } from "../icons/icons";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="box-border absolute w-[1076px] h-[544px] left-[314px] top-[145px] bg-new-white border-solid border-[3px] border-new-gray rounded-[15px] p-6 overflow-auto">
      <div className="relative flex items-center w-full p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-[360px] h-[56px] bg-primaria-clara3 border border-solid border-gray-300 rounded-[28px] pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <SearchIcon />
          </div>
        </div>

        <div className="flex justify-center ml-[40px]">
          <button
            onClick={handleOpenModal}
            className="flex items-center w-[200px] h-[41px] bg-new-white border-solid border-[3px] border-[#0082BA] text-custom-blue font-medium text-sm rounded-lg hover:text-new-white hover:bg-custom-blue"
          >
            <AddIcon/>
            Novo Paciente
          </button>
        </div>

        <div className="flex w-[166px] h-[18px] left-[1191px] top-[194px] ml-[225px]">
          Pacientes Arquivados
        </div>
      </div>

      <div className="max-w-[800px] mx-auto p-5 font-sans">
        {error && <p className="text-center mb-[20px] text-red-500">{error}</p>}
        {isLoading ? (
          <p>Carregando clientes...</p>
        ) : (
          <ul className="list-none p-0">
            {customers.map((customer) => (
              <li
                key={`customer-${customer.customer_id}`}
                className="border-b-10 border-b border-gray-200 py-2.5"
              >
                <span className="text-xl text-[#333]">
                  {customer.customer_name}
                </span>
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
                  className="flex justify-between items-center mb-[15px] bg-white text-[#0082BA] rounded-[5px] hover:bg-custom-blue hover:text-white"
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
