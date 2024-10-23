import React, { useState, useEffect } from "react";
import { Trash, AddIcon } from "../../icons/icons";
import { Months } from "../../utils/Months/months";
import {
  showSaveToast,
  showErrorToast,
  showDeleteToast,
} from "../../utils/notification/toastify";

const formatCurrency = (value) => {
  if (typeof value !== "string") {
    value = value?.toString() || "0";
  }
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "R$ 0,00";
  return (parseFloat(numericValue) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const parseCurrency = (value) => {
  const numericValue = value.replace(/[^0-9]/g, "");
  return parseFloat(numericValue) || 0;
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
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    String(new Date().getFullYear())
  );

  const [isExpenseButtonClicked, setIsExpenseButtonClicked] = useState(false);

  const addExpense = async (name, value) => {
    if (name.trim() && selectedMonth && selectedYear) {
      const newExpense = {
        name: name,
        value: value || "0,00",
      };

      try {
        const formattedDate = `01/${String(selectedMonth).padStart(2, "0")}/${selectedYear}`;

        const response = await fetch(`http://localhost:3000/income/expense`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newExpense.name,
            value: parseCurrency(newExpense.value) / 100,
            date: formattedDate,
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          console.error("Erro ao adicionar despesa:", responseData);
        } else {
          setExpenses((prevExpenses) => [...prevExpenses, responseData]);
        }
      } catch (error) {
        console.error("Erro ao adicionar despesa:", error);
      }
    }
  };

  const addRevenue = async (name, value) => {
    if (name.trim() && value && selectedMonth && selectedYear) {
      const newRevenue = {
        name: name,
        value: value,
      };

      try {
        const formattedDate = `01/${String(selectedMonth).padStart(2, "0")}/${selectedYear}`;

        const response = await fetch(`http://localhost:3000/income/revenue`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newRevenue.name,
            value: parseCurrency(newRevenue.value) / 100,
            date: formattedDate,
          }),
        });

        const responseData = await response.json();
        if (!response.ok) {
          console.error("Erro ao adicionar receita:", responseData);
        } else {
          setRevenues((prevRevenues) => [...prevRevenues, responseData]);
        }
      } catch (error) {
        console.error("Erro ao adicionar receita:", error);
      }
    }
  };

  const repeatLastMonthEntries = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/income/entries/repeat-last-month",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedMonth: String(selectedMonth),
            selectedYear: String(selectedYear),
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setRevenues((prevRevenues) => [...prevRevenues, ...result.newRevenues]);
        setExpenses((prevExpenses) => [...prevExpenses, ...result.newExpenses]);
        alert("Entradas do mês passado duplicadas com sucesso!");
      } else if (response.status === 400) {
        const errorData = await response.json();
        alert(errorData.message);
      } else {
        console.error("Erro ao duplicar entradas:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao duplicar entradas:", error);
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
    showDeleteToast();
    setIsSuccessModalOpen(true);
  };

  const handleClick = async () => {
    const expensePromises = isAddingExpense.map(async (expense) => {
      await addExpense(expense.name, expense.value);
    });

    const revenuePromises = isAddingRevenue.map(async (revenue) => {
      await addRevenue(revenue.name, revenue.value);
    });

    await Promise.all([...expensePromises, ...revenuePromises]);

    showSaveToast();

    setIsAddingExpense([]);
    setIsAddingRevenue([]);
  };

  const loadExpenses = async (month, year) => {
    const monthYear = `${month}/${year.slice(-2)}`;
    console.log(`Chamando API: /income/expense?monthYear=${monthYear}`);

    try {
      const response = await fetch(
        `http://localhost:3000/income/expense?monthYear=${monthYear}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const expenseData = await response.json();
        setExpenses(expenseData);
        console.log("Despesas carregadas:", expenseData);
      }
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
    }
  };

  const loadRevenues = async (month, year) => {
    const monthYear = `${month}/${year.slice(-2)}`;
    console.log(`Chamando API: /income/revenue?monthYear=${monthYear}`);

    try {
      const response = await fetch(
        `http://localhost:3000/income/revenue?monthYear=${monthYear}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const revenueData = await response.json();
        setRevenues(revenueData);
        console.log("Receitas carregadas:", revenueData);
      }
    } catch (error) {
      console.error("Erro ao carregar receitas:", error);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const initialMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const initialYear = String(currentDate.getFullYear());

    setSelectedMonth(initialMonth);
    setSelectedYear(initialYear);

    loadExpenses(initialMonth, initialYear);
    loadRevenues(initialMonth, initialYear);
  }, []);

  const handleMonthChange = (month) => {
    const formattedMonth = String(month).padStart(2, "0");
    console.log("Mês selecionado:", formattedMonth);
    setSelectedMonth(formattedMonth);
  };

  const handleYearChange = (year) => {
    const formattedYear = String(year);
    console.log("Ano selecionado:", formattedYear);
    setSelectedYear(formattedYear);
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      setExpenses([]);
      setRevenues([]);

      loadExpenses(selectedMonth, selectedYear);
      loadRevenues(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const handleCancel = () => {
    setIsAddingRevenue([]);
    setIsAddingExpense([]);
    closeModal();
  };

  const toggleAddRevenue = () => {
    setIsAddingRevenue((prev) => [...prev, { name: "", value: "" }]);
  };

  const toggleAddExpense = () => {
    setIsAddingExpense((prev) => [...prev, { name: "", value: "" }]);
    setIsExpenseButtonClicked((prev) => !prev);
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
          <div className="w-[335px] h-[202px] bg-white rounded-lg border-2 border-[#81a0ae] p-6 shadow-lg transform translate-x-[117px] translate-y-[-169px]">
            <div className="w-full text-center mx-auto mb-6">
              <span className="text-[#5c5c5c] text-[21px] font-medium font-['Ubuntu'] tracking-tight">
                Você tem certeza que <br />
                deseja
                <span className="text-[#0082ba]"> excluir </span>
                este <br /> ítem?
              </span>
            </div>

            <div className="flex justify-around">
              <button
                onClick={closeModal}
                className="h-10 w-[100px] bg-white border border-[#0082ba] text-[#0082ba] rounded-full text-center font-semibold hover:bg-[#e6f4f8]"
              >
                Não
              </button>
              <button
                onClick={confirmDelete}
                className="h-10 w-[100px] bg-[#0082ba] text-white rounded-full text-center font-semibold hover:bg-[#007bb8]"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-[727px] mx-auto h-auto bg-neutral-100 rounded-[15px] border-2 border-cinza6 p-4 shadow-md">
        <div className="flex justify-between mb-6">
          <Months
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            className="p-2 mt-4 border rounded-md border-cinza6"
          />
          <button
            className="w-[200px] h-[57.69px] shadow bg-neutral-100 drop-shadow-lastMonthShadow active:drop-shadow-lg active:opacity-75 rounded-[10px] mr-[220px] border-2 font-['Ubuntu'] border-primaria mt-[5px] text-primaria text-xs font-medium"
            onClick={repeatLastMonthEntries}
          >
            REPETIR LANÇAMENTO DO
            <br /> MÊS ANTERIOR
          </button>
        </div>
        <div className="flex flex-wrap gap-6 z-10">
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
                <div className="flex ml-8 items-center">
                  <div className="w-[140px] p-2  bg-neutral-100 text-gray-700 border-[2px] border-cinza6 mr-2 rounded-[15px] cursor-default flex justify-center">
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
              <div className="flex flex-wrap ml-4 mb-2" key={index}>
                <input
                  type="text"
                  placeholder="Nome da receita"
                  value={revenue.name}
                  onChange={(e) =>
                    updateAddingRevenue(index, "name", e.target.value)
                  }
                  className="flex w-[140px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md mr-4"
                />
                <input
                  type="text"
                  placeholder="Valor da receita"
                  value={formatCurrency(revenue.value)}
                  onChange={(e) =>
                    updateAddingRevenue(index, "value", e.target.value)
                  }
                  className="flex w-[118px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md"
                />
              </div>
            ))}
            <button
              onClick={toggleAddRevenue}
              className="flex ml-4 z-[-1]  items-center mt-4 active:drop-shadow-lg active:opacity-50 transition-shadow"
            >
              <AddIcon />
              <span className="text-primaria ml-[8px]">Adicionar item</span>
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
                  className="flex w-[146px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md mr-4"
                />
                <input
                  type="text"
                  placeholder="Valor da despesa"
                  value={formatCurrency(expense.value)}
                  onChange={(e) =>
                    updateAddingExpense(index, "value", e.target.value)
                  }
                  className="flex w-[118px] p-2 bg-neutral-100 text-gray-700 border border-cinza6 focus:border-cinza6 focus:outline focus:ring rounded-md"
                />
              </div>
            ))}
            <button
              onClick={toggleAddExpense}
              className="flex drop-shadow-addShadow ml-4 active:drop-shadow-lg active:opacity-50 items-center mt-4 transition-shadow"
            >
              <AddIcon />
              <span className="text-primaria ml-[8px]">Adicionar item</span>
            </button>
          </div>
        </div>
        <div className="flex mr-10 justify-end mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border w-[108px] h-[39px] item-center border-primaria text-primaria rounded-[100px] mr-2 "
          >
            Cancelar
          </button>
          <button
            onClick={handleClick}
            className="px-4 py-2 w-[90px] h-[40px] bg-primaria drop-shadow-saveShadow active:drop-shadow-sm text-white rounded-[100px]"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
