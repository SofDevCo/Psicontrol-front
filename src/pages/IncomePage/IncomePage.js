import React, { useState, useEffect } from "react";
import { Trash } from "../../icons/icons";
import { Months } from "../../components/months";

const formatCurrency = (value) => {
  if (typeof value !== "string") {
    value = value?.toString() || "0";
  }
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "R$ 0,00"; // Ajuste aqui para exibir zero corretamente
  return (parseFloat(numericValue) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const parseCurrency = (value) => {
  // Remover caracteres não numéricos e converter para centavos
  const numericValue = value.replace(/[^0-9]/g, "");
  return parseFloat(numericValue) || 0; // Retornar 0 se não houver valor
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
  const [isAddingRevenue, setIsAddingRevenue] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);

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
      } catch (error) {}
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
      } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
  }

  // Atualizar valor da despesa
  // const handleExpenseChange = (index, value) => {
  //   const updatedExpenses = [...expenses];
  //   updatedExpenses[index].value = value;
  //   setExpenses(updatedExpenses);
  // };

  // Atualizar valor da receita
  // const handleRevenueChange = (index, value) => {
  //   const updatedRevenues = [...revenues];
  //   updatedRevenues[index].value = value;
  //   setRevenues(updatedRevenues);
  // };

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
      } catch (error) {}
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
      } catch (error) {}
    };

    loadExpenses();
    loadRevenues();
  }, []);

  const toggleAddRevenue = () => {
    setIsAddingRevenue(!isAddingRevenue);
  };

  const toggleAddExpense = () => {
    setIsAddingExpense(!isAddingExpense);
  };

  return (
    <div className="">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Você tem certeza que deseja excluir este item?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="mr-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Item excluído com sucesso!
            </h2>
            <div className="flex justify-end">
              <button
                onClick={closeSuccessModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative w-[1076px] h-auto ml-[200px] bg-neutral-100 rounded-[15px] border-2 border-cinza6 p-4 shadow-md">
        <div className="flex justify-between mb-6">
          <Months className="p-2 border rounded-md border-cinza6" />
          <button className="w-[200px] h-[57.69px] shadow bg-neutral-100 rounded-[10px] mr-[490px] border-2 border-cinza6 mt-[5px] text-cinza6 text-sm font-medium font-['Ubuntu'] tracking-tight">
            Repetir Último <br /> Lançamento
          </button>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 pr-4">
            <h2 className="text-lg font-semibold mb-2">Receitas</h2>
            {revenues.map((revenue, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={revenue.name}
                  readOnly // Somente leitura
                  className="w-[180px] p-2 bg-neutral-100 text-gray-700 border border-cinza6  focus:border-cinza6 focus:outline focus:ring rounded-md mr-2"
                />
                <input
                  type="text"
                  value={formatCurrency(revenue.value)} // Formatar para exibição
                  readOnly // Somente leitura
                  className="w-[120px] p-2 bg-neutral-100 text-gray-700 border border-cinza6  focus:border-cinza6 focus:outline focus:ring rounded-md"
                />
                <button
                  onClick={() => openModal(revenue.id, "revenue")}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <Trash />
                </button>
              </div>
            ))}
  
            {isAddingRevenue && (
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Nome da receita"
                  value={newRevenueName}
                  onChange={(e) => setNewRevenueName(e.target.value)} // Atualizar nome
                  className="w-[180px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md mr-2"
                />
                <input
                  type="text"
                  placeholder="Valor da receita"
                  value={formatCurrency(newRevenueValue)}
                  onChange={(e) => setNewRevenueValue(e.target.value)} // Atualizar valor
                  className="w-[120px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md"
                />
              </div>
            )}
  
            <button
              onClick={toggleAddRevenue}
              className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
            >
              <span className="mr-1">+</span> Adicionar item
            </button>
          </div>
  
          <div className="w-1/2 pl-4">
            <h2 className="text-lg font-semibold mb-2">Despesas</h2>
            {expenses.map((expense, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={expense.name}
                  readOnly // Somente leitura
                  className="w-[180px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md mr-2"
                />
                <input
                  type="text"
                  value={formatCurrency(expense.value)} // Formatar para exibição
                  readOnly // Somente leitura
                  className="w-[120px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md"
                />
                <button
                  onClick={() => openModal(expense.id, "expense")}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash />
                </button>
              </div>
            ))}
  
            {isAddingExpense && (
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Nome da despesa"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)} // Atualizar nome
                  className="w-[180px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md mr-2"
                />
                <input
                  type="text"
                  placeholder="Valor da despesa"
                  value={formatCurrency(newExpenseValue)}
                  onChange={(e) => setNewExpenseValue(e.target.value)} // Atualizar valor
                  className="w-[120px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md"
                />
              </div>
            )}
  
            <button
              onClick={toggleAddExpense}
              className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
            >
              <span className="mr-1">+</span> Adicionar item
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md mr-2 hover:bg-blue-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default IncomePage;
