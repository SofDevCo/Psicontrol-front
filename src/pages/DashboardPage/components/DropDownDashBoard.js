import React from 'react';
import { TrashIconDash, VinculateIcon } from './IconsDashBoard';

const DropDownDashBoard = ({ onVincular, onExcluir }) => {
  return (
    <div className="w-full p-2 md:p-4">
      <ul className="w-full">
        <li className="w-full">
          <button
            onClick={onVincular}
            className="group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-F15 text-F9 font-normal tracking-tight underline w-full"
          >
            <VinculateIcon />
            <span>Vincular paciente</span>
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={onExcluir}
            className="group flex items-center gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-F15 text-F9 font-normal tracking-tight underline w-full"
          >
            <TrashIconDash />
            <span>Excluir paciente</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropDownDashBoard;