import React from 'react'


const DropDownDashActions = ({ onSendEmail, onSendWhatsApp }) => {
    return (
      <nav className="absolute right-0 mt-3 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default rounded-md">
        <ul className="w-[210px] h-auto">
          <li>
            <button 
              onClick={onSendEmail} 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Enviar por Email
            </button>
          </li>
          <li>
            <button 
              onClick={onSendWhatsApp} 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Enviar por WhatsApp
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default DropDownDashActions;