import {
    Trash,
    UserIconBorder,
    EditIcon,
  } from "../../../icons/icons";

const DropDonw = ({dropdownRef}) => {
  return (
    <nav
      className="absolute right-0 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default"
      ref={dropdownRef}
    >
      <ul>
        <li>
          <button
            className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2"
            onClick={() => <lable> "Conta do paciente clicada</lable>}
          >
            <UserIconBorder />
            Conta do paciente
          </button>
        </li>
        <li>
          <button
            className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2"
            onClick={() => <label>Editar paciente clicado" </label>}
          >
            <EditIcon />
            Editar paciente
          </button>
        </li>
        <li>
          <button
            className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2"
            onClick={() => <label>Excluir paciente clicado </label>}
          >
            <Trash />
            Excluir paciente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDonw;