import React from "react";

const BillingDashBoard = ({
  onClose,
  onSendEmail,
  onSendWhatsApp,
  message,
}) => {
  return (
    <div className="fixed inset-0 bg-bgM/30 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-bg1 rounded-md p-6 w-[477px] h-[521px]">
        <h2 className="w-[303px] text-primaria text-[21px] font-medium font-['Ubuntu'] tracking-tight">
          Enviar mensagem de cobrança
        </h2>
        <p
          className="mb-4 w-[403px] h-[347.32px]"
          dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, "<br />") }}
        ></p>
        <div className="flex justify-between">
          <button
            onClick={onSendEmail}
            className="h-[39px] px-6 py-2.5 bg-bg1 rounded-[100px] border border-primaria justify-center items-center gap-2 inline-flex text-center text-primaria text-sm font-semibold font-['Open Sans'] underline tracking-tight"
          >
            Enviar por Email
          </button>
          <button
            onClick={onSendWhatsApp}
            className="h-[39px] px-6 py-2.5 bg-bg1 rounded-[100px] border border-primaria justify-center items-center gap-2 inline-flex text-center text-primaria text-sm font-semibold font-['Open Sans'] underline tracking-tight"
          >
            Enviar por WhatsApp
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-gray-700"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default BillingDashBoard;
