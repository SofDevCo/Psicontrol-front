import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "../../index.css";
import { fetchCustomers } from "../../service/pagesService/pagesService";

const DashBoard = () => {
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState("");
  const [patients, setPatients] = useState([]); 
  const [unmatchedPatients, setUnmatchedPatients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const calendarIdsParam = searchParams.get("calendarIds");

  const selectedCalendarIds = useMemo(
    () => (calendarIdsParam ? calendarIdsParam.split(",") : []),
    [calendarIdsParam]
  );

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/events/calendars", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const filteredCalendars = data.filter((calendar) =>
            selectedCalendarIds.includes(calendar.id)
          );
          setCalendars(filteredCalendars);
          if (filteredCalendars.length > 0 && !selectedCalendarId) {
            setSelectedCalendarId(filteredCalendars[0].id);
          }
        }
      } catch (error) {
        setError("Erro ao buscar calendários");
      } finally {
        setLoading(false);
      }
    };
    fetchCalendars();
  }, [selectedCalendarIds, selectedCalendarId]);

  const fetchEvents = async () => {
    if (selectedCalendarId === "") return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/events/get-events/${selectedCalendarId}`,
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
      }
    } catch (error) {
      setError("Erro ao buscar eventos");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnmatchedPatients = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/events/unmatched-patients",
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
        console.error("Erro ao buscar pacientes não encontrados");
      }
    } catch (error) {
      console.error("Erro ao buscar pacientes não encontrados:", error);
    }
  };

  useEffect(() => {
    fetchUnmatchedPatients();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCalendarId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const data = await fetchCustomers();
      setPatients(data);
    } catch (error) {
      setError("Erro ao buscar pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  return (
    <div className="relative mx-auto mt-12 box-border h-[436px] w-[1076px] rounded-[15px] border-[3px] border-solid border-cinza6 bg-bg1 z-10">
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Paciente</th>
                <th className="text-left px-4 py-2">Valor Consulta</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{patient.customer_name}</td>
                  <td className="px-4 py-2">
                    R${" "}
                    {parseFloat(patient.consultation_fee)
                      .toFixed(2)
                      .replace(".", ",")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="mt-6 text-lg font-bold">Pacientes não encontrados</h2>
          <table className="min-w-full bg-white mt-2">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Nome do Evento</th>
              </tr>
            </thead>
            <tbody>
              {unmatchedPatients.length > 0 ? (
                unmatchedPatients.map((event, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{event.name}</td>
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
        </>
      )}
    </div>
  );
};

export default DashBoard;
