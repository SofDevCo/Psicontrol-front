import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "../../index.css";
import { fetchCustomers } from "../../service/pagesService/pagesService";
import DropDownDashBoard from "./components/DropDownDashBoard";
import SearchBarDashBoard from "./components/SearchBarDashBoard";
import { HamburguerIcon } from "../../icons/icons";
import { CrossIcon } from "./components/IconsDashBoard";
import CardDashBoard from "./components/CardsDashBoard";
import DropDownDashActions from "./components/DropDownDashActions";
import BillingDashBoard from "./components/BillingDashBoard";
import { Months } from "../../utils/Months/months";

const DashBoard = () => {
  const [customersData, setCustomersData] = useState([]);
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState("");
  const [patients, setPatients] = useState([]);
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);
  const [netTime, setNetTime] = useState(0);
  const [billingMessage, setBillingMessage] = useState("");
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isDropdownOpenPatients, setIsDropdownOpenPatients] = useState(null);
  const [unmatchedPatients, setUnmatchedPatients] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const calendarIdsParam = searchParams.get("calendarIds");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const selectedCalendarIds = useMemo(
    () => (calendarIdsParam ? calendarIdsParam.split(",") : []),
    [calendarIdsParam]
  );

  const dropdownRef = useRef();

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

  const fetchUnmatchedPatients = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/unmatched-patients`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setUnmatchedPatients(data);
    } else {
      return null;
    }
  };

  useEffect(() => {
    fetchUnmatchedPatients();
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

  const handleLinkPatient = async (customer_id) => {
    if (selectedEvent === null || selectedEvent === undefined) {
      return null;
    }

    const event = unmatchedPatients[selectedEvent];

    if (!customer_id) {
      return null;
    }
    if (!event) {
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
          eventId: event.customers_id,
          customer_id: customer_id,
        }),
      }
    );

    if (response.ok) {
      alert("Paciente vinculado com sucesso!");
      fetchUnmatchedPatients();
      setIsSearchBarOpen(false);
    } else {
      return null;
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

  const handleVinculatePatient = async () => {
    if (selectedEvent === null || selectedEvent === undefined) {
      return null;
    }
    const event = unmatchedPatients[selectedEvent];
    if (!event) {
      return null;
    }
    if (!patients || patients.length === 0) {
      await fetchPatientData();
    }
    openSearchBar();
  };
  const openSearchBar = () => {
    if (!selectedEvent) {
      return null;
    }
    setIsSearchBarOpen(true);
    setIsDropdownOpen(false);
  };

  const fetchBillingRecords = async (month, year) => {
    setLoading(true);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/dashboard/billing-records?month=${month}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "authentication_token"
          )}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setPatients(data.billingRecords || []);
      setTotalConsultations(data.totalConsultations || 0);
      setTotalRevenue(parseFloat(data.totalRevenue || 0));
      setNetRevenue(parseFloat(data.netRevenue || 0));
      setNetTime(parseFloat(data.netTime) || 0);
    } else if (response.status === 404) {
      setPatients([]);
      setTotalConsultations(0);
      setTotalRevenue(0);
    } else {
      setError("Erro ao buscar registros de faturamento.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const currentDate = new Date();
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

  const openBillingModal = () => {
    setIsBillingModalOpen(true);
  };

  const closeBillingModal = () => {
    setIsBillingModalOpen(false);
  };

  const handleSendWhatsApp = async (customer, openModalOnly = false) => {
    const customerId = customer?.customer_id;

    if (!customerId) {
      alert("ID do cliente não encontrado.");
      return;
    }

    setLoading(true);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/message/send-whatsapp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          selected_month: `${selectedYear}-${selectedMonth}`,
        }),
      }
    );

    setLoading(false);
    if (response.ok) {
      const data = await response.json();
      const whatsappLink = data.whatsappLink;
      setBillingMessage(data.user_message);

      if (openModalOnly) {
        setIsBillingModalOpen(true);
      } else {
        alert("Redirecionando para o WhatsApp...");
        window.open(whatsappLink, "_blank");
      }
    } else {
      const errorData = await response.json();
      alert(`Erro: ${errorData.error}`);
    }
  };

  const handleSendEmail = async (customer) => {
    const customerId = customer?.customer_id;

    if (!customerId) {
      alert("ID do cliente não encontrado.");
      return;
    }

    setLoading(true);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/message/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          total_consultation_fee: customer.total_consultation_fee,
          selected_month: `${selectedYear}-${selectedMonth}`,
        }),
      }
    );

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      const mailtoLink = data.mailtoLink;
      setBillingMessage(data.user_message);
      alert("Abrindo cliente de email...");
      window.open(mailtoLink, "_blank");
    } else {
      const errorData = await response.json();
      alert(`Erro: ${errorData.error}`);
    }
  };

  const handleDeleteUnmatchedEvent = async (google_event_id) => {
    console.log("Tentando excluir evento com ID:", google_event_id);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/unmatched-patients/${google_event_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
      }
    );

    if (response.ok) {
      alert("Evento excluído com sucesso.");
      fetchUnmatchedPatients();
    } else {
      const errorData = await response.json();
      alert(`Erro: ${errorData.error}`);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="flex justify-around gap-4 mb-8 mt-8">
            <Months
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              className="z-50"
            />
            <CardDashBoard title="Nº de Consultas" value={totalConsultations} />
            <CardDashBoard
              title="Receita Total"
              value={`R$ ${totalRevenue.toFixed(2).replace(".", ",")}`}
            />
            <CardDashBoard
              title="Receita liquida"
              value={`R$ ${netRevenue.toFixed(2).replace(".", ".")}`}
            />
            <CardDashBoard
              title="Hora liquida"
              value={`R$ ${netTime.toFixed(2).replace(".", ".")}`}
            />
          </div>

          <div className=" mx-auto box-border md:h-[436px] md:w-[1076px] rounded-[15px] border-[3px] overflow-y-auto border-solid border-cinza6 bg-bg1 z-10">
            <table className="min-w-full bg-bg1">
              <thead>
                <tr>
                  <th className="md:w-[75px] border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    Paciente
                  </th>
                  <th className="md:w-[125px] border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    Valor Consulta
                  </th>
                  <th className="md:w-10 border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    Dias
                  </th>
                  <th className="md:w-[136px] border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    Nª de consultas
                  </th>
                  <th className="md:w-11 border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    Total
                  </th>
                  <th className="md:w-20 border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    Cobrança
                  </th>
                  <th className="md:w-[98px] border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    Pagamento
                  </th>
                  <th className="w-6 border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    NF
                  </th>
                  <th className="w-[52px] border-b border-b-cinza6 text-primaria text-lg font-medium font-['Ubuntu'] tracking-tight px-4 py-2">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <tr key={index}>
                      <td className="w-[97px] text-texto1 text-[15px] font-normal font-['Open Sans'] tracking-tight px-4 py-2">
                        {patient.Customer?.customer_name || "-"}
                      </td>
                      <td className="w-[73px] text-texto1 text-[15px] font-normal font-['Open Sans'] tracking-tight px-12 py-2">
                        R${" "}
                        {parseFloat(patient.consultation_fee)
                          .toFixed(2)
                          .replace(".", ",")}
                      </td>
                      <td className="w-10 text-texto1 text-[15px] font-normal font-['Open Sans'] tracking-tight px-4 py-2">
                        {patient.consultation_days || "-"}
                      </td>
                      <td className="w-[136px] text-texto1 text-[15px] font-normal font-['Open Sans'] tracking-tight px-4 py-2">
                        {patient.num_consultations || "-"}
                      </td>
                      <td className="w-11 text-texto1 text-[15px] font-normal font-['Open Sans'] tracking-tight px-4 py-2">
                        R$ {patient.total_consultation_fee || "0,00"}
                      </td>
                      <td className="w-20 text-center">
                        <CrossIcon />
                      </td>
                      <td className="w-20 text-center">
                        <CrossIcon />
                      </td>
                      <td className="w-20 text-center">
                        <CrossIcon />
                      </td>
                      <td className="w-[52px] border-b border-b-cinza6 text-center px-4 py-2">
                        <button
                          className="cursor-pointer"
                          onClick={() => toggleDropdownPatients(index, patient)}
                        >
                          <HamburguerIcon />
                        </button>
                        {isDropdownOpenPatients === index && (
                          <div className="absolute right-0 shadow-lg rounded p-2 z-20">
                            <DropDownDashActions
                              onOpenModal={() =>
                                handleSendWhatsApp(patient, true)
                              }
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center px-4 py-2">
                      Nenhum registro encontrado para este mês e ano.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="relative mx-auto mt-[30px] box-border md:h-[263px] md:w-[1076px] rounded-[15px] border-[3px] overflow-y-auto border-solid border-cinza6 bg-bg1 z-10">
            {isSearchBarOpen && (
              <div className="absolute inset-0 bg-bg1 bg-opacity-30 backdrop-blur-sm h-screen z-20 "></div>
            )}
            <h2 className="mt-6 text-primaria text-[25px] font-normal font-['Ubuntu']">
              Pacientes não encontrados
            </h2>
            <table className="min-w-full bg-bg1 mt-2">
              <tbody>
                {unmatchedPatients.length > 0 ? (
                  unmatchedPatients.map((event, index) => (
                    <tr
                      key={event.id}
                      className="border-b border-b-cinza6 relative"
                    >
                      <td className="px-4 py-2 flex items-center justify-between">
                        <span>{event.name}</span>
                        <button
                          className="cursor-pointer"
                          onClick={() => toggleDropdown(index)}
                        >
                          <HamburguerIcon />
                        </button>
                        {isDropdownOpen && selectedEvent === index && (
                          <div className="absolute right-0 shadow-lg rounded p-2 z-20">
                            <DropDownDashBoard
                              onVincular={() => handleVinculatePatient(event)}
                              onExcluir={() =>
                                handleDeleteUnmatchedEvent(
                                  event.google_event_id
                                )
                              }
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center px-4 py-2">
                      Nenhum paciente não encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {isSearchBarOpen && (
            <SearchBarDashBoard
              patients={patients}
              onSelectPatient={handleLinkPatient}
              onClose={() => setIsSearchBarOpen(false)}
            />
          )}
        </>
      )}
      {isBillingModalOpen && selectedPatient && (
        <BillingDashBoard
          onClose={closeBillingModal}
          onSendWhatsApp={() => {
            if (selectedPatient && selectedPatient.customer_id) {
              handleSendWhatsApp(selectedPatient);
            } else {
              alert("Paciente não encontrado ou sem ID.");
            }
          }}
          onSendEmail={() => {
            if (selectedPatient && selectedPatient.customer_id) {
              handleSendEmail(selectedPatient);
            } else {
              alert("Paciente não encontrado ou sem ID.");
            }
          }}
          message={billingMessage}
        />
      )}
    </div>
  );
};

export default DashBoard;
