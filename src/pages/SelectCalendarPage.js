import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/Psicontrol.png';
import '../styles/SelectCalendarPage.css';

const SelectCalendarPage = () => {
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendarIds, setSelectedCalendarIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                const response = await fetch('http://localhost:3000/events/calendars');
                if (response.ok) {
                    const data = await response.json();
                    setCalendars(data);
                } else {
                    throw new Error('Erro ao buscar calendários');
                }
            } catch (error) {
                setError('Erro ao carregar calendários');
            } finally {
                setLoading(false);
            }
        };

        fetchCalendars();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedCalendarIds(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(id)) {
                newSelection.delete(id);
            } else {
                newSelection.add(id);
            }
            return newSelection;
        });
    };

    const handleProceed = () => {
        const ids = Array.from(selectedCalendarIds).join(',');
        navigate(`/create-event-form?calendarIds=${ids}`);
    };

    return (
        <div className="select-calendar-page">
            <img src={logo} alt="Logo" className="login-logo" />
            <h1 className="title">Selecione as agendas que gostaria de utilizar</h1>
            {loading ? (
                <p className="loading">Carregando calendários...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="calendar-selection">
                    <div className="calendar-column">
                        <h2 className="calendar-column-title">Minhas Agendas</h2> 
                        {calendars.slice(0, Math.ceil(calendars.length / 2)).map((calendar) => (
                            <div key={calendar.id} className="calendar-item">
                                <input
                                    type="checkbox"
                                    name="calendar"
                                    id={calendar.id}
                                    checked={selectedCalendarIds.has(calendar.id)}
                                    onChange={() => handleCheckboxChange(calendar.id)}
                                />
                                <label htmlFor={calendar.id}>{calendar.summary}</label>
                            </div>
                        ))}
                    </div>
                    <div className="calendar-column">
                        <h2 className="calendar-column-title">Outras Agendas</h2> 
                        {calendars.slice(Math.ceil(calendars.length / 2)).map((calendar) => (
                            <div key={calendar.id} className="calendar-item">
                                <input
                                    type="checkbox"
                                    name="calendar"
                                    id={calendar.id}
                                    checked={selectedCalendarIds.has(calendar.id)}
                                    onChange={() => handleCheckboxChange(calendar.id)}
                                />
                                <label htmlFor={calendar.id}>{calendar.summary}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button
                onClick={handleProceed}
                className="proceed-button"
                disabled={!selectedCalendarIds}
            >
                Salvar
            </button>
        </div>
    );
};

export default SelectCalendarPage;
