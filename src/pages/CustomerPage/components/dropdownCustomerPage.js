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
      className="absolute md:right-0 right-3 mt-32 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default"
      ref={dropdownRef}
    >
      <ul className="md:w-[210px] w-[151px]  md:h-[189px] h-[131.08px] md:ml-0">
        <li>
          <button
            className="group mt-5 flex items-center gap-2 md:ml-7 ml-6 font-['Open Sans'] bg-bg2 md:text-[15px] text-[9px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => <label> "Conta do paciente clicada"</label>}
          >
            <UserIconBorder />
            <Link to={`/customers/${customerId}/profile`}>
              {" "}
              Conta do paciente{" "}
            </Link>
          </button>
        </li>
        <li>
          <button
            className="group md:mt-5 mt-1 flex items-center gap-2 md:ml-6 ml-6 font-['Open Sans'] bg-bg2 md:text-[15px] text-[9px]  font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
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
            className="group md:mt-5 mt-1 flex items-center md:gap-3 gap-2 md:ml-8 ml-7 font-['Open Sans'] bg-bg2 md:text-[15px] text-[9px]  font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => onDelete(customerId)}
          >
            <TrashIcon />
            Excluir paciente
          </button>
        </li>
        <li>
          <button
            className="group md:mt-6 mt-1 flex items-center md:gap-2 gap-2 md:ml-8 ml-7 font-['Open Sans'] bg-bg2 md:text-[15px] text-[9px]  font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => onArchive(customerId)}
          >
            <ArchiveIcon />
            Arquivar Paciente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDonw;
