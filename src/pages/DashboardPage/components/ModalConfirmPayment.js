import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

const ModalConfirmPayment = ({ isOpen, onClose, onConfirm, patient }) => {
  const [tipoPagamento, setTipoPagamento] = useState("total");
  const [valorPago, setValorPago] = useState("");
  const [dataPagamento, setDataPagamento] = useState(format(new Date(), "yyyy-MM-dd"));
  const [formaPagamento, setFormaPagamento] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          },
        });

        const data = await response.json();
        const raw = data.payment_method || "";
        const parsed = raw.startsWith("[")
          ? JSON.parse(raw)
          : raw.split(",").map((m) => m.trim()).filter(Boolean);

        setPaymentMethods(parsed);
      } catch (error) {
        console.error("Erro ao buscar formas de pagamento:", error);
        setPaymentMethods([]);
      }
    };

    if (isOpen) fetchPaymentMethods();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, isOpen]);

  const handleConfirmar = () => {
    if (!formaPagamento) {
      alert("Selecione uma forma de pagamento.");
      return;
    }

    onConfirm({
      tipoPagamento,
      valorPago: tipoPagamento === "parcial" ? valorPago : null,
      dataPagamento,
      formaPagamento,
    });

    onClose();
  };

  if (!isOpen) return null;

  const valorTotal = patient?.total_consultation_fee || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#33B8D14D] backdrop-blur-[6px]">
      <div
        ref={modalRef}
        className="w-[90%] max-w-[400px] bg-white rounded-[10px] shadow-lg p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#0082ba] text-lg font-bold hover:scale-105"
        >
          ×
        </button>

        <h2 className="text-center text-[#0082ba] text-lg font-bold mb-4">
          Confirmação de Pagamento
        </h2>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-[#232323]">
            <input
              type="radio"
              value="total"
              checked={tipoPagamento === "total"}
              onChange={() => setTipoPagamento("total")}
            />
            Pagamento total
          </label>
          <label className="flex items-center gap-2 text-sm text-[#232323] mt-1">
            <input
              type="radio"
              value="parcial"
              checked={tipoPagamento === "parcial"}
              onChange={() => setTipoPagamento("parcial")}
            />
            Pagamento parcial
          </label>
        </div>

        <hr className="mb-3" />

        <div className="mb-4">
          <label className="text-sm text-[#232323] block">Valor total</label>
          <strong className="text-black">
            R$ {parseFloat(valorTotal).toFixed(2).replace(".", ",")}
          </strong>
        </div>

        {tipoPagamento === "parcial" && (
          <div className="mb-4">
            <label className="block mb-1 text-sm text-[#232323]">Valor pago</label>
            <input
              type="text"
              value={valorPago}
              onChange={(e) => setValorPago(e.target.value)}
              className="w-full px-4 py-2 border border-[#81a0ae] rounded-[10px] text-[#232323] placeholder-[#a0a0a0] focus:outline-none focus:ring-2 focus:ring-[#0082ba]"
              placeholder="R$ 0,00"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm text-[#232323]">Data de pagamento</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
            className="w-full px-4 py-2 border border-[#81a0ae] rounded-[10px] text-[#232323] placeholder-[#a0a0a0] focus:outline-none focus:ring-2 focus:ring-[#0082ba]"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm text-[#232323]">Forma de pagamento</label>
          <select
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="w-full px-4 py-2 border border-[#81a0ae] rounded-[10px] text-[#232323] focus:outline-none focus:ring-2 focus:ring-[#0082ba]"
          >
            <option value="">Selecione uma opção</option>
            {paymentMethods.map((method, index) => (
              <option key={index} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConfirmar}
          className="w-full bg-[#0082ba] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#0070a3] transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default ModalConfirmPayment;
