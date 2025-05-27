import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DropDownProfile from "./components/DropdownProfilePage";
import CreateCustomerForm from "../CustomerPage/components/CreateCustomerForm";
import {
  ArchiveCustomer,
  createOrUpdateCustomer,
  deleteCustomer,
  fetchCustomerProfile,
} from "../../service/pagesService/pagesService";
import { HamburguerIcon, ArrowBackBlueIcon } from "../../icons/icons";
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
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleFetchCustomerProfile = async () => {
      const response = await fetchCustomerProfile(customerId);
      if (!response.ok) {
        setError("Erro ao buscar o perfil do paciente");
        return;
      }
      const data = await response.json();
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
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      customer_personal_message: updatedCustomer.customer_personal_message,
    }));
    setSavedMessages(lines);

    setIsEditingMessage(false);
    setEditingIndex(null);
  };

  const handleEditMessage = () => {
    setCustomerMessage(savedMessages.join("\n"));
    setIsEditingMessage(true);
    setEditingIndex(null);
  };

  const handleDeleteCustomer = async () => {
    const response = await deleteCustomer(customerToDelete);

    if (response.ok) {
      setCustomer(null);
      setIsConfirmModalOpen(false);
      setCustomerToDelete(null);
      showDeleteProfileToast();
    } else {
      showErrorToast("Erro ao excluir cliente!");
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
    <div className="relative">
      <button
        onClick={() => navigate('/customers')}
        className="fixed z-40 hidden p-0 transition-opacity lg:block top-8 right-8 hover:opacity-80"
        aria-label="Voltar para clientes"
      >
        <ArrowBackBlueIcon />
      </button>

      <div className="container px-8 mx-auto mt-24 ">
        <div className="flex flex-wrap items-start justify-center gap-6 lg:flex-nowrap">
          <div className="relative lg:lg:w-[48%] md:w-[90%] max-w-[95%]  w-[calc(90vw)] lg:h-[449px] h-auto bg-bg1 shadow p-6 lg:border-2 border border-cinza6 rounded-[15px] text-F15 mt-4">
            <button
              onClick={() => toggleDropdown(customer.customer_id)}
              className="absolute top-4 right-4 bg-bg1 hover:bg-bg1"
            >
              <HamburguerIcon />
            </button>
            {activeDropdown === customer.customer_id && (
              <DropDownProfile
                dropdownRef={dropdownRef}
                onClose={() => setActiveDropdown(null)}
                customerId={customer.customer_id}
                onDelete={handleDeleteConfirmation}
                setSelectedPatient={setSelectedPatient}
                openModal={openModal}
                customer={customer}
                onArchive={handleArchviveCustomer}
              />
            )}
            <h2 className="mb-4 text-sm font-medium lg:text-F25 text-primaria lg:ml-5">
              Conta do paciente
            </h2>
            <div>
              <div className="lg:ml-5">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-primaria text-F20">
                    {customer?.customer_name?.charAt(0)}
                  </div>
                  <h3 className="mt-1 font-bold leading-tight text-texto1 text-F17">
                    {customer.customer_name} {customer.customer_second_name}
                  </h3>
                </div>

                <div className="mt-3 ml-2 lg:ml-14">
                  <p className="mt-1 text-texto1 text-F15">
                    <strong>CPF/CNPJ:</strong>{" "}
                    <span className="text-texto2">{customer.customer_cpf_cnpj || "Não informado"}</span>
                  </p>
                  <p className="mt-1 text-texto1 text-F15">
                    <strong>Idade:</strong>{" "}
                    <span className="text-texto2">
                      {customer.customer_dob && customer.age
                        ? `${customer.age} anos`
                        : "Não informado"}
                    </span>
                  </p>
                  <p className="mt-1 text-texto1 text-F15">
                    <strong>E-mail:</strong>{" "}
                    <span className="text-texto2">{customer.customer_email || "Não informado"}</span>
                  </p>
                  <p className="mt-1 text-texto1 text-F15">
                    <strong>Telefone:</strong>{" "}
                    <span className="text-texto2">{customer.customer_phone || "Não informado"}</span>
                  </p>
                </div>

                <div className="mt-6 ml-2 lg:ml-14">
                  <h3 className="font-bold text-F17">Dados para recibo</h3>
                  <p className="mt-3 text-texto1 text-F15">
                    <strong>Nome:</strong>{" "}
                    <span className="text-texto2">
                      {customer.alternative_name || "Não informado"}
                    </span>
                  </p>
                  <p className="mt-1 text-texto1 text-F15">
                    <strong>CPF/CNPJ:</strong>{" "}
                    <span className="text-texto2">
                      {customer.alternative_cpf_cnpj || "Não informado"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative lg:lg:w-[48%] md:w-[90%] mx-auto px-4 max-w-[95%] w-[calc(90vw)] lg:h-[449px] h-auto bg-bg1 shadow p-6 lg:border-2 border border-cinza6 rounded-B15 text-F15 lg:mt-4 overflow-auto"
            onClick={() => {
              if (!isEditingMessage) {
                setCustomerMessage(savedMessages.join("\n"));
                setIsEditingMessage(true);
                setEditingIndex(null);
              }
            }}
          >
            <h3 className="text-primaria lg:text-F25 text-sm font-medium font-['Ubuntu']">
              Anotações
            </h3>

            {isEditingMessage ? (
              <textarea
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setCustomerMessage((prevMessage) => `${prevMessage}\n`);
                  }
                }}
                className="w-full h-[304px] mt-2 p-3 border  border-cinza6  bg-bg1 rounded-2xl lg:text-F17 text-xs font-normal text-texto2"
                placeholder="Clique aqui para adicionar anotações."
                autoFocus
                onBlur={(e) => {
                  if (!e.relatedTarget || e.relatedTarget.id !== "salvar-btn") {
                    setIsEditingMessage(false);
                    setCustomerMessage("");
                    setEditingIndex(null);
                  }
                }}
              />
            ) : (
              <ul className="mt-4 text-sm list-disc list-inside lg:text-F17 text-texto1">
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
                  <li className="italic text-texto2">
                    Nenhuma anotação disponível.
                  </li>
                )}
              </ul>
            )}
            {isEditingMessage && (
              <button
                id="salvar-btn"
                type="submit"
                className="flex justify-end items-start lg:h-[39px] px-6 py-2.5 bg-primaria rounded-[100px] text-white text-sm font-semibold mt-2 ml-auto"
                onClick={() => {
                  handleSaveMessage(customerMessage);
                  setIsEditingMessage(false);
                }}
              >
                Salvar
              </button>
            )}
          </div>

          {isEditing && (
            <div className="fixed inset-0 flex justify-center items-start bg-[#33b8d1]/30 backdrop-blur-[6px] z-30 overflow-y-auto">
              <div className="w-full max-w-[90%] lg:max-w-[60%] h-auto mt-32 mb-8 lg:ml-64 rounded-[25px] bg-bg1 border-2 border-cinza6 p-8 shadow-lg z-30">
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
                <p className="mb-4 text-lg font-semibold text-texto2">
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
    </div>
  );
};

export default ProfileCustomerPage;