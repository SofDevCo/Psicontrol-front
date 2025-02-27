import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {
  VerifyGreenIcon,
  CrossIcon,
  ArrowDownIcon,
} from "../../DashboardPage/components/IconsDashBoard";
import { FilterIcon } from "../components/ProfilePageIcons";
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
import ModalPaymentDash from "../..//DashboardPage/components/ModalPaymentDash";
import FilterStatusProfilePage from "./FilterStatusProfilePage";
import EditConsultationModalPaymentControl from "./EditConsultationModalPaymentControl";
import { useOutsideClick } from "../../../utils/OutsideClick/useOutsideClick";

const PaymentControlCard = ({
  billingRecords,
  customerId,
  updateBillingRecords,
}) => {
  const [isDropdownOpenPatients, setIsDropdownOpenPatients] = useState(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isPartialPaymentModalOpen, setIsPartialPaymentModalOpen] =
    useState(false);
  const [
    selectedPatientForPartialPayment,
    setSelectedPatientForPartialPayment,
  ] = useState(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [billingMessage, setBillingMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMonthForEdit, setSelectedMonthForEdit] = useState(null);
  const [selectedYearForEdit, setSelectedYearForEdit] = useState(null);
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredBillingRecords, setFilteredBillingRecords] =
    useState(billingRecords);
  const [loading, setLoading] = useState(false);

  const monthsInRangeShort = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const outSideClickRef = useRef(null);

  useOutsideClick(outSideClickRef, () => setIsDropdownOpenPatients(false));

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
    if (typeof updateBillingRecords === "function") {
      updateBillingRecords(updatedData.billingRecords);
    }
  };

  const handleOpenModalForBilling = async (billingRecord) => {
    if (!billingRecord || !billingRecord.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }
    const [year, month] = billingRecord.month.split("-");

    setLoading(true);

    const whatsappResponse = await sendWhatsAppMessage(
      billingRecord.customer_id,
      parseInt(year),
      parseInt(month)
    );

    const emailResponse = await sendEmailMessage(
      billingRecord.customer_id,
      billingRecord.total_consultation_fee || 0,
      parseInt(year),
      parseInt(month)
    );

    if (whatsappResponse.error || emailResponse.error) {
      alert(
        `Erro: ${whatsappResponse.error ? whatsappResponse.error : ""} ${
          emailResponse.error ? emailResponse.error : ""
        }`
      );
      return;
    }

    const mensagemRecebida =
      whatsappResponse?.user_message ||
      whatsappResponse?.message ||
      "Nenhuma mensagem recebida.";
    console.log("Mensagem recebida da API (Ajustada):", mensagemRecebida);
    setBillingMessage(mensagemRecebida);
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
    const [year, month] = billingRecord.month.split("-");

    const response = await confirmPayment(
      billingRecord.customer_id,
      parseInt(year),
      parseInt(month)
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

    const [year, month] = billingRecord.month.split("-");

    const response = await confirmBillOfSale(
      billingRecord.customer_id,
      parseInt(year),
      parseInt(month)
    );

    if (response) {
      alert("Nota fiscal confirmada!");
    }
    await handleUpdateBillingStatus();
  };

  const handleSavePartialPayment = async (paymentAmount) => {
    if (!selectedPatientForPartialPayment) return;

    const { customer_id } = selectedPatientForPartialPayment;

    const [year, month] = selectedPatientForPartialPayment.month.split("-");

    const response = await savePartialPayment(
      customer_id,
      parseInt(year, 10),
      parseInt(month, 10),
      paymentAmount
    );

    if (!response) {
      alert("Erro ao salvar pagamento parcial.");
      return;
    }

    alert("Pagamento parcial salvo com sucesso!");

    if (typeof updateBillingRecords === "function") {
      updateBillingRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.customer_id === customer_id &&
          record.month === selectedPatientForPartialPayment.month
            ? {
                ...record,
                payment_amount: parseFloat(paymentAmount),
                payment_status: "parcial",
              }
            : record
        )
      );
    } else {
      console.error("Erro: updateBillingRecords não é uma função.");
    }
    setIsPartialPaymentModalOpen(false);
  };

  const handleOpenPartialPayment = (patient) => {
    setSelectedPatientForPartialPayment(patient);
    setIsPartialPaymentModalOpen(true);
  };

  useEffect(() => {
    const filteredBillingRecords = () => {
      if (!billingRecords) return;

      const filtered = billingRecords.filter((record) => {
        if (selectedStatus.length === 0) return true;

        const matchesPaymentStatus =
          (selectedStatus.includes("aberto") && !record.payment_status) ||
          selectedStatus.includes(record.payment_status);

        const matchesInvoiceStatus =
          (selectedStatus.includes("realizada") && record.sending_invoice) ||
          (selectedStatus.includes("nao-realizada") && !record.sending_invoice);

        const matchesBillofSaleStatus =
          (selectedStatus.includes("nao-emitidos") && !record.bill_of_sale) ||
          (selectedStatus.includes("emitidos") && record.bill_of_sale);

        return (
          matchesPaymentStatus ||
          matchesInvoiceStatus ||
          matchesBillofSaleStatus
        );
      });

      setFilteredBillingRecords(filtered);
    };

    filteredBillingRecords();
  }, [selectedStatus, billingRecords]);

  const toggleTableSize = () => {
    setIsTableExpanded((prev) => !prev);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  };

  if (!billingRecords || billingRecords.length === 0) {
    return (
      <p className="text-center text-texto2 italic py-4">
        Nenhum dado disponível
      </p>
    );
  }

  const handleEditConsultation = (billingRecord) => {
    const [year, month] = billingRecord.month.split("-");
    setSelectedMonthForEdit(month);
    setSelectedYearForEdit(year);
    setSelectedCustomerForEdit(billingRecord.customer_id);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="flex lg:mt-10 mt-5 ml-2 md:ml-9 lg:auto lg:mx-auto justify-between box-border lg:w-full w-[calc(90vw-40px)] md:w-[89.9%] h-auto mb-8 lg:rounded-B15 rounded-B10 lg:border-[3px] border  border-solid border-cinza6 bg-bg1 z-10 ">
        <div>
          <div className="flex justify-between items-center p-6">
            <p className="lg:text-F25 text-sm text-primaria font-medium font-ubuntu">
              Controle de pagamento
            </p>

            <div className="group relative flex items-center gap-2">
              <FilterStatusProfilePage
                selectedStatus={selectedStatus}
                onChangeStatus={setSelectedStatus}
              />
              <FilterIcon />
            </div>
          </div>
          <table className="table-fixed w-full bg-bg1 mt-1 rounded-B15 text-left overflow-x-auto ">
            <thead>
              <tr>
                <th className="text-center align-middle min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Mês
                </th>
                <th className="text-center align-middle lg:whitespace-nowrap min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Valor Consulta
                </th>
                <th className="text-center align-middle hidden lg:table-cell min-w-[75px]  text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Dias
                </th>
                <th className="text-center align-middle lg:whitespace-nowrap min-w-[100px]  text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Nº de consultas
                </th>
                <th className=" text-center lg:align-middle min-w-[100px]  text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-5 lg:px-4 py-1 lg:py-2">
                  Total
                </th>
                <th className="text-center align-middle min-w-[100px]  text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-3 lg:px-4 py-1 lg:py-2">
                  Cobrança
                </th>
                <th className="text-center align-middle min-w-[100px]  text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-3 lg:px-4 py-1 lg:py-2">
                  Pagamento
                </th>
                <th className="text-center align-middle min-w-[100px]  text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-5 lg:px-4 py-1 lg:py-2">
                  NF
                </th>
                <th className="text-center align-middle min-w-[100px]  text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBillingRecords
                .sort((a, b) => new Date(b.month) - new Date(a.month))
                .slice(0, isTableExpanded ? filteredBillingRecords.length : 4)
                .map((item, index) => (
                  <tr key={index} className="relative text-center">
                    <td className="text-texto1 lg:text-F15 text-F10 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-auto py-2">
                      {item.month
                        ? (() => {
                            const [year, month] = item.month.split("-");
                            const monthIndex = parseInt(month, 10) - 1;
                            return `${monthsInRangeShort[monthIndex]}/${String(year).slice(-2)}`;
                          })()
                        : "-"}
                    </td>
                    <td className="text-center text-texto1 lg:text-F15 text-F10 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                      R${" "}
                      {parseFloat(item.consultation_fee)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                    <td className="hidden lg:table-cell text-center text-texto1 lg:text-F15 text-F10 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                      {item.consultation_days
                        ? item.consultation_days
                            .split(", ")
                            .map(Number)
                            .sort((a, b) => a - b)
                            .join(", ")
                        : "-"}
                    </td>
                    <td className="relative text-center text-texto1 lg:text-F15 text-F10 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2 group">
                      <span>{item.num_consultations}</span>
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-bg2 text-text2 text-xs font-normal py-1 px-2 rounded shadow-md whitespace-nowrap lg:hidden">
                        Dias:{" "}
                        {item.consultation_days
                          ? item.consultation_days
                              .split(", ")
                              .map(Number)
                              .sort((a, b) => a - b)
                              .join(", ")
                          : "Sem dias"}
                      </div>
                    </td>
                    <td className="text-center text-texto1 lg:text-F15 text-F10 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                      R$ {item.total_consultation_fee || "0,00"}
                    </td>
                    <td>
                      <div className="flex items-center justify-center text-center h-full">
                        {item.sending_invoice ? (
                          <VerifyGreenIcon />
                        ) : (
                          <CrossIcon />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center text-center h-full">
                        {" "}
                        {item.payment_status === "pago" ? (
                          <VerifyGreenIcon />
                        ) : item.payment_status === "parcial" ? (
                          <span className="text-texto2 lg:text-F15 text-F10 font-semibold font-['Open Sans'] tracking-tight rounded-B15 border-2 border-aviso">
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
                        {item.bill_of_sale ? (
                          <VerifyGreenIcon />
                        ) : (
                          <CrossIcon />
                        )}
                      </div>
                    </td>

                    <td className="text-center px-2 lg:px-4 py-1 lg:py-2">
                      <button
                        className="cursor-pointer"
                        onClick={() => toggleDropdownPatients(index)}
                      >
                        <HamburguerIcon />
                      </button>

                      {isDropdownOpenPatients === index && (
                        <div
                          ref={outSideClickRef}
                          className="absolute -mt-23 ml-10 md:ml-16 shadow-lg rounded z-20"
                        >
                          <DropDownDashActions
                            onOpenModal={() => handleOpenModalForBilling(item)}
                            onPartialPayment={() =>
                              handleOpenPartialPayment(item)
                            }
                            onConfirmedPayment={() =>
                              handleConfirmPayment(item)
                            }
                            onConfirmedBillOfSale={() =>
                              handleConfirmBillOfSale(item)
                            }
                            onEditConsultationFee={() =>
                              handleEditConsultation(item)
                            }
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8 lg:9" className="relative py-3">
                  <div className="flex justify-center items-center relative w-full transition-all duration-300 lg:mt-4">
                    <button
                      onClick={toggleTableSize}
                      className={`absolute transform cursor-pointer transition-transform duration-300 ${
                        isTableExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <div className="lg:w-[452px] w-[263px] h-[1px] bg-cinza6 absolute top-[-20px] left-1/2 transform -translate-x-1/2 mt-3"></div>
                      <ArrowDownIcon />
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
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
        {isEditModalOpen &&
          selectedMonthForEdit &&
          selectedYearForEdit &&
          selectedCustomerForEdit && (
            <EditConsultationModalPaymentControl
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              selectedMonth={selectedMonthForEdit}
              selectedYear={selectedYearForEdit}
              customerId={selectedCustomerForEdit}
            />
          )}
        <>
          {isPartialPaymentModalOpen && selectedPatientForPartialPayment && (
            <ModalPaymentDash
              onClose={() => setIsPartialPaymentModalOpen(false)}
              onSave={handleSavePartialPayment}
              totalAmount={
                selectedPatientForPartialPayment.total_consultation_fee
              }
            />
          )}
        </>
      </div>
    </>
  );
};

export default PaymentControlCard;
