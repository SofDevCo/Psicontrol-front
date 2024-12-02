const CardDashBoard = ({title, value, revenue, netTime}) => {
    return (
        <div className="bg-clara4 border-[3px] border-cinza6  shadow-md rounded-[10px] p-4 w-[198px] h-[46px] flex flex-col justify-center items-center">
        <h3 className="text-texto3/50 text-sm font-medium font-['Ubuntu'] tracking-tight mb-1 bg-clara4">{title}</h3>
        <h3 className="text-lg font-medium font-['Ubuntu'] text-texto2 mt-3">{value}</h3>
        <h3 className="w-[104px] h-[19px] text-[#81a0ae] text-sm font-medium font-['Ubuntu'] tracking-tight">{revenue}</h3>
        <h3 className="w-[104px] h-[19px] text-[#81a0ae] text-sm font-medium font-['Ubuntu'] tracking-tight">{netTime}</h3>
      </div>
    );
};

export default CardDashBoard;