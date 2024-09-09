import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SelectCalendarPage.css';  // Referenciando o arquivo CSS

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
            <h1 className="title">Selecione os Calendários</h1>
            {loading ? (
                <p className="loading">Carregando calendários...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="calendar-selection">
                    {calendars.map((calendar) => (
                        <div key={calendar.id} className="calendar-item">
                            <input
                                type="checkbox"
                                id={calendar.id}
                                checked={selectedCalendarIds.has(calendar.id)}
                                onChange={() => handleCheckboxChange(calendar.id)}
                            />
                            <label htmlFor={calendar.id}>{calendar.summary}</label>
                        </div>
                    ))}
                    <button
                        onClick={handleProceed}
                        className="proceed-button"
                        disabled={selectedCalendarIds.size === 0}
                    >
                        Prosseguir
                    </button>
                </div>
            )}
        </div>
    );
};

export default SelectCalendarPage;
