import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DropDownProfile from "./components/DropdownProfilePage";
import {
  ArchiveCustomer,
  deleteCustomer,
  fetchCustomerProfile,
} from "../../service/pagesService/pagesService";
import { HamburguerIcon } from "../../icons/icons";
import {
  showSuccessToast,
  showErrorToast,
} from "../../utils/notification/toastify";

const ProfileCustomerPage = () => {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { customerId } = useParams();

  const dropdownRef = useRef();

  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
  };

  useEffect(() => {
    const handleFetchCustomerProfile = async (cutomerId) => {

      const response = await fetchCustomerProfile(customerId)
      if (!response.ok) {
        setError("Erro ao buscar o perfil do paciente");
        return;
      }
      const data = await response.json();
      setCustomer(data);
    };

    handleFetchCustomerProfile();
  }, [customerId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!customer) {
    return <div>Carregando...</div>;
  }

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await deleteCustomer(customerId);

      if (response.ok) {
        setCustomer();
      } else {
        showErrorToast("Erro ao excluir cliente!");
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleArchviveCustomer = async (customerId) => {
    const response = await ArchiveCustomer(customerId);
    if (response.ok) {
      setCustomer();
    } else {
      showErrorToast("Erro ao excluir cliente!");
    }
  };

 

  return (
    <div className="relative w-[1076px] h-[330px] bg-bg1 shadow p-6 border-2 border-cinza6 rounded-[15px] mt-4">
      <button
        onClick={() => toggleDropdown(customer.customer_id)}
        className="absolute top-4 right-4 bg-bg1 hover:bg-bg1"
      >
        <HamburguerIcon />
      </button>
      {activeDropdown === customer.customer_id && (
        <DropDownProfile
          dropdownRef={dropdownRef}
          customerId={customer.customer_id}
          onDelete={handleDeleteCustomer}
          customers={customer}
          onArchive={handleArchviveCustomer}
        />
      )}
      <h2 className="text-2xl font-bold mb-4 text-primaria">
        Conta do paciente
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center">
            <div className="bg-blue-500 text-white h-12 w-12 rounded-full flex items-center justify-center">
              {customer.customer_name.charAt(0)}
            </div>
            <h3 className="ml-4 text-xl font-bold">{customer.customer_name}</h3>
          </div>
          <p className="mt-4 text-texto2">
            <strong>CPF/CNPJ:</strong>
            <label className="text-texto3/50">
              {" "}
              {customer.customer_cpf_cnpj || "Não informado"}
            </label>
          </p>
          <p className="mt-2 text-texto2">
            <strong>Idade:</strong>{" "}
            <label className="text-texto3/50">
              {" "}
              {customer.age || "Não informado"} anos{" "}
            </label>
          </p>
          <p className="mt-2 text-texto2">
            <strong>E-mail:</strong>{" "}
            <label className="text-texto3/50">
              {customer.customer_email || "Não informado"}{" "}
            </label>
          </p>
          <p className="mt-2 text-texto2">
            <strong className="texto">Telefone:</strong>{" "}
            <label className="text-texto3/50">
              {" "}
              {customer.customer_phone || "Não informado"}{" "}
            </label>
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold">Dados para recibo</h3>
          <p className="mt-4 text-texto2">
            <strong>Nome:</strong>{" "}
            <label className="text-texto3/50">
              {" "}
              {customer.alternative_name || "Não informado"}{" "}
            </label>
          </p>
          <p className="mt-2 text-texto2">
            <strong>CPF/CNPJ:</strong>{" "}
            <label className="text-texto3/50">
              {" "}
              {customer.alternative_cpf_cnpj || "Não informado"}{" "}
            </label>
          </p>
          <p className="mt-2 text-texto2">
            <strong>E-mail:</strong>{" "}
            <label className="text-texto3/50">
              {" "}
              {customer.customer_email || "Não informado"}{" "}
            </label>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomerPage;
