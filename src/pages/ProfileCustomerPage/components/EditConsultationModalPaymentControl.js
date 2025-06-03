import React, { useState, useEffect } from "react";
import {
  EditIcon,
  CloseMiniIcon,
  AddConsultationIcon,
  CloseIconEdit,
} from "../../CustomerPage/components/IconsRegisterCard";
import { AddDay, RemoveDay } from "../../../service/pagesService/pagesService";
import { showErrorToast } from "../../../utils/notification/toastify";

const isValidDayForMonth = (day, month, year) => {
  const dayInt = parseInt(day, 10);
  if (isNaN(dayInt) || dayInt <= 0) return false;
  const lastDay = new Date(year, month, 0).getDate();
  return dayInt <= lastDay;
};

const EditConsultationModalPaymentControl = ({
  isOpen,
  onClose,
  selectedMonth,
  selectedYear,
  customerId,
  onRemoveDay,
  onAddDay,
  updateBillingRecords,
}) => {
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [tempDays, setTempDays] = useState([]);

  useEffect(() => {
    if (!selectedMonth || !selectedYear || !customerId) return;

    const fetchDays = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dashboard/billing-records?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok && data.billingRecords.length > 0) {
        const daysArray = data.billingRecords
          .filter((record) => record.customer_id === customerId)
          .flatMap((record) => record.consultation_days?.split(", ") || []);
        const sorted = daysArray
          .map(Number)
          .sort((a, b) => a - b)
          .map(String);
        setDays(sorted);
        setTempDays(sorted);
      } else {
        setDays([]);
        setTempDays([]);
      }
    };

    fetchDays();
  }, [selectedMonth, selectedYear, customerId]);

  if (!isOpen || !customerId) return null;

  const handleAddDayLocal = () => {
    const d = newDay.trim();
    if (!isValidDayForMonth(d, selectedMonth, selectedYear)) {
      showErrorToast(
        `Dia inválido para o mês ${selectedMonth}/${selectedYear}`
      );
      return;
    }
    if (!d) return;

    setTempDays((prev) =>
      [...prev, d]
        .map(Number)
        .sort((a, b) => a - b)
        .map(String)
    );
    setNewDay("");
    setIsAdding(false);
  };

  const handleAddDayKey = (e) => {
    if (e.key === "Enter") handleAddDayLocal();
  };

  const handleRemoveDayLocal = (indexToRemove) => {
    setTempDays((prev) => {
      const arr = [...prev];
      arr.splice(indexToRemove, 1);
      return arr
        .map(Number)
        .sort((a, b) => a - b)
        .map(String);
    });
  };

  const handleSaveChanges = async () => {
    if (!customerId || !selectedMonth || !selectedYear) {
      alert("Erro: cliente, mês ou ano não disponível.");
      return;
    }

    const countDays = (arr) =>
      arr.reduce((acc, d) => {
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {});
    const originalCount = countDays(days);
    const editedCount = countDays(tempDays);

    const daysToRemove = [];
    for (const d in originalCount) {
      const diff = originalCount[d] - (editedCount[d] || 0);
      for (let i = 0; i < diff; i++) daysToRemove.push(d);
    }

    const daysToAdd = [];
    for (const d in editedCount) {
      const diff = editedCount[d] - (originalCount[d] || 0);
      for (let i = 0; i < diff; i++) daysToAdd.push(d);
    }

    if (daysToRemove.length > 0) {
      await onRemoveDay(customerId, daysToRemove, selectedMonth, selectedYear);
      updateBillingRecords((prev) =>
        prev.map((rec) =>
          rec.customer_id === customerId &&
          rec.month === `${selectedYear}-${selectedMonth}`
            ? {
                ...rec,
                consultation_days: rec.consultation_days
                  .split(", ")
                  .filter((d) => !daysToRemove.includes(d))
                  .join(", "),
              }
            : rec
        )
      );
    }

    if (daysToAdd.length > 0) {
      await onAddDay(customerId, daysToAdd, selectedMonth, selectedYear);
    }

    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-opacity-50 bg-bgM">
      <div className="bg-neutral-100 lg:w-[437px] w-[325px] p-6 rounded-lg shadow-lg border border-cinza6">
        <div clas sName="flex justify-end">
          <button onClick={onClose}>
            <CloseIconEdit />
          </button>
        </div>
        <h1 className="text-center text-primaria text-[21px] font-medium tracking-tight mb-7">
          Editar Consultas - {selectedMonth}/{selectedYear}
        </h1>
        <div className="mt-4">
          <span className="text-texto1 text-[15px] font-semibold tracking-tight">
            Dias de consulta
          </span>
          <div className="mt-2">
            {!isEditing ? (
              <span>{tempDays.join(", ") || "Nenhum dia cadastrado"}</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tempDays.map((day, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center w-[43px] h-11 p-2 rounded-[15px] border-2 border-cinza6"
                  >
                    <span className="mb-1">{day}</span>
                    <button
                      onClick={() => handleRemoveDayLocal(index)}
                      className="absolute -bottom-5"
                    >
                      <CloseMiniIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center mt-4">
              {isAdding && (
                <input
                  type="text"
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  onKeyDown={handleAddDayKey}
                  className="border-2 border-cinza6 px-3 py-1 rounded-[15px] w-[43px] h-11 appearance-none mr-2 bg-bg1"
                />
              )}
              <div
                className="flex items-center justify-center w-[43px] h-11 p-2 rounded-[15px] border-2 border-cinza6 cursor-pointer"
                onClick={() => {
                  if (isAdding) {
                    handleAddDayLocal();
                  } else {
                    setIsAdding(true);
                  }
                }}
              >
                <AddConsultationIcon />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setIsEditing(!isEditing);
            if (!isEditing) setIsAdding(false);
          }}
          className="mt-4"
        >
          {!isEditing && <EditIcon />}
        </button>

        <div className="flex justify-end">
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-primaria lg:text-sm text-F10 text-texto4 font-semibold font-openSans rounded-[100px] tracking-tight"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConsultationModalPaymentControl;
