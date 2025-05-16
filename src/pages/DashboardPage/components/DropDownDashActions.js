import React from "react";
import {
  ConfirmPaymentIcon,
  SendIcon,
  BillOfSaleIcon,
  EditConsultationModalIcon,
  ReturnIcon,
  CopyIcon,
  PartialIcon,
} from "./IconsDashBoard";

const DropDownDashActions = ({
  onOpenModal,
  onConfirmedPayment,
  onPartialPayment,
  onEditConsultationFee,
  onOpenReceiptInfo,
  isSendingInvoice = false,
  isPaymentConfirmed = false,
  isBillOfSaleIssued = false,
  onRevertSendingInvoice,
  onRevertPaymentConfirmed,
  onRevertBillOfSale,
  patient,
  selectedMonth,
  selectedYear,
}) => {
  return (
    <div className="w-[240px] h-[230px] max-w-xs pt-8 pl-4">
      <ul className="flex flex-col justify-between w-full h-[185px]">
        <li className="flex items-center justify-between w-full mb-1">
          <button
            onClick={onOpenModal}
            className={`group flex items-center text-texto2 text-F15 font-normal underline underline-offset-[3px] w-full ${
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
              className="p-1 transition-colors rounded-full hover:bg-cinza9"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center justify-between w-full mb-1">
          <button
            onClick={onPartialPayment}
            className="group flex items-center text-texto2 active:text-texto2/50 text-F15 font-normal underline underline-offset-[3px] w-full"
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
            className={`group flex items-center text-texto2 active:text-texto2/50 text-F15 font-normal underline underline-offset-[3px] w-full ${
              isPaymentConfirmed ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isPaymentConfirmed}
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8">
              <ConfirmPaymentIcon />
            </div>
            <span className="whitespace-nowrap">
              {isPaymentConfirmed ? "Pgto. Confirmado" : "Confirmar pagamento"}
            </span>
          </button>
          {isPaymentConfirmed && (
            <button
              onClick={onRevertPaymentConfirmed}
              className="p-1 transition-colors rounded-full hover:bg-cinza9"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center justify-between w-full mb-1">
          <button
            onClick={async () => {
              if (!isBillOfSaleIssued && patient) {
                try {
                  const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/dashboard/confirmBillOfSale`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "authentication_token"
                        )}`,
                      },
                      body: JSON.stringify({
                        customer_id: patient.customer_id,
                        month_and_year: `${selectedYear}-${String(
                          selectedMonth
                        ).padStart(2, "0")}`,
                      }),
                    }
                  );

                  const result = await response.json();

                  if (response.ok && result.data) {
                    onOpenReceiptInfo(result.data);
                  } else {
                    alert(result.error || "Erro ao emitir recibo.");
                  }
                } catch (err) {
                  console.error("Erro ao emitir recibo:", err);
                  alert("Erro inesperado ao emitir recibo.");
                }
              }
            }}
            className={`group flex items-center text-texto2 active:text-texto2/50 text-F15 font-normal underline underline-offset-[3px] w-full ${
              isBillOfSaleIssued ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isBillOfSaleIssued}
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8">
              <CopyIcon />
            </div>
            <span>Recibo Emitido</span>
          </button>
          {isBillOfSaleIssued && (
            <button
              onClick={onRevertBillOfSale}
              className="p-1 transition-colors rounded-full hover:bg-cinza9"
            >
              <ReturnIcon />
            </button>
          )}
        </li>

        <li className="flex items-center justify-between w-full">
          <button
            onClick={onEditConsultationFee}
            className="group flex items-center text-texto2 active:text-texto2/50 text-F15 font-normal underline underline-offset-[3px] w-full"
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
