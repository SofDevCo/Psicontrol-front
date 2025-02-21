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

  useEffect(() => {
    console.log("Modal recebeu o patient:", patient);

    if (patient && patient.consultation_days) {
      setDays(patient.consultation_days.split(", "));
    } else {
      setDays([]);
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const handleAddDayLocal = () => {
    const dayTrimmed = newDay.trim();
    if (dayTrimmed && !days.includes(dayTrimmed)) {
      setDays((prev) => [...prev, dayTrimmed]);
      onAddDay(patient.customer_id, dayTrimmed);
      setNewDay("");
    }
  };

  const handleRemoveDayLocal = (dayToRemove) => {
    setDays((prev) => prev.filter((d) => d !== dayToRemove));
    onRemoveDay(patient.customer_id, dayToRemove);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-neutral-100 w-[437px] h-[341px] p-6 rounded-lg shadow-lg border border-cinza6">
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
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-texto1 text-[15px] font-semibold tracking-tight">
              Dias de consulta
            </span>
            <div className="flex flex-wrap gap-2">
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
          </div>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <CloseMiniIcon /> : <EditIcon />}
          </button>
        </div>
        {isEditing && (
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              placeholder="Novo dia"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="border-2 border-cinza6 px-3 py-1 rounded-[15px] w-[43px] h-auto"
            />
            <button
              onClick={handleAddDayLocal}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              +
            </button>
          </div>
        )}
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
