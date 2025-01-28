import React from "react";

const PaymentControlCard = ({ billingRecords }) => {
  if (!billingRecords || billingRecords.length === 0) {
    return (
      <p className="text-center text-texto2 italic py-4">
        Nenhum dado disponível
      </p>
    );
  }

  return (
    <div className="flex  md:mt-10 md:auto md:mx-auto justify-center box-border w-full h-[443px] md:rounded-B15 rounded-B10 md:border-[3px] border overflow-x-auto border-solid border-cinza6 bg-bg1 z-10 ">
      <div className="overflow-x-auto  ">
        <table className="table-fixed w-full bg-bg1 mt-5 text-left">
          <thead>
            <tr>
              <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-2 md:px-4 py-1 md:py-2">
                Mês
              </th>
              <th className="text-center align-middle md:whitespace-nowrap min-w-[100px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-2 md:px-4 py-1 md:py-2">
                Valor Consulta
              </th>
              <th className="text-center align-middle hidden md:table-cell min-w-[75px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-2 md:px-4 py-1 md:py-2">
                Dias
              </th>
              <th className="text-center align-middle md:whitespace-nowrap min-w-[100px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-2 md:px-4 py-1 md:py-2">
                Nº de consultas
              </th>
              <th className=" text-center md:align-middle min-w-[100px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-5 md:px-4 py-1 md:py-2">
                Total
              </th>
              <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-3 md:px-4 py-1 md:py-2">
                Cobrança
              </th>
              <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-3 md:px-4 py-1 md:py-2">
                Pagamento
              </th>
              <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-5 md:px-4 py-1 md:py-2">
                NF
              </th>
              <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria md:text-lg text-F8 font-medium tracking-tight px-2 md:px-4 py-1 md:py-2">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {billingRecords.map((item, index) => (
              <tr
                key={index}
                className="relative text-center border-t border-gray-300"
              >
                <td className="text-texto1 md:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 md:px-auto py-2">
                  {item.month}
                </td>
                <td className="text-center text-texto1 md:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 md:px-4 py-1 md:py-2">
                  R${" "}
                  {parseFloat(item.consultation_fee)
                    .toFixed(2)
                    .replace(".", ",")}
                </td>
                <td className="hidden md:table-cell text-center text-texto1 md:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 md:px-4 py-1 md:py-2">
                  {item.consultation_days
                    ? item.consultation_days
                        .split(", ")
                        .map(Number)
                        .sort((a, b) => a - b)
                        .join(", ")
                    : "-"}
                </td>
                <td className="relative text-center text-texto1 md:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 md:px-4 py-1 md:py-2 group">
                  {item.num_consultations}
                </td>
                <td className="text-center text-texto1 md:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 md:px-4 py-1 md:py-2">
                  R$ {item.total_consultation_fee || "0,00"}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentControlCard;
