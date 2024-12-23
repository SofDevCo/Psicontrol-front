const CardDashBoard = ({title, value, revenue, netTime}) => {
    return (
        <div className="bg-clara4 md:border-[3px] border-[1px] border-cinza6 md:mt-[14px] shadow-md rounded-[10px] p-4 md:w-[198px] w-[74px] h-[46px] md:flex md:flex-col md:justify-center md:items-center">

        <h3 className="text-texto3/50 md:text-sm text-[8px] md:font-medium font-['Ubuntu'] tracking-tight md:mb-1 md:border-[3px] border-clara4 bg-clara4">{title}</h3>

        <h3 className="md:text-lg md:font-medium font-['Ubuntu'] text-texto2 md:mb-[16px]">{value}</h3>

        <h3 className="w-[104px] h-[19px] text-center text-[#81a0ae] text-sm font-medium font-['Ubuntu'] tracking-tight">{revenue}</h3>

        <h3 className="w-[104px] h-[19px] text-center text-[#81a0ae] text-sm font-medium font-['Ubuntu'] tracking-tight">{netTime}</h3>
      </div>
    );
};

export default CardDashBoard;