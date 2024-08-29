import React, { useState, useEffect } from 'react';
import '../styles/CreateEventForm.css';

const CreateEventForm = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);
    const [formValues, setFormValues] = useState({
        event_name: '',
        date: '',
        start_time: '',
        end_time: '',
        status: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/events/get-events');
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();

                // Ordenar os eventos pela data de forma decrescente
                const sortedEvents = data.sort((a, b) => new Date(b.date) - new Date(a.date));

                setEvents(sortedEvents);
            } else {
                throw new Error('Resposta não é JSON');
            }
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            setError('Não foi possível carregar eventos.');
        }
    };

    const handleDelete = async (googleEventId) => {
        try {
            await fetch(`http://localhost:3000/events/delete-event/${googleEventId}`, {
                method: 'DELETE',
            });
            fetchEvents(); // Atualizar a lista de eventos após a exclusão
        } catch (error) {
            console.error('Erro ao excluir o evento:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/events/create-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });

            if (response.ok) {
                fetchEvents(); // Atualiza a lista de eventos após a criação de um novo evento
                setShowCreateEventForm(false); // Fecha o formulário após criar o evento
            } else {
                throw new Error('Erro ao criar o evento');
            }
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            setError('Não foi possível criar o evento.');
        }
    };

    const syncCalendar = async () => {
        try {
            const response = await fetch('http://localhost:3000/events/sync-calendar', {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                fetchEvents(); // Atualiza a lista de eventos após a sincronização
            } else {
                console.error('Erro ao sincronizar calendário.');
            }
        } catch (error) {
            console.error('Erro ao sincronizar calendário:', error);
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
                        <form className="create-event-form" onSubmit={handleSubmit}>
                            <h3>Criar Evento</h3>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="event_name"
                                    name="event_name"
                                    placeholder="Nome do Evento"
                                    value={formValues.event_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formValues.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="time"
                                    id="start_time"
                                    name="start_time"
                                    value={formValues.start_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="time"
                                    id="end_time"
                                    name="end_time"
                                    value={formValues.end_time}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="status"
                                    name="status"
                                    placeholder="Status"
                                    value={formValues.status}
                                    onChange={handleInputChange}
                                    required
                                />
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
                        <h2 className="event-list-title">
                            Eventos Criados
                            <button onClick={syncCalendar} className="refresh-button">Atualizar</button>
                        </h2>
                        {error && <p className="error-message">{error}</p>}
                        <table className="event-table">
                            <thead>
                                <tr>
                                    <th>Nome do Evento</th>
                                    <th>Data</th>
                                    <th>Hora de Início</th>
                                    <th>Ações</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event) => (
                                    <tr key={event.google_event_id}>
                                        <td>{event.event_name}</td>
                                        <td>{event.date}</td>
                                        <td>{event.start_time}</td>
                                        <td>
                                            <button onClick={() => handleDelete(event.google_event_id)}>Deletar</button>
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
