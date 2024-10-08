import React, { useState } from "react";
import { Trash } from "../icons/icons";
import "../index.css";
import "../styles/CreateEventForm.css";
// import { useModal, useSuccessModal } from "../components/useModal";

const CreateCustomerForm = ({ onClose, onSubmit }) => {
  const [customer, setCustomer] = useState({
    customer_name: "",
    customer_cpf_cnpj: "",
    customer_phone: "",
    customer_email: "",
    consultation_fee: "",
    patient_status: true,
    alternative_name: "",
    alternative_cpf_cnpj: "",
  });

  const [additionalAlternatives, setAdditionalAlternatives] = useState([]);
  // const { isSuccessModalOpen, openSuccessModal, closeSuccessModal } =  useSuccessModal();


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
        alert("Erro ao criar cliente.");
      }
    } catch (error) {
      alert("Erro ao criar cliente.");
    }
  };

  return (
    <div className="max-w space-y-4 p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[15px] font-normal text-gray-700">
                Nome
              </label>
              <input
                type="text"
                name="customer_name"
                value={customer.customer_name}
                onChange={handleChange}
                placeholder="Nome do paciente"
                required
                className="h-[50px] w-[418px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="mb-1 block text-[15px] font-normal text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="customer_email"
                value={customer.customer_email}
                onChange={handleChange}
                placeholder="e-mail.paciente@gmail.com"
                className="h-[50px] w-[418px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="mb-1 block text-[15px] font-normal text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                name="customer_phone"
                value={customer.customer_phone}
                onChange={handleChange}
                placeholder="(00) 0 0000-0000"
                className="h-[50px] w-[418px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-normal text-gray-700">
                CPF/CNPJ
              </label>
              <input
                type="text"
                name="customer_cpf_cnpj"
                value={customer.customer_cpf_cnpj}
                onChange={handleChange}
                placeholder="XX.XXX.XXX/0001-XX."
                className="h-[50px] w-[418px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-normal text-[#5c5c5c] text-gray-700">
                Valor da consulta
              </label>
              <input
                type="number"
                step="0.01"
                name="consultation_fee"
                value={customer.consultation_fee}
                onChange={handleChange}
                placeholder="R$ 000,00"
                className="h-[50px] w-[418px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-['Inter']l mb-4 text-lg text-xl font-[20px] font-medium text-black">
            Dados para recibo
          </h3>

          <div className="mb-4 flex items-center">
            <div
              className="relative h-[30.71px] w-[56px] cursor-pointer"
              onClick={() =>
                handleChange({
                  target: {
                    name: "patient_status",
                    type: "checkbox",
                    checked: !customer.patient_status,
                  },
                })
              }
            >
              <div
                className={`absolute h-full w-full rounded-full ${!customer.patient_status ? "bg-[#16DBCC]" : "bg-gray-300"}`}
              ></div>
              <div
                className={`absolute right-[27px] top-[2px] flex h-[27px] w-[27px] items-center justify-center rounded-full bg-white transition-transform ${
                  !customer.patient_status
                    ? "translate-x-[26px]"
                    : "translate-x-0"
                }`}
                style={{ top: "2px" }}
              ></div>
            </div>
            <label className="ml-2 text-sm font-medium text-gray-700">
              Utilizar dados do paciente
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[15px] font-normal text-gray-700">
                Nome
              </label>
              <input
                type="text"
                name="alternative_name"
                value={customer.alternative_name}
                onChange={handleChange}
                placeholder="Nome do Paciente"
                className="h-[50px] w-[418px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
                disabled={customer.patient_status}
              />
            </div>

            <div className="relative">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                CPF/CNPJ
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="alternative_cpf_cnpj"
                  value={customer.alternative_cpf_cnpj}
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/0001-XX."
                  className="h-[50px] w-[370px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
                  disabled={customer.patient_status}
                />
                {!customer.patient_status && (
                  <button
                    type="button"
                    onClick={handleDeleteAlternativeCPF}
                    className="ml-2 flex items-center justify-center rounded-full bg-white p-1 hover:bg-primaria"
                  >
                    <Trash />
                  </button>
                )}
              </div>
            </div>

            {additionalAlternatives.map((alternative, index) => (
              <div key={index}>
                <label className="mb-1.5 mt-1.5 flex text-[15px] font-normal text-gray-700">
                  Nome Alternativo {index + 2}
                </label>
                <input
                  type="text"
                  name="alternative_name"
                  value={alternative.alternative_name}
                  onChange={(e) =>
                    handleAlternativeChange(
                      index,
                      "alternative_name",
                      e.target.value
                    )
                  }
                  placeholder={`Nome Alternativo ${index + 2}`}
                  className="h-[50px] w-[418px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
                  disabled={customer.patient_status}
                />

                <label className="mb-1.5 mt-4 flex text-[15px] font-normal text-gray-700">
                  CPF Alternativo {index + 2}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="alternative_cpf"
                    value={alternative.alternative_cpf_cnpj}
                    onChange={(e) =>
                      handleAlternativeChange(
                        index,
                        "alternative_cpf",
                        e.target.value
                      )
                    }
                    placeholder={`CPF/CNPJ Alternativo ${index + 1}`}
                    className="h-[50px] w-[370px] rounded-[15px] border border-gray-300 px-4 py-2 text-[#5c5c5c] shadow-sm focus:border-blue-300 focus:outline-none focus:ring"
                    disabled={customer.patient_status}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteAlternativeCPF(index)}
                    className="absolute ml-2 items-center justify-center rounded-full bg-white p-1 text-primaria hover:text-white"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {additionalAlternatives.length < 1 && (
            <button
              type="button"
              className="hover:text-marinho ml-[150px] mt-4 inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 font-['Inter'] text-[17px] font-semibold text-black hover:bg-white"
              onClick={handleAddAlternativeFields}
            >
              Adicionar
            </button>
          )}
        </div>

        <div className="">
          <button
            type="submit"
            onClick={handleSubmit}
            className="mb-[43px] ml-[350px] mt-[50px] h-[64px] w-[296px] rounded-[15px] bg-primaria font-normal text-white transition duration-300 hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerForm;
