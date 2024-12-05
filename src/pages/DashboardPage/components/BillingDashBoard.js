import React from 'react'

const BillingDashBoard = ({ onClose, onSendEmail, onSendWhatsApp }) =>  {
  return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-md p-6 w-[300px]">
          <h2 className="text-lg font-semibold mb-4">Enviar Cobrança</h2>
          <p className="mb-4">Mensagem de WhatsApp: "Sua cobrança foi gerada. Por favor, pague o valor devido o quanto antes!"</p>
          <div className="flex justify-between">
            <button
              onClick={onSendEmail}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Enviar por Email
            </button>
            <button
              onClick={onSendWhatsApp}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
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
  
export default BillingDashBoard