import React, { useState } from "react";

const EditConsultationModal = ({
  isOpen,
  onClose,
  patient,
  onRemoveDay,
  onAddDay,
}) => {
  const [newDay, setNewDay] = useState("");

  if (!isOpen || !patient) return null;

  const handleAddDay = () => {
    if (newDay.trim() && !patient.consultation_days.includes(newDay)) {
      onAddDay(patient.customer_id, newDay.trim());
      setNewDay("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          Editar Consultas - {patient?.customer_name}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {(patient.consultation_days
            ? patient.consultation_days.split(", ")
            : []
          ).map((day, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-3 py-1 rounded-full"
            >
              <span className="mr-2">{day}</span>
              <button
                onClick={() => onRemoveDay(patient.customer_id, day)}
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
            onClick={handleAddDay}
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
