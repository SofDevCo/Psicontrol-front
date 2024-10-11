import { useState } from "react";
import { useModal } from "./useModal";
import { VerifyIcon,  EditIcon} from "../icons/icons";

export const Months = () => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showingMonths, setShowingMonths] = useState(true);

  const getYearsRange = () => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const monthsInRange = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const handleMonthClick = (index) => {
    setSelectedMonth(index);
    closeModal();
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
    setShowingMonths(true);
  };

  const toggleModal = () => {
    if (isModalOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  return (
    <div className="ml-3 relative top-3">
      <button
        onClick={toggleModal}
        className="w-[200px] h-[46px] px-3 py-2 bg-[#0082ba] rounded-[10px] shadow justify-start items-center gap-3 inline-flex">
        <div className="flex items-center gap-2">
          <VerifyIcon />
          <span className="text-neutral-100 text-[21px] font-medium font-['Ubuntu'] tracking-tight">
            {`${monthsInRange[selectedMonth]}/${selectedYear.toString().slice(-2)}`}
          </span>
        </div>
        <span className="ml-1 origin-top-left ">▼</span>
      </button>
      {isModalOpen && (
        <div className="flex flex-col items-center mt-2 bg-neutral-100 shadow-lg rounded-2xl border border-[#81a0ae] p-2 absolute z-10 w-[250px]">
          <div className="flex items-center justify-between w-full px-4 mb-2 border-b border-[#cac4d0]">
            <button
              onClick={() => setShowingMonths(true)}
              className="text-[#5c5c5c] text-sm font-normal font-['Open Sans'] tracking-tight hover:text-black focus:outline-none">
              {monthsInRange[selectedMonth]}
            </button>
            <button
              onClick={() => setShowingMonths(false)}
              className="text-[#5c5c5c] text-sm font-normal font-['Open Sans'] tracking-tight hover:text-black focus:outline-none">
              {selectedYear}
            </button>
          </div>
          <div className="flex flex-col w-full overflow-y-auto max-h-60">
            {showingMonths ? (
              monthsInRange.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthClick(index)}
                  className={`w-full px-3 py-2 text-left rounded-md hover:bg-blue-100 ${
                    selectedMonth === index ? "bg-blue-200 flex items-center" : ""
                  }`}>
                  {selectedMonth === index && <VerifyIcon />}
                  {month}
                </button>
              ))
            ) : (
              getYearsRange().map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`w-full px-3 py-2 text-left rounded-md hover:bg-blue-100 ${
                    selectedYear === year ? "bg-blue-200 flex items-center" : ""
                  }`}>
                  {selectedYear === year && <VerifyIcon />}
                  {year}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};