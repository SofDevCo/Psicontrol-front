import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Trash } from '../icons/icon';

// Função para formatar os valores para exibição
const formatCurrency = (value) => {
  if (typeof value !== 'string') {
    value = value?.toString() || '0'; 
  }
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '0,00';
  return (parseFloat(numericValue) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Função para desformatar o valor de volta para número
const parseCurrency = (value) => {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
};

const IncomePage = () => {
  const [newExpenseValue, setNewExpenseValue] = useState('');
  const [newRevenueValue, setNewRevenueValue] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newRevenueName, setNewRevenueName] = useState('');

  const fetchUserId = async () => {
    try {
        const response = await fetch('http://localhost:3000/get-user-id', {
            credentials: 'include' // Inclui cookies para manter a sessão
        });
        if (response.ok) {
            const data = await response.json();
            return data.userId; // Retorna o user_id da sessão
        } else {
            console.error('Erro ao buscar o User ID da sessão');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar o User ID:', error);
        return null;
    }
};


  // Adicionar nova despesa
  const addExpense = async () => {
    if (newExpenseName.trim()) {
      const newExpense = { name: newExpenseName, value: newExpenseValue || '0,00' };
      setExpenses([...expenses, newExpense]);
      setNewExpenseName('');
      setNewExpenseValue('');

      // Salvar a nova despesa no backend
      try {
        const user_id = await fetchUserId(); // Buscar o user_id da sessão
        if (!user_id) {
            console.error('User ID não encontrado. Usuário não está logado.');
            return;
        }

        const response = await fetch('http://localhost:3000/income/expense/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newExpense.name,
            value: parseCurrency(newExpense.value), // Desformatação para salvar
            user_id: user_id, // Use o user_id obtido do localStorage
            date: new Date(),
          }),
        });

        if (response.ok) {
          console.log('Nova despesa salva com sucesso!');
        } else {
          console.error('Erro ao salvar a nova despesa:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao salvar a nova despesa:', error);
      }
    }
  };


  // Adicionar nova receita
  const addRevenue = async () => {
    if (newRevenueName.trim()) {
      const newRevenue = { name: newRevenueName, value: newRevenueValue || '0,00' };
      setRevenues([...revenues, newRevenue]);
      setNewRevenueName('');
      setNewRevenueValue('');

      // Salvar a nova receita no backend
      try {
        const user_id = await fetchUserId(); // Buscar o user_id da sessão
        if (!user_id) {
            console.error('User ID não encontrado. Usuário não está logado.');
            return;
        }

        const response = await fetch(`http://localhost:3000/income/revenue/${user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newRevenue.name,
            value: parseCurrency(newRevenue.value), // Desformatação para salvar
            user_id: user_id,
            date: new Date(),
          }),
        });
        if(response.ok){
          console.log('deu certo');
        } else {
          console.error('deu errado')
        }
      } catch (error) {
        console.error('Erro ao salvar a nova receita:', error);
      }
    }
  };

  async function deleteRevenue(id) {
    try {
      console.log('alguma mensagem', id)
      const response = await fetch(`http://localhost:3000/income/revenue/${id}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Receita deletada com sucesso:', data.message);
      } else {
        console.error('Erro ao deletar receita:', response.statusText);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  }
  
  async function deleteExpense(id) {
    try {
      const response = await fetch(`http://localhost:3000/income/expense/${id}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Despesa deletada com sucesso:', data.message);
      } else {
        console.error('Erro ao deletar despesa:', response.statusText);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  }

  // Atualizar valor da despesa
  const handleExpenseChange = (index, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index].value = value;
    setExpenses(updatedExpenses);
  };

  // Atualizar valor da receita
  const handleRevenueChange = (index, value) => {
    const updatedRevenues = [...revenues];
    updatedRevenues[index].value = value;
    setRevenues(updatedRevenues);
  };

  const handleDelete = (id, type) => {
    // deleteExpense();
    // deleteRevenue();
    console.log('id:',id , "tipo:",type);
    if (type === 'expense') {
      deleteExpense(id);
    } else if (type === 'revenue');
    deleteRevenue(id);
  };

  const handleClick = () => {
    addExpense();
    addRevenue();
  };

  // Carregar dados do backend
  useEffect(() => {
    const loadData = async () => {
      const user_id = await fetchUserId(); // Buscar o user_id da sessão
        if (!user_id) {
            console.error('User ID não encontrado.');
            return;
        }
      try {
        const response = await fetch('http://localhost:3000/income/entries/');
        const data = await response.json();
        const expenseData = data.filter(entry => entry.type === 'expense') || [];
        const revenueData = data.filter(entry => entry.type === 'revenue') || [];

        setExpenses(expenseData);
        setRevenues(revenueData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-grow justify-center items-center">
        <div className="w-[1110px] h-[635px] bg-white rounded-[25px] p-6 shadow-lg">
          <h1 className="text-xl font-bold mb-4">Receitas e Despesas</h1>

          <div className="flex justify-between mb-4">
            <div className="w-1/2">
              <h2 className="text-lg font-semibold mb-2">Despesas</h2>
              {expenses.map((expense, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={expense.name}
                    readOnly
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={formatCurrency(expense.value)}  // Formatar para exibição
                    onChange={(e) => handleExpenseChange(index, e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />

                  <button onClick={() => handleDelete(expense.id, "expense")} className="ml-2 text-red-500 hover:text-red-700">
                    <Trash />
                  </button>
                </div>
              ))}
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  placeholder="Nome da nova despesa"
                  className="w-1/3 p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={newExpenseValue}
                  onChange={(e) => setNewExpenseValue(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-1/3 p-2 border border-gray-300 rounded-md"
                />
                <button onClick={addExpense} className="ml-2 text-blue-500 hover:text-blue-700">
                  + Adicionar Despesa
                </button>
              </div>
            </div>

            <div className="w-1/2">
              <h2 className="text-lg font-semibold mb-2">Outras Receitas</h2>
              {revenues.map((revenue, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={revenue.name}
                    readOnly
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={formatCurrency(revenue.value)}  // Formatar para exibição
                    onChange={(e) => handleRevenueChange(index, e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />
                  <button onClick={() => handleDelete (revenue.id, "revenue")} className="ml-2 text-red-500 hover:text-red-700">
                    <Trash />
                  </button>
                </div>
              ))}
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newRevenueName}
                  onChange={(e) => setNewRevenueName(e.target.value)}
                  placeholder="Nome da nova receita"
                  className="w-1/3 p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={newRevenueValue}
                  onChange={(e) => setNewRevenueValue(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-1/3 p-2 border border-gray-300 rounded-md"
                />
                <button onClick={addRevenue} className="ml-2 text-blue-500 hover:text-blue-700">
                  + Adicionar Receita
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="text-blue-500 hover:text-blue-700 border border-blue-500 p-2 rounded-md">
              Repetir Lançamentos mês anterior
            </button>
            <button onClick={handleClick} className="bg-blue-500 text-white p-2 rounded-md">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
