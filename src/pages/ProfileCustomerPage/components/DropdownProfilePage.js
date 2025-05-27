import { EditIcon, Trash } from "../../../icons/icons";
import { ArchiveIcon } from "./ProfilePageIcons";
import { useOutsideClick } from "../../../utils/OutsideClick/useOutsideClick";
import { Link } from "react-router-dom";
const DropDownProfile = ({
  dropdownRef,
  onClose,
  customerId,
  onDelete,
  setSelectedPatient,
  openModal,
  customer,
  onArchive,
}) => {
  useOutsideClick(dropdownRef, onClose);
  return (
    <nav
      className="absolute right-0 lg:mt-4 mt-1 box-border border-[1px] border-1 border-cinza6 bg-bg2 shadow-dropShadow rounded-l-[5px]"
      ref={dropdownRef}
    >
      <ul className="lg:w-[210px] w-[159px] lg:h-[189px h-[115px]] p-4">
        <li>
          <button
            className="group mt-5 flex items-center gap-2 lg:ml-5 font-['Open Sans']  bg-bg2 lg:text-[15px] text-[10px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => {
              setSelectedPatient(customer);
              openModal();
            }}
          >
            <EditIcon />
            Editar paciente
          </button>
        </li>
        <li>
          <button
            className="group lg:mt-5 flex items-center gap-2 lg:ml-5 font-['Open Sans']  bg-bg2 lg:text-[15px] text-[10px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => onArchive(customerId)}
          >
            <ArchiveIcon />
            <Link to="/customers">Arquivar paciente </Link>
          </button>
        </li>
        <li>
          <button
            className="group mt-5 flex items-center gap-2 lg:ml-6 ml-[2px] font-['Open Sans']  bg-bg2 lg:text-[15px] text-[10px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => onDelete(customerId)}
          >
            <Trash />
            Excluir paciente
          </button>
        </li>
      </ul>
    </nav>
  );
};
export default DropDownProfile;
