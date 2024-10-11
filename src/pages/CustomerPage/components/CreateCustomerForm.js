import React, { useState, useEffect, useRef } from "react";
import { AddIcon, Trash } from "../../../icons/icons";
import "../../../index.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../utils/notification/toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCustomerForm = ({
  onClose,
  onSubmit,
  selectedPatient,
  customer,
  setCustomer,
}) => {
  const [additionalAlternatives, setAdditionalAlternatives] = useState([]);

  useEffect(() => {
    if (selectedPatient) {
      setCustomer((prev) => ({
        ...prev,
        customer_name: selectedPatient.customer_name || "",
        customer_cpf_cnpj: selectedPatient.customer_cpf_cnpj || "",
        customer_phone: selectedPatient.customer_phone || "",
        customer_email: selectedPatient.customer_email || "",
      }));
    }
  }, [selectedPatient, setCustomer]);

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
    try {
      const response = await fetch(
        "http://localhost:3000/events/create-customer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "authentication_token"
            )}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...customer, additionalAlternatives }),
          credentials: "include",
        }
      );

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
        });
        setAdditionalAlternatives([]);
        onSubmit();
        onClose();
      } else {
        showErrorToast("Erro ao criar cliente!");
      }
    } catch (error) {
      showErrorToast("Erro ao criar cliente!");
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
            <div>
              <label className="mb-1 block ext-base font-normal font-['Open Sans'] tracking-wide text-texto1">
                Nome
              </label>
              <input
                type="text"
                name="customer_name"
                value={customer.customer_name  || ""}
                onChange={handleChange}
                placeholder="Nome do paciente"
                required
                className="h-[50px] w-[418px] bg-bg1 rounded-[15px] border-2 border-cinza6 px-4 py-2 text-texto2/50 shadow-sm focus:border-cinza6/50 focus:outline-none focus:ring"
              />
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
                  placeholder="XX.XXX.XXX/0001-XX."
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
              onClick={handleSubmit}
              className="h-[39px] px-6 py-2.5 bg-primaria rounded-[100px] text-white text-sm font-semibold"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateCustomerForm;
