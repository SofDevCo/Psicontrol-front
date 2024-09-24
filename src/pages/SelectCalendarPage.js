import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/Psicontrol.png';
import '../index.css';

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
        <div class="max-w-[900px] mx-auto p-8 font-sans text-center flex flex-col items-center">
            <img src={logo} alt="Logo" class="block mx-auto mb-8 w-[150px]" />
            <h1 className="text-primaria mb-8 text-[32px]">Selecione as agendas que gostaria de utilizar</h1>
            {loading ? (
                <p class="text-gray-500 italic">Carregando calendários...</p>
            ) : error ? (
                <p class="text-gray-500 italic">{error}</p>
            ) : (
                <div class="flex justify-center items-start gap-8 mt-8 flex-wrap ml-[136px]">
                    <div class="flex flex-col items-start justify-center w-auto p-[5px] max-w-[250px]">
                        <h2 class="text-center text-[19.2px] font-bold mb-[16px] ">Minhas Agendas</h2> 
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
                    <div class="flex flex-col items-start justify-center w-auto p-[5px] max-w-[250px]">
                        <h2 class="text-center text-[19.2px] font-bold mb-[16px] ">Outras Agendas</h2> 
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
                class="block w-52 p-4 mt-8 mx-auto bg-primaria text-white border-none rounded-custom text-lg cursor-pointer transition duration-300 ease-in-out hover:bg-blue-700"
                disabled={!selectedCalendarIds}
            >
                Salvar
            </button>
        </div>
    );
};

export default SelectCalendarPage;
