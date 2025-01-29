import React, { useEffect } from "react";
import { useState } from "react";
import {
  VerifyGreenIcon,
  CrossIcon,
} from "../../DashboardPage/components/IconsDashBoard";
import {
  sendEmailMessage,
  sendWhatsAppMessage,
  confirmBillOfSale,
  confirmPayment,
  savePartialPayment,
  fetchCustomerProfile,
} from "../../../service/pagesService/pagesService";
import { HamburguerIcon } from "../../../icons/icons";
import BillingDashBoard from "../../DashboardPage/components/BillingDashBoard";
import DropDownDashActions from "../../DashboardPage/components/DropDownDashActions";

const PaymentControlCard = ({
  billingRecords,
  customerId,
  updateBillingRecords,
}) => {
  const [isDropdownOpenPatients, setIsDropdownOpenPatients] = useState(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [billingMessage, setBillingMessage] = useState("");
  const [selectedYear] = useState(new Date().getFullYear());
  const [selectedMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  const toggleDropdownPatients = (index) => {
    setIsDropdownOpenPatients((prev) => (prev === index ? null : index));
  };

  const handleUpdateBillingStatus = async () => {
    if (!customerId) {
      alert("Erro: ID do cliente não encontrado.");
      return;
    }

    setLoading(true);
    const response = await fetchCustomerProfile(customerId);
    setLoading(false);

    if (!response.ok) {
      alert("Erro ao buscar os dados do cliente.");
      return;
    }

    const updatedData = await response.json();
    updateBillingRecords(updatedData.billingRecords);
  };

  const handleOpenModalForBilling = async (billingRecord) => {
    if (!billingRecord || !billingRecord.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    setLoading(true);

    const whatsappResponse = await sendWhatsAppMessage(
      billingRecord.customer_id,
      selectedYear,
      selectedMonth
    );

    const emailResponse = await sendEmailMessage(
      billingRecord.customer_id,
      billingRecord.total_consultation_fee || 0,
      selectedYear,
      selectedMonth
    );

    if (whatsappResponse.error || emailResponse.error) {
      alert(
        `Erro: ${whatsappResponse.error ? whatsappResponse.error : ""} ${
          emailResponse.error ? emailResponse.error : ""
        }`
      );
      return;
    }

    setBillingMessage(whatsappResponse.user_message);
    setSelectedPatient({
      ...billingRecord,
      whatsappLink: whatsappResponse.whatsappLink,
      mailtoLink: emailResponse.mailtoLink,
    });

    setIsBillingModalOpen(true);
  };

  const handleSendWhatsApp = async () => {
    if (!selectedPatient || !selectedPatient.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    alert("Redirecionando para o WhatsApp...");
    window.open(selectedPatient.whatsappLink, "_blank");

    await handleUpdateBillingStatus();
    setIsBillingModalOpen(false);
  };

  const handleSendEmail = async () => {
    if (!selectedPatient || !selectedPatient.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    alert("Abrindo cliente de e-mail...");
    window.open(selectedPatient.mailtoLink, "_blank");

    await handleUpdateBillingStatus();
    setIsBillingModalOpen(false);
  };

  const closeBillingModal = () => {
    setIsBillingModalOpen(false);
    setSelectedPatient(null);
  };

  const handleConfirmPayment = async (billingRecord) => {
    if (!billingRecord || !billingRecord.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    const response = await confirmPayment(
      billingRecord.customer_id,
      selectedYear,
      selectedMonth
    );

    if (response) {
      alert("Pagamento confirmado!");
    }
    await handleUpdateBillingStatus();
  };

  const handleConfirmBillOfSale = async (billingRecord) => {
    if (!billingRecord || !billingRecord.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    const response = await confirmBillOfSale(
      billingRecord.customer_id,
      selectedYear,
      selectedMonth
    );

    if (response) {
      alert("Nota fiscal confirmada!");
    }
    await handleUpdateBillingStatus();
  };

  const handleOpenPartialPayment = async (billingRecord) => {
    if (!billingRecord || !billingRecord.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    setSelectedPatient(billingRecord);
    setIsBillingModalOpen(true);
  };

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
                <td>
                  <div className="flex items-center justify-center text-center h-full">
                    {item.sending_invoice ? <VerifyGreenIcon /> : <CrossIcon />}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center text-center h-full">
                    {" "}
                    {item.payment_status === "pago" ? (
                      <VerifyGreenIcon />
                    ) : item.payment_status === "parcial" ? (
                      <span className="text-texto2 md:text-F15 text-F8 font-semibold font-['Open Sans'] tracking-tight rounded-B15 border-2 border-aviso">
                        R${" "}
                        {parseFloat(item.payment_amount || 0)
                          .toFixed(2)
                          .replace(".", ",")}
                      </span>
                    ) : (
                      <CrossIcon />
                    )}{" "}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center text-center h-full">
                    {item.bill_of_sale ? <VerifyGreenIcon /> : <CrossIcon />}
                  </div>
                </td>

                <td className="text-center px-2 md:px-4 py-1 md:py-2">
                  <button
                    className="cursor-pointer"
                    onClick={() => toggleDropdownPatients(index)}
                  >
                    <HamburguerIcon />
                  </button>

                  {isDropdownOpenPatients === index && (
                    <div className="absolute right-0 shadow-lg rounded p-2 z-20">
                      <DropDownDashActions
                        onOpenModal={() => handleOpenModalForBilling(item)}
                        onPartialPayment={() => handleOpenPartialPayment(item)}
                        onConfirmedPayment={() => handleConfirmPayment(item)}
                        onConfirmedBillOfSale={() =>
                          handleConfirmBillOfSale(item)
                        }
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isBillingModalOpen && selectedPatient && (
        <BillingDashBoard
          onClose={closeBillingModal}
          onSendWhatsApp={() => handleSendWhatsApp(selectedPatient)}
          onSendEmail={() => handleSendEmail(selectedPatient)}
          message={billingMessage}
        />
      )}
    </div>
  );
};

export default PaymentControlCard;
