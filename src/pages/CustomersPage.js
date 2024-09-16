import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:3000/events/customers');
                if (!response.ok) {
                    throw new Error('Erro ao carregar os clientes');
                }
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
                setError('Erro ao carregar clientes');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    return (
        <div class="max-w-[800px] mx-auto p-5 font-sans">
            <h1 class="text-center text-[#333]">Pacientes</h1>

            {error && <p class="text-center mb-[20px] text-[red]">{error}</p>}
            {isLoading ? (
                <p>Carregando clientes...</p>
            ) : (
                <ul className="list-none p-0">
                    {customers.map(customer => (
                        <li key={`customer-${customer.customer_id}`} class="border-b-10border-b border-gray-200 py-2.5">
                            <span class="text-xl text-[#333]">{customer.customer_name}</span>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate('/create-customer')} class="py-2.5 px-4 bg-custom-blue text-white rounded cursor-pointer text-base">
                Cadastrar novo cliente
            </button>
        </div>
    );
};

export default CustomersPage;
