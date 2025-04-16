import React from 'react';
import { TrashIconDash, VinculateIcon } from './IconsDashBoard';

const DropDownDashBoard = ({ onVincular, onExcluir }) => {
  return (
    <div className="w-52 max-w-xs p-2">
      <ul className="w-full">
        <li className="w-full mb-1">
          <button
            onClick={onVincular}
            className="group flex items-center text-texto2 active:text-texto2/50 lg:text-F15 text-F15 font-normal w-full"
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8">
              <VinculateIcon />
            </div>
            <span>Vincular paciente</span>
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={onExcluir}
            className="group flex items-center text-texto2 active:text-texto2/50 lg:text-F15 text-F15 font-normal w-full"
          >
            <div className="flex items-center justify-center w-8 h-8 min-w-8">
              <TrashIconDash />
            </div>
            <span>Excluir paciente</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DropDownDashBoard;