import React from 'react'
import { useState } from 'react';

const ModalPaymentDash = ({ onClose, onSave, totalAmount }) => {
    const [paymentAmount, setPaymentAmount] = useState("");
  
    const handleSave = () => {
      if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
        alert("Informe um valor válido.");
        return;
      }
      onSave(paymentAmount);
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
          <h2 className="text-lg font-semibold mb-4">Pagamento de Valor Parcial</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Valor Total</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={`R$ ${totalAmount}`}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Valor Pago</label>
            <input
              type="number"
              className="w-full border rounded-md px-3 py-2 mt-1"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ModalPaymentDash