import React from 'react'


const DropDownDashActions = ({ onOpenModal }) => {
  return (
    <nav className="absolute right-0 mt-3 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default rounded-md">
      <ul className="w-[210px] h-auto">
        <li>
          <button 
            onClick={onOpenModal} 
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Enviar Cobrança
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDownDashActions;