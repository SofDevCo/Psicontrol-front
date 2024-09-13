import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomersPage.css';

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
        <div className="customers-page-container">
            <h1 className="customers-page-title">Pacientes</h1>

            {error && <p className="customers-page-error-message">{error}</p>}
            {isLoading ? (
                <p>Carregando clientes...</p>
            ) : (
                <ul className="customers-page-list">
                    {customers.map(customer => (
                        <li key={`customer-${customer.customer_id}`} className="customers-page-list-item">
                            <span className="customers-page-item-name">{customer.customer_name}</span>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate('/create-customer')} className="customers-page-button">
                Cadastrar novo cliente
            </button>
        </div>
    );
};

export default CustomersPage;
