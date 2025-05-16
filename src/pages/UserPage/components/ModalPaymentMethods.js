import React, { useEffect, useState, useRef } from "react";
import { Trash } from "../../../../src/icons/icons";

const ModalPaymentMethods = ({ isOpen, onClose }) => {
  const [methods, setMethods] = useState([]);
  const [newMethod, setNewMethod] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const fetchPaymentMethods = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
    });

    const data = await response.json();
    try {
      const raw = data.payment_method || "";
      const parsed = raw.startsWith("[")
        ? JSON.parse(raw)
        : raw.split(",").map((m) => m.trim()).filter(Boolean);

      setMethods(parsed);
    } catch {
      setMethods([]);
    }
  };

  const addPaymentMethod = async () => {
    if (!newMethod.trim()) return;

    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/payment-methods`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method: newMethod.trim() }),
    });

    const data = await response.json();
    if (response.ok) {
      setMethods(data.payment_method);
      setNewMethod("");
    } else {
      alert(data.error || "Erro ao adicionar forma de pagamento.");
    }
  };

  const removePaymentMethod = async (method) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user/payment-methods/${encodeURIComponent(method)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      setMethods(data.payment_method);
    } else {
      alert(data.error || "Erro ao remover forma de pagamento.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#33B8D14D] backdrop-blur-[6px]">
      <div
        ref={modalRef}
        className="relative w-[90%] max-w-[500px] bg-white rounded-[10px] shadow-xl p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#0082ba] text-xl font-bold hover:scale-105"
        >
          ×
        </button>

        <h2 className="text-center text-[#0082ba] text-lg font-bold mb-6">
          Formas de Pagamento
        </h2>

        <ul className="mb-6 space-y-3">
          {methods.map((method, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-[16px] text-[#232323]"
            >
              <span>• {method}</span>
              <button
                onClick={() => removePaymentMethod(method)}
                className="text-[#0082ba] hover:scale-110"
              >
                <Trash  />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-1 text-sm text-[#232323] font-medium">
              Adicionar:
            </label>
            <input
              type="text"
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              placeholder="PIX"
              className="w-full sm:w-[300px] px-4 py-2 border border-[#81a0ae] rounded-[10px] text-[#5c5c5c] placeholder-[#a0a0a0] focus:outline-none focus:ring-2 focus:ring-[#0082ba]"
            />
          </div>
          <button
            onClick={addPaymentMethod}
            className="bg-[#0082ba] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#0070a3] transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPaymentMethods;
