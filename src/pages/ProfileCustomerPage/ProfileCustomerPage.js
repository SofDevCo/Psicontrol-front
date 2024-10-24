import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 

const ProfileCustomerPage = () => {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  
  const { customerId } = useParams(); 

  useEffect(() => {
    const fetchCustomer = async () => {
      const response = await fetch(`http://localhost:3000/events/customers/${customerId}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authentication_token')}`,
        },
      });
      if (!response.ok) {
        setError('Erro ao buscar o perfil do paciente');
        return;
      }
      const data = await response.json();
      setCustomer(data);
    };

    fetchCustomer();
  }, [customerId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!customer) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto bg-white shadow p-6 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Conta do paciente</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center">
            <div className="bg-blue-500 text-white h-12 w-12 rounded-full flex items-center justify-center">
              {customer.customer_name.charAt(0)}
            </div>
            <h3 className="ml-4 text-xl font-bold">{customer.customer_name}</h3>
          </div>
          <p className="mt-4 text-gray-700">
            <strong>CPF/CNPJ:</strong> {customer.customer_cpf_cnpj || 'Não informado'}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>E-mail:</strong> {customer.customer_email || 'Não informado'}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>Telefone:</strong> {customer.customer_phone || 'Não informado'}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold">Dados para recibo</h3>
          <p className="mt-4 text-gray-700">
            <strong>Nome:</strong> {customer.alternative_name || 'Não informado'}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>CPF/CNPJ:</strong> {customer.alternative_cpf_cnpj || 'Não informado'}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>E-mail:</strong> {customer.alternative_email || 'Não informado'}
          </p>
        </div>
      </div>
    </div>
  );
};


export default ProfileCustomerPage;
