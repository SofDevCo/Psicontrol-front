import React from "react";
import { useState } from "react";

const ModalPaymentDash = ({ onClose, onSave, totalAmount }) => {
  const [paymentAmount, setPaymentAmount] = useState("");

  const formatCurrency = (value) => {
    if (typeof value !== "string") {
      value = value?.toString() || "0";
    }
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "R$ 00,00";
    return (parseFloat(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const parseCurrency = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return parseFloat(numericValue) || 0;
  };

  const handleInputChange = (e) => {
    setPaymentAmount(formatCurrency(e.target.value));
  };

  const handleSave = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert("Informe um valor válido.");
      return;
    }
    onSave(parseCurrency(paymentAmount));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bgM bg-opacity-30 z-50 ">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] border border-cinza6">
        <h2 className="text-center md:text-F21 text-primaria font-medium font-ubuntu mb-4 tracking-tight">
          Pagamento de Valor Parcial
        </h2>
        <div className="mb-4">
          <label className="block ml-12 text-texto1 text-F15 font-normal font-openSans tracking-tight">
            Valor Total
          </label>
          <input
            type="text"
            className="w-[159.85px] h-[42.21px] text-center text-texto2 border-2 border-cinza6 rounded-B15 px-3 py-2 mt-1"
            value={`R$ ${totalAmount.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block ml-12 text-texto1 text-F15 font-normal font-openSans tracking-tight">
            Valor Pago
          </label>
          <input
            type="text"
            placeholder="R$ 00,00"
            className="w-[159.85px] h-[42.21px] text-center text-texto2 border-2 border-cinza6 rounded-B15 px-3 py-2 mt-1"
            value={paymentAmount}
            onChange={handleInputChange}
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

export default ModalPaymentDash;
