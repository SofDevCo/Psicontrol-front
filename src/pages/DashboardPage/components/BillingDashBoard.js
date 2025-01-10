import React from "react";
import { CloseIconMessageModal } from "./IconsDashBoard";

const BillingDashBoard = ({
  onClose,
  onSendEmail,
  onSendWhatsApp,
  message,
}) => {
  return (
    <div className="fixed inset-0 bg-bgM/30 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-bg1 rounded-B15 p-6 w-[477px] h-[521px] border-cinza6 border-[3px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-center text-primaria text-[21px] font-medium font-ubuntu tracking-tight ml-16 mt-3">
            Enviar mensagem de cobrança
          </h2>
          <button onClick={onClose}>
            <CloseIconMessageModal />
          </button>
        </div>
        <p
          className="mb-10 ml-8 w-[403px] text-text1 text-sm font-openSans tracking-tight "
          dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, "<br />") }}
        ></p>
        <div className="w- border-b border-cinza6 mb-12"></div>
        <div className="flex justify-between ml-8 gap-4">
          <button
            onClick={onSendEmail}
            className="w-full h-[39px] px-auto bg-bg1 rounded-[100px] border border-primaria justify-center items-center gap-12 inline-flex text-center text-primaria text-sm font-semibold font-['Open Sans'] underline tracking-tight"
          >
            Enviar por Email
          </button>
          <button
            onClick={onSendWhatsApp}
            className="w-full h-[39px] px-auto  bg-bg1 rounded-[100px] border border-primaria justify-center items-center gap-2 inline-flex text-center text-primaria text-sm font-semibold font-['Open Sans'] underline tracking-tight"
          >
            Enviar pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default BillingDashBoard;
