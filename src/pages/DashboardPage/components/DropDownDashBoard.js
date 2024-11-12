import React from 'react'

const DropDownDashBoard  = ({ onVincular, onExcluir }) => {
    return (
      <nav className="absolute right-0 mt-3 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default">
        <ul className="w-[210px] h-[130px]">
          <li>
            <button onClick={onVincular} className="flex items-center gap-2">
              <span>Vincular paciente</span>
            </button>
          </li>
          <li>
            <button onClick={onExcluir} className="flex items-center gap-2">
              <span>Excluir paciente</span>
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  

export default DropDownDashBoard