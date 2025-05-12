import {
  UserIconBorder,
  ActionModalEditIcon,
  ActionModalTrashIcon,
  ActionModalArchiveIcon,
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
      className="box-border absolute z-20 max-w-xs pt-8 pl-4 mt-1 border rounded-l-md right-0 top-full border-cinza6 bg-bg2 shadow-default w-[210px] h-[189px]"
      ref={dropdownRef}
    >
      <ul className="flex flex-col justify-between sw-full h-[140px]">
        <li className="flex items-center gap-2 mb-1">
          <UserIconBorder />
          <Link
            to={`/customers/${customerId}/profile`}
            className="text-texto2 text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50 underline underline-offset-[3px]"
          >
            Conta do paciente
          </Link>
        </li>

        <li className="flex items-center gap-2 mb-1">
          <button
            onClick={() => {
              const patient = customers.find(
                (c) => c.customer_id === customerId
              );
              if (patient) {
                setSelectedPatient(patient);
              }
              openModal();
            }}
            className="flex items-center gap-2 text-texto2 text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50 underline underline-offset-[3px]"
          >
            <ActionModalEditIcon />
            Editar paciente
          </button>
        </li>

        <li className="flex items-center gap-2 mb-1">
          <button
            onClick={() => onArchive(customerId)}
            className="flex items-center gap-2 text-texto2 text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50 underline underline-offset-[3px]"
          >
            <ActionModalArchiveIcon />
            Arquivar Paciente
          </button>
        </li>

        <li className="flex items-center gap-2">
          <button
            onClick={() => onDelete(customerId)}
            className="flex items-center gap-2 text-texto2 text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50 underline underline-offset-[3px]"
          >
            <ActionModalTrashIcon />
            Excluir paciente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDonw;
