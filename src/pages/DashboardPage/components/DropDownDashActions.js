import React from "react";
import {
  ConfirmPaymentIcon,
  SendIcon,
  PartialIcon,
  BillOfSaleIcon,
  EditConsultationModalIcon,
  ReturnIcon,
} from "./IconsDashBoard";

const DropDownDashActions = ({
  onOpenModal,
  onPartialPayment,
  onConfirmedPayment,
  onConfirmedBillOfSale,
  onEditConsultationFee,
  isSendingInvoice = false,
  isPaymentConfirmed = false,
  isBillOfSaleIssued = false,
  onRevertSendingInvoice,
  onRevertPaymentConfirmed,
  onRevertBillOfSale,
}) => {
  return (
    <div className="w-full p-2 md:p-4">
      <ul className="w-full">
        <li className="flex items-center justify-between w-full">
          <button
            onClick={onOpenModal}
            className={`group flex items-center gap-2 py-2 text-texto2 lg:text-F15 text-F9 font-normal tracking-tight underline w-full ${
              isSendingInvoice ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSendingInvoice}
          >
            <SendIcon />
            <span>Enviar Cobrança</span>
          </button>

          {isSendingInvoice && (
            <button
              onClick={onRevertSendingInvoice}
              className="p-1 hover:bg-cinza9 rounded-full transition-colors"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center w-full">
          <button
            onClick={onPartialPayment}
            className="group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-F15 text-F9 font-normal tracking-tight underline w-full"
          >
            <PartialIcon />
            <span>Pagamento Parcial</span>
          </button>
        </li>

        <li className="flex items-center justify-between w-full">
          <button
            onClick={onConfirmedPayment}
            className={`group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-F15 text-F9 font-normal tracking-tight underline w-full ${
              isPaymentConfirmed ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isPaymentConfirmed}
          >
            <ConfirmPaymentIcon />
            <span>{isPaymentConfirmed ? "Pgto. Confirmado" : "Pagamento Confirmado"}</span>
          </button>

          {isPaymentConfirmed && (
            <button
              onClick={onRevertPaymentConfirmed}
              className="p-1 hover:bg-cinza9 rounded-full transition-colors"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center justify-between w-full">
          <button
            onClick={onConfirmedBillOfSale}
            className={`group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-F15 text-F9 font-normal tracking-tight underline w-full ${
              isBillOfSaleIssued ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isBillOfSaleIssued}
          >
            <BillOfSaleIcon />
            <span>Recibo Emitido</span>
          </button>

          {isBillOfSaleIssued && (
            <button
              onClick={onRevertBillOfSale}
              className="p-1 hover:bg-cinza9 rounded-full transition-colors"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center w-full">
          <button
            onClick={onEditConsultationFee}
            className="group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-F15 text-F9 font-normal tracking-tight underline w-full"
          >
            <EditConsultationModalIcon />
            <span>Editar Consultas</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropDownDashActions;