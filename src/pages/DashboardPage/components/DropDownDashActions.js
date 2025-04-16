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
    <div className="w-52 max-w-xs p-2">
      <ul className="w-full">
        <li className="flex items-center justify-between w-full mb-1">
          <button
            onClick={onOpenModal}
            className={`group flex items-center text-texto2 lg:text-F15 text-F15 font-normal w-full ${
              isSendingInvoice ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSendingInvoice}
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8">
              <SendIcon />
            </div>
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

        <li className="flex items-center justify-between w-full mb-1">
          <button
            onClick={onPartialPayment}
            className="group flex items-center text-texto2 active:text-texto2/50 lg:text-F15 text-F15 font-normal w-full"
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8">
              <PartialIcon />
            </div>
            <span>Pagamento Parcial</span>
          </button>
        </li>

        <li className="flex items-center justify-between w-full mb-1">
          <button
            onClick={onConfirmedPayment}
            className={`group flex items-center text-texto2 active:text-texto2/50 lg:text-F15 text-F15 font-normal w-full ${
              isPaymentConfirmed ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isPaymentConfirmed}
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8 flex-shrink-0">
              <ConfirmPaymentIcon />
            </div>
            <span className="whitespace-nowrap">
              {isPaymentConfirmed ? "Pgto. Confirmado" : "Pagamento Confirmado"}
            </span>
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

        <li className="flex items-center justify-between w-full mb-1">
          <button
            onClick={onConfirmedBillOfSale}
            className={`group flex items-center text-texto2 active:text-texto2/50 lg:text-F15 text-F15 font-normal w-full ${
              isBillOfSaleIssued ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isBillOfSaleIssued}
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8">
              <BillOfSaleIcon />
            </div>
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

        <li className="flex items-center justify-between w-full">
          <button
            onClick={onEditConsultationFee}
            className="group flex items-center text-texto2 active:text-texto2/50 lg:text-F15 text-F15 font-normal w-full"
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8">
              <EditConsultationModalIcon />
            </div>
            <span>Editar Consultas</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropDownDashActions;