import React, { useState, useEffect } from "react";
import { registerLocale } from "react-datepicker";
import {
  formatDateBrazilian,
  parseISODate,
  formatDateIso,
  isValidDate,
} from "../../../utils/DateOfBirth/dateOfBirth";
import { ptBR } from "date-fns/locale";
import { Trash } from "../../../icons/icons";
import { AddIcon, CloseIconRegisterModal } from "./IconsRegisterCard";
import "../../../index.css";
import { showErrorToast } from "../../../utils/notification/toastify";
import { showEditToast } from "../components/notiificationCustomerPage";
import "react-toastify/dist/ReactToastify.css";
import { createOrUpdateCustomer } from "../../../service/pagesService/pagesService";
import { showSuccessToast } from "../components/notiificationCustomerPage";

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
  const [startDate, setStartDate] = useState(null);

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

    if (
      startDate &&
      (isNaN(new Date(startDate)) ||
        startDate.getFullYear() < 1900 ||
        startDate.getFullYear() > new Date().getFullYear())
    ) {
      showErrorToast("Data de nascimento inválida");
      return;
    }

    const formattedCustomer = {
      ...customer,
      customer_dob: startDate ? formatDateIso(startDate) : "",
    };

    try {
      const response = await createOrUpdateCustomer(
        customer,
        additionalAlternatives,
        customer.customer_id
      );
      const data = await response.json();

      if (response.ok) {
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
        onSubmit();
        onClose();

        if (customer.customer_id) {
          showEditToast();
        } else {
          showSuccessToast();
        }

        setStartDate(null);
      } else {
        showErrorToast(data.message || "Erro ao processar a solicitação!");
      }
    } catch (error) {
      showErrorToast("Erro ao processar a solicitação!");
    }
  };

  return (
    <div className=" space-y-2 p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full"
      >
        <div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm md:text-[25px] font-medium font-ubuntu text-primaria">
                Adicionar Paciente
              </h2>
              <button
                onClick={onClose}
                className="block md:hidden text-primaria"
              >
                <CloseIconRegisterModal />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 md:ml-3 ml-2 block  text-xs md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nome
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={customer.customer_name || ""}
                  onChange={handleChange}
                  placeholder="Nome do paciente"
                  required
                  className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label className="mb-1 ml-3 block text-xs md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Sobronome
                </label>
                <input
                  type="text"
                  name="customer_second_name"
                  value={customer.customer_second_name || ""}
                  onChange={handleChange}
                  placeholder="Sobrenome do paciente"
                  className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1">
                  <label className="mb-1 ml-3 block text-xs md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1 whitespace-nowrap">
                    ID Paciente - Google Agenda
                  </label>
                  <input
                    type="text"
                    name="customer_calendar_name"
                    value={customer.customer_calendar_name || ""}
                    onChange={handleChange}
                    required
                    placeholder="Google Agenda"
                    className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring placeholder:text-sm md:placeholder:text-base"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 ml-2 block text-xs md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                    Nascimento
                  </label>
                  <input
                    type="text"
                    value={customer.customer_dob || ""}
                    onChange={(e) => handleManualDateChange(e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring placeholder:text-sm md:placeholder:text-base "
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 ml-3 block  text-xs md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                CPF/CNPJ
              </label>
              <input
                type="text"
                name="customer_cpf_cnpj"
                value={customer.customer_cpf_cnpj || ""}
                onChange={handleChange}
                placeholder="XX.XXX.XXX/0001-XX"
                className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="mb-1 ml-3  block text-xs md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                Email
              </label>
              <input
                type="email"
                name="customer_email"
                value={customer.customer_email || ""}
                onChange={handleChange}
                placeholder="e-mail.paciente@gmail.com"
                className="h-[50px] w-full bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 md:w-[213px]">
                <label className="mb-1 ml-3 block text-xs md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Telefone
                </label>
                <input
                  type="text"
                  name="customer_phone"
                  value={customer.customer_phone || ""}
                  onChange={handleChange}
                  placeholder="(00) 0 0000-0000"
                  className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>
              <div className="w-full md:w-[181px]">
                <label className="mb-1 ml-3 block text-xs md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-texto2/50">
                    R$
                  </span>
                  <input
                    type="text"
                    step="0.01"
                    name="consultation_fee"
                    value={customer.consultation_fee || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="pl-10 w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-primaria  md:text-2xl text-sm font-medium font-ubuntu">
              Contato de Emergência
            </h2>
            <div className="flex flex-col sm:gap-4 gap-3">
              <div className="flex-1">
                <label className="mb-1 ml-3 block text-sm md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nome
                </label>
                <input
                  type="text"
                  name="customer_emergency_name"
                  value={customer.customer_emergency_name || ""}
                  onChange={handleChange}
                  placeholder="Nome do contato"
                  className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>
              <div className="flex flex-1 sm:flex-row sm:gap-4 sm:items-start gap-2">
                <div className="flex-1">
                  <label className="mb-1 ml-3 block text-sm md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                    Vinculo
                  </label>
                  <input
                    type="text"
                    name="customer_emergency_relationship"
                    value={customer.customer_emergency_relationship || ""}
                    onChange={handleChange}
                    placeholder="Vinculo"
                    className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 ml-3 block text-sm md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="customer_emergency_contact"
                    value={customer.customer_emergency_contact || ""}
                    onChange={handleChange}
                    placeholder="(00) 0 0000-0000"
                    className="w-full  h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:-space-y-1 space-y-4 md:-mt-5 h-full">
          <div className="flex  items-center  max-w-[600px] 2xl:gap-4">
            <h3 className="text-primaria text-sm md:text-[25px] md:mt-0 mt-4 font-medium font-ubuntu ">
              Dados para Recibo
            </h3>
            <button
              type="button"
              onClick={handleUsePatientData}
              className="hidden md:block w-[181px] h-[58px] px-4 border-2 border-primaria bg-bg1 hover:bg-bg1 rounded-[10px] text-center text-primaria text-sm font-medium font-ubuntu tracking-tight whitespace-nowrap"
            >
              Usar dados do <br /> paciente
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-full md:w-[418px]">
                <label className="mb-1 ml-3 block text-sm md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nome
                </label>
                <input
                  type="text"
                  name="alternative_name"
                  value={customer.alternative_name || ""}
                  onChange={handleChange}
                  placeholder="Nome do Paciente"
                  className="h-[50px] w-full max-w-[414px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  disabled={customer.patient_status}
                />
              </div>
            </div>

            <div className="relative">
              <label className="mb-1 ml-3 block text-sm md:text-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                CPF/CNPJ
              </label>
              <div className="max-w-[151px] md:max-w-[212px]">
                <input
                  type="text"
                  name="alternative_cpf_cnpj"
                  value={customer.alternative_cpf_cnpj || ""}
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/0001-XX."
                  className="w-full h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />

                <button
                  type="button"
                  onClick={handleDeleteAlternativeCPF}
                  className="ml-2 flex items-center justify-center bg-bg1 p-1 hover:bg-bg1"
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
                <div className="flex gap-4 items-start w-full">
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
                      className="absolute ml-2 p-1 items-center justify-center  bg-bg1 hover:bg-bg1"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end 2xl:items-start 2xl:ml-40  mt-6">
            <div className="flex gap-4 md:mt-[600px] mt-6">
              <button
                type="button"
                className="hidden md:table-cell h-[39px] px-6 py-2.5 bg-bg1 hover:bg-bg1 rounded-[100px] border border-primaria text-primaria text-sm font-semibold"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="md:h-[39px] px-6 py-2.5 bg-primaria rounded-[100px] text-white text-sm font-semibold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerForm;
