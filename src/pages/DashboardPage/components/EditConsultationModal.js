import React, { useState, useEffect } from "react";
import {
  EditIcon,
  CloseMiniIcon,
  AddConsultationIcon,
  CloseIconEdit,
} from "../../CustomerPage/components/IconsRegisterCard";

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

  const handleAddDayLocal = () => {
    const dayTrimmed = newDay.trim();
    if (dayTrimmed && !tempDays.includes(dayTrimmed)) {
      setTempDays((prev) => [...prev, dayTrimmed]);
      setNewDay("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddDayLocal();
    }
  };

  const handleRemoveDayLocal = (dayToRemove) => {
    setTempDays((prev) => prev.filter((d) => d !== dayToRemove));
  };

  const handleSaveChanges = async () => {
    if (!patient || !selectedMonth || !selectedYear) {
      alert("Erro: Paciente, mês ou ano não disponível.");
      return;
    }

    setDays(tempDays);
    const daysToRemove = days.filter((day) => !tempDays.includes(day));
    const daysToAdd = tempDays.filter((day) => !days.includes(day));

    if (daysToRemove.length > 0) {
      await onRemoveDay(
        patient.customer_id,
        daysToRemove,
        selectedMonth,
        selectedYear
      );
    }
    if (daysToAdd.length > 0) {
      await Promise.all(
        daysToAdd.map((day) =>
          onAddDay(patient.customer_id, day, selectedMonth, selectedYear)
        )
      );
    }

    await onUpdatePatient(patient.customer_id, tempDays);
    setIsEditing(false);
    onClose();
    window.location.reload();
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
                        onClick={() => handleRemoveDayLocal(day)}
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
