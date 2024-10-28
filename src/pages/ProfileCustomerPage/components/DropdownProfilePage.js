import { EditIcon, Trash, ArchiveIcon } from "../../../icons/icons";

const DropDownProfile = ({
  dropdownRef,
  customerId,
  onDelete,
  setSelectedPatient,
  openModal,
  customer,
  onArchive,
}) => {
  return (
    <nav
      className="absolute right-0 mt-4 box-border border-[1px] border-1 border-cinza6 bg-bg2 shadow-dropShadow rounded-l-[5px]"
      ref={dropdownRef}
    >
      <ul className="w-[210px] h-[189px] p-4">
        <li>  
          <button
            className="group mt-5 flex items-center gap-2 ml-6 font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
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
            className="group mt-5 flex items-center gap-2 ml-6 font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
            onClick={() => onDelete(customerId)}
          >
            <Trash />
            Excluir paciente
          </button>
        </li>
        <li>
          <button
            className="group mt-5 flex items-center gap-2 ml-6 font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2 hover:text-texto2/50"
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

export default DropDownProfile;
