import React, { useState, useEffect } from "react";
import { Trash } from "../icons/icons";

// Função para formatar os valores para exibição
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

// Função para desformatar o valor de volta para número
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState("");

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
        return data.user_id; // Retorna o user_id
      } else {
        console.error("Erro na resposta da requisição:", response.status);
        return null; // Retorna null em caso de erro
      }
    } catch (error) {
      console.error("Erro ao buscar o User ID:", error);
      return null; // Retorna null em caso de erro
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  // Adicionar nova despesa
  const addExpense = async () => {
    if (newExpenseName.trim()) {
      const newExpense = {
        name: newExpenseName,
        value: newExpenseValue || "0,00",
      };

      // Limpar os campos de entrada
      setNewExpenseName("");
      setNewExpenseValue("");

      try {
        const user_id = await fetchUserId(); // Obtém o user_id
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
            value: parseCurrency(newExpense.value) / 100, // Corrige a conversão do valor para o banco
            date: new Date(),
          }),
        });

        if (response.ok) {
          const savedExpense = await response.json(); // Assume que o backend retorna a despesa salva com o ID
          setExpenses((prevExpenses) => [...prevExpenses, savedExpense]); // Atualiza o estado local com a nova despesa
          console.log("Nova despesa salva com sucesso!");
        } else {
          console.error("Erro ao salvar a nova despesa:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao salvar a nova despesa:", error);
      }
    }
  };





  // Adicionar nova receita
  const addRevenue = async () => {
    if (newRevenueName.trim() && newRevenueValue) {
      const newRevenue = {
        name: newRevenueName,
        value: newRevenueValue,
      };

      // Limpar os campos de entrada
      setNewRevenueName("");
      setNewRevenueValue("");

      try {
        const user_id = await fetchUserId(); // Obtém o user_id
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
            value: parseCurrency(newRevenue.value) / 100, // Corrige a conversão do valor para o banco
            date: new Date(),
          }),
        });

        if (response.ok) {
          const savedRevenue = await response.json(); // Assume que o backend retorna a receita salva com o ID
          setRevenues((prevRevenues) => [...prevRevenues, savedRevenue]); // Atualiza o estado local com a nova receita
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
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remover a receita do estado local
        setRevenues(revenues.filter(revenue => revenue.id !== id));
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
      });

      if (response.ok) {
        // Remover a despesa do estado local
        setExpenses(expenses.filter(expense => expense.id !== id));
        const data = await response.json();
        console.log("Despesa deletada com sucesso:", data.message);
      } else {
        console.error("Erro ao deletar despesa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
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

  const handleDelete = (id, type) => { // Altera user_id para id
    console.log("ID:", id, "tipo:", type);
    if (type === "expense") {
      deleteExpense(id); // Passa o id da despesa
    } else if (type === "revenue") {
      deleteRevenue(id); // Passa o id da receita
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
  };


  const handleClick = () => {
    addExpense();
    addRevenue();
  };

  // Carregar dados do backend
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

    // Chamar ambas as funções para carregar dados
    loadExpenses();
    loadRevenues();
  }, []);




  return (
    <div className="flex h-screen bg-gray-100">
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Você tem certeza que deseja excluir este item?</h2>
            <div className="flex justify-end">
              <button onClick={closeModal} className="mr-2 text-gray-500">
                Não
              </button>
              <button onClick={confirmDelete} className="bg-red-500 text-white p-2 rounded-md">
                Sim
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
