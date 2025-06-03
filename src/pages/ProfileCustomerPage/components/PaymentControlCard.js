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
  savePayment,
  fetchCustomerProfile,
  revertSendingInvoice,
  revertBillOfSale,
  revertPaymentConfirmation,
  AddDay,
  RemoveDay,
} from "../../../service/pagesService/pagesService";
import { HamburguerIcon } from "../../../icons/icons";
import BillingDashBoard from "../../DashboardPage/components/BillingDashBoard";
import DropDownDashActions from "../../DashboardPage/components/DropDownDashActions";
import ModalPaymentDash from "../../DashboardPage/components/ModalPaymentDash";
import FilterStatusProfilePage from "./FilterStatusProfilePage";
import EditConsultationModalPaymentControl from "./EditConsultationModalPaymentControl";
import { useOutsideClick } from "../../../utils/OutsideClick/useOutsideClick";
import Dropdown from "../../../components/Dropdown";
import ReturnPatientModal from "../../DashboardPage/components/ReturnPatientModal";
import ModalConfirmPayment from "../../DashboardPage/components/ModalConfirmPayment";
import ModalReceiptInfo from "../../DashboardPage/components/ModalReceiptInfo";

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
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnAction, setReturnAction] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isModalReceiptOpen, setIsModalReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isModalConfirmPaymentOpen, setIsModalConfirmPaymentOpen] =
    useState(false);
  const [
    selectedPatientForConfirmPayment,
    setSelectedPatientForConfirmPayment,
  ] = useState(null);
  const [selectedYearForConfirm, setSelectedYearForConfirm] = useState(null);
  const [selectedMonthForConfirm, setSelectedMonthForConfirm] = useState(null);
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
  const patientDropdownRefs = useRef({});

  useOutsideClick(outSideClickRef, () => setIsDropdownOpenPatients(false));

  const openReturnModal = (action) => {
    console.log("Guardando action no estado", action);

    setReturnAction(() => action);
    setIsReturnModalOpen(true);
  };

  const handleOpenConfirmPaymentModal = (record) => {
    const [year, month] = record.month.split("-");
    setSelectedYearForConfirm(parseInt(year, 10));
    setSelectedMonthForConfirm(parseInt(month, 10));
    setSelectedPatientForConfirmPayment(record);
    setIsModalConfirmPaymentOpen(true);
  };

  const handleOpenReceiptModal = async (record) => {
    if (!record.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    const [yearStr, monthStr] = record.month.split("-");
    const year = parseInt(yearStr, 10);
    const monthAndYear = `${yearStr}-${monthStr.padStart(2, "0")}`;

    const response = await confirmBillOfSale({
      customer_id: record.customer_id,
      month_and_year: monthAndYear,
    });

    if (!response || response.error) {
      alert(response?.error || "Erro ao buscar dados do Recibo.");
      return;
    }

    const {
      payer_name,
      payer_cpf,
      alternative_payer,
      alternative_cpf,
      total_consultation_fee,
      num_consultations,
      consultation_days,
    } = response.data;

    setReceiptData({
      payerName: payer_name,
      payerCPF: payer_cpf,
      AlternativePayer: alternative_payer,
      AlternativeCPF: alternative_cpf,
      amount: parseFloat(total_consultation_fee || 0)
        .toFixed(2)
        .replace(".", ","),
      paymentDate: new Date().toLocaleDateString("pt-BR"),
      description: `Valor referente às consultas realizadas em ${monthStr}/${year}, total de ${
        num_consultations || 0
      } consultas nos dias ${consultation_days || "não informados"}.`,
    });

    updateBillingRecords((prev) =>
      prev.map((r) =>
        r.customer_id === record.customer_id && r.month === record.month
          ? { ...r, bill_of_sale: true }
          : r
      )
    );

    setIsModalReceiptOpen(true);
  };

  const closeReturnModal = () => {
    setIsReturnModalOpen(false);
    setReturnAction(null);
  };

  const handleConfirmReturn = () => {
    if (returnAction) returnAction();
    closeReturnModal();
  };

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

    const response = await savePayment(
      billingRecord.customer_id,
      parseInt(year),
      parseInt(month),
      null,
      "total",
      new Date().toISOString().split("T")[0],
      "PIX"
    );

    if (!response || response.error) {
      alert("Erro ao confirmar pagamento.");
      return;
    }

    alert("Pagamento confirmado!");
    await handleUpdateBillingStatus();
  };

  const handleConfirmBillOfSale = async (record) => {
    if (!record?.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    const [year, month] = record.month.split("-");
    const response = await confirmBillOfSale(
      record.customer_id,
      parseInt(year, 10),
      parseInt(month, 10)
    );
    if (!response || response.error) {
      alert(response?.error || "Erro ao emitir NF/Recibo.");
      return;
    }

    const {
      payer_name,
      payer_cpf,
      alternative_payer,
      alternative_cpf,
      total_consultation_fee,
      payment_date,
      num_consultations,
      consultation_days,
    } = response.data;

    const newReceiptData = {
      payerName: payer_name,
      payerCPF: payer_cpf,
      AlternativePayer: alternative_payer,
      AlternativeCPF: alternative_cpf,
      amount: parseFloat(total_consultation_fee || 0)
        .toFixed(2)
        .replace(".", ","),
      paymentDate: payment_date
        ? payment_date.split("T")[0].split("-").reverse().join("/")
        : "Data não informada",
      description: `Valor referente às consultas realizadas em ${month}/${year}, total de ${num_consultations || 0} consultas nos dias ${consultation_days || "não informados"}.`,
    };

    updateBillingRecords((prev) =>
      prev.map((r) =>
        r.customer_id === record.customer_id
          ? { ...r, bill_of_sale: true, receiptData: newReceiptData }
          : r
      )
    );

    setReceiptData(newReceiptData);
    setIsModalReceiptOpen(true);
  };

  const handleSavePartialPayment = async (
    paymentAmount,
    dataPagamento,
    formaPagamento
  ) => {
    if (!selectedPatientForPartialPayment) return;

    const { customer_id } = selectedPatientForPartialPayment;
    const [year, month] = selectedPatientForPartialPayment.month.split("-");

    const response = await savePayment(
      customer_id,
      parseInt(year, 10),
      parseInt(month, 10),
      "parcial",
      dataPagamento,
      formaPagamento,
      paymentAmount
    );

    if (!response || response.error) {
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
                payment_amount: parseFloat(
                  paymentAmount.replace("R$", "").replace(",", ".")
                ),
                payment_status: "parcial",
              }
            : record
        )
      );
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
      <p className="py-4 italic text-center text-texto2">
        Nenhum dado disponível
      </p>
    );
  }

  const handleEditConsultation = (billingRecord) => {
    const [year, month] = billingRecord.month.split("-");

    setSelectedCustomerForEdit(billingRecord.customer_id);
    setSelectedYearForEdit(year);
    setSelectedMonthForEdit(month);

    setIsEditModalOpen(true);
  };

  const handleRemoveDay = async (customerId, daysToRemove) => {
    if (
      !selectedCustomerForEdit ||
      !selectedMonthForEdit ||
      !selectedYearForEdit
    ) {
      alert("Erro: Paciente ou mês não disponível.");
      return;
    }

    const month = String(selectedMonthForEdit).padStart(2, "0");
    const year = String(selectedYearForEdit);

    const response = await RemoveDay(
      customerId,
      daysToRemove,
      parseInt(month, 10),
      parseInt(year, 10)
    );

    if (response.ok) {
      updateBillingRecords((prev) =>
        prev.map((r) => {
          if (r.customer_id === customerId && r.month === `${year}-${month}`) {
            const updatedDays = (r.consultation_days || "")
              .split(", ")
              .filter((dayStr) => !daysToRemove.includes(dayStr))
              .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

            const newCount = updatedDays.length;
            const fee = parseFloat(r.consultation_fee || 0);

            return {
              ...r,
              consultation_days: updatedDays.join(", "),
              num_consultations: newCount,
              total_consultation_fee: (newCount * fee).toFixed(2),
            };
          }
          return r;
        })
      );

      alert("Dias removidos com sucesso!");
      setIsEditModalOpen(false);
    } else {
      alert(response.error || "Erro ao remover dias.");
    }
  };

  const handleAddDay = async (customerId, days) => {
    if (
      !selectedCustomerForEdit ||
      !selectedMonthForEdit ||
      !selectedYearForEdit
    ) {
      alert("Erro: Paciente ou mês não disponível.");
      return;
    }

    const month = String(selectedMonthForEdit).padStart(2, "0");
    const year = String(selectedYearForEdit);

    const response = await AddDay(
      customerId,
      days,
      parseInt(month, 10),
      parseInt(year, 10)
    );

    if (response.ok) {
      updateBillingRecords((prev) =>
        prev.map((r) =>
          r.customer_id === customerId && r.month === `${year}-${month}`
            ? {
                ...r,
                consultation_days: r.consultation_days
                  ? `${r.consultation_days}, ${days}`
                  : `${days}`,
              }
            : r
        )
      );
      setIsEditModalOpen(false);
    } else {
      const data = await response.json();
      alert(data.error || "Erro ao adicionar dia.");
    }
  };

  const updatePatientDays = (customerId, newDays) => {
    updateBillingRecords((prev) =>
      prev.map((r) =>
        r.customer_id === customerId
          ? { ...r, consultation_days: newDays.join(", ") }
          : r
      )
    );
  };

  const handleRevertSendingInvoice = async (billingRecord) => {
    if (!billingRecord?.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }

    const [yearStr, monthRaw] = billingRecord.month.split("-");
    const month = monthRaw.toString().padStart(2, "0");

    const response = await revertSendingInvoice(
      billingRecord.customer_id,
      yearStr,
      month
    );

    if (response?.ok) {
      await handleUpdateBillingStatus();
    } else {
      return;
    }
  };

  const handleRevertPaymentConfirmation = async (record) => {
    if (!record?.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }
    const [yearStr, monthRaw] = record.month.split("-");
    const month = monthRaw.toString().padStart(2, "0");

    const response = await revertPaymentConfirmation(
      record.customer_id,
      yearStr,
      month
    );
    if (response?.ok) {
      await handleUpdateBillingStatus();
    } else {
      return;
    }
  };

  const handleRevertBillOfSale = async (record) => {
    if (!record?.customer_id) {
      alert("ID do cliente não encontrado.");
      return;
    }
    const [yearStr, monthRaw] = record.month.split("-");
    const month = monthRaw.toString().padStart(2, "0");

    const response = await revertBillOfSale(record.customer_id, yearStr, month);

    if (response?.ok) {
      await handleUpdateBillingStatus();
    } else {
      return;
    }
  };

  return (
    <>
      <div className="flex lg:mt-10 mt-5 ml-4 md:ml-9 lg:mx-auto justify-between box-border w-[calc(100%-32px)] md:w-[89.9%] lg:w-full h-auto mb-8 lg:rounded-B15 rounded-B10 lg:border-[3px] border border-solid border-cinza6 bg-bg1 z-10">
        <div className="w-full">
          <div className="flex items-center justify-between p-6">
            <p className="text-sm font-medium lg:text-F25 text-primaria font-ubuntu">
              Controle de pagamento
            </p>

            <div className="relative flex items-center gap-2 group">
              <FilterStatusProfilePage
                selectedStatus={selectedStatus}
                onChangeStatus={setSelectedStatus}
              />
              <FilterIcon />
            </div>
          </div>
          <table className="w-full mt-1 text-left table-fixed bg-bg1 rounded-B15">
            <thead>
              <tr>
                <th className="text-center align-middle min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Mês
                </th>
                <th className="text-center align-middle lg:whitespace-nowrap min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Valor Consulta
                </th>
                <th className="text-center align-middle hidden lg:table-cell min-w-[75px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Dias
                </th>
                <th className="text-center align-middle lg:whitespace-nowrap min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                  Nº de consultas
                </th>
                <th className="text-center lg:align-middle min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-5 lg:px-4 py-1 lg:py-2">
                  Total
                </th>
                <th className="text-center align-middle min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-3 lg:px-4 py-1 lg:py-2">
                  Cobrança
                </th>
                <th className="text-center align-middle min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-3 lg:px-4 py-1 lg:py-2">
                  Pagamento
                </th>
                <th className="text-center align-middle min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-5 lg:px-4 py-1 lg:py-2">
                  NF
                </th>
                <th className="text-center align-middle min-w-[100px] text-texto1 lg:text-lg text-F10 font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
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
                      {item.consultation_fee
                        ? parseFloat(item.consultation_fee)
                            .toFixed(2)
                            .replace(".", ",")
                        : "0,00"}
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
                      <div className="absolute hidden px-2 py-1 mb-2 text-xs font-normal transform -translate-x-1/2 rounded shadow-md left-1/2 bottom-full group-hover:block bg-bg2 text-text2 whitespace-nowrap lg:hidden">
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
                      R${" "}
                      {item.total_consultation_fee
                        ? parseFloat(item.total_consultation_fee)
                            .toFixed(2)
                            .replace(".", ",")
                        : "0,00"}
                    </td>
                    <td>
                      <div className="flex items-center justify-center h-full text-center">
                        {item.sending_invoice ? (
                          <VerifyGreenIcon />
                        ) : (
                          <CrossIcon />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center h-full text-center">
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
                      <div className="flex items-center justify-center h-full text-center">
                        {item.bill_of_sale ? (
                          <VerifyGreenIcon />
                        ) : (
                          <CrossIcon />
                        )}
                      </div>
                    </td>

                    <td className="relative px-2 py-1 text-center lg:px-4 lg:py-2">
                      <button
                        className="cursor-pointer"
                        onClick={() => toggleDropdownPatients(index)}
                      >
                        <HamburguerIcon />
                      </button>
                      {isDropdownOpenPatients === index && (
                        <div
                          ref={outSideClickRef}
                          className="box-border absolute z-20 mt-1 border right-8 top-full border-cinza6 bg-bg2 shadow-default"
                        >
                          <Dropdown
                            isOpen={isDropdownOpenPatients === index}
                            onClose={() => setIsDropdownOpenPatients(null)}
                            triggerRef={{
                              current: patientDropdownRefs.current[index],
                            }}
                            position="bottom-right"
                            width="auto"
                          >
                            <DropDownDashActions
                              patient={item}
                              selectedMonth={parseInt(
                                item.month.split("-")[1],
                                10
                              )}
                              selectedYear={parseInt(
                                item.month.split("-")[0],
                                10
                              )}
                              onOpenModal={() =>
                                handleOpenModalForBilling(item)
                              }
                              onOpenReceiptInfo={() =>
                                handleOpenReceiptModal(item)
                              }
                              onPartialPayment={() =>
                                handleOpenPartialPayment(item)
                              }
                              onConfirmedPayment={() =>
                                handleOpenConfirmPaymentModal(item)
                              }
                              onConfirmedBillOfSale={() =>
                                handleConfirmBillOfSale(item)
                              }
                              onEditConsultationFee={() =>
                                handleEditConsultation(item)
                              }
                              onRevertSendingInvoice={() =>
                                openReturnModal(() =>
                                  handleRevertSendingInvoice(item)
                                )
                              }
                              onRevertPaymentConfirmed={() => {
                                openReturnModal(() =>
                                  handleRevertPaymentConfirmation(item)
                                );
                              }}
                              onRevertBillOfSale={() => {
                                openReturnModal(() =>
                                  handleRevertBillOfSale(item)
                                );
                              }}
                              isSendingInvoice={item.sending_invoice}
                              isPaymentConfirmed={
                                item.payment_status === "pago"
                              }
                              isBillOfSaleIssued={item.bill_of_sale}
                            />
                          </Dropdown>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8 lg:9" className="relative py-3">
                  <div className="relative flex items-center justify-center w-full transition-all duration-300 lg:mt-4">
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
              onRemoveDay={handleRemoveDay}
              onAddDay={handleAddDay}
              updateBillingRecords={updatePatientDays}
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
          {isModalConfirmPaymentOpen && selectedPatientForConfirmPayment && (
            <ModalConfirmPayment
              isOpen={isModalConfirmPaymentOpen}
              onClose={() => setIsModalConfirmPaymentOpen(false)}
              patient={selectedPatientForConfirmPayment}
              onConfirm={async ({
                tipoPagamento,
                valorPago,
                dataPagamento,
                formaPagamento,
              }) => {
                const response = await savePayment(
                  selectedPatientForConfirmPayment.customer_id,
                  selectedYearForConfirm,
                  selectedMonthForConfirm,
                  tipoPagamento,
                  dataPagamento,
                  formaPagamento,
                  tipoPagamento === "total" ? null : valorPago // ex: "R$ 150,00"
                );

                if (!response?.error) {
                  await handleUpdateBillingStatus();
                } else {
                  alert("Erro ao salvar pagamento.");
                }

                setIsModalConfirmPaymentOpen(false);
              }}
            />
          )}
          {isModalReceiptOpen && receiptData && (
            <ModalReceiptInfo
              isOpen={isModalReceiptOpen}
              onClose={() => setIsModalReceiptOpen(false)}
              receiptData={receiptData}
            />
          )}
          <ReturnPatientModal
            isOpen={isReturnModalOpen}
            onClose={() => setIsReturnModalOpen(false)}
            onConfirm={() => {
              returnAction?.();
              setIsReturnModalOpen(false);
            }}
          />
        </>
      </div>
    </>
  );
};

export default PaymentControlCard;