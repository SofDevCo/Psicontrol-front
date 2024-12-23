import { useState } from "react";
import { useModal } from "../Modal/useModal";
import { VerifyIcon, CheckIcon, SetaIcon } from "../../icons/icons";

export const Months = ({ onMonthChange, onYearChange, selectedMonth, selectedYear  }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [showingMonths, setShowingMonths] = useState(true);

  const getYearsRange = () => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const monthsInRange = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const monthsInRangeShort = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  
  const handleMonthClick = (index) => {
    onMonthChange(index + 1); 
  };

  const handleYearClick = (year) => {
    onYearChange(year); 
  };

  const toggleModal = () => {
    if (isModalOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  return (
    <div className="drop-shadow-monthsShadow active:drop-shadow-addShadow active:opacity-50 ml-3 relative top-3">
      <button
        onClick={toggleModal}
        className="md:w-[213px] md:h-[46px] w-[75px] h-[26px] px-3 py-2 bg-[#0082ba] rounded-[10px] shadow justify-start items-center gap-3 inline-flex z-50"
      >
        <div className="flex items-center gap-2">
          <VerifyIcon />
          
          <span className="text-texto4 md:text-[21px] text-[10px] font-medium font-['Ubuntu'] tracking-tight">
          <span className="block md:hidden">{`${monthsInRangeShort[selectedMonth - 1]}/${selectedYear.toString().slice(-2)}`}
          </span>
          <span className="hidden md:block">{`${monthsInRange[selectedMonth - 1]}/${selectedYear.toString().slice(-2)}`}</span>
          </span>
        </div>
        <SetaIcon />
      </button>
      {isModalOpen && (
        <div className="flex flex-col items-center mt-2 bg-neutral-100 shadow-lg rounded-2xl border border-[#81a0ae] p-2 absolute w-[250px] z-50">
          <div className="flex items-center my-3 justify-between w-full px-4 mb-2 border-b border-[#cac4d0]">
            <button
              onClick={() => setShowingMonths(true)}
              className="text-[#5c5c5c] text-sm font-normal font-['Open Sans'] mb-3 tracking-tight hover:text-black focus:outline-none"
            >
              {monthsInRange[selectedMonth - 1]}
            </button>
            <button
              onClick={() => setShowingMonths(false)}
              className="text-[#5c5c5c] text-sm font-normal font-['Open Sans'] tracking-tight mb-3 hover:text-black focus:outline-none"
            >
              {selectedYear}
            </button>
          </div>
          <div className="flex flex-col w-full overflow-y-auto max-h-60 ">
            {showingMonths
              ? monthsInRange.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => handleMonthClick(index)}
                    className={`w-full px-3 py-2 text-left rounded-md hover:bg-blue-100 ${
                      selectedMonth - 1 === index ? "bg-blue-100 flex items-center" : ""
                    }`}
                  >
                    {selectedMonth - 1 === index && <CheckIcon />}
                    <span className="block md:hidden">{monthsInRangeShort[index]}</span>
                    <span className="hidden md:block">{month}</span>
                  </button>
                ))
              : getYearsRange().map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className={`w-full px-3 py-2 text-left rounded-md hover:bg-blue-100 ${
                      selectedYear === year ? "bg-blue-200 flex items-center" : ""
                    }`}
                  >
                    {selectedYear === year && <CheckIcon />}
                    {year}
                  </button>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};
