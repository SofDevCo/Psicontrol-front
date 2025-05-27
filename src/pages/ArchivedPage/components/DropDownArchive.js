import { Trash, UnarchiveIcon } from "../../../icons/icons";

const DropDown = ({
  dropdownRef,
  customerId,
  onDelete,
  customers,
  onUnarchive,
}) => {
  return (
    <nav
      className="box-border absolute z-20 max-w-xs pt-8 pl-4 mt-1 border rounded-l-md right-0 top-full border-cinza6 bg-bg2 shadow-default w-[210px] h-[130px]"
      ref={dropdownRef}
    >
      <ul className="flex flex-col justify-between w-full h-[80px]">
        <li className="flex items-center gap-2 mb-1">
          <button
            onClick={() => onUnarchive(customerId)}
            className="flex items-center gap-2 text-texto2 text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50 underline underline-offset-[3px]"
          >
            <UnarchiveIcon />
            Desarquivar
          </button>
        </li>
        
        <li className="flex items-center gap-2">
          <button
            onClick={() => onDelete(customerId)}
            className="flex items-center gap-2 text-texto2 text-[15px] font-normal font-['Open Sans'] hover:text-texto2/50 underline underline-offset-[3px]"
          >
            <Trash />
            Excluir do arquivo
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DropDown;