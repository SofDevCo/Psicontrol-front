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
  const [tempDays, setTempDays] = useState([]);

  useEffect(() => {
    console.log("Modal recebeu o patient:", patient);

    if (patient && patient.consultation_days) {
      const daysArray = patient.consultation_days.split(", ");
      setDays(daysArray);
      setTempDays(daysArray);
    } else {
      setDays([]);
      setTempDays([]);
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const handleAddDayLocal = (event) => {
    if (event.key === "Enter") {
      const dayTrimmed = newDay.trim();
      if (dayTrimmed && !tempDays.includes(dayTrimmed)) {
        setTempDays((prev) => [...prev, dayTrimmed]);
        setNewDay("");
        setIsAdding(false);
      }
    }
  };

  const handleRemoveDayLocal = (dayToRemove) => {
    setTempDays((prev) => prev.filter((d) => d !== dayToRemove));
  };

  const handleSaveChanges = () => {
    setDays(tempDays);
    tempDays.forEach((day) => {
      if (!days.includes(day)) {
        onAddDay(patient.customer_id, day);
      }
    });
    days.forEach((day) => {
      if (!tempDays.includes(day)) {
        onRemoveDay(patient.customer_id, day);
      }
    });
    setIsEditing(false);
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
            {tempDays.map((day, index) => (
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
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2  bg-primaria md:text-sm text-F10 text-texto4 font-semibold font-openSans rounded-[100px] tracking-tight"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditConsultationModal;
