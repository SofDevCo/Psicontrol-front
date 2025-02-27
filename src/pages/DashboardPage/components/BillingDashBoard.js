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
      <div className="bg-bg1 rounded-B15 p-6 lg:w-[477px] w-[280px] lg:h-[521px] h-[386px] border border-cinza6 lg:border-[3px] lg:mt-64 lg:ml-64  mt-[18vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-center text-primaria lg:text-[21px] text-sm font-medium font-ubuntu tracking-tight lg:ml-16 lg:mt-3">
            Enviar mensagem de cobrança
          </h2>
          <button onClick={onClose}>
            <CloseIconMessageModal />
          </button>
        </div>
        <p
          className="lg:mb-10 mb-3 lg:ml-8 w-[403px] text-texto1 lg:text-sm text-[10px] font-openSans tracking-tight "
          dangerouslySetInnerHTML={{
            __html: safeMessage.replace(/\n/g, "<br />"),
          }}
        ></p>
        <div className="border-b border-cinza6 mb-12"></div>
        <div className="flex justify-between lg:ml-8 gap-4">
          <button
            onClick={onSendEmail}
            className="w-full lg:h-[39px] h-[29px] px-auto bg-bg1 rounded-[100px] border border-primaria justify-center items-center gap-12 inline-flex text-center text-primaria lg:text-sm text-[10px] font-semibold font-['Open Sans'] underline tracking-tight"
          >
            Enviar por Email
          </button>
          <button
            onClick={onSendWhatsApp}
            className="w-full lg:h-[39px] h-[29px] px-auto   bg-bg1 rounded-[100px] border border-primaria justify-center items-center gap-2 inline-flex text-center text-primaria lg:text-sm  text-[10px] font-semibold font-['Open Sans'] underline tracking-tight"
          >
            Enviar pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingDashBoard;
