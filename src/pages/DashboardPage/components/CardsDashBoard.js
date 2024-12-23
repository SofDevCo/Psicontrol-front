const CardDashBoard = ({title, value, revenue, netTime}) => {
    return (
        <div className="bg-clara4 md:border-[3px] border-[1px] border-cinza6 md:mt-[14px] shadow-md rounded-[10px] p-4 w-[74px] h-[31px] md:w-full md:h-[46px] flex flex-col justify-center items-center mt-2">

        <h3 className="text-center w-[52px] h-[18px] md:w-[107px] md:h-[19px]md:text-texto3 text-texto2 md:text-sm text-[8px] font-normal md:font-medium font-['Ubuntu'] tracking-tight md:border-[2px] border-clara4 bg-clara4 md:mb-1 mb-1">{title}</h3>

        <h3 className="text-center w-[52px] h-[18px] md:w-[107px] md:h-[19px] md:text-lg text-[10px] md:font-medium font-['Ubuntu'] text-texto2 md:mb-[25px] mb-3">{value}</h3>

        <h3 className="w-[104px] h-[19px] text-center text-[#81a0ae] text-sm font-medium font-['Ubuntu'] tracking-tight">{revenue}</h3>

        <h3 className="w-[104px] h-[19px] text-center text-[#81a0ae] text-sm font-medium font-['Ubuntu'] tracking-tight">{netTime}</h3>
      </div>
    );
};

export default CardDashBoard;