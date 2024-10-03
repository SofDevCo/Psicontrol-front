import React, { useState, useEffect } from "react";
import { Trash } from "../icons/icons";

const formatCurrency = (value) => {
  if (typeof value !== "string") {
    value = value?.toString() || "0";
  }
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "R$";
  return (parseFloat(numericValue) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const parseCurrency = (value) => {
  return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
};

const IncomePage = () => {
  const [newExpenseValue, setNewExpenseValue] = useState("");
  const [newRevenueValue, setNewRevenueValue] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newRevenueName, setNewRevenueName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Adicionar nova despesa
  const addExpense = async () => {
    if (newExpenseName.trim()) {
      const newExpense = {
        name: newExpenseName,
        value: newExpenseValue || "0,00",
      };

      setNewExpenseName("");
      setNewExpenseValue("");

      try {
        const response = await fetch(`http://localhost:3000/income/expense`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "authentication_token"
            )}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newExpense.name,
            value: parseCurrency(newExpense.value) / 100,
            date: new Date(),
          }),
        });

        if (response.ok) {
          const savedExpense = await response.json();
          setExpenses((prevExpenses) => [...prevExpenses, savedExpense]);
          
        } 
      } catch (error) {
      }
    }
  };

  const addRevenue = async () => {
    if (newRevenueName.trim() && newRevenueValue) {
      const newRevenue = {
        name: newRevenueName,
        value: newRevenueValue,
      };

      
      setNewRevenueName("");
      setNewRevenueValue("");

      try {
        const response = await fetch(`http://localhost:3000/income/revenue`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "authentication_token"
            )}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newRevenue.name,
            value: parseCurrency(newRevenue.value) / 100,
            date: new Date(),
          }),
        });

        if (response.ok) {
          const savedRevenue = await response.json();
          setRevenues((prevRevenues) => [...prevRevenues, savedRevenue]);
        } else {
        }
      } catch (error) {
      }
    }
  };

  async function deleteRevenue(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/income/revenue/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "authentication_token"
            )}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setRevenues(revenues.filter((revenue) => revenue.id !== id));
        const data = await response.json();
      } else {
      }
    } catch (error) {
 
    }
  }

  async function deleteExpense(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/income/expense/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "authentication_token"
            )}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        
        setExpenses(expenses.filter((expense) => expense.id !== id));
        const data = await response.json();
      } else {
      }
    } catch (error) {
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
    if (type === "expense") {
      deleteExpense(id); 
    } else if (type === "revenue") {
      deleteRevenue(id);
    }
  };

  const openModal = (id, type) => {
    setItemToDelete(id);
    setItemType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
    setItemType("");
  };

  const confirmDelete = () => {
    handleDelete(itemToDelete, itemType);
    closeModal();
    setIsSuccessModalOpen(true); 
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const handleClick = () => {
    addExpense();
    addRevenue();
  };

  useEffect(() => {
    const loadExpenses = async () => {

      try {
        const response = await fetch(`http://localhost:3000/income/expense`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "authentication_token"
            )}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const expenseData = await response.json();
        setExpenses(expenseData);
      } catch (error) {
        
      }
    };

    const loadRevenues = async () => {

      try {
        const response = await fetch(`http://localhost:3000/income/revenue`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "authentication_token"
            )}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const revenueData = await response.json();
        setRevenues(revenueData);
      } catch (error) {
      }
    };

    loadExpenses();
    loadRevenues();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Você tem certeza que deseja excluir este item?
            </h2>
            <div className="flex justify-end">
              <button onClick={closeModal} className="mr-2 text-gray-500">
                Não
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Item excluído com sucesso!
            </h2>
            <div className="flex justify-end">
              <button
                onClick={closeSuccessModal}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
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
                    value={formatCurrency(expense.value)} // Formatar para exibição
                    onChange={(e) => handleExpenseChange(index, e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />

                  <button
                    onClick={() => openModal(expense.id, "expense")} // Passa expense.id e o tipo
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
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
                  value={formatCurrency(newExpenseValue)} // Formata o valor enquanto digita
                  onChange={(e) => setNewExpenseValue(e.target.value)} // Mantém o valor formatado
                  placeholder="R$"
                  className="w-1/3 p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={addExpense}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
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
                    value={formatCurrency(revenue.value)} // Formatar para exibição
                    onChange={(e) => handleRevenueChange(index, e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => openModal(revenue.id, "revenue")} // Passa revenue.id e o tipo
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
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
                  value={formatCurrency(newRevenueValue)} // Formata o valor enquanto digita
                  onChange={(e) => setNewRevenueValue(e.target.value)} // Mantém o valor formatado
                  placeholder="R$"
                  className="w-1/3 p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={addRevenue}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  + Adicionar Receita
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="text-blue-500 hover:text-blue-700 border border-blue-500 p-2 rounded-md">
              Repetir Lançamentos mês anterior
            </button>
            <button
              onClick={handleClick}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
