import { useState } from "react";
import { useModal } from "../Modal/useModal";

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
    <div className="relative">
      <button
        onClick={toggleModal}
        className="flex items-center justify-between px-4 py-2 w-[200px] bg-blue-600 text-white shadow-md rounded-lg font-semibold"
      >
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fillRule="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{`${monthsInRange[selectedMonth]} ${selectedYear}`}</span>
        </div>
        <span className="ml-1">▼</span>
      </button>
      {isModalOpen && (
        <div className="flex flex-col items-center mt-2 bg-white shadow-lg rounded-lg p-2 absolute z-10 w-[250px]">
          <div className="flex items-center justify-between w-full px-4 mb-2">
            <button
              onClick={() => setShowingMonths(true)}
              className="text-gray-500 hover:text-black focus:outline-none"
            >
              {monthsInRange[selectedMonth]}
            </button>
            <button
              onClick={() => setShowingMonths(false)}
              className="text-gray-500 hover:text-black focus:outline-none"
            >
              {selectedYear}
            </button>
          </div>
          <div className="flex flex-col w-full overflow-y-auto max-h-60">
            {showingMonths
              ? monthsInRange.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => handleMonthClick(index)}
                    className={`w-full px-3 py-2 text-left rounded-md hover:bg-blue-100 ${
                      selectedMonth === index
                        ? "bg-blue-200 flex items-center"
                        : ""
                    }`}
                  >
                    {selectedMonth === index && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fillRule="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {month}
                  </button>
                ))
              : getYearsRange().map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className={`w-full px-3 py-2 text-left rounded-md hover:bg-blue-100 ${
                      selectedYear === year
                        ? "bg-blue-200 flex items-center"
                        : ""
                    }`}
                  >
                    {selectedYear === year && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fillRule="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {year}
                  </button>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};
