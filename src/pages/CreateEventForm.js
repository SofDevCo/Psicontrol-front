import React, { useEffect, useState } from 'react';
import '../styles/CreateEventForm.css';

const CreateEventForm = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/events/get-events');
    
            // Verifique se a resposta é JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setEvents(data);
            } else {
                throw new Error('Resposta não é JSON');
            }
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            setError('Não foi possível carregar eventos.');
        }
    };

    const handleDelete = async (eventId) => {
        try {
            await fetch(`http://localhost:3000/events/delete-event/${eventId}`, {
                method: 'DELETE',
            });
            // Atualizar a lista de eventos após a exclusão
            fetchEvents();
        } catch (error) {
            console.error('Erro ao excluir o evento:', error);
        }
    };

    return (
        <div className="create-event-page">
            <div className="create-event-box">
                <h2 className="create-event-title">Criar Evento</h2>
                <form action="http://localhost:3000/events/create-event" method="POST">
                    <div className="form-group">
                        <label htmlFor="event_name" className="form-label">Nome do Evento:</label>
                        <input type="text" id="event_name" name="event_name" className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date" className="form-label">Data:</label>
                        <input type="date" id="date" name="date" className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="start_time" className="form-label">Hora de Início:</label>
                        <input type="time" id="start_time" name="start_time" className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="end_time" className="form-label">Hora de Término:</label>
                        <input type="time" id="end_time" name="end_time" className="form-input" required />
                    </div>

                    <button type="submit" className="submit-button">Criar Evento</button>
                </form>

                <h2 className="event-list-title">Eventos Criados</h2>
                {error && <p className="error-message">{error}</p>}
                <table className="event-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Data</th>
                            <th>Início</th>
                            <th>Término</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.customers_id}>
                                <td>{event.event_name}</td>
                                <td>{event.date}</td>
                                <td>{event.start_time}</td>
                                <td>{event.end_time}</td>
                                <td>
                                    <button onClick={() => handleDelete(event.customers_id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CreateEventForm;
