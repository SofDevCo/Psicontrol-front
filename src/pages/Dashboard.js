import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/CreateEventForm.css';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/sidebar'

const CreateEventForm = () => {
    const [events, setEvents] = useState([]);
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [searchParams] = useSearchParams();
    const calendarIdsParam = searchParams.get('calendarIds');

    const selectedCalendarIds = useMemo(() => calendarIdsParam ? calendarIdsParam.split(',') : [], [calendarIdsParam]);

    const fetchCalendars = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/events/calendars');
            if (response.ok) {
                const data = await response.json();
                console.log('Calendários recebidos:', data);
                const filteredCalendars = data.filter(calendar => selectedCalendarIds.includes(calendar.id));
                setCalendars(filteredCalendars);
                if (filteredCalendars.length > 0 && !selectedCalendarId) {
                    setSelectedCalendarId(filteredCalendars[0].id);
                }
            } else {
                throw new Error('Erro ao buscar calendários');
            }
        } catch (error) {
            console.error('Erro ao buscar calendários:', error);
            setError('Não foi possível carregar os calendários.');
        } finally {
            setLoading(false);
        }
    }, [selectedCalendarIds, selectedCalendarId]);

    const fetchEvents = useCallback(async () => {
        if (selectedCalendarId === '') return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/events/get-events/${selectedCalendarId}`);
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const sortedEvents = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setEvents(sortedEvents);
                } else {
                    throw new Error('Resposta JSON não é um array');
                }
            } else {
                throw new Error('Resposta não é JSON');
            }
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            setError('Não foi possível carregar eventos.');
        } finally {
            setLoading(false);
        }
    }, [selectedCalendarId]);

    useEffect(() => {
        fetchCalendars();
    }, [fetchCalendars]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents, selectedCalendarId]);

    const handleCancel = async (googleEventId, calendarId) => {
        try {
            if (!googleEventId || !calendarId) {
                throw new Error('ID do evento ou ID do calendário ausente.');
            }

            const response = await fetch(`http://localhost:3000/events/cancel/${googleEventId}/${calendarId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Erro ao cancelar o evento.');
            }

            alert('Evento cancelado com sucesso!');
            // Atualizar a lista de eventos após o cancelamento
            fetchEvents();
        } catch (error) {
            console.error('Erro ao cancelar o evento:', error);
            alert(`Erro ao cancelar o evento: ${error.message}`);
        }
    };

    const syncCalendar = async () => {
        try {
            setLoading(true);
            for (const calendarId of selectedCalendarIds) {
                const response = await fetch(`http://localhost:3000/events/sync-calendar/${calendarId}`, {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error(`Erro ao sincronizar calendário ${calendarId}.`);
                }
            }
            await fetchEvents(); 
        } catch (error) {
            console.error('Erro ao sincronizar calendários:', error);
            setError('Erro ao sincronizar calendários.');
        } finally {
            setLoading(false);
        }
    };

    const handleCalendarChange = (e) => {
        setSelectedCalendarId(e.target.value); 
    };

    return (
        <div className="app-layout">
            <Sidebar/>
            <main className="main-content">
                <h2>Eventos</h2>
                <div className="content-area">
                    <section className="events-list-section">
                        <h2 className="event-list-title">
                            Eventos Criados:
                            <select onChange={handleCalendarChange} value={selectedCalendarId} disabled={loading}>
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
                                            <td>{(() => {
                                                const [year, month, day] = event.date.split('-');
                                                return `${day}/${month}/${year}`;
                                            })()}</td>
                                            {/* <td>{event.start_time}</td> */}
                                            <td>
                                                {event.status !== 'cancelado' && (
                                                    <button onClick={() => handleCancel(event.google_event_id, event.calendar_id)}>
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
