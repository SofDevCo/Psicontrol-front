import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/Psicontrol.png';
import '../tailwind.css';

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

        // Armazenar o user_id no localStorage
        const userId = localStorage.getItem('user_id'); // Obtém o user_id do localStorage
        if (userId) {
            localStorage.setItem('user_id', userId);
            console.log('User ID armazenado:', userId); // Log para verificar se foi armazenado
        } else {
            console.log('User ID não encontrado.'); // Log caso não encontre o user_id
        }

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
        <div className="max-w-[900px] mx-auto p-8 font-sans text-center flex flex-col items-center">
            <img src={logo} alt="Logo" className="block mx-auto mb-8 w-[150px]" />
            <h1 className="text-custom-blue mb-8 text-[32px]">Selecione as agendas que gostaria de utilizar</h1>
            {loading ? (
                <p className="text-gray-500 italic">Carregando calendários...</p>
            ) : error ? (
                <p className="text-gray-500 italic">{error}</p>
            ) : (
                <div className="flex justify-center items-start gap-8 mt-8 flex-wrap ml-[136px]">
                    <div className="flex flex-col items-start justify-center w-auto p-[5px] max-w-[250px]">
                        <h2 className="text-center text-[19.2px] font-bold mb-[16px] ">Minhas Agendas</h2>
                        {calendars.slice(0, Math.ceil(calendars.length / 2)).map((calendar) => (
                            <div key={calendar.id} className="flex items-center mb-2 w-full">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    name="calendar"
                                    id={calendar.id}
                                    checked={selectedCalendarIds.has(calendar.id)}
                                    onChange={() => handleCheckboxChange(calendar.id)}
                                />
                                <label htmlFor={calendar.id} className="font-bold">
                                    {calendar.summary}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-start justify-center w-auto p-[5px] max-w-[250px]">
                        <h2 className="text-center text-[19.2px] font-bold mb-[16px] ">Outras Agendas</h2>
                        {calendars.slice(Math.ceil(calendars.length / 2)).map((calendar) => (
                            <div key={calendar.id} className="flex items-center mb-2 w-full">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    name="calendar"
                                    id={calendar.id}
                                    checked={selectedCalendarIds.has(calendar.id)}
                                    onChange={() => handleCheckboxChange(calendar.id)}
                                />
                                <label htmlFor={calendar.id} className="font-bold">
                                    {calendar.summary}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button
                onClick={handleProceed}
                className="block w-52 p-4 mt-8 mx-auto bg-custom-blue text-white border-none rounded-custom text-lg cursor-pointer transition duration-300 ease-in-out hover:bg-blue-700"
                disabled={!selectedCalendarIds.size} // Atualizado para verificar se há seleções
            >
                Salvar
            </button>
        </div>
    );
};

export default SelectCalendarPage;
