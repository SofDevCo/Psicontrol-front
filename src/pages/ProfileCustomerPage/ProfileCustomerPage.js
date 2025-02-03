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
import { showErrorToast } from "../../utils/notification/toastify";
import {
  showDeleteProfileToast,
  showArchiveProfileToast,
} from "../ProfileCustomerPage/components/notificationProfilePage";
import PaymentControlCard from "./components/PaymentControlCard";

const ProfileCustomerPage = () => {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [customerMessage, setCustomerMessage] = useState("");
  const [savedMessages, setSavedMessages] = useState([]);
  const [billingRecords, setBillingRecords] = useState([]);

  const { customerId } = useParams();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleFetchCustomerProfile = async () => {
      const response = await fetchCustomerProfile(customerId);
      if (!response.ok) {
        setError("Erro ao buscar o perfil do paciente");
        return;
      }
      const data = await response.json();
      console.log("Dados do paciente:", data);
      setCustomer(data);
      setSavedMessages(
        Array.isArray(data.customer_personal_message)
          ? data.customer_personal_message
          : [data.customer_personal_message]
      );
      setBillingRecords(data.billingRecords || []);
    };
    

    handleFetchCustomerProfile();
  }, [customerId]);

  const toggleDropdown = (customer_id) => {
    setActiveDropdown((prev) => (prev === customer_id ? null : customer_id));
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!customer) {
    return <div>Carregando...</div>;
  }

  const handleDeleteConfirmation = (customerId) => {
    setCustomerToDelete(customerId);
    setIsConfirmModalOpen(true);
  };

  const handleSaveMessage = async (message) => {
    const lines = message.split("\n").filter((line) => line.trim() !== "");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/customers/${customerId}/message`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({ customer_personal_message: lines }),
      }
    );

    if (!response.ok) {
      showErrorToast("Erro ao salvar a mensagem.");
      return;
    }

    const updatedCustomer = await response.json();
    setCustomer(updatedCustomer);
    setSavedMessages(lines);

    setCustomerMessage("");
    setIsEditingMessage(false);
    setEditingIndex(null);
  };

  const handleEditMessage = () => {
    setCustomerMessage(savedMessages.join("\n"));
    setIsEditingMessage(true);
    setEditingIndex(null);
  };

  const handleDeleteCustomer = async () => {
    try {
      const response = await deleteCustomer(customerToDelete);

      if (response.ok) {
        setCustomer(null);
        setIsConfirmModalOpen(false);
        setCustomerToDelete(null);
        showDeleteProfileToast();
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
      showArchiveProfileToast();
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
        const updatedProfile = await profileResponse.json();
        console.log("Perfil atualizado:", updatedProfile);
        setCustomer(updatedProfile);
      }
      setIsEditing(false);
    } else {
      const errorData = await response.json();
      showErrorToast(errorData.message || "Erro ao atualizar o cliente.");
    }
  };


  const openModal = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const updateBillingRecords = (newRecords) => {
    setBillingRecords(newRecords);
  };

  return (
    <div className="container mx-auto px-8 mt-36">
      <div className="flex justify-center items-start gap-4">
        <div className="relative md:w-[calc(47vw)] max-w-[95%] h-[449px] bg-bg1 shadow p-6 border-2 border-cinza6 rounded-[15px] text-F15 mt-4">
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
              onDelete={handleDeleteConfirmation}
              setSelectedPatient={setSelectedPatient}
              openModal={openModal}
              customer={customer}
              onArchive={handleArchviveCustomer}
            />
          )}
          <h2 className="text-F25 font-medium font-['Ubuntu'] mb-4 text-primaria ml-5">
            Conta do paciente
          </h2>
          <div className="">
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
              <p className="mt-4 text-texto1 text-F17 font-normal font-['Open Sans'] tracking-normal ml-16">
                <strong>CPF/CNPJ:</strong>
                <label className="text-texto2 text-F17 font-normal font-['Open Sans'] tracking- ">
                  {" "}
                  {customer.customer_cpf_cnpj || "Não informado"}
                </label>
              </p>
              <p className="mt-2 text-texto1 text-F17 font-normal font-['Open Sans'] tracking-normal ml-16">
                <strong>Idade:</strong>{" "}
                <label className="text-texto2 text-F17 font-normal font-['Open Sans'] tracking-normal">
                  {customer.customer_dob && customer.age
                    ? `${customer.age} anos`
                    : "Não informado"}
                </label>
              </p>
              <p className="mt-2 text-texto1 text-F17 font-normal font-['Open Sans'] tracking-normal ml-16">
                <strong>E-mail:</strong>{" "}
                <label className="text-texto2 text-F17 font-normal font-['Open Sans'] tracking-normal">
                  {customer.customer_email || "Não informado"}{" "}
                </label>
              </p>
              <p className="mt-2 text-texto1 text-17 font-normal font-['Open Sans'] tracking-normal ml-16">
                <strong className="texto">Telefone:</strong>{" "}
                <label className="text-texto2 text-F17 font-normal font-['Open Sans'] tracking-normal">
                  {" "}
                  {customer.customer_phone || "Não informado"}{" "}
                </label>
              </p>
            </div>
            <div className="mt-5 ml-20">
              <h3 className="text-F20 font-bold">Dados para recibo</h3>
              <p className="mt-4 text-texto1 text-F17 ">
                <strong>Nome:</strong>{" "}
                <label className="text-texto2 text-17 font-normal font-['Open Sans'] tracking-normal">
                  {" "}
                  {customer.alternative_name || "Não informado"}{" "}
                </label>
              </p>
              <p className="mt-2 text-texto1 text-F17 font-normal font-['Open Sans'] tracking-normal">
                <strong>CPF/CNPJ:</strong>{" "}
                <label className="text-texto2 text-F17 font-normal font-['Open Sans'] tracking-normal">
                  {" "}
                  {customer.alternative_cpf_cnpj || "Não informado"}{" "}
                </label>
              </p>
            </div>
          </div>
        </div>

        <div
          className=" md:w-[calc(47vw)] max-w-[95%] h-[449px] bg-bg1 shadow p-6 border-2 border-cinza6 rounded-B15 text-F15 mt-4"
          onClick={() => {
            if (!isEditingMessage) {
              setCustomerMessage(savedMessages.join("\n"));
              setIsEditingMessage(true);
              setEditingIndex(null);
            }
          }}
        >
          <h3 className="text-primaria text-F25 font-medium font-['Ubuntu']">
            Anotações
          </h3>

          {isEditingMessage ? (
            <textarea
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveMessage(customerMessage);
                } else if (e.key === "Enter" && e.shiftKey) {
                  e.preventDefault();
                  setCustomerMessage((prevMessage) => `${prevMessage}\n`);
                }
              }}
              className="w-full h-[333px] mt-2 p-3 border  border-cinza6  bg-bg1 rounded-2xl text-F17 font-normal text-texto2"
              placeholder="Clique aqui para adicionar anotações."
              autoFocus
              onBlur={() => {
                setIsEditingMessage(false);
                setCustomerMessage("");
                setEditingIndex(null);
              }}
            />
          ) : (
            <ul className="mt-4 list-disc list-inside text-F17 text-texto1">
              {savedMessages.map((msg, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditMessage(index);
                  }}
                  className="whitespace-pre-wrap"
                >
                  {msg}
                </li>
              ))}
              {savedMessages.length === 0 && (
                <li className="text-texto2 italic">
                  Nenhuma anotação disponível.
                </li>
              )}
            </ul>
          )}
        </div>

        {isEditing && (
          <div className="fixed inset-0 flex justify-center items-start bg-[#82d4e3] backdrop-blur-[6px] z-30 overflow-y-auto">
            <div className="w-full max-w-[90%] md:max-w-[60%] h-auto mt-32 md:ml-64 rounded-[25px] bg-bg1 border-2 border-cinza6 p-8 shadow-lg z-30">
              <CreateCustomerForm
                onClose={handleCancelEdit}
                onSubmit={() => handleEditCustomer(customer)}
                selectedPatient={selectedPatient}
                customer={customer}
                setCustomer={setCustomer}
                isEditing
              />
            </div>
          </div>
        )}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-destaque bg-opacity-30 z-30 backdrop-blur-[6px]">
            <div className="bg-bg1 p-6 rounded-lg w-[335px] h-[228px] border border-cinza6 text-center -translate-y-64 translate-x-32">
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
      {billingRecords && billingRecords.length > 0 ? (
        <PaymentControlCard
          billingRecords={billingRecords}
          customerId={customerId}
          updateBillingRecords={updateBillingRecords}
        />
      ) : (
        <p>Carregando registros de cobrança...</p>
      )}
    </div>
  );
};

export default ProfileCustomerPage;
