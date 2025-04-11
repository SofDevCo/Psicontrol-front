import React, { useState, useEffect } from "react";
import {
  EditIcon,
  CloseMiniIcon,
  AddConsultationIcon,
  CloseIconEdit,
} from "../../CustomerPage/components/IconsRegisterCard";
import { showErrorToast } from "../../../utils/notification/toastify";

const EditConsultationModal = ({
  isOpen,
  onClose,
  patient,
  selectedMonth,
  selectedYear,
  onRemoveDay,
  onAddDay,
  onUpdatePatient,
}) => {
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [tempDays, setTempDays] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (patient && patient.consultation_days) {
      const daysArray = patient.consultation_days.split(", ");
      setDays(daysArray);
      setTempDays(daysArray);
    } else {
      setDays([]);
      setTempDays([]);
    }
  }, [patient, selectedMonth, selectedYear]);

  if (!isOpen || !patient) return null;

  const isValidDayForMonth = (day, month, year) => {
    const dayInt = parseInt(day, 10);
    if (isNaN(dayInt) || dayInt <= 0) return false;

    const lastDay = new Date(year, month, 0).getDate();
    return dayInt <= lastDay;
  };

  const handleAddDayLocal = () => {
    const dayTrimmed = newDay.trim();

    if (!isValidDayForMonth(dayTrimmed, selectedMonth, selectedYear)) {
      showErrorToast(
        `Dia inválido para o mês ${selectedMonth}/${selectedYear}`
      );
      return;
    }

    if (dayTrimmed) {
      setTempDays((prev) => {
        const updatedDays = [...prev, dayTrimmed].sort((a, b) => a - b);
        return updatedDays;
      });
      setNewDay("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddDayLocal();
    }
  };

  const handleRemoveDayLocal = (indexToRemove) => {
    setTempDays((prev) => {
      const newDays = [...prev];
      newDays.splice(indexToRemove, 1);
      return newDays;
    });
  };

  const handleSaveChanges = async () => {
    if (!patient || !selectedMonth || !selectedYear) {
      alert("Erro: Paciente, mês ou ano não disponível.");
      return;
    }

    setDays(tempDays);

    const originalDays = [...days];
    const editedDays = [...tempDays];

    const countDays = (array) => {
      return array.reduce((acc, day) => {
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});
    };

    const originalCount = countDays(originalDays);
    const editedCount = countDays(editedDays);

    const daysToRemove = [];

    for (const day in originalCount) {
      const qtdOriginal = originalCount[day];
      const qtdEdited = editedCount[day] || 0;

      const qtdToRemove = qtdOriginal - qtdEdited;

      if (qtdToRemove > 0) {
        for (let i = 0; i < qtdToRemove; i++) {
          daysToRemove.push(day);
        }
      }
    }

    const daysToAdd = [];

    for (const day in editedCount) {
      const qtdEdited = editedCount[day];
      const qtdOriginal = originalCount[day] || 0;

      const qtdToAdd = qtdEdited - qtdOriginal;

      if (qtdToAdd > 0) {
        for (let i = 0; i < qtdToAdd; i++) {
          daysToAdd.push(day);
        }
      }
    }

    if (daysToRemove.length > 0) {
      await onRemoveDay(
        patient.customer_id,
        daysToRemove,
        selectedMonth,
        selectedYear
      );
    }

    if (daysToAdd.length > 0) {
      await onAddDay(
        patient.customer_id,
        daysToAdd,
        selectedMonth,
        selectedYear
      );
    }

    await onUpdatePatient(patient.customer_id, tempDays);

    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bgM bg-opacity-50 z-30">
      <div className="bg-neutral-100 lg:w-[437px] w-[325px] p-6 rounded-lg shadow-lg border border-cinza6">
        <div className="flex justify-end">
          <button onClick={onClose}>
            <CloseIconEdit />
          </button>
        </div>
        <h1 className="text-center text-primaria text-[21px] font-medium tracking-tight mb-7">
          Editar Consultas
        </h1>
        <span className="text-texto1 text-[15px] font-semibold tracking-tight">
          Paciente:
        </span>
        <br />
        <span className="text-texto1 text-[15px] font-normal tracking-tight">
          {patient.Customer?.customer_name || "Sem nome"}
        </span>
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
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveDayLocal(index)}
                        className="absolute -bottom-5"
                      >
                        <CloseMiniIcon />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {isEditing && (
              <div className="flex items-center mt-4">
                {isAdding && (
                  <input
                    type="text"
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="border-2 border-cinza6 px-3 py-1 rounded-[15px] w-[43px] h-11 appearance-none mr-2 bg-bg1"
                  />
                )}
                <div
                  className="flex items-center justify-center w-[43px] h-11 p-2 rounded-[15px] border-2 border-cinza6 cursor-pointer"
                  onClick={() => {
                    if (isAdding && newDay.trim()) {
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
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="mt-4">
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

export default EditConsultationModal;
