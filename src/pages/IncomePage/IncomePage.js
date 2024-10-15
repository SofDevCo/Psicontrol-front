import React, { useState, useEffect } from "react";
import { Trash, AddIcon } from "../../icons/icons";
import { Months } from "../../utils/Months/months";

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
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAddingRevenue, setIsAddingRevenue] = useState([]);
  const [isAddingExpense, setIsAddingExpense] = useState([]);

  // Adicionar nova despesa
  const addExpense = async (name, value) => {
    if (name.trim()) {
      const newExpense = {
        name: name,
        value: value || "0,00",
      };

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

  const addRevenue = async (name, value) => {
    if (name.trim() && value) {
      const newRevenue = {
        name: name,
        value: value,
      };

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

  const handleClick = async () => {
    const expensePromises = isAddingExpense.map(async (expense) => {
      // Remover o setNewExpenseName e setNewExpenseValue aqui
      await addExpense(expense.name, expense.value);
    });

    const revenuePromises = isAddingRevenue.map(async (revenue) => {
      // Remover o setNewRevenueName e setNewRevenueValue aqui
      await addRevenue(revenue.name, revenue.value);
    });

    // Aguarda todas as promessas de despesas e receitas serem resolvidas
    await Promise.all([...expensePromises, ...revenuePromises]);

    // Limpar inputs após adicionar
    setIsAddingExpense([]);
    setIsAddingRevenue([]);
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

  const handleCancel = () => {
    setIsAddingRevenue([]); // Reseta as receitas que estão sendo adicionadas
    setIsAddingExpense([]); // Reseta as despesas que estão sendo adicionadas
    closeModal(); // Fecha o modal
  };

  const toggleAddRevenue = () => {
    setIsAddingRevenue((prev) => [...prev, { name: "", value: "" }]);
  };

  const toggleAddExpense = () => {
    setIsAddingExpense((prev) => [...prev, { name: "", value: "" }]);
  };

  const updateAddingRevenue = (index, field, value) => {
    setIsAddingRevenue((prev) => {
      const newRevenues = [...prev];
      newRevenues[index][field] = value;
      return newRevenues;
    });
  };

  const updateAddingExpense = (index, field, value) => {
    setIsAddingExpense((prev) => {
      const newExpenses = [...prev];
      newExpenses[index][field] = value;
      return newExpenses;
    });
  };

  return (
    <div className="">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[335px] h-[202px] bg-neutral-100 rounded-lg border border-[#81a0ae] p-6 shadow-lg">
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
          <div className="w-[360px] h-[207px] bg-neutral-100 rounded-lg shadow border border-[#81a0ae] p-6">
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
      <div className="relative w-[727px] mx-auto h-auto bg-neutral-100 rounded-[15px] border-2 border-cinza6 p-4 shadow-md">
        <div className="flex justify-between mb-6">
          <Months className="p-2 mt-4 border rounded-md border-cinza6" />
          <button className="w-[200px] h-[57.69px] shadow bg-neutral-100 rounded-[10px] mr-[220px] border-2 border-cinza6 mt-[5px] text-cinza6 text-sm">
            Repetir Último <br /> Lançamento
          </button>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="flex-1">
            <h2 className="text-lg text-texto1 ml-4 font-semibold mb-2">
              Receitas
            </h2>
            {revenues.map((revenue, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex-1">
                  <div className="text-gray-700 pl-4 cursor-default">
                    {revenue.name}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-[140px] p-2 bg-neutral-100 text-gray-700 border-[2px] border-cinza6 mr-3 rounded-[15px] cursor-default flex items-center justify-center">
                    {formatCurrency(revenue.value)}
                  </div>
                  <button
                    onClick={() => openModal(revenue.id, "revenue")}
                    className="mr-20 text-blue-500 hover:text-blue-700"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            ))}

            {isAddingRevenue.map((revenue, index) => (
              <div className="flex flex-wrap mb-2" key={index}>
                <input
                  type="text"
                  placeholder="Nome da receita"
                  value={revenue.name}
                  onChange={(e) =>
                    updateAddingRevenue(index, "name", e.target.value)
                  }
                  className="flex-1 min-w-[130px] max-w-[200px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md mr-4"
                />
                <input
                  type="text"
                  placeholder="Valor da receita"
                  value={formatCurrency(revenue.value)}
                  onChange={(e) =>
                    updateAddingRevenue(index, "value", e.target.value)
                  }
                  className="flex-1 min-w-[116px] max-w-[200px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md"
                />
              </div>
            ))}
            <button
              onClick={toggleAddRevenue}
              className="flex ml-4 items-center text-blue-500 hover:text-blue-700 mt-4"
            >
              <AddIcon />
              <span className="text-[#0082ba] ml-[8px]">Adicionar item</span>
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-lg text-texto1 font-semibold mb-2">Despesas</h2>
            {expenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <div className="flex-1">
                  <div className="text-gray-700 cursor-default">
                    {expense.name}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-[140px] p-2 bg-neutral-100 text-gray-700 border-[2px] border-cinza6 mr-2 rounded-[15px] cursor-default flex items-center justify-center">
                    {formatCurrency(expense.value)}
                  </div>
                  <button
                    onClick={() => openModal(expense.id, "expense")}
                    className="mr-10 text-red-500 hover:text-red-700"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            ))}

            {isAddingExpense.map((expense, index) => (
              <div className="flex flex-wrap mb-2" key={index}>
                <input
                  type="text"
                  placeholder="Nome da despesa"
                  value={expense.name}
                  onChange={(e) =>
                    updateAddingExpense(index, "name", e.target.value)
                  }
                  className="flex-1 min-w-[130px] max-w-[200px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md mr-4"
                />
                <input
                  type="text"
                  placeholder="Valor da despesa"
                  value={formatCurrency(expense.value)}
                  onChange={(e) =>
                    updateAddingExpense(index, "value", e.target.value)
                  }
                  className="flex-1 min-w-[116px] max-w-[200px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md"
                />
              </div>
            ))}
            <button
              onClick={toggleAddExpense}
              className="flex items-center text-blue-500 hover:text-blue-700 mt-4"
            >
              <AddIcon />
              <span className="text-[#0082ba] ml-[8px]">Adicionar item</span>
            </button>
          </div>
        </div>
        <div className="flex mr-10 justify-end mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-[100px] mr-2 hover:bg-blue-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-primaria text-white rounded-[100px] hover:bg-blue-600"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
