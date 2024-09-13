import React, { useState } from 'react';

const CreateCustomerForm = () => {
    const [customer, setCustomer] = useState({
        customer_name: '',
        customer_cpf: '',
        customer_cnpj: '',
        customer_phone: '',
        customer_email: '',
        consultation_fee: '',
        patient_status: false,
        alternative_name: '',
        alternative_cpf: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCustomer(prevState => ({
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
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                alert('Cliente criado com sucesso!');
                setCustomer({
                    customer_name: '',
                    customer_cpf: '',
                    customer_cnpj: '',
                    customer_phone: '',
                    customer_email: '',
                    consultation_fee: '',
                    patient_status: false,
                    alternative_name: '',
                    alternative_cpf: ''
                });
            } else {
                alert('Erro ao criar cliente.');
            }
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao criar cliente.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="customer_name"
                value={customer.customer_name}
                onChange={handleChange}
                placeholder="Nome"
                required
            />
            <input
                type="text"
                name="customer_cpf"
                value={customer.customer_cpf}
                onChange={handleChange}
                placeholder="CPF"
                required
            />
            <input
                type="text"
                name="customer_cnpj"
                value={customer.customer_cnpj}
                onChange={handleChange}
                placeholder="CNPJ"
            />
            <input
                type="text"
                name="customer_phone"
                value={customer.customer_phone}
                onChange={handleChange}
                placeholder="Telefone"
            />
            <input
                type="email"
                name="customer_email"
                value={customer.customer_email}
                onChange={handleChange}
                placeholder="Email"
            />
            <input
                type="number"
                step="0.01"
                name="consultation_fee"
                value={customer.consultation_fee}
                onChange={handleChange}
                placeholder="Taxa de Consulta"
            />
            <input
                type="text"
                name="alternative_name"
                value={customer.alternative_name}
                onChange={handleChange}
                placeholder="Nome Alternativo"
            />
            <input
                type="text"
                name="alternative_cpf"
                value={customer.alternative_cpf}
                onChange={handleChange}
                placeholder="CPF Alternativo"
            />
            <label>
                Status do Paciente:
                <input
                    type="checkbox"
                    name="patient_status"
                    checked={customer.patient_status}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Criar Cliente</button>
        </form>
    );
};

export default CreateCustomerForm;