import React from 'react'
import { TrashIconDash, VinculateIcon } from './IconsDashBoard';

const DropDownDashBoard  = ({ onVincular, onExcluir }) => {
  return (
    <nav className="absolute w-[210px] h-[130px] right-0 mt-3 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default rounded-l-md">
      <ul className="w-full h-full flex flex-col justify-center items-center">
        <li className="w-full">
          <button
            onClick={onVincular}
            className="flex items-center justify-center w-full gap-2 py-2 text-texto2 md:text-F15 font-normal font-openSans underline tracking-tight"
          >
            <VinculateIcon />
            <span>Vincular paciente</span>
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={onExcluir}
            className="flex items-center justify-center w-full gap-6 py-2 text-texto2 md:text-F15 font-normal font-openSans underline tracking-tight"
          >
            <TrashIconDash />
            <span>Excluir paciente</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDownDashBoard