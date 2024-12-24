const CardDashBoard = ({ title, value,  isCurrency}) => {
  return (
    <div className="bg-clara4 md:border-[3px] border-[1px] border-cinza6 md:mt-[14px] shadow-lg rounded-[10px] p-4 w-[60px] h-[31px] md:w-[198px] md:h-[46px] flex flex-col justify-center items-center mt-2">
      <h3 className="text-center md:w-[107px] md:h-[auto] w-full h-auto md:text-texto3 text-texto2 md:text-sm text-[8px] font-normal md:font-medium font-['Ubuntu'] tracking-tight md:border-[2px] border-clara4 bg-clara4 md:mb-1 mb-1 ">
        {title}
      </h3>

      <h3 className="text-center md:w-[198px] md:h-auto w-full h-auto md:text-lg text-[10px] md:font-medium font-['Ubuntu'] text-texto2 md:mb-[25px] mb-3">
        {isCurrency && <span className="-ml-2">R$</span>}
        <span>{value}</span>
      </h3>
    </div>
  );
};

export default CardDashBoard;
