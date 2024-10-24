import {
  Trash,
  UserIconBorder,
  EditIcon,
  ArchiveIcon,
} from "../../../icons/icons";
import { Link } from "react-router-dom";

const DropDonw = ({
  dropdownRef,
  customerId,
  onDelete,
  setSelectedPatient,
  openModal,
  customers,
  onArchive,
}) => {
  return (
    <nav
      className="absolute right-0 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default"
      ref={dropdownRef}
    >
      <ul className="w-[210px] h-[189px]">
        <li>
          <button
            className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => <lable> "Conta do paciente clicada</lable>}
          >
            <UserIconBorder />
            <Link to={`/customers/${customerId}/profile`}> Conta do paciente </Link>
          </button>
        </li>
        <li>
          <button
            className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => {
              const patient = customers.find(
                (c) => c.customer_id === customerId
              );
              if (patient) {
                setSelectedPatient(patient);
              }
              openModal();
            }}
          >
            <EditIcon />
            Editar paciente
          </button>
        </li>
        <li>
          <button
            className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => onDelete(customerId)}
          >
            <Trash />
            Excluir paciente
          </button>
        </li>
        <li>
          <button
            className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => onArchive(customerId)}
          >
            <ArchiveIcon />
            ArquivarPaciente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDonw;
