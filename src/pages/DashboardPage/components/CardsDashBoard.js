const CardDashBoard = ({ title, value, isCurrency }) => {
  return (
    <div className="relative bg-clara4 md:border-[3px] border-[1px] border-cinza6 md:mt-[14px] shadow-lg rounded-[10px] md:h-[46px] h-[31px] flex flex-1 flex-col justify-center items-center mt-2">
      <div className="w-full absolute md:-top-4 -top-4 flex justify-center">
        <h3 className="text-center h-auto md:w-auto w-[40px] md:text-texto3 text-texto2 md:text-sm text-F8 font-normal md:font-medium font-ubuntu tracking-tight md:border-[2px] border-clara4 bg-clara4 whitespace-normal break-words">
          {title}
        </h3>
      </div>

      <h3 className="text-center w-full h-auto md:text-lg text-F8 md:font-medium font-ubuntu text-texto2 ">
        {isCurrency && <span >R$</span>}
        <span>{value}</span>
      </h3>
    </div>
  );
};

export default CardDashBoard;
