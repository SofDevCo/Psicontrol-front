import React from 'react'
import { TrashIconDash, VinculateIcon } from './IconsDashBoard';

const DropDownDashBoard  = ({ onVincular, onExcluir }) => {
  return (
    <nav className="absolute lg:w-[210px] lg:h-[130px] h-[77px] right-0 mt-3 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default rounded-l-md">
      <ul className="lg:w-full w-[151px] h-full flex flex-col justify-center items-center">
      <li className="w-full">
          <button
            onClick={onVincular}
            className="group flex items-center justify-center w-full gap-2 py-2 text-texto2 active:text-texto2/50 lg:text-F15 text-F9 font-normal font-openSans underline tracking-tight"
          >
            <VinculateIcon />
            <span>Vincular paciente</span>
          </button>
        </li>
        <li className="lg:w-full">
          <button
            onClick={onExcluir}
            className="group flex items-center justify-center w-full lg:gap-6 gap-3 py-2 text-texto2 active:text-texto2/50 lg:text-F15 text-F9  font-normal font-openSans underline tracking-tight"
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