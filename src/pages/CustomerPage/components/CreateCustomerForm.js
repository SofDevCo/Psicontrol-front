import React, { useState, useEffect } from "react";
import { registerLocale } from "react-datepicker";
import {
  formatDateBrazilian,
  parseISODate,
  isValidDate,
} from "../../../utils/DateOfBirth/dateOfBirth";
import { ptBR } from "date-fns/locale";
import { Trash } from "../../../icons/icons";
import { AddIcon, CloseIconRegisterModal, ArrowIcon } from "./IconsRegisterCard";
import "../../../index.css";
import { showErrorToast } from "../../../utils/notification/toastify";
import { showEditToast } from "../components/notiificationCustomerPage";
import "react-toastify/dist/ReactToastify.css";
import EditConsultationFeeModal from "./EditConsultationFeeModal";
import {
  createOrUpdateCustomer,
  fetchUnmatchedPatients,
} from "../../../service/pagesService/pagesService";
import { showSuccessToast, showLoadingToast } from "../components/notiificationCustomerPage";

registerLocale(ptBR);

const CreateCustomerForm = ({
  onClose,
  onSubmit,
  selectedPatient,
  customer,
  setCustomer,
  isEditing,
}) => {
  const [additionalAlternatives, setAdditionalAlternatives] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [originalConsultationFee, setOriginalConsultationFee] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [unmatchedPatients, setUnmatchedPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [clickedOnArrow, setClickedOnArrow] = useState(false);

  useEffect(() => {
    if (isEditing && selectedPatient && selectedPatient.customer_dob) {
      const parsedDate = parseISODate(selectedPatient.customer_dob);
      setStartDate(parsedDate);
      setCustomer((prev) => ({
        ...prev,
        ...selectedPatient,
        customer_dob: formatDateBrazilian(parsedDate),
      }));
    }
  }, [isEditing, selectedPatient, setCustomer]);

  useEffect(() => {
    if (isEditing && selectedPatient) {
      setOriginalConsultationFee(selectedPatient.consultation_fee || "");
    }
  }, [isEditing, selectedPatient]);

  useEffect(() => {
    const handleFetchUnmatchedPatients = async () => {
      const response = await fetchUnmatchedPatients();

      if (response) {
        setUnmatchedPatients(response);
      }
    };

    handleFetchUnmatchedPatients();
  }, []);

  
  useEffect(() => {
    
    if (!customer.customer_calendar_name) {
      setActiveField(null);
      setFilteredPatients([]);
    }
  }, [customer.customer_calendar_name]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    setCustomer((prev) => ({
      ...prev,
      customer_calendar_name: value,
    }));

    if (validationErrors.customer_calendar_name && value) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated.customer_calendar_name;
        return updated;
      });
    }

    setActiveField("customer_calendar_name");

    if (value) {
      const filtered = unmatchedPatients.filter((patient) =>
        patient.event_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(unmatchedPatients);
    }
  };

  const isConsultationFeeChanged = () => {
    const formattedOriginal = parseFloat(
      originalConsultationFee || "0"
    ).toFixed(2);
    const formattedCurrent = parseFloat(
      customer.consultation_fee || "0"
    ).toFixed(2);
    return formattedOriginal !== formattedCurrent;
  };

  const handleManualDateChange = (value) => {
    let formattedValue = value.replace(/\D/g, "");

    if (formattedValue.length === 0) {
      setCustomer((prevState) => ({
        ...prevState,
        customer_dob: "",
      }));
      return;
    }

    if (formattedValue.length > 2 && formattedValue.length <= 4) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
    } else if (formattedValue.length > 4) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}/${formattedValue.slice(4, 8)}`;
    }

    setCustomer((prevState) => ({
      ...prevState,
      customer_dob: formattedValue,
    }));

    if (formattedValue.length === 10) {
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;

      if (regex.test(formattedValue)) {
        const [day, month, year] = formattedValue.split("/").map(Number);
        const date = new Date(year, month - 1, day);

        if (year < 1900 || year > new Date().getFullYear()) {
          showErrorToast("Data inválida");
          return;
        }

        if (
          isValidDate(date) &&
          date.getDate() === day &&
          date.getMonth() === month - 1 &&
          date.getFullYear() === year
        ) {
          setStartDate(date);
        } else {
          showErrorToast("Data inválida! Verifique se a data existe.");
        }
      } else {
        showErrorToast("Data inválida! Use o formato DD/MM/AAAA.");
      }
    }
  };

  const handleUsePatientData = () => {
    setCustomer((prev) => ({
      ...prev,
      alternative_name: prev.customer_name,
      alternative_cpf_cnpj: prev.customer_cpf_cnpj,
    }));
  };

  const handleAddAlternativeFields = () => {
    if (additionalAlternatives.length < 2) {
      setAdditionalAlternatives((prev) => [
        ...prev,
        { alternative_name: "", alternative_cpf_cnpj: "" },
      ]);
    }
  };

  const handleAlternativeChange = (index, name, value) => {
    const updatedAlternatives = additionalAlternatives.map((alt, i) =>
      i === index ? { ...alt, [name]: value } : alt
    );
    setAdditionalAlternatives(updatedAlternatives);
  };

  const handleDeleteAlternativeCPF = (index) => {
    const updatedAlternatives = additionalAlternatives.filter(
      (_, i) => i !== index
    );
    setAdditionalAlternatives(updatedAlternatives);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (validationErrors[name] && value) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    setCustomer((prevState) => {
      if (name === "consultation_fee") {
        let formattedValue = value.replace(/[^0-9]/g, "");

        if (formattedValue.length > 0) {
          formattedValue = (parseFloat(formattedValue) / 100).toFixed(2);
        }

        return {
          ...prevState,
          [name]: formattedValue,
        };
      }

      return {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!customer.customer_name) errors.customer_name = true;
    if (!customer.customer_calendar_name) errors.customer_calendar_name = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      showErrorToast("Preencha os campos obrigatórios!");
      return;
    }

    if (
      startDate &&
      (isNaN(new Date(startDate)) ||
        startDate.getFullYear() < 1900 ||
        startDate.getFullYear() > new Date().getFullYear())
    ) {
      showErrorToast("Data de nascimento inválida");
      return;
    }

    if (isEditing && isConsultationFeeChanged()) {
      setIsConfirmModalOpen(true);
      return;
    }


    const loading = showLoadingToast();

    try {

      const response = await createOrUpdateCustomer(
        {
          ...customer,
          consultation_fee: customer.consultation_fee,
          update_from: "current_month",
          additionalAlternatives,
        },
        [],
        customer.customer_id
      );

      const data = await response.json();


      setCustomer({
        customer_name: "",
        customer_second_name: "",
        customer_calendar_name: "",
        customer_cpf_cnpj: "",
        customer_phone: "",
        customer_email: "",
        consultation_fee: "",
        patient_status: true,
        alternative_name: "",
        alternative_cpf_cnpj: "",
        customer_dob: "",
        customer_emergency_contact: "",
        customer_emergency_name: "",
        customer_emergency_relationship: "",
        customer_personal_message: "",
      });

      setAdditionalAlternatives([]);
      setStartDate(null);
      setFilteredPatients([]);
      setActiveField(null);
      setInputValue("");
      setClickedOnArrow(false);


      if (data.error || !response.ok) {

        loading.closeToast();
        showErrorToast(data.message || "Erro ao processar a solicitação!");
        return;
      }
      const updatedUnmatchedPatients = unmatchedPatients.filter(
        (patient) => patient.event_name.toLowerCase() !== customer.customer_calendar_name.toLowerCase()
      );
      setUnmatchedPatients(updatedUnmatchedPatients);

      setTimeout(() => {

        loading.closeToast();

        onSubmit();

        if (customer.customer_id) {
          showEditToast();
        } else {
          showSuccessToast();
        }
      }, 3000);
    } catch (error) {

      loading.closeToast();
      showErrorToast("Erro ao processar a solicitação!");
    }

  };

  const handleConfirmSubmit = async (updateOption) => {
    setIsConfirmModalOpen(false);

    const loading = showLoadingToast();

    try {
      const response = await createOrUpdateCustomer(
        {
          ...customer,
          consultation_fee: customer.consultation_fee,
          update_from: updateOption,
          additionalAlternatives,
        },
        [],
        customer.customer_id
      );

      const data = await response.json();

      setCustomer({
        customer_name: "",
        customer_second_name: "",
        customer_calendar_name: "",
        customer_cpf_cnpj: "",
        customer_phone: "",
        customer_email: "",
        consultation_fee: "",
        patient_status: true,
        alternative_name: "",
        alternative_cpf_cnpj: "",
        customer_dob: "",
        customer_emergency_contact: "",
        customer_emergency_name: "",
        customer_emergency_relationship: "",
        customer_personal_message: "",
      });

      setAdditionalAlternatives([]);
      setStartDate(null);
      setFilteredPatients([]);
      setActiveField(null);
      setInputValue("");
      setClickedOnArrow(false);

      if (data.error || !response.ok) {

        loading.closeToast();
        showErrorToast(data.message || "Erro ao processar a solicitação!");
        return;
      }

      const updatedUnmatchedPatients = unmatchedPatients.filter(
        (patient) => patient.event_name.toLowerCase() !== customer.customer_calendar_name.toLowerCase()
      );
      setUnmatchedPatients(updatedUnmatchedPatients);
      setTimeout(() => {

        loading.closeToast();

        onSubmit();

        if (customer.customer_id) {
          showEditToast();
        } else {
          showSuccessToast();
        }
      }, 3000);
    } catch (error) {

      loading.closeToast();
      showErrorToast("Erro ao processar a solicitação!");
    }
  };

  useEffect(() => {
    if (customer.customer_name && validationErrors.customer_name) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated.customer_name;
        return updated;
      });
    }

    if (customer.customer_calendar_name && validationErrors.customer_calendar_name) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated.customer_calendar_name;
        return updated;
      });
    }
  }, [customer.customer_name, customer.customer_calendar_name, validationErrors]);

  useEffect(() => {
    const handleEnterKey = (e) => {
      if (e.key === "Enter") {
        const tag = e.target.tagName.toLowerCase();
        const isInputOrTextarea = tag === "input" || tag === "textarea";

        if (isInputOrTextarea) {
          e.preventDefault();
          const submitBtn = document.getElementById("submit-customer-form");
          if (submitBtn) submitBtn.click();
        }
      }
    };

    document.addEventListener("keydown", handleEnterKey);
    return () => {
      document.removeEventListener("keydown", handleEnterKey);
    };
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-2 w-full max-w-[1200px] mx-auto">
      <form
        onSubmit={handleSubmit}
        className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm lg:text-[25px] font-medium font-ubuntu text-primaria">
                {isEditing ? "Editar Paciente" : "Adicionar Paciente"}
              </h2>
              <button
                onClick={onClose}
                className="block lg:hidden text-primaria"
              >
                <CloseIconRegisterModal />
              </button>
            </div>

            <span className="block mt-1 ml-1 text-sm lg:text-base">
              <span className="font-bold text-red-500">*</span> Campos obrigatórios
            </span>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 lg:ml-3 ml-2 block text-xs lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nome{" "}
                  <span className="font-bold text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={customer.customer_name || ""}
                  onChange={handleChange}
                  placeholder="Nome do paciente"
                  className={`w-full h-[50px] bg-bg1 rounded-[15px] border-2 ${validationErrors.customer_name ? "border-red-500" : "border-cinza6"
                    } px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring`}
                />
              </div>

              <div>
                <label className="mb-1 ml-3 block text-xs lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Sobrenome
                </label>
                <input
                  type="text"
                  name="customer_second_name"
                  value={customer.customer_second_name || ""}
                  onChange={handleChange}
                  placeholder="Sobrenome do paciente"
                  className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1">
                  <label className="mb-1 ml-3 block text-xs lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1 whitespace-nowrap">
                    Nome do Evento (Google Agenda){" "}
                    <span className="font-bold text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="customer_calendar_name"
                      value={customer.customer_calendar_name || ""}
                      onChange={handleInputChange}
                      onFocus={() => {
                        if (validationErrors.customer_calendar_name) {
                          setValidationErrors(prev => {
                            const updated = { ...prev };
                            delete updated.customer_calendar_name;
                            return updated;
                          });
                        }
                      }}
                      onBlur={() => {
                        if (!clickedOnArrow) {
                          setTimeout(() => setActiveField(null));
                        }
                      }}
                      autoComplete="off"
                      placeholder="Nome do evento"
                      className={`relative w-full h-[50px] bg-bg1 rounded-[15px] border-2 ${validationErrors.customer_calendar_name && !customer.customer_calendar_name
                        ? "border-red-500"
                        : "border-cinza6"
                        } px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:outline-none focus:border-cinza6 placeholder:text-sm lg:placeholder:text-base z-10`}
                    />
                    <div
                      className="absolute right-4 top-1/2 transform -translate-y-[30%] cursor-pointer z-20"
                      onMouseDown={(e) => {

                        e.preventDefault();
                        setClickedOnArrow(true);

                        if (activeField === "customer_calendar_name") {
                          setActiveField(null);
                          setFilteredPatients([]);
                        } else {
                          setActiveField("customer_calendar_name");

                          fetchUnmatchedPatients().then(response => {
                            if (response) {
                              setUnmatchedPatients(response);

                              if (customer.customer_calendar_name) {
                                const filtered = response.filter((patient) =>
                                  patient.event_name.toLowerCase().includes(customer.customer_calendar_name.toLowerCase())
                                );
                                setFilteredPatients(filtered);
                              } else {
                                setFilteredPatients(response);
                              }
                            }
                          });
                        }

                        setTimeout(() => {
                          setClickedOnArrow(false);
                        }, 500);
                      }}
                    >
                      <div className={`transform transition-transform duration-300 ${activeField === "customer_calendar_name" ? "rotate-180" : ""}`}>
                        <ArrowIcon />
                      </div>
                    </div>
                  </div>
                  {activeField === "customer_calendar_name" && (
                    <ul className="absolute w-full mt-1 border-2 border-cinza6 rounded-[15px] bg-bg1 z-30 max-h-[200px] overflow-y-auto shadow-md">
                      {filteredPatients.length > 0 ? (
                        filteredPatients
                          .sort((a, b) => a.event_name.localeCompare(b.event_name))
                          .map((patient) => (
                            <li
                              key={patient.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setClickedOnArrow(true);

                                setCustomer((prev) => ({
                                  ...prev,
                                  customer_calendar_name: patient.event_name,
                                }));

                                setInputValue(patient.event_name);
                                setActiveField(null);
                                setFilteredPatients([]);

                                setTimeout(() => {
                                  setClickedOnArrow(false);
                                }, 300);
                              }}
                              className="p-3 text-sm font-bold tracking-tight border-b cursor-pointer hover:bg-bgM border-b-cinza6 text-texto2"
                            >
                              {patient.event_name}
                            </li>
                          ))
                      ) : (
                        <li className="p-3 text-sm text-center text-texto2">
                          Nenhum paciente encontrado
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="flex-1">
                  <label className="mb-1 ml-2 block text-xs lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                    Nascimento
                  </label>
                  <input
                    type="text"
                    value={customer.customer_dob || ""}
                    onChange={(e) => handleManualDateChange(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring placeholder:text-sm lg:placeholder:text-base "
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 ml-3 block  text-xs lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                CPF/CNPJ
              </label>
              <input
                type="text"
                name="customer_cpf_cnpj"
                value={customer.customer_cpf_cnpj || ""}
                onChange={handleChange}
                placeholder="XXX.XXX.XXX-XX"
                pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
                title="Insira um CPF válido com 11 dígitos. Exemplo: 123.456.789-00"
                className={`w-full h-[50px] bg-bg1 rounded-[15px] border-2 ${validationErrors.customer_cpf_cnpj ? "border-red-500" : "border-cinza6"} px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring`}
              />
            </div>

            <div>
              <label className="mb-1 ml-3  block text-xs lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                Email
              </label>
              <input
                type="email"
                name="customer_email"
                value={customer.customer_email || ""}
                onChange={handleChange}
                placeholder="e-mail.paciente@gmail.com"
                className="h-[50px] w-full bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium focus:border-cinza6/50 focus:outline-none focus:ring"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 lg:w-[213px]">
                <label className="mb-1 ml-3 block text-xs lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={customer.customer_phone || ""}
                  onChange={handleChange}
                  placeholder="(11) 91234-5678"
                  pattern="\(?\d{2}\)?\s?\d{5}-?\d{4}"
                  title="Insira um telefone válido com DDD. Exemplo: (11) 91234-5678"
                  className={`w-full h-[50px] bg-bg1 rounded-[15px] border-2 ${validationErrors.customer_phone ? "border-red-500" : "border-cinza6"} px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring`}
                />

              </div>
              <div className="w-full lg:w-[181px]">
                <label className="mb-1 ml-3 block text-xs lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute transform -translate-y-1/2 left-4 top-1/2 text-texto2/50">
                    R$
                  </span>
                  <input
                    type="text"
                    step="0.01"
                    name="consultation_fee"
                    value={customer.consultation_fee || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="pl-10 w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-sm font-medium text-primaria lg:text-2xl font-ubuntu">
              Contato de Emergência
            </h2>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="mb-1 ml-3 block text-sm lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nome
                </label>
                <input
                  type="text"
                  name="customer_emergency_name"
                  value={customer.customer_emergency_name || ""}
                  onChange={handleChange}
                  placeholder="Nome do contato"
                  className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-1 gap-2 sm:flex-row sm:gap-4 sm:items-start">
                <div className="flex-1">
                  <label className="mb-1 ml-3 block text-sm lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                    Vinculo
                  </label>
                  <input
                    type="text"
                    name="customer_emergency_relationship"
                    value={customer.customer_emergency_relationship || ""}
                    onChange={handleChange}
                    placeholder="Vinculo"
                    className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 ml-3 block text-sm lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="customer_emergency_contact"
                    value={customer.customer_emergency_contact || ""}
                    onChange={handleChange}
                    placeholder="(00) 0 0000-0000"
                    className="w-full  h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full space-y-4 lg:-space-y-1 lg:-mt-5">
          <div className="flex  items-center  max-w-[600px] 2xl:gap-4">
            <h3 className="text-primaria text-sm lg:text-[25px] lg:mt-0 mt-4 font-medium font-ubuntu ">
              Dados para Recibo
            </h3>
            <button
              type="button"
              onClick={handleUsePatientData}
              className="hidden lg:block w-[181px] h-[58px] px-4 border-2 border-primaria bg-bg1 hover:bg-bg1 rounded-[10px] text-center text-primaria text-sm font-medium font-ubuntu tracking-tight whitespace-nowrap"
            >
              Usar dados do <br /> paciente
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-full lg:w-[418px]">
                <label className="mb-1 ml-3 block text-sm lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nome
                </label>
                <input
                  type="text"
                  name="alternative_name"
                  value={customer.alternative_name || ""}
                  onChange={handleChange}
                  placeholder="Nome"
                  className="h-[50px] w-full max-w-[414px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  disabled={customer.patient_status}
                />
              </div>
            </div>

            <div className="relative">
              <label className="mb-1 ml-3 block text-sm lg:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                CPF/CNPJ
              </label>
              <div className="max-w-[151px] lg:max-w-[212px]">
                <input
                  type="text"
                  name="alternative_cpf_cnpj"
                  value={customer.alternative_cpf_cnpj || ""}
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/0001-XX."
                  className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2  placeholder:text-texto2/50 placeholder:font-light text-black font-medium shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />

                <button
                  type="button"
                  onClick={handleDeleteAlternativeCPF}
                  className="flex items-center justify-center p-1 ml-2 bg-bg1 hover:bg-bg1"
                ></button>
              </div>
              {additionalAlternatives.length < 1 && (
                <button
                  type="button"
                  className="group h-4 justify-center items-start gap-2 mt-5 inline-flex  text-[#0082ba] hover:text-primaria/50 bg-bg1 hover:bg-bg1 text-sm font-medium font-ubuntu tracking-tight underline"
                  onClick={handleAddAlternativeFields}
                >
                  <AddIcon />
                  Adicionar item
                </button>
              )}
            </div>

            {additionalAlternatives.map((alternative, index) => (
              <div key={index}>
                <div className="flex items-start w-full gap-4">
                  <div className="w-full">
                    <label className="mb-1.5 mt-1.5 ml-3 flex font-normal font-['Open Sans'] tracking-wide text-texto1">
                      Nome Alternativo {index + 1}
                    </label>
                    <input
                      type="text"
                      name="alternative_name"
                      value={alternative.alternative_name || ""}
                      onChange={(e) =>
                        handleAlternativeChange(
                          index,
                          "alternative_name",
                          e.target.value
                        )
                      }
                      placeholder={`Nome Alternativo ${index + 1}`}
                      className="h-[50px] w-full bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                      disabled={customer.patient_status}
                    />
                  </div>
                </div>

                <div className="rleative w-[212px]">
                  <label className="mb-1.5 mt-4 ml-3 flex font-normal font-['Open Sans'] tracking-wide text-texto1">
                    CPF Alternativo {index + 1}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="alternative_cpf"
                      value={alternative.alternative_cpf_cnpj || ""}
                      onChange={(e) =>
                        handleAlternativeChange(
                          index,
                          "alternative_cpf",
                          e.target.value
                        )
                      }
                      placeholder={`CPF/CNPJ Alternativo ${index + 1}`}
                      className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                      disabled={customer.patient_status}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteAlternativeCPF(index)}
                      className="absolute items-center justify-center p-1 ml-2 bg-bg1 hover:bg-bg1"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end mt-6 2xl:items-start 2xl:ml-40">
            <div className="flex gap-4 lg:mt-[600px] mt-6">
              <button
                type="button"
                className="hidden lg:table-cell h-[39px] px-6 py-2.5 bg-bg1 hover:bg-bg1 rounded-[100px] border border-primaria text-primaria text-sm font-semibold"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                id="submit-customer-form"
                className="lg:h-[39px] px-6 py-2.5 bg-primaria rounded-[100px] text-white text-sm font-semibold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </form>
      <EditConsultationFeeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
};

export default CreateCustomerForm;
