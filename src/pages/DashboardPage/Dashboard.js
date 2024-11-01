import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "../../index.css";

const CreateEventForm = () => {
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState("");
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
          // Filtra os calendários para incluir apenas os selecionados
          const filteredCalendars = data.filter((calendar) =>
            selectedCalendarIds.includes(calendar.id)
          );
          setCalendars(filteredCalendars); // Seta apenas os calendários filtrados
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

  useEffect(() => {
    fetchEvents();
  }, [selectedCalendarId]);

  const handleCancel = async (googleEventId, calendarId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/events/cancel/${googleEventId}/${calendarId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        await fetchEvents();
      }
    } catch (error) {
      setError("Erro ao cancelar o evento");
    }
  };

  const syncCalendar = async () => {
    try {
      setLoading(true);
      for (const calendarId of selectedCalendarIds) {
        const response = await fetch(
          `http://localhost:3000/events/sync-calendar/${calendarId}`,
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao sincronizar calendário");
        }
      }
      await fetchEvents(); // Atualiza os eventos após sincronização
    } catch (error) {
      setError("Erro ao sincronizar calendário");
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarChange = (e) => {
    setSelectedCalendarId(e.target.value);
  };

  return (
    <div className="m-0 flex bg-gray-200 p-0">
      <main className="flex-grow-0 p-5">
        <h2>Eventos</h2>
        <div className="bg-white rounded-lg p-5 shadow-default">
          <section className="events-list-section">
            <h2 className="event-list-title">
              Eventos Criados:
              <select
                onChange={handleCalendarChange}
                value={selectedCalendarId}
                disabled={loading}
              >
                {calendars.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.summary}
                  </option>
                ))}
              </select>
              <section className="sync-calendar-section">
                <button onClick={syncCalendar}>Sincronizar Calendários</button>
              </section>
            </h2>
            {error && <p className="error-message">{error}</p>}
            <table className="events-table">
              <thead>
                <tr>
                  <th>Nome do Evento</th>
                  <th>Data</th>
                  <th>Ação</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.google_event_id}>
                    <td>{event.event_name}</td>
                    <td>
                      {(() => {
                        const [year, month, day] = event.date.split("-");
                        return `${day}/${month}/${year}`;
                      })()}
                    </td>
                    <td>
                      {event.status !== "cancelado" && (
                        <button
                          onClick={() =>
                            handleCancel(
                              event.google_event_id,
                              event.calendar_id
                            )
                          }
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                    <td>{event.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CreateEventForm;
