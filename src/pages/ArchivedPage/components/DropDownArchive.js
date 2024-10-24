import { Trash, UnarchiveIcon } from "../../../icons/icons";

const DropDown = ({
    dropdownRef,
    customerId,
    onDelete,
    setSelectedPatient,
    openModal,
    customers,
    onUnarchive,
  }) => {
    return (
      <nav
        className="absolute right-0 box-border border-[1px] border-solid border-cinza6 bg-bg2 shadow-default"
        ref={dropdownRef}
      >
        <ul>
          <li>
            <button
              className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2"
              onClick={() => onDelete(customerId)}
            >
              <Trash />
              Excluir paciente
            </button>
          </li>
          <li>
            <button
             className="item-center font-['Open Sans'] flex bg-bg2 text-[15px] font-normal not-italic leading-5 tracking-normal text-texto2 underline hover:bg-bg2"
             onClick={()=> onUnarchive(customerId)}
            >
                <UnarchiveIcon/>
                Desarquivar Paciente
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  
  export default DropDown;