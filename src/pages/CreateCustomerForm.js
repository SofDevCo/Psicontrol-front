import React, { useState } from 'react';
import { Trash } from '../icons/icons'; 
import '../index.css';  
import '../styles/CreateEventForm.css';

const CreateCustomerForm = ({ onClose, onSubmit }) => {
  const [customer, setCustomer] = useState({
    customer_name: '',
    customer_cpf_cnpj: '',
    customer_phone: '',
    customer_email: '',
    consultation_fee: '',
    patient_status: true,  
    alternative_name: '',
    alternative_cpf_cnpj: '',
  });

  const [additionalAlternatives, setAdditionalAlternatives] = useState([]);

  const handleAddAlternativeFields = () => {
    if (additionalAlternatives.length < 2) {  
      setAdditionalAlternatives((prev) => [
        ...prev,
        { alternative_name: '', alternative_cpf_cnpj: '' },
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
    const updatedAlternatives = additionalAlternatives.filter((_, i) => i !== index);
    setAdditionalAlternatives(updatedAlternatives);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomer((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/events/create-customer', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "authentication_token"
          )}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...customer, additionalAlternatives }),
        credentials: 'include',
      });

      if (response.ok) {
        alert('Cliente criado com sucesso!');
        setCustomer({
          customer_name: '',
          customer_cpf_cnpj: '',
          customer_phone: '',
          customer_email: '',
          consultation_fee: '',
          patient_status: true,
          alternative_name: '',
          alternative_cpf_cnpj: '',
        });
        setAdditionalAlternatives([]);
        onSubmit();
        onClose();
      } else {
        alert('Erro ao criar cliente.');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao criar cliente.');
    }
  };

  return (
    <div className="space-y-4 p-6 max-w">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-[15px] font-normal text-gray-700">Nome</label>
              <input
                type="text"
                name="customer_name"
                value={customer.customer_name}
                onChange={handleChange}
                placeholder="Nome do paciente"
                required
                className="w-[418px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-[15px] font-normal text-gray-700">Email</label>
              <input
                type="email"
                name="customer_email"
                value={customer.customer_email}
                onChange={handleChange}
                placeholder="e-mail.paciente@gmail.com"
                className="w-[418px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-[15px] font-normal text-gray-700">Telefone</label>
              <input
                type="text"
                name="customer_phone"
                value={customer.customer_phone}
                onChange={handleChange}
                placeholder="(00) 0 0000-0000"
                className="w-[418px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-normal text-gray-700">CPF/CNPJ</label>
              <input
                type="text"
                name="customer_cpf_cnpj"
                value={customer.customer_cpf_cnpj}
                onChange={handleChange}
                placeholder="XX.XXX.XXX/0001-XX."
                className="w-[418px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-[#5c5c5c] text-sm font-normal text-gray-700">Valor da consulta</label>
              <input
                type="number"
                step="0.01"
                name="consultation_fee"
                value={customer.consultation_fee}
                onChange={handleChange}
                placeholder="R$ 000,00"
                className="w-[418px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-[20px] text-black text-xl font-medium font-['Inter']l mb-4">Dados para recibo</h3>

          <div className="mb-4 flex items-center">
            <div
              className="relative w-[56px] h-[30.71px] cursor-pointer"
              onClick={() => handleChange({ target: { name: 'patient_status', type: 'checkbox', checked: !customer.patient_status } })}
            >
              <div className={`absolute w-full h-full rounded-full ${!customer.patient_status ? 'bg-[#16DBCC]' : 'bg-gray-300'}`}></div>
              <div
                className={`absolute flex items-center justify-center w-[27px] h-[27px] right-[27px] top-[2px] bg-white rounded-full transition-transform ${
                  !customer.patient_status ? 'translate-x-[26px]' : 'translate-x-0'
                }`}
                style={{ top: '2px' }}
              ></div>
            </div>
            <label className="ml-2 text-sm font-medium text-gray-700">Utilizar dados do paciente</label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-[15px] font-normal text-gray-700">Nome</label>
              <input
                type="text"
                name="alternative_name"
                value={customer.alternative_name}
                onChange={handleChange}
                placeholder="Nome do Paciente"
                className="w-[418px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                disabled={customer.patient_status}
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">CPF/CNPJ</label>
              <div className="flex">
                <input
                  type="text"
                  name="alternative_cpf_cnpj"
                  value={customer.alternative_cpf_cnpj} 
                  onChange={handleChange}
                  placeholder="XX.XXX.XXX/0001-XX."
                  className="w-[370px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  disabled={customer.patient_status}
                />
                {!customer.patient_status && (
                  <button
                    type="button"
                    onClick={handleDeleteAlternativeCPF}
                    className="ml-2 flex items-center justify-center rounded-full p-1 bg-white hover:bg-primaria"
                  >
                    <Trash />
                  </button>
                )}
              </div>
            </div>
                

            {additionalAlternatives.map((alternative, index) => (
              <div key={index}>
                <label className="flex mb-1.5 mt-1.5 text-[15px] font-normal text-gray-700">Nome Alternativo {index + 2}</label>
                <input
                  type="text"
                  name="alternative_name"
                  value={alternative.alternative_name}
                  onChange={(e) => handleAlternativeChange(index, 'alternative_name', e.target.value)}
                  placeholder={`Nome Alternativo ${index + 2}`}
                  className="w-[418px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  disabled={customer.patient_status}
                />

                <label className="flex mb-1.5 mt-4 text-[15px] font-normal text-gray-700">CPF Alternativo {index + 2}</label>
                <div className="relative">
                  <input
                    type="text"
                    name="alternative_cpf"
                    value={alternative.alternative_cpf_cnpj}
                    onChange={(e) => handleAlternativeChange(index, 'alternative_cpf', e.target.value)}
                    placeholder={`CPF/CNPJ Alternativo ${index + 1}`}
                    className="w-[370px] h-[50px] px-4 py-2 text-[#5c5c5c] border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    disabled={customer.patient_status}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteAlternativeCPF(index)}
                    className="ml-2 absolute items-center justify-center bg-white rounded-full p-1 text-primaria hover:text-white "
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
              className="mt-4 ml-[150px] inline-flex items-center px-4 py-2 border border-transparent text-black text-[17px] font-semibold font-['Inter'] bg-white rounded-md hover:bg-white hover:text-marinho"
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
          className="w-[296px] h-[64px] mt-[50px] mb-[43px] ml-[350px] bg-primaria text-white font-normal rounded-[15px] hover:bg-blue-600 transition duration-300"
        >
          Salvar
        </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerForm;
