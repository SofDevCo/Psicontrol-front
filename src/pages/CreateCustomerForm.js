import React, { useState } from 'react';
import { Trash } from '../icons/icons'; 
import '../index.css';  

const CreateCustomerForm = ({ onClose, onSubmit }) => {
  const [customer, setCustomer] = useState({
    customer_name: '',
    customer_cpf: '',
    customer_phone: '',
    customer_email: '',
    consultation_fee: '',
    patient_status: true,  
    alternative_name: '',
    alternative_cpf: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomer((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDeleteAlternativeCPF = () => {
    setCustomer((prevState) => ({
      ...prevState,
      alternative_cpf: '',
      alternative_name: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/events/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        alert('Cliente criado com sucesso!');
        setCustomer({
          customer_name: '',
          customer_cpf: '',
          customer_phone: '',
          customer_email: '',
          consultation_fee: '',
          patient_status: true,
          alternative_name: '',
          alternative_cpf: '',
        });
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
    <div className="">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="ml-[54px]"> 
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                name="customer_name"
                value={customer.customer_name}
                onChange={handleChange}
                placeholder="Nome"
                required
                className="w-[418px] h-[50px] px-4 py-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
  
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="customer_email"
                value={customer.customer_email}
                onChange={handleChange}
                placeholder="Email"
                className="w-[418px] h-[50px] px-4 py-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
  
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="text"
                name="customer_phone"
                value={customer.customer_phone}
                onChange={handleChange}
                placeholder="Telefone"
                className="w-[418px] h-[50px] px-4 py-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
  
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">CPF</label>
              <input
                type="text"
                name="customer_cpf"
                value={customer.customer_cpf}
                onChange={handleChange}
                placeholder="CPF"
                className="w-[418px] h-[50px] px-4 py-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
  
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Valor da consulta</label>
              <input
                type="number"
                step="0.01"
                name="consultation_fee"
                value={customer.consultation_fee}
                onChange={handleChange}
                placeholder="R$ 0,00"
                className="w-[418px] h-[50px] px-4 py-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        </form>
        </div>

        <div className="mt-4"> 
          <h3 className="text-lg font-[20px] font-bold mb-4">Dados para recibo / nota fiscal</h3>

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
                style={{top: '2px'}}
              >
              </div>
            </div>
            <label className="ml-2 text-sm font-medium text-gray-700">Utilizar dados do paciente</label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                name="alternative_name"
                value={customer.alternative_name}
                onChange={handleChange}
                placeholder="Nome Alternativo"
                className=" w-[418px] h-[50px] px-4 py-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                disabled={customer.patient_status}
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">CPF</label>
              <div className="flex">
                <input
                  type="text"
                  name="alternative_cpf"
                  value={customer.alternative_cpf}
                  onChange={handleChange}
                  placeholder="CPF Alternativo"
                  className="w-[370px] h-[50px]px-4 py-2 border border-gray-300 rounded-[15px] shadow-sm focus:outline-none focus:ring "
                  disabled={customer.patient_status}
                />
                {!customer.patient_status && (
                  <button
                    type="button"
                    onClick={handleDeleteAlternativeCPF}
                    className="ml-2 flex items-center justify-center bg-white rounded-full p-1 text-custom-blue hover:text-white "
                  >
                    <Trash />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-[296px] h-[64px] mt-[50px] mb-[43px] bg-custom-blue text-white font-bold rounded-[15px] hover:bg-blue-600 transition duration-300"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default CreateCustomerForm;
