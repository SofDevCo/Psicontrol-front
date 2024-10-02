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
  const [userId, setUserId] = useState(null);

  const fetchUserId = async () => {
    try {
      const user_id = localStorage.getItem("user_id") || "default_user_id";

      const response = await fetch(`http://localhost:3000/income/entries/${user_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.user_id);
        console.log("User ID:", data.user_id);
        return data.user_id; 
      } else {
        console.error("Erro na resposta da requisição:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar o User ID:", error);
      return null; 
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const addExpense = async () => {
    if (newExpenseName.trim()) {
      const newExpense = {
        name: newExpenseName,
        value: newExpenseValue || "0,00",
      };

      setExpenses([...expenses, newExpense]); 
      setNewExpenseName("");
      setNewExpenseValue("");

      try {
        const user_id = await fetchUserId(); 
        if (!user_id) {
          console.error("User ID não encontrado. Usuário não está logado.");
          return;
        }

        const response = await fetch(`http://localhost:3000/income/expense/${user_id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newExpense.name,
            value: parseCurrency(newExpense.value) / 100, 
            date: new Date(),
          }),
        });

        if (response.ok) {
          console.log("Nova despesa salva com sucesso!");
        } else {
          console.error("Erro ao salvar a nova despesa:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao salvar a nova despesa:", error);
      }
    }
  };


  const addRevenue = async () => {
    if (newRevenueName.trim() && newRevenueValue) {
      const newRevenue = {
        name: newRevenueName,
        value: newRevenueValue,
      };

      setRevenues([...revenues, newRevenue]); 
      setNewRevenueName("");
      setNewRevenueValue("");

      try {
        const user_id = await fetchUserId(); 
        if (!user_id) {
          console.error("User ID não encontrado. Usuário não está logado.");
          return;
        }

        const response = await fetch(`http://localhost:3000/income/revenue/${user_id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newRevenue.name,
            value: parseCurrency(newRevenue.value) / 100,
            date: new Date(),
          }),
        });

        if (response.ok) {
          console.log("Nova receita salva com sucesso!");
        } else {
          console.error("Erro ao salvar a nova receita:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao salvar a nova receita:", error);
      }
    } else {
      console.error("Por favor, preencha todos os campos.");
    }
  };




  async function deleteRevenue(id) { 
    try {
      const response = await fetch(
        `http://localhost:3000/income/revenue/${id}`, { 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
      }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Receita deletada com sucesso:", data.message);
      } else {
        console.error("Erro ao deletar receita:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  async function deleteExpense(id) { 
    try {
      const response = await fetch(
        `http://localhost:3000/income/expense/${id}`, { 
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
      }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Despesa deletada com sucesso:", data.message);
      } else {
        console.error("Erro ao deletar despesa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }


  
  const handleExpenseChange = (index, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index].value = value;
    setExpenses(updatedExpenses);
  };

  
  const handleRevenueChange = (index, value) => {
    const updatedRevenues = [...revenues];
    updatedRevenues[index].value = value;
    setRevenues(updatedRevenues);
  };

  const handleDelete = (id, type) => { 
    console.log("ID:", id, "tipo:", type);
    if (type === "expense") {
      deleteExpense(id); 
    } else if (type === "revenue") {
      deleteRevenue(id); 
    }
  };


  const handleClick = () => {
    addExpense();
    addRevenue();
  };

  useEffect(() => {
    const loadExpenses = async () => {
      console.log("Carregando despesas...");
      const user_id = await fetchUserId();
      console.log("User ID:", user_id);
      if (!user_id) {
        console.error("User ID não encontrado.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/income/expense/${user_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Erro ao buscar despesas:", response.statusText);
          return;
        }

        const expenseData = await response.json();
        console.log("Dados de despesas:", expenseData);
        setExpenses(expenseData);
      } catch (error) {
        console.error("Erro ao carregar despesas:", error);
      }
    };

    const loadRevenues = async () => {
      console.log("Carregando receitas...");
      const user_id = await fetchUserId();
      console.log("User ID:", user_id);
      if (!user_id) {
        console.error("User ID não encontrado.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/income/revenue/${user_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Erro ao buscar receitas:", response.statusText);
          return;
        }

        const revenueData = await response.json();
        console.log("Dados de receitas:", revenueData);
        setRevenues(revenueData);
      } catch (error) {
        console.error("Erro ao carregar receitas:", error);
      }
    };

    loadExpenses();
    loadRevenues();
  }, []);




  return (
    <div className="flex h-screen bg-gray-100">
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
                    value={formatCurrency(expense.value)} 
                    onChange={(e) => handleExpenseChange(index, e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />

                  <button
                    onClick={() => handleDelete(expense.id, "expense")} 
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
                  value={formatCurrency(newExpenseValue)} 
                  onChange={(e) => setNewExpenseValue(e.target.value)}
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
                    value={formatCurrency(revenue.value)} 
                    onChange={(e) => handleRevenueChange(index, e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => handleDelete(revenue.id, "revenue")} 
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
                  value={formatCurrency(newRevenueValue)} 
                  onChange={(e) => setNewRevenueValue(e.target.value)} 
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
