import { UserIconBorder } from "../../../icons/icons";
import {
  EditIcon,
  TrashIcon,
  ArchiveIcon,
} from "../components/CustomersPageIcons";
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
      className="box-border absolute z-20 max-w-xs p-2 mt-1 border rounded-md right-8 top-full border-cinza6 bg-bg2 shadow-default w-52"
      ref={dropdownRef}
    >
      <ul className="w-full">
        <li className="flex items-center gap-2 mb-1">
          <UserIconBorder />
          <Link
            to={`/customers/${customerId}/profile`}
            className="text-texto2 text-[9px] lg:text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50"
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
            className="flex items-center gap-2 text-texto2 text-[9px] lg:text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50"
          >
            <EditIcon />
            Editar paciente
          </button>
        </li>

        <li className="flex items-center gap-2 mb-1">
          <button
            onClick={() => onArchive(customerId)}
            className="flex items-center gap-2 text-texto2 text-[9px] lg:text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50"
          >
            <ArchiveIcon />
            Arquivar Paciente
          </button>
        </li>

        <li className="flex items-center gap-2">
          <button
            onClick={() => onDelete(customerId)}
            className="flex items-center gap-2 text-texto2 text-[9px] lg:text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50"
          >
            <TrashIcon />
            Excluir paciente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDonw;
