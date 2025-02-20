import React, { useState, useEffect } from "react";

const EditConsultationModal = ({
  isOpen,
  onClose,
  patient,
  onRemoveDay,
  onAddDay,
}) => {
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState("");

  useEffect(() => {
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          Editar Consultas - {patient.customer_name}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Agora renderiza a partir de 'days' */}
          {days.map((day, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
            >
              <span className="mr-2">{day}</span>
              <button
                onClick={() => handleRemoveDayLocal(day)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Novo dia"
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
            className="border px-3 py-1 rounded w-full"
          />
          <button
            onClick={handleAddDayLocal}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            +
          </button>
        </div>
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
