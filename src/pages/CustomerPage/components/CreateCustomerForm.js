import React, { useState, useEffect} from "react";
import { registerLocale } from "react-datepicker";
import {
  formatDateBrazilian,
  parseISODate,
  formatDateIso,
} from "../../../utils/DateOfBirth/dateOfBirth";
import { ptBR } from "date-fns/locale";
import { AddIcon, Trash } from "../../../icons/icons";
import "../../../index.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../utils/notification/toastify";
import "react-toastify/dist/ReactToastify.css";

registerLocale(ptBR);

const CreateCustomerForm = ({
  onClose,
  onSubmit,
  selectedPatient,
  customer,
  setCustomer,
}) => {
  const [additionalAlternatives, setAdditionalAlternatives] = useState([]);
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    if (selectedPatient && selectedPatient.customer_dob) {
      const parsedDate = parseISODate(selectedPatient.customer_dob);
      setStartDate(parsedDate);
      setCustomer((prev) => ({
        ...prev,
        ...selectedPatient,
        customer_dob: formatDateBrazilian(parsedDate),
      }));
    }
  }, [selectedPatient, setCustomer]);


  const handleManualDateChange = (value) => {
    let formattedValue = value.replace(/\D/g, "");
  
    if (formattedValue.length >= 2) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
    }
    if (formattedValue.length >= 5) {
      formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5, 9)}`;
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
  
        if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
          setStartDate(date); 
        } else {
          showErrorToast("Data inválida! Verifique se a data existe.");
        }
      } else {
        showErrorToast("Data inválida! Use o formato DD/MM/AAAA.");
      }
    }
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
    setCustomer((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedCustomer = {
      ...customer,
      customer_dob: startDate ? formatDateIso(startDate) : "", 
    };

    const url = customer.customer_id
      ? `http://localhost:3000/events/customers/${customer.customer_id}`
      : `http://localhost:3000/events/create-customer`;

    const method = customer.customer_id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...customer, additionalAlternatives }),
      });
      const data = await response.json();

      if (response.ok) {
        setCustomer({
          customer_name: "",
          customer_cpf_cnpj: "",
          customer_phone: "",
          customer_email: "",
          consultation_fee: "",
          patient_status: true,
          alternative_name: "",
          alternative_cpf_cnpj: "",
          customer_dob: "",
        });
        setAdditionalAlternatives([]);
        onSubmit();
        onClose();
        showSuccessToast();
      } else {
        showErrorToast(data.message || "Erro ao processar a solicitação!");
      }
    } catch (error) {
      showErrorToast("Erro ao processar a solicitação!");
    }
  };

  return (
    <div className="max-w space-y-4 p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full"
      >
        <div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div>
                <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nome
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={customer.customer_name || ""}
                  onChange={handleChange}
                  placeholder="Nome do paciente"
                  required
                  className="w-[262px] h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nascimento
                </label>
                <input
                  type="text"
                  value={customer.customer_dob || ""}
                  onChange={(e) => handleManualDateChange(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-[131px] h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                Email
              </label>
              <input
                type="email"
                name="customer_email"
                value={customer.customer_email || ""}
                onChange={handleChange}
                placeholder="e-mail.paciente@gmail.com"
                className="h-[50px] w-[418px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
              />
            </div>

            <div className="flex gap-4">
              <div>
                <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Telefone
                </label>
                <input
                  type="text"
                  name="customer_phone"
                  value={customer.customer_phone || ""}
                  onChange={handleChange}
                  placeholder="(00) 0 0000-0000"
                  className="w-[181px] h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  name="customer_cpf_cnpj"
                  value={customer.customer_cpf_cnpj || ""}
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/0001-XX"
                  className="w-[212px] h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                Valor
              </label>
              <input
                type="number"
                step="0.01"
                name="consultation_fee"
                value={customer.consultation_fee || ""}
                onChange={handleChange}
                placeholder="R$ 000,00"
                className="w-[181px] h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                Nome
              </label>
              <input
                type="text"
                name="alternative_name"
                value={customer.alternative_name || ""}
                onChange={handleChange}
                placeholder="Nome do Paciente"
                className="h-[50px] w-[418px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                disabled={customer.patient_status}
              />
            </div>

            <div className="relative">
              <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                CPF/CNPJ
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="alternative_cpf_cnpj"
                  value={customer.alternative_cpf_cnpj || ""}
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/0001-XX."
                  className="w-[212px] h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  disabled={customer.patient_status}
                />

                <button
                  type="button"
                  onClick={handleDeleteAlternativeCPF}
                  className="ml-2 flex items-center justify-center bg-bg1 p-1 hover:bg-bg1"
                >
                  <Trash />
                </button>
              </div>
            </div>

            {additionalAlternatives.map((alternative, index) => (
              <div key={index}>
                <label className="mb-1.5 mt-1.5 flex font-normal font-['Open Sans'] tracking-wide text-texto1">
                  Nome Alternativo {index + 2}
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
                  placeholder={`Nome Alternativo ${index + 2}`}
                  className="h-[50px] w-[418px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
                  disabled={customer.patient_status}
                />

                <label className="mb-1.5 mt-4 flex font-normal font-['Open Sans'] tracking-wide text-texto1">
                  CPF Alternativo {index + 2}
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
                    className="w-[212px] h-[50px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
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
            ))}
          </div>
          {additionalAlternatives.length < 2 && (
            <button
              type="button"
              className="grouph-4 justify-center items-start gap-2 inline-flex hw-[97px] text-[#0082ba] hover:text-primaria/50 bg-bg1 hover:bg-bg1 text-sm font-medium font-['Ubuntu'] tracking-tight"
              onClick={handleAddAlternativeFields}
            >
              <AddIcon />
              Adicionar item
            </button>
          )}
          <div className=" flex mt-[130px] space-x-4">
            <div className="ml-[205px] px] border border-primaria rounded-[100px]  ">
              <button
                className="h-[39px] px-6 py-2.5 bg-bg1 hover:bg-bg1 rounded-[100px]  text-primaria text-sm font-semibold"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>

            <button
              type="submit"
              className="h-[39px] px-6 py-2.5 bg-primaria rounded-[100px] text-white text-sm font-semibold"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerForm;
