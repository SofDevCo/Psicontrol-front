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
  openReturnModal,
}) => {
  return (
    <nav className="absolute right-0 w-[151px] h-[131px] lg:w-[234px] lg:h-auto lg:mt-3 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default rounded-md">
      <ul className="w-[210px] h-auto mx-auto lg:mt-8">
        <li className="flex items-center">
          <button
            onClick={onOpenModal}
            className={`group flex items-center gap-2 py-2 text-texto2 lg:text-[15px] text-[9px] font-normal tracking-tight underline ${isSendingInvoice ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSendingInvoice}
          >
            <SendIcon />
            Enviar Cobrança
          </button>

          {isSendingInvoice && (
            <button
              onClick={onRevertSendingInvoice}
              className="pr-1 scale-75"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center">
          <button
            onClick={onPartialPayment}
            className="group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-[15px] text-[9px] font-normal font-['Open Sans'] tracking-tight underline"
          >
            <PartialIcon />
            Pagamento Parcial
          </button>
        </li>

        <li className="flex items-center">
          <button
            onClick={onConfirmedPayment}
            className={`group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-[15px] text-[9px] font-normal font-['Open Sans'] tracking-tight underline ${isPaymentConfirmed ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isPaymentConfirmed}
          >
            <ConfirmPaymentIcon />
            {isPaymentConfirmed ? "Pgto. Confirmado" : "Pagamento Confirmado"}
          </button>

          {isPaymentConfirmed && (
            <button
              onClick={onRevertPaymentConfirmed}
              className="pr-1 scale-75"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center">
          <button
            onClick={onConfirmedBillOfSale}
            className={`group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-[15px] text-[9px] font-normal font-['Open Sans'] tracking-tight underline ml-2 ${isBillOfSaleIssued ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isBillOfSaleIssued}
          >
            <BillOfSaleIcon />
            Recibo Emitido
          </button>

          {isBillOfSaleIssued && (
            <button
              onClick={onRevertBillOfSale}
              className="pr-1 scale-75"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center">
          <button
            onClick={onEditConsultationFee}
            className="group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-[15px] text-[9px] font-normal font-['Open Sans'] tracking-tight underline ml-2"
          >
            <EditConsultationModalIcon />
            Editar Consultas
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDownDashActions;