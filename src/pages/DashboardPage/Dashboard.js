import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "../../index.css";
import DeletePatientModal from "./components/DeletePatientModal";
import ReturnPatientModal from "./components/ReturnPatientModal";
import ModalReceiptInfo from "./components/ModalReceiptInfo";
import ModalConfirmPayment from "./components/ModalConfirmPayment";
import {
  fetchCustomers,
  sendWhatsAppMessage,
  sendEmailMessage,
  confirmBillOfSale,
  savePayment,
  AddDay,
  RemoveDay,
  revertSendingInvoice,
  revertPaymentConfirmation,
  revertBillOfSale,
  fetchUnmatchedPatients,
  HandleFetchBillingRecords,
} from "../../service/pagesService/pagesService";
import DropDownDashBoard from "./components/DropDownDashBoard";
import { showErrorToast } from "../../utils/notification/toastify";
import SearchBarDashBoard from "./components/SearchBarDashBoard";
import EditConsultationModal from "./components/EditConsultationModal";
import { HamburguerIcon } from "../../icons/icons";
import {
  ShowVinculateToast,
  showDeleteToast,
  showConfirmPaymentToast,
  showNoContactToast,
} from "./components/ToastDashBoard";
import {
  CrossIcon,
  VerifyGreenIcon,
  FilterIcon,
  ArrowDownIcon,
} from "./components/IconsDashBoard";
import CardDashBoard from "./components/CardsDashBoard";
import DropDownDashActions from "./components/DropDownDashActions";
import BillingDashBoard from "./components/BillingDashBoard";
import ModalPaymentDash from "./components/ModalPaymentDash";
import FilterStatusDashBoard from "./components/FilterStatusDashBoard";
import { Months } from "../../utils/Months/months";
import Dropdown from "../../components/Dropdown";

const DashBoard = () => {
  const [customersData, setCustomersData] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalReceiptOpen, setIsModalReceiptOpen] = useState(false);
  const [selectedPatientForReceipt, setSelectedPatientForReceipt] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState("");
  const [loadingUnmatched, setLoadingUnmatched] = useState(true);
  const [patients, setPatients] = useState([]);
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);
  const [netTime, setNetTime] = useState(0);
  const [billingMessage, setBillingMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isDropdownOpenPatients, setIsDropdownOpenPatients] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [unmatchedPatients, setUnmatchedPatients] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [showUnmatchedPatients, setShowUnmatchedPatients] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [isPartialPaymentModalOpen, setIsPartialPaymentModalOpen] =
    useState(false);
  const [
    selectedPatientForPartialPayment,
    setSelectedPatientForPartialPayment,
  ] = useState(null);
  const calendarIdsParam = searchParams.get("calendarIds");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState(null);
  const selectedCalendarIds = useMemo(
    () => (calendarIdsParam ? calendarIdsParam.split(",") : []),
    [calendarIdsParam]
  );
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnAction, setReturnAction] = useState(null);
  const openReturnModal = (action) => {
    setReturnAction(() => action);
    setIsReturnModalOpen(true);
  };
  const patientDropdownRefs = useRef({});
  const unmatchedDropdownRefs = useRef({});

  const handleRevertSendingInvoice = async (customer) => {
    if (!customer || !customer.customer_id) {
      alert("Paciente não encontrado.");
      return;
    }

    const response = await revertSendingInvoice(
      customer.customer_id,
      selectedYear,
      selectedMonth
    );

    if (response && response.ok) {
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.customer_id === customer.customer_id
            ? { ...p, sending_invoice: false }
            : p
        )
      );
    }
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          },
        });

        if (!response.ok) {
          console.error("Erro ao buscar formas de pagamento");
          return;
        }

        const data = await response.json();
        let parsed = [];

        try {
          const raw = data.payment_method;

          if (Array.isArray(raw)) {
            parsed = raw;
          } else if (typeof raw === "string") {
            parsed = raw.startsWith("[")
              ? JSON.parse(raw)
              : raw.split(",").map((m) => m.trim()).filter(Boolean);
          } else {
            parsed = [];
          }
        } catch (error) {
          console.error("Erro ao interpretar formas de pagamento:", error);
          parsed = [];
        }

        setPaymentMethods(parsed);
      } catch (error) {
        console.error("Erro na requisição de formas de pagamento:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const [isModalConfirmPaymentOpen, setIsModalConfirmPaymentOpen] = useState(false);
  const [selectedPatientForConfirmPayment, setSelectedPatientForConfirmPayment] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const openConfirmPaymentModal = (patient) => {
    setSelectedPatientForConfirmPayment(patient);
    setIsModalConfirmPaymentOpen(true);
  };

  const handleRevertPaymentConfirmation = async (customer) => {
    if (!customer || !customer.customer_id) {
      alert("Paciente não encontrado.");
      return;
    }

    const response = await revertPaymentConfirmation(
      customer.customer_id,
      selectedYear,
      selectedMonth
    );

    if (response && response.ok) {
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.customer_id === customer.customer_id
            ? { ...p, payment_status: "", payment_amount: null }
            : p
        )
      );

      setFilteredPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.customer_id === customer.customer_id
            ? { ...p, payment_status: "", payment_amount: null }
            : p
        )
      );
    }
  };

  const handleRevertBillOfSale = async (customer) => {
    if (!customer || !customer.customer_id) {
      alert("Paciente não encontrado.");
      return;
    }

    const response = await revertBillOfSale(
      customer.customer_id,
      selectedYear,
      selectedMonth
    );

    if (response && response.ok) {
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.customer_id === customer.customer_id
            ? { ...p, bill_of_sale: false }
            : p
        )
      );

      setFilteredPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.customer_id === customer.customer_id
            ? { ...p, bill_of_sale: false }
            : p
        )
      );
    }
  };

  useEffect(() => {
    const fetchCalendars = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/events/calendars`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const filteredCalendars = data.filter((calendar) =>
          selectedCalendarIds.includes(calendar.id)
        );
        setCalendars(filteredCalendars);
        if (filteredCalendars.length > 0 && !selectedCalendarId) {
          setSelectedCalendarId(filteredCalendars[0].id);
        }
      } else {
        setError("Erro ao buscar calendários");
      }
      setLoading(false);
    };
    fetchCalendars();
  }, [selectedCalendarIds, selectedCalendarId]);

  const fetchEvents = async () => {
    if (selectedCalendarId === "") return;

    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/get-events/${selectedCalendarId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
      }
    );
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const sortedEvents = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEvents(sortedEvents);
      }
    } else {
      setError("Erro ao buscar eventos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCalendarId]);

  const handleFetchUnmatchedPatients = async () => {
    const response = await fetchUnmatchedPatients();

    if (response) {
      setUnmatchedPatients(response);
    } else {
      return null;
    }

    setLoadingUnmatched(false);
  };

  useEffect(() => {
    handleFetchUnmatchedPatients();
  }, []);

  const fetchPatientData = async () => {
    setLoading(true);
    const data = await fetchCustomers();
    setCustomersData(
      (data.customers || []).filter((customer) => customer.customer_name)
    );
    setTotalConsultations(data.totalConsultations || 0);
    setTotalRevenue(parseFloat(data.totalRevenue || 0));
    setLoading(false);
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const [linkEventId, setLinkEventId] = useState(null);

  const handleLinkPatient = async (customer_id) => {
    if (!linkEventId || !customer_id) {
      return null;
    }
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/linkCustomerToEvent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({
          eventId: linkEventId,
          customer_id: customer_id,
        }),
      }
    );
    if (response.ok) {
      handleFetchUnmatchedPatients();
      setIsSearchBarOpen(false);
      setIsConfirmModalOpen(false);
      setSelectedPatient(null);
      ShowVinculateToast();
    } else {
      setIsConfirmModalOpen(false);
    }
  };

  const toggleDropdownPatients = (eventIndex, patient) => {
    if (patient && patient.customer_id) {
      setSelectedPatient(patient);
    } else {
      alert("Paciente não possui ID.");
    }

    setIsDropdownOpenPatients((prevIndex) =>
      prevIndex === eventIndex ? null : eventIndex
    );
  };

  const toggleDropdown = (eventIndex) => {
    const event = unmatchedPatients[eventIndex];
    if (!event) {
      return;
    }
    if (isDropdownOpen && selectedEvent === eventIndex) {
      setIsDropdownOpen(false);
      setSelectedEvent(null);
    } else {
      setSelectedEvent(eventIndex);
      setIsDropdownOpen(true);
    }
  };

  const handleVinculatePatient = async (group) => {
    const groupIndex = unmatchedPatients.indexOf(group);
    if (groupIndex !== -1) {
      setSelectedEvent(groupIndex);
      setLinkEventId(group.events[0].google_event_id);
      if (!patients || patients.length === 0) {
        await fetchPatientData();
      }
    }
    openSearchBar();
  };

  const confirmLinkPatient = (patient) => {
    setSelectedPatient(patient);
    setIsConfirmModalOpen(true);
  };

  const openSearchBar = () => {
    if (selectedEvent === null || selectedEvent === undefined) {
      return null;
    }
    setIsSearchBarOpen(true);
    setIsDropdownOpen(false);
  };

  const fetchBillingRecords = async (month, year) => {
    setLoading(true);

    const response = await HandleFetchBillingRecords(month, year);

    if (response.ok) {
      const data = await response.json();

      setPatients(data.billingRecords || []);
      setFilteredPatients(data.billingRecords || []);
      setTotalConsultations(data.totalConsultations || 0);
      setTotalRevenue(parseFloat(data.totalRevenue || 0));
      setNetRevenue(parseFloat(data.netRevenue || 0));
      setNetTime(parseFloat(data.netTime || 0));
    } else {
      setPatients([]);
      setFilteredPatients([]);
      setTotalConsultations(0);
      setTotalRevenue(0);
      setNetRevenue(0);
      setNetTime(0);
      if (response.status !== 404) {
        setError("Erro ao buscar registros de faturamento.");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const filterPatients = () => {
      const filtered = patients.filter((patient) => {
        if (selectedStatus.length === 0) return true;
        const matchesPaymentStatus =
          (selectedStatus.includes("aberto") && !patient.payment_status) ||
          selectedStatus.includes(patient.payment_status);

        const matchesInvoiceStatus =
          (selectedStatus.includes("realizada") && patient.sending_invoice) ||
          (selectedStatus.includes("nao-realizada") &&
            !patient.sending_invoice);

        const matchesBillofSaleStatus =
          (selectedStatus.includes("nao-emitidos") && !patient.bill_of_sale) ||
          (selectedStatus.includes("emitidos") && patient.bill_of_sale);

        return (
          matchesPaymentStatus ||
          matchesInvoiceStatus ||
          matchesBillofSaleStatus
        );
      });

      setFilteredPatients(filtered);
    };

    filterPatients();
  }, [selectedStatus, patients]);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const initialMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const initialYear = String(currentDate.getFullYear());

    setSelectedMonth(initialMonth);
    setSelectedYear(initialYear);

    fetchBillingRecords(initialMonth, initialYear);
  }, []);

  const handleMonthChange = (month) => {
    const formattedMonth = String(month).padStart(2, "0");
    setSelectedMonth(formattedMonth);
    fetchBillingRecords(formattedMonth, selectedYear);
  };

  const handleYearChange = (year) => {
    const formattedYear = String(year);
    setSelectedYear(formattedYear);
    fetchBillingRecords(selectedMonth, formattedYear);
  };

  useEffect(() => {
    setPatients([]);
    fetchBillingRecords(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const closeBillingModal = () => {
    setIsBillingModalOpen(false);
  };

  const handleSendWhatsApp = async (customer) => {
    const customerId = customer?.customer_id;

    if (!customerId) {
      alert("ID do cliente não encontrado.");
      return;
    }

    setLoading(true);
    const data = await sendWhatsAppMessage(
      customerId,
      selectedYear,
      selectedMonth
    );
    setLoading(false);

    if (data?.success) {
      setBillingMessage(data.user_message);
      setSelectedPatient((prev) => ({
        ...prev,
        whatsappLink: data.whatsappLink,
      }));
      setIsBillingModalOpen(true);
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.customer_id === customerId
            ? { ...patient, sending_invoice: true }
            : patient
        )
      );
    } else if (!data.success && data.showModal) {
      setBillingMessage(data.message);
      setIsBillingModalOpen(true);
    } else {
      showNoContactToast();
    }
  };

  const handleSendEmail = async (customer) => {
    const customerId = customer?.customer_id;

    if (!customerId) {
      alert("ID do cliente não encontrado.");
      return;
    }

    setLoading(true);

    const response = await sendEmailMessage(
      customerId,
      customer.total_consultation_fee,
      selectedYear,
      selectedMonth
    );

    setLoading(false);

    if (!response || response.message === "E-mail não cadastrado.") {
      showErrorToast("Erro: E-mail não cadastrado.");
      return;
    }

    if (response?.mailtoLink) {
      window.open(response.mailtoLink, "_blank");
    } else {
      alert(`Erro: ${response?.error || "Erro ao processar a cobrança."}`);
    }
  };

  const handleDeleteUnmatchedEvent = async (google_event_id) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/unmatched-patients/${google_event_id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({ status: "cancelado" }),
      }
    );

    if (response.ok) {
      showDeleteToast();
      handleFetchUnmatchedPatients();
    } else {
      const errorData = await response.json();
      alert(`Erro: ${errorData.error}`);
    }
  };

  const openDeleteModal = (google_event_id) => {
    setEventToDelete(google_event_id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      handleDeleteUnmatchedEvent(eventToDelete);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSavePartialPayment = async (paymentAmount, dataPagamento, formaPagamento) => {
    if (!selectedPatientForPartialPayment) return;

    const { customer_id } = selectedPatientForPartialPayment;

    const response = await savePayment({
      customer_id,
      month_and_year: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`,
      payment_date: dataPagamento,
      payment_method: formaPagamento,
      payment_amount: parseFloat(paymentAmount.replace("R$", "").replace(",", ".")),
    });

    if (!response?.error) {
      showConfirmPaymentToast();

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.customer_id === customer_id
            ? {
              ...patient,
              payment_amount: parseFloat(paymentAmount),
              payment_status: "parcial",
            }
            : patient
        )
      );
    }

    setIsPartialPaymentModalOpen(false);
  };

  const handleOpenReceiptModal = (patient) => {
 
    const payerName = patient.Customer?.customer_name || patient.payer_name;
    const payerCPF = patient.Customer?.cpf || patient.payer_cpf;
    const beneficiaryName = patient.beneficiary_name || "Nome beneficiário não informado";
    const beneficiaryCPF = patient.beneficiary_cpf || "CPF beneficiário não informado";
    const amount = parseFloat(patient.total_consultation_fee || 0).toFixed(2).replace(".", ",");
  
    const paymentDate = patient.payment_date
      ? patient.payment_date.split("T")[0].split("-").reverse().join("/")
      : "Data não informada";
  
    const numConsultations = patient.num_consultations || 0;
    const consultationDays = patient.consultation_days
      ? patient.consultation_days.split(",").map((d) => d.trim()).join(", ")
      : "não informados";
  
    setReceiptData({
      payerName,
      payerCPF,
      beneficiaryName,
      beneficiaryCPF,
      amount,
      paymentDate,
      description: `Valor referente às consultas realizadas em ${selectedMonth}/${selectedYear}, total de ${numConsultations} consultas nos dias ${consultationDays}.`
    });
  
    setIsModalReceiptOpen(true);
  };

  const handleOpenPartialPayment = (patient) => {
    setSelectedPatientForPartialPayment(patient);
    setIsPartialPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (patient) => {
    if (!patient || !patient.customer_id) {
      alert("Paciente não encontrado.");
      return;
    }

    const response = await savePayment(
      patient.customer_id,
      selectedYear,
      selectedMonth
    );

    if (response) {
      showConfirmPaymentToast();
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.customer_id === patient.customer_id
            ? { ...p, was_charged: true, payment_status: "pago" }
            : p
        )
      );
    }
  };

  const handleConfirmBillOfSale = async (patient) => {
    console.log("Dados do paciente recebido:", patient);
    if (!patient || !patient.customer_id) {
      alert("Paciente não encontrado.");
      return;
    }

    const response = await confirmBillOfSale(
      patient.customer_id,
      selectedYear,
      selectedMonth
    );

    if (!response || response.error) {
      alert(response?.error || "Erro ao emitir recibo.");
      return;
    }

    const data = response.data;

    if (data) {
      const {
        payer_name,
        payer_cpf,
        beneficiary_name,
        beneficiary_cpf,
        total_consultation_fee,
        payment_date,
        num_consultations,
        consultation_days,
      } = data;

      setReceiptData({
        payerName: payer_name,
        payerCPF: payer_cpf,
        beneficiaryName: beneficiary_name,
        beneficiaryCPF: beneficiary_cpf,
        amount: parseFloat(total_consultation_fee || 0).toFixed(2).replace(".", ","),
        paymentDate: payment_date
          ? payment_date.split("T")[0].split("-").reverse().join("/")
          : "Data não informada",
        description: `Valor referente às consultas realizadas em ${selectedMonth}/${selectedYear}, total de ${num_consultations || 0} consultas nos dias ${
          consultation_days
            ? consultation_days.split(",").map((d) => d.trim()).join(", ")
            : "não informados"
        }.`,
      });

      setFilteredPatients((prev) =>
        prev.map((p) =>
          p.customer_id === patient.customer_id
            ? { ...p, bill_of_sale: true }
            : p
        )
      );

      setIsModalReceiptOpen(true);
    }
  };

  const toggleTableSize = () => {
    setIsTableExpanded(!isTableExpanded);
    setShowUnmatchedPatients(!isTableExpanded);
  };

  useEffect(() => {
    setIsTableExpanded(true);
  }, []);

  const handleRemoveDay = async (customerId, daysToRemove) => {
    if (!selectedPatientForEdit || !selectedPatientForEdit.month_and_year) {
      alert("Erro: Paciente ou mês não disponível.");
      return;
    }

    const [yearFromPatient, monthFromPatient] =
      selectedPatientForEdit.month_and_year.split("-");

    const response = await RemoveDay(
      customerId,
      daysToRemove,
      monthFromPatient,
      yearFromPatient
    );
    if (response.ok) {
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.customer_id === customerId
            ? {
              ...p,
              consultation_days: p.consultation_days
                .split(",")
                .filter((d) => !daysToRemove.includes(d))
                .join(","),
            }
            : p
        )
      );
      await fetchBillingRecords(selectedMonth, selectedYear);
    }
  };

  const handleAddDay = async (customerId, days) => {
    if (!selectedPatientForEdit || !selectedPatientForEdit.month_and_year) {
      alert("Erro: Paciente ou mês não disponível.");
      return;
    }

    const [yearFromPatient, monthFromPatient] =
      selectedPatientForEdit.month_and_year.split("-");

    const response = await AddDay(
      customerId,
      days,
      monthFromPatient,
      yearFromPatient
    );

    if (response.ok) {
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.customer_id === customerId
            ? {
              ...p,
              consultation_days: p.consultation_days
                ? `${p.consultation_days}, ${days}`
                : days,
            }
            : p
        )
      );

      await fetchBillingRecords(selectedMonth, selectedYear);
    } else {
      const data = await response.json();
      alert(data.error || "Erro ao adicionar dia.");
    }
  };

  const handleEditConsultation = (patient) => {
    setSelectedPatientForEdit(patient);
    setIsEditModalOpen(true);
  };

  const updatePatientDays = (customerId, newDays) => {
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.customer_id === customerId
          ? { ...p, consultation_days: newDays.join(", ") }
          : p
      )
    );
  };

  return (
    <div className="top-0 w-full p-6">
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="flex justify-center gap-1 mt-16 lg:mt-32">
            <div className="w-full">
              <div className="flex flex-col w-full lg:hidden">
                <div className="flex justify-center w-full mb-8">
                  <Months
                    onMonthChange={handleMonthChange}
                    onYearChange={handleYearChange}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    className="z-50"
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <CardDashBoard
                    title="Nº de Consultas"
                    value={totalConsultations}
                    isCurrency={false}
                  />
                  <CardDashBoard
                    title="Receita Total"
                    value={totalRevenue.toFixed(2).replace(".", ",")}
                    isCurrency={true}
                  />
                  <CardDashBoard
                    title="Receita líquida"
                    value={netRevenue.toFixed(2).replace(".", ",")}
                    isCurrency={true}
                  />
                  <CardDashBoard
                    title="Hora líquida"
                    value={netTime.toFixed(2).replace(".", ",")}
                    isCurrency={true}
                  />
                </div>

                <div className="flex justify-end pl-4 pr-0 mb-1">
                  <div className="z-10 group">
                    <FilterStatusDashBoard
                      selectedStatus={selectedStatus}
                      onChangeStatus={setSelectedStatus}
                    />
                    <FilterIcon />
                  </div>
                </div>
              </div>
              <ReturnPatientModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
                onConfirm={() => {
                  if (returnAction) returnAction();
                  setIsReturnModalOpen(false);
                }}
              />

              <div className="justify-center hidden gap-2 lg:flex">
                <Months
                  onMonthChange={handleMonthChange}
                  onYearChange={handleYearChange}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  className="z-50"
                />
                <CardDashBoard
                  title="Nº de Consultas"
                  value={totalConsultations}
                  isCurrency={false}
                />
                <CardDashBoard
                  title="Receita Total"
                  value={totalRevenue.toFixed(2).replace(".", ",")}
                  isCurrency={true}
                />
                <CardDashBoard
                  title="Receita líquida"
                  value={netRevenue.toFixed(2).replace(".", ",")}
                  isCurrency={true}
                />
                <CardDashBoard
                  title="Hora líquida"
                  value={netTime.toFixed(2).replace(".", ",")}
                  isCurrency={true}
                />

                <div className="z-10 group lg:mt-20 lg:mb-2">
                  <FilterStatusDashBoard
                    selectedStatus={selectedStatus}
                    onChangeStatus={setSelectedStatus}
                  />
                  <FilterIcon />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`flex mt-3 lg:mt-0 lg:auto lg:mx-auto justify-center box-border w-full lg:rounded-B15 rounded-B10 lg:border-[3px] border border-solid border-cinza6 bg-bg1 z-10 ${isTableExpanded ? "h-auto" : "min-h-screen"
              }`}
          >
            <table className="w-full mt-1 overflow-x-auto text-left table-fixed bg-bg1 rounded-B15">
              <thead>
                <tr>
                  <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                    Paciente
                  </th>
                  <th className="text-center align-middle lg:whitespace-nowrap min-w-[100px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                    Valor Consulta
                  </th>
                  <th className="text-center align-middle hidden lg:table-cell min-w-[75px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                    Dias
                  </th>
                  <th className="text-center align-middle lg:whitespace-nowrap min-w-[100px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                    Nº de consultas
                  </th>
                  <th className=" text-center lg:align-middle min-w-[100px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-5 lg:px-4 py-1 lg:py-2">
                    Total
                  </th>
                  <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-3 lg:px-4 py-1 lg:py-2">
                    Cobrança
                  </th>
                  <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-3 lg:px-4 py-1 lg:py-2">
                    Pagamento
                  </th>
                  <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-5 lg:px-4 py-1 lg:py-2">
                    NF
                  </th>
                  <th className="text-center align-middle min-w-[100px] border-b border-b-cinza6 text-primaria lg:text-lg text-F8 font-ubuntu font-medium tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  [...filteredPatients]
                    .sort((a, b) =>
                      a.Customer?.customer_name.localeCompare(
                        b.Customer?.customer_name
                      )
                    )
                    .map((patient, index) => (
                      <tr key={index} className="relative">
                        <td className=" text-texto1 lg:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2 z-10 text-center">
                          <div className="flex flex-col justify-center leading-tight ">
                            <span>
                              {patient.Customer?.customer_name?.split(" ")[0] ||
                                "-"}
                            </span>
                            <span>
                              {patient.Customer?.customer_name
                                ?.split(" ")
                                .slice(1)
                                .join(" ") || ""}
                            </span>
                          </div>
                        </td>
                        <td className="text-center text-texto1 lg:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                          R${" "}
                          {parseFloat(patient.consultation_fee)
                            .toFixed(2)
                            .replace(".", ",")}
                        </td>
                        <td className="hidden lg:table-cell text-center text-texto1 lg:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                          {patient.consultation_days
                            ? patient.consultation_days
                              .split(", ")
                              .map(Number)
                              .sort((a, b) => a - b)
                              .join(", ")
                            : "-"}
                        </td>
                        <td className="relative text-center text-texto1 lg:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2 group">
                          <span>{patient.num_consultations || "-"}</span>
                          <div className="absolute hidden px-2 py-1 mb-2 text-xs font-normal transform -translate-x-1/2 rounded shadow-md left-1/2 bottom-full group-hover:block bg-bg2 text-text2 whitespace-nowrap lg:hidden">
                            Dias:{" "}
                            {patient.consultation_days
                              ? patient.consultation_days
                                .split(", ")
                                .map(Number)
                                .sort((a, b) => a - b)
                                .join(", ")
                              : "Sem dias"}
                          </div>
                        </td>
                        <td className="text-center text-texto1 lg:text-F15 text-F8 font-normal font-['Open Sans'] tracking-tight px-2 lg:px-4 py-1 lg:py-2">
                          R$ {patient.total_consultation_fee || "0,00"}
                        </td>
                        <td>
                          <div className="flex items-center justify-center h-full text-center">
                            {patient.sending_invoice ? (
                              <VerifyGreenIcon />
                            ) : (
                              <CrossIcon />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center justify-center h-full text-center">
                            {" "}
                            {patient.payment_status === "pago" ? (
                              <VerifyGreenIcon />
                            ) : patient.payment_status === "parcial" ? (
                              <span className="text-texto2 lg:text-F15 text-F8 font-semibold font-['Open Sans'] tracking-tight rounded-B15 border-2 border-aviso">
                                R${" "}
                                {parseFloat(patient.payment_amount || 0)
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
                            {patient.bill_of_sale ? (
                              <VerifyGreenIcon />
                            ) : (
                              <CrossIcon />
                            )}
                          </div>
                        </td>

                        <td className="px-2 py-1 text-center lg:px-4 lg:py-2">
                          <button
                            className="cursor-pointer"
                            onClick={() =>
                              toggleDropdownPatients(index, patient)
                            }
                            ref={(el) =>
                              (patientDropdownRefs.current[index] = el)
                            }
                          >
                            <HamburguerIcon />
                          </button>

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
                              patient={patient}
                              selectedMonth={selectedMonth}
                              selectedYear={selectedYear}
                              onOpenReceiptInfo={handleOpenReceiptModal}
                              onOpenModal={() => handleSendWhatsApp(patient)}
                              onPartialPayment={() =>
                                handleOpenPartialPayment(patient)
                              }
                              onConfirmedPayment={() =>
                                openConfirmPaymentModal(patient)
                              }
                              onConfirmedBillOfSale={() =>
                                handleConfirmBillOfSale(patient)
                              }
                              onEditConsultationFee={() =>
                                handleEditConsultation(patient)
                              }
                              isSendingInvoice={patient.sending_invoice}
                              isPaymentConfirmed={
                                patient.payment_status === "pago"
                              }
                              isBillOfSaleIssued={patient.bill_of_sale}
                              onRevertSendingInvoice={() => {
                                openReturnModal(() =>
                                  handleRevertSendingInvoice(patient)
                                );
                              }}
                              onRevertPaymentConfirmed={() => {
                                openReturnModal(() =>
                                  handleRevertPaymentConfirmation(patient)
                                );
                              }}
                              onRevertBillOfSale={() => {
                                openReturnModal(() =>
                                  handleRevertBillOfSale(patient)
                                );
                              }}
                            />
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="lg:text-base text-[8px] text-center px-2 lg:px-4 py-1 lg:py-2"
                    >
                      Nenhum registro encontrado para este mês e ano.
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="8" className="relative py-3">
                    <div
                      className={`flex justify-center items-center relative w-full transition-all duration-300 lg:mt-4 ${isTableExpanded ? "h-auto" : "h-screen"}`}
                    >
                      <button
                        onClick={toggleTableSize}
                        className={`absolute transform  cursor-pointer transition-transform duration-300 ${isTableExpanded
                          ? "rotate-0 bottom-0"
                          : "rotate-180 bottom-5"
                          }`}
                      >
                        <div className="lg:w-[452px] w-[263px]  h-[1px] bg-cinza6 absolute top-[-20px] left-1/2 transform -translate-x-1/2 mt-3 "></div>
                        <ArrowDownIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {showUnmatchedPatients && (
            <div className="relative mx-auto mt-[30px] box-border w-full  h-[122px] lg:h-[263px] lg:rounded-B15 rounded-B10 lg:border-[3px] border overflow-y-auto border-solid border-cinza6 bg-bg1 ">
              {isSearchBarOpen && (
                <div className="absolute inset-0 z-10 h-auto bg-bg1 bg-opacity-30 backdrop-blur-sm "></div>
              )}
              <h2 className="px-4 mt-6 text-sm font-normal text-primaria lg:text-F25 font-ubuntu">
                Eventos não vinculados
              </h2>
              {loadingUnmatched ? (
                <p className="mt-4 italic text-center text-texto2">
                  Carregando pacientes não vinculados...
                </p>
              ) : unmatchedPatients.length > 0 ? (
                <table className="min-w-full mt-2 bg-bg1">
                  <tbody>
                    {unmatchedPatients.map((event, index) => (
                      <tr
                        key={event.id}
                        className="relative border-b border-b-cinza6"
                      >
                        <td className="flex items-center justify-between px-4 py-2 lg:text-F15 text-F8">
                          <span>{event.event_name}</span>
                          <button
                            className="cursor-pointer"
                            onClick={() => toggleDropdown(index)}
                            ref={(el) =>
                              (unmatchedDropdownRefs.current[index] = el)
                            }
                          >
                            <HamburguerIcon />
                          </button>

                          <Dropdown
                            isOpen={isDropdownOpen && selectedEvent === index}
                            onClose={() => {
                              setIsDropdownOpen(false);
                              setSelectedEvent(null);
                            }}
                            triggerRef={{
                              current: unmatchedDropdownRefs.current[index],
                            }}
                            position="bottom-right"
                            width="210px"
                          >
                            <DropDownDashBoard
                              onVincular={() => handleVinculatePatient(event)}
                              onExcluir={() => {
                                if (event.events.length > 0) {
                                  openDeleteModal(
                                    event.events[0].google_event_id
                                  );
                                }
                              }}
                            />
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : !loadingUnmatched ? (
                <p colSpan="4" className="px-4 py-2 text-center">
                  Nenhum paciente não encontrado
                </p>
              ) : null}

              <DeletePatientModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
              />
            </div>
          )}

          {isSearchBarOpen && (
            <SearchBarDashBoard
              patients={patients}
              onConfirmPatient={confirmLinkPatient}
              onClose={() => setIsSearchBarOpen(false)}
            />
          )}
        </>
      )}

      {isBillingModalOpen && selectedPatient && (
        <BillingDashBoard
          onClose={closeBillingModal}
          onSendWhatsApp={() => {
            if (selectedPatient?.whatsappLink) {
              window.open(selectedPatient.whatsappLink, "_blank");
            } else {
              showErrorToast("Erro: Telefone não cadastrado.");
            }
          }}
          onSendEmail={() => {
            if (selectedPatient?.customer_id) {
              handleSendEmail(selectedPatient);
            } else {
              showErrorToast("Paciente não encontrado ou sem ID.");
            }
          }}
          message={billingMessage}
        />
      )}

      <>
        {isPartialPaymentModalOpen && selectedPatientForPartialPayment && (
          <ModalPaymentDash
            onClose={() => setIsPartialPaymentModalOpen(false)}
            onSave={(paymentAmount, dataPagamento, formaPagamento) =>
              handleSavePartialPayment(paymentAmount, dataPagamento, formaPagamento)
            }
            totalAmount={selectedPatientForPartialPayment.total_consultation_fee}
          />
        )}
        {isModalReceiptOpen && (
          <ModalReceiptInfo
            isOpen={isModalReceiptOpen}
            onClose={() => setIsModalReceiptOpen(false)}
            receiptData={receiptData}
          />
        )}
      </>

      {isEditModalOpen && selectedPatientForEdit && (
        <EditConsultationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          patient={selectedPatientForEdit}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onRemoveDay={handleRemoveDay}
          onAddDay={handleAddDay}
          onUpdatePatient={updatePatientDays}
        />
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center bg-destaque bg-opacity-30 backdrop-blur-[6px] z-30">
          <div className="bg-bg1 p-6 rounded-lg lg:w-[335px] w-auto lg:h-[228px] border border-cinza6 text-center lg:mt-64 lg:ml-64 mt-[10vh]">
            <p className="lg:text-[21px] text-[12px] mb-4 text-texto2 font-medium font-ubuntu leading-6 tracking-tight">
              Você tem certeza que <br />
              deseja <span className="text-primaria">vincular</span> este <br />
              paciente à informação <br />
              <span>
                “
                {selectedPatient?.Customer?.customer_name ||
                  selectedPatient?.customer_name ||
                  "Nome não disponível"}
                ”
              </span>
              ?
            </p>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                }}
                className="w-[50px] lg:w-[74px] lg:h-[40px] lg:text-sm border border-primaria lg:rounded-[100px] rounded-[50px] shadow flex justify-center items-center text-primaria"
              >
                Não
              </button>
              <button
                type="button"
                onClick={() => handleLinkPatient(selectedPatient?.customer_id)}
                className="w-[50px] lg:w-[74px] lg:h-[40px] lg:text-sm bg-primaria lg:rounded-[100px] rounded-[50px] shadow flex justify-center items-center text-texto4"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalConfirmPaymentOpen && selectedPatientForConfirmPayment && (
        <ModalConfirmPayment
          isOpen={isModalConfirmPaymentOpen}
          onClose={() => setIsModalConfirmPaymentOpen(false)}
          patient={selectedPatientForConfirmPayment}
          paymentMethods={paymentMethods}
          onConfirm={async ({ tipoPagamento, valorPago, dataPagamento, formaPagamento }) => {
            const response = await savePayment(
              selectedPatientForConfirmPayment.customer_id,
              selectedYear,
              selectedMonth,
              tipoPagamento,
              dataPagamento,
              formaPagamento,
              valorPago
            );

            if (!response?.error) {
              showConfirmPaymentToast();

              const novoStatus =
                tipoPagamento === "total" ? "pago" : "parcial";

              const novoValorPago =
                tipoPagamento === "total"
                  ? parseFloat(selectedPatientForConfirmPayment.total_consultation_fee)
                  : parseFloat(valorPago.replace("R$", "").replace(",", "."));

              setPatients((prev) =>
                prev.map((p) =>
                  p.customer_id === selectedPatientForConfirmPayment.customer_id
                    ? {
                      ...p,
                      payment_status: novoStatus,
                      payment_amount: novoValorPago,
                    }
                    : p
                )
              );

              setFilteredPatients((prev) =>
                prev.map((p) =>
                  p.customer_id === selectedPatientForConfirmPayment.customer_id
                    ? {
                      ...p,
                      payment_status: novoStatus,
                      payment_amount: novoValorPago,
                    }
                    : p
                )
              );
            }

            setIsModalConfirmPaymentOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DashBoard;
