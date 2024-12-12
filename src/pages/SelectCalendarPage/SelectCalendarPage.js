import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../images/Psicontrol.png";
import "../../index.css";
import { CalendarIcon } from "../../icons/icons";

const SelectCalendarPage = () => {
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCalendars = async () => {
    const authenticationToken = localStorage.getItem("authentication_token");

    if (authenticationToken) {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/events/calendars`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authenticationToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCalendars(data);

        const activeCalendars = new Set(
          data
            .filter((calendar) => calendar.enabled)
            .map((calendar) => calendar.calendar_id)
        );
        setSelectedCalendarIds(activeCalendars);

        setLoading(false);
      } else {
        setLoading(false);
        setError("Erro ao carregar calendários");
      }
    }
  };

  const checkCalendars = async () => {
    const authenticationToken = localStorage.getItem("authentication_token");

    if (!authenticationToken) {
      setError("Token de autenticação não encontrado.");
      return setLoading(false);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/events/check-calendars`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authenticationToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setError("Erro ao verificar calendários.");
        return setLoading(false);
      }

      const data = await response.json();
      if (data.redirect) {
        console.log("Redirecionando para:", data.redirect);
        navigate(data.redirect);
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor.");
      console.error("Erro ao conectar com o servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await checkCalendars();
      await fetchCalendars();
    };

    fetchInitialData();
  }, []);

  const handleCheckboxChange = async (calendar) => {
    const newSelectedCalendarIds = new Set(selectedCalendarIds);
    const isSelected = newSelectedCalendarIds.has(calendar.id);

    if (isSelected) {
      newSelectedCalendarIds.delete(calendar.id);
    } else {
      newSelectedCalendarIds.add(calendar.id);
    }
    setSelectedCalendarIds(newSelectedCalendarIds);

    const authenticationToken = localStorage.getItem("authentication_token");
    await fetch(
      `${process.env.REACT_APP_API_URL}/events/calendars/selection/${calendar.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authenticationToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: !isSelected,
          calendar_name: calendar.calendar_name,
        }),
      }
    );
  };

  const handleProceed = () => {
    const ids = Array.from(selectedCalendarIds);

    localStorage.setItem("selectedCalendars", JSON.stringify(ids));
    console.log("Calendários selecionados salvos no localStorage:", ids); // Verificação

    navigate(`/create-event-form?calendarIds=${ids.join(",")}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mx-auto  p-8 bg-bg1 text-center font-sans">
      <img
        src={logo}
        alt="Logo"
        className="mx-auto mb-8 md:w-[275px] md:h-[165px] w-[212px] h-[127px]"
      />
      {loading ? (
        <p className="italic text-gray-500">Carregando calendários...</p>
      ) : error ? (
        <p className="italic text-gray-500">{error}</p>
      ) : (
        <div className="mt-8 flex flex-col items-center shadow-xl justify-center gap-8">
          <div className="flex w-auto md:p-6 p-1 rounded-[8px] border-2 border-solid border-primaria flex-col items-center justify-center">
            <h1 className="mb-6 md:text-[22px] text-[18px] leading-[26px] text-texto1 font-['Ubuntu'] font-normal">
              Escolher agenda
            </h1>
            <h2 className="mb-4 border-b border-b-cinza6 text-center md:text-[16px] text-[16px] font-bold text-texto1 flex items-center justify-center gap-2">
              <CalendarIcon />
              <span className="mr-3">Minhas Agendas</span>
            </h2>

            {calendars.map((calendar) => (
              <div key={calendar.id} className="mb-3 flex w-full items-center text-texto2">
                <input
                  type="checkbox"
                  className="appearance-none md:w-[20px] md:h-[20px] w-[16px] h-[16px] rounded-full border-2 border-primaria checked:border-primaria checked:bg-white checked:relative checked:before:content-[''] checked:before:absolute checked:before:top-[50%] checked:before:left-[50%] checked:before:w-[10px] checked:before:h-[10px] checked:before:rounded-full checked:before:bg-primaria checked:before:transform checked:before:translate-x-[-50%] checked:before:translate-y-[-50%] ml-5 mr-3 cursor-pointer"
                  name="calendar"
                  id={calendar.id}
                  checked={selectedCalendarIds.has(calendar.calendar_id)}
                  onChange={() => handleCheckboxChange(calendar)}
                />
                <label htmlFor={calendar.id} className="font-bold md:text-[15px] text-[13px]">
                  {calendar.summary}
                </label>
              </div>
            ))}


            <button
              onClick={handleProceed}
              className="rounded-[100px] md:mt-6 mt-3 md:mb-0 mb-3 px-6 py-2 cursor-pointer border-2 border-solid border-primaria bg-white text-primaria text-[14px] font-bold hover:bg-primaria hover:text-white disabled:opacity-50 drop-shadow-monthsShadow"
              disabled={selectedCalendarIds.size === 0}
            >
              Continuar
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default SelectCalendarPage;
