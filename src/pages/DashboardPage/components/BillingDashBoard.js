import React from "react";
import { CloseIconMessageModal } from "./IconsDashBoard";

const BillingDashBoard = ({
  onClose,
  onSendEmail,
  onSendWhatsApp,
  message,
}) => {
  const safeMessage = message || "";

  return (
    <div className="fixed inset-0 bg-bgM/30 bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-30">
      <div className="bg-bg1 rounded-B15 p-6 w-[90%] sm:w-[400px] lg:w-[477px] max-h-[90vh] lg:h-[521px] border border-cinza6 lg:border-[3px] mt-[18vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-primaria lg:text-[21px] text-base font-medium font-ubuntu tracking-tight lg:ml-[68px] lg:mt-3">
            Enviar mensagem de cobrança
          </h2>
          <button className="mt-2" onClick={onClose}>
            <CloseIconMessageModal />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[300px] sm:max-h-[350px] mb-10 lg:mb-12 lg:ml-4 w-full text-left text-texto1 lg:text-sm text-[10px] font-openSans tracking-tight">
          <p
            dangerouslySetInnerHTML={{
              __html: safeMessage.replace(/\n/g, "<br />"),
            }}
          ></p>
        </div>

        <div className="border-b border-cinza6 mb-4"></div>
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <button
            onClick={onSendEmail}
            className="w-full h-auto px-4 py-2 bg-bg1 rounded-[100px] border border-primaria text-primaria text-sm font-semibold text-center underline lg:text-sm text-[10px]"
          >
            Enviar por Email
          </button>
          <button
            onClick={onSendWhatsApp}
            className="w-full h-auto px-4 py-2 bg-bg1 rounded-[100px] border border-primaria text-primaria text-sm font-semibold text-center underline lg:text-sm text-[10px]"
          >
            Enviar pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingDashBoard;
