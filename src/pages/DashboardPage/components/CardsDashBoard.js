const CardDashBoard = ({ title, value, isCurrency }) => {
  return (
    <div className="relative bg-clara4 lg:border-[3px] border-[1px] border-cinza6 lg:mt-[14px] shadow-lg rounded-[10px] lg:h-[46px] h-[31px] flex flex-1 flex-col justify-center items-center mt-2">
      <div className="w-full absolute lg:-top-4 -top-4 flex justify-center">
        <h3 className="text-center h-auto lg:w-auto w-[40px] lg:text-texto3 text-texto2 lg:text-sm text-F8 font-normal lg:font-medium font-ubuntu tracking-tight lg:border-[2px] border-clara4 bg-clara4 whitespace-normal break-words">
          {title}
        </h3>
      </div>

      <h3 className="text-center w-full h-auto lg:text-lg text-F8 lg:font-medium font-ubuntu text-texto2 ">
        {isCurrency && <span >R$</span>}
        <span>{value}</span>
      </h3>
    </div>
  );
};

export default CardDashBoard;
