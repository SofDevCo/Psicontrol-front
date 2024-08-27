import React, { useState, useEffect } from 'react';
import '../styles/CreateEventForm.css';

const CreateEventForm = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/events/get-events');
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
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-content">
                    <h1 className="sidebar-title">PsiControl</h1>
                    <nav>
                        <ul>
                            <li><a href="#dashboard">Dashboard</a></li>
                            <li><a href="#pacientes">Pacientes</a></li>
                            <li><a href="#despesas">Despesas e receitas</a></li>
                            <li><a href="#meus-dados">Meus dados</a></li>
                            <li><a href="#configuracoes">Configurações</a></li>
                            <li>
                                <button onClick={() => setShowCreateEventForm(!showCreateEventForm)}>
                                    {showCreateEventForm ? 'Fechar' : 'Agendamento Rápido'}
                                </button>
                            </li>
                        </ul>
                    </nav>
                    {showCreateEventForm && (
                    <form className="create-event-form" action="http://localhost:3000/events/create-event" method="POST">
                        <h3>Criar Evento</h3>
                        <div className="form-group">
                            <input type="text" id="event_name" name="event_name" placeholder="Nome do Evento" required />
                        </div>
                        <div className="form-group">
                            <input type="date" id="date" name="date" required />
                        </div>
                        <div className="form-group">
                            <input type="time" id="start_time" name="start_time" placeholder="Hora de Início" required />
                        </div>
                        <div className="form-group">
                            <input type="time" id="end_time" name="end_time" placeholder="Hora de Fim" required />
                        </div>
                        <button type="submit" className="submit-button">Salvar</button>
                    </form>
                )}
                </div>
                <div className="user-profile">
                    <img src="/caminho/para/foto-perfil.jpg" alt="Foto do perfil" className="profile-photo" />
                    <span className="profile-name">Nome do Usuário</span>
                </div>
            </aside>
            <main className="main-content">
                <div className="content-area">
                    <section className="events-list-section">
                        <h2 className="event-list-title">Eventos Criados</h2>
                        {error && <p className="error-message">{error}</p>}
                        <table className="event-table">
                            <thead>
                                <tr>
                                    <th>Nome do Evento</th>
                                    <th>Data</th>
                                    <th>Hora de Início</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event) => (
                                    <tr key={event.id}>
                                        <td>{event.event_name}</td>
                                        <td>{event.date}</td>
                                        <td>{event.start_time}</td>
                                        <td>
                                            <button onClick={() => handleDelete(event.id)}>Deletar</button>
                                        </td>
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