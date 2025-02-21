import React, { useState, useEffect } from "react";
import {
  EditIcon,
  CloseMiniIcon,
  AddConsultationIcon,
} from "../../CustomerPage/components/IconsRegisterCard";

const EditConsultationModal = ({
  isOpen,
  onClose,
  patient,
  onRemoveDay,
  onAddDay,
}) => {
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    console.log("Modal recebeu o patient:", patient);

    if (patient && patient.consultation_days) {
      setDays(patient.consultation_days.split(", "));
    } else {
      setDays([]);
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const handleAddDayLocal = (event) => {
    if (event.key === "Enter") {
      const dayTrimmed = newDay.trim();
      if (dayTrimmed && !days.includes(dayTrimmed)) {
        setDays((prev) => [...prev, dayTrimmed]);
        onAddDay(patient.customer_id, dayTrimmed);
        setNewDay("");
        setIsAdding(false);
      }
    }
  };

  const handleRemoveDayLocal = (dayToRemove) => {
    setDays((prev) => prev.filter((d) => d !== dayToRemove));
    onRemoveDay(patient.customer_id, dayToRemove);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-neutral-100 w-[437px] p-6 rounded-lg shadow-lg border border-cinza6">
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
          <div className="flex flex-wrap gap-2 mt-2">
            {days.map((day, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center w-[43px] h-auto p-2 rounded-[15px] border-2 border-cinza6"
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
          {isEditing && (
            <div className="flex items-center mt-4">
              {isAdding && (
                <input
                  type="text"
                  placeholder="Novo dia"
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  onKeyDown={handleAddDayLocal}
                  className="border-2 border-cinza6 px-3 py-1 rounded-[15px] w-[43px] h-auto appearance-none mr-2"
                />
              )}
              <div
                className="flex items-center justify-center w-[43px] h-auto p-2 rounded-[15px] border-2 border-cinza6 cursor-pointer"
                onClick={() => setIsAdding(true)}
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
          {isEditing ? <CloseMiniIcon /> : <EditIcon />}
        </button>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConsultationModal;
