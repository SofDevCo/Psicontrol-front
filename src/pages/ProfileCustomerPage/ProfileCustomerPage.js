import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DropDownProfile from "./components/DropdownProfilePage";
import CreateCustomerForm from "../CustomerPage/components/CreateCustomerForm";
import {
  ArchiveCustomer,
  createOrUpdateCustomer,
  deleteCustomer,
  fetchCustomerProfile,
} from "../../service/pagesService/pagesService";
import { HamburguerIcon } from "../../icons/icons";
import {
  showErrorToast,
} from "../../utils/notification/toastify";
import { showSaveToast } from "../CustomerPage/components/notiificationCustomerPage";

const ProfileCustomerPage = () => {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { customerId } = useParams();

  const dropdownRef = useRef();

  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
  };

  useEffect(() => {
    const handleFetchCustomerProfile = async (cutomerId) => {
      const response = await fetchCustomerProfile(customerId);
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
        setCustomer(null);
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
      setCustomer(null);
    } else {
      showErrorToast("Erro ao excluir cliente!");
    }
  };

  const handleEditCustomer = async (updatedCustomer) => {
    const response = await createOrUpdateCustomer(
      updatedCustomer,
      [],
      updatedCustomer.customer_id
    );

    if (response.ok) {
      const profileResponse = await fetchCustomerProfile(customerId);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setCustomer(profileData);
      }
      setIsEditing(false);
      showSaveToast();
    } else {
      const errorData = await response.json();
      showErrorToast(errorData.message || "Erro ao atualizar o cliente.");
    }
  };

  const handleUsePatientData = () => {
    setCustomer((prev) => ({
      ...prev,
      alternative_name: prev.customer_name,
      alternative_cpf_cnpj: prev.customer_cpf_cnpj,
    }));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-[1076px] h-[330px] bg-bg1 shadow p-6 border-2 border-cinza6 rounded-[15px] text-F15 mt-4">
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
            setSelectedPatient={setSelectedPatient}
            openModal={() => setIsEditing(true)}
            customer={customer}
            onArchive={handleArchviveCustomer}
          />
        )}
        <h2 className="text-F25 font-medium font-['Ubuntu'] mb-4 text-primaria ml-5">
          Conta do paciente
        </h2>
        <div className="grid grid-cols-2 ">
          <div className="ml-5">
            <div className="flex items-center max-w-auto">
              <div className="bg-primaria text-white h-10 w-10 rounded-full flex items-center justify-center transform translate-y-4">
                {customer && customer.customer_name
                  ? customer.customer_name.charAt(0)
                  : ""}
              </div>
              <h3 className="ml-6 text-F20 font-medium font-['Ubuntu'] tracking-normal">
                {customer.customer_name}
              </h3>
            </div>
            <p className="mt-4 text-texto2 text-F15 font-normal font-['Open Sans'] tracking-normal ml-16">
              <strong>CPF/CNPJ:</strong>
              <label className="text-texto3/50 text-F15 font-normal font-['Open Sans'] tracking- ">
                {" "}
                {customer.customer_cpf_cnpj || "Não informado"}
              </label>
            </p>
            <p className="mt-2 text-texto2 text-F15 font-normal font-['Open Sans'] tracking-normal ml-16">
              <strong>Idade:</strong>{" "}
              <label className="text-texto3/50 text-F15 font-normal font-['Open Sans'] tracking-normal">
                {" "}
                {customer.age || "Não informado"} anos{" "}
              </label>
            </p>
            <p className="mt-2 text-texto2 text-F15 font-normal font-['Open Sans'] tracking-normal ml-16">
              <strong>E-mail:</strong>{" "}
              <label className="text-texto3/50 text-F15 font-normal font-['Open Sans'] tracking-normal">
                {customer.customer_email || "Não informado"}{" "}
              </label>
            </p>
            <p className="mt-2 text-texto2 text-F15 font-normal font-['Open Sans'] tracking-normal ml-16">
              <strong className="texto">Telefone:</strong>{" "}
              <label className="text-texto3/50 text-F15 font-normal font-['Open Sans'] tracking-normal">
                {" "}
                {customer.customer_phone || "Não informado"}{" "}
              </label>
            </p>
          </div>
          <div className="mt-2 mr-2">
            <h3 className="text-F20 font-bold">Dados para recibo</h3>
            <p className="mt-4 text-texto2 text-F15 ">
              <strong>Nome:</strong>{" "}
              <label className="text-texto3/50 text-F15 font-normal font-['Open Sans'] tracking-normal">
                {" "}
                {customer.alternative_name || "Não informado"}{" "}
              </label>
            </p>
            <p className="mt-2 text-texto2 text-F15 font-normal font-['Open Sans'] tracking-normal">
              <strong>CPF/CNPJ:</strong>{" "}
              <label className="text-texto3/50 text-F15 font-normal font-['Open Sans'] tracking-normal">
                {" "}
                {customer.alternative_cpf_cnpj || "Não informado"}{" "}
              </label>
            </p>
            <p className="mt-3 text-texto2 text-F15 font-normal font-['Open Sans'] tracking-normal">
              <strong>E-mail:</strong>{" "}
              <label className="text-texto3/50 text-F15 font-normal font-['Open Sans'] tracking-normal">
                {" "}
                {customer.customer_email || "Não informado"}{" "}
              </label>
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-[90%] md:max-w-[1070px] h-auto max-h-[90vh] rounded-[25px] bg-bg1 border-2 border-cinza6 p-8 shadow-lg overflow-y-auto">
            <div className="flex flex-wrap items-center mt-[20px] gap-4">
              <h2 className="ml-6 text-[20px] md:text-[25px] font-medium font-['Ubuntu'] text-primaria">
                Editar Paciente
              </h2>
              <h3 className="text-primaria text-[20px] md:text-[25px] font-medium font-['Ubuntu'] ml-[290px]">
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
              onClose={() => setIsEditing(false)}
              onSubmit={() => handleEditCustomer(customer)}
              selectedPatient={selectedPatient}
              customer={customer}
              setCustomer={setCustomer}
              isEditing
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCustomerPage;
