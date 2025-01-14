import React from "react";
import { CloseIconMessageModal } from "./IconsDashBoard";

const BillingDashBoard = ({
  onClose,
  onSendEmail,
  onSendWhatsApp,
  message,
}) => {
  return (
    <div className="fixed inset-0 bg-bgM/30 bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-30">
      <div className="bg-bg1 rounded-B15 p-6 md:w-[477px] w-[280px] md:h-[521px] h-[386px] border border-cinza6 md:border-[3px] md:mt-64 md:ml-64  mt-[18vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-center text-primaria md:text-[21px] text-sm font-medium font-ubuntu tracking-tight md:ml-16 md:mt-3">
            Enviar mensagem de cobrança
          </h2>
          <button onClick={onClose}>
            <CloseIconMessageModal />
          </button>
        </div>
        <p
          className="md:mb-10 mb-3 md:ml-8 w-[403px] text-texto1 md:text-sm text-[10px]  font-openSans tracking-tight "
          dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, "<br />") }}
        ></p>
        <div className="border-b border-cinza6 mb-12"></div>
        <div className="flex justify-between md:ml-8 gap-4">
          <button
            onClick={onSendEmail}
            className="w-full md:h-[39px] h-[29px] px-auto bg-bg1 rounded-[100px] border border-primaria justify-center items-center gap-12 inline-flex text-center text-primaria md:text-sm text-[10px] font-semibold font-['Open Sans'] underline tracking-tight"
          >
            Enviar por Email
          </button>
          <button
            onClick={onSendWhatsApp}
            className="w-full md:h-[39px] h-[29px] px-auto   bg-bg1 rounded-[100px] border border-primaria justify-center items-center gap-2 inline-flex text-center text-primaria md:text-sm  text-[10px] font-semibold font-['Open Sans'] underline tracking-tight"
          >
            Enviar pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default BillingDashBoard;
