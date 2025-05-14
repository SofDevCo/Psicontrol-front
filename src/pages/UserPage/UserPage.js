import React, { useState, useEffect, useRef } from "react";
import { CheckMessage, EditIcon, RefreshIcon } from "../../icons/icons";
import { showAlteredToast } from "./components/toastUserPage";
import { VariableIcon } from "./components/UserPageIcons";
import { showErrorToast } from "../../utils/notification/toastify";
import VariableDropdown from "./components/VariableDropdown";
import {
  showLoadingToast,
  showSuccessToast,
  showSuccessCalendarToast,
  showLoadingCalendarToast,
} from "../CustomerPage/components/notiificationCustomerPage";

const UserPage = () => {
  const [userData, setUserData] = useState({
    user_name: "",
    user_email: "",
    user_cpf: "",
    user_cnpj: "",
    crp_number: "",
    user_phone: "",
    user_message: "",
    image: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState(new Set());
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [fileName, setFileName] = useState("nomedoarquivo.png");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [activeCalendarId, setActiveCalendarId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "Erro ao buscar os dados do usuário:",
          await response.text()
        );
        return;
      }

      const data = await response.json();
      setUserData(data);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchCalendars = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/events/calendars`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setCalendars(data);

      const selected = new Set(
        data.filter((cal) => cal.enabled).map((cal) => cal.calendar_id)
      );
      setSelectedCalendars(selected);
    };

    fetchCalendars();
  }, [refreshKey]);

  const toggleCalendar = async (calendarId) => {
    const isEnabled = !selectedCalendars.has(calendarId);

    const calendar = calendars.find((cal) => cal.id === calendarId);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/events/calendars/selection/${calendarId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: isEnabled,
          calendar_name: calendar ? calendar.summary : "default name",
        }),
      }
    );
    if (!response.ok) {
      return;
    }

    setSelectedCalendars((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (isEnabled) {
        updatedSelected.add(calendarId);
      } else {
        updatedSelected.delete(calendarId);
      }
      return updatedSelected;
    });

    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleChangeAccount = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/google`);
    const data = await response.json();

    if (data.authUrl) {
      window.location.href = data.authUrl;
    }
  };

  const handleSave = async () => {
    const loadingToast = showLoadingToast();

    const startTime = Date.now();

    const formData = new FormData();
    formData.append("user_cpf", userData.user_cpf || "");
    formData.append("user_cnpj", userData.user_cnpj || "");
    formData.append("user_email", userData.user_email || "");
    formData.append("crp_number", userData.crp_number || "");
    formData.append("user_phone", userData.user_phone || "");
    formData.append("user_message", userData.user_message || "");
    formData.append("clinic_name", userData.clinic_name || "");

    if (userData.image instanceof File) {
      formData.append("image", userData.image);
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/save-users`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: formData,
      }
    );

    const responseData = await response.json();

    const elapsed = Date.now() - startTime;
    const minDuration = 2000;
    if (elapsed < minDuration) {
      await new Promise((resolve) =>
        setTimeout(resolve, minDuration - elapsed)
      );
    }

    loadingToast.closeToast();

    if (!response.ok) {
      if (responseData.error?.includes("E-mail inválido")) {
        showErrorToast("E-mail inválido. Verifique e tente novamente.");
      } else {
        showErrorToast(
          responseData.error || "Erro ao salvar os dados do usuário."
        );
      }
      return;
    }

    setUserData((prevData) => ({
      ...prevData,
      ...responseData,
    }));

    setRefreshKey((prevKey) => prevKey + 1);
    setIsEditing(false);

    showAlteredToast();
  };

  const saveMessage = async () => {
    const formData = new FormData();
    formData.append("user_message", userData.user_message || "");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/save-users`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      showErrorToast("Erro ao salvar a mensagem.");
      return;
    }

    const updatedData = await response.json();
    setUserData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));

    setIsEditingMessage(false);
  };

  const openModalToChangeAccount = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const maskCpf = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");

  const maskCnpj = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");

  const handleDocumentChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length <= 11) {
      setUserData((prev) => ({
        ...prev,
        user_cpf: maskCpf(raw),
        user_cnpj: "",
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        user_cpf: "",
        user_cnpj: maskCnpj(raw),
      }));
    }
  };

  const handleCRPChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevData) => ({
      ...prevData,
      [name]: formatCRP(value),
    }));
  };

  const formatCRP = (input) => {
    let cleaned = input.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 7)}`;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserData((prevData) => ({
      ...prevData,
      image: file,
    }));
    setFileName(file ? file.name : "");
  };

  const openConfirmationModal = (calendarId) => {
    setActiveCalendarId(calendarId);
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setActiveCalendarId(null);
  };

  const handleToggleCalendar = async (calendarId) => {
    closeConfirmationModal();

    const loadingToast = showLoadingCalendarToast();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    loadingToast.closeToast();
    await toggleCalendar(calendarId);

    showSuccessCalendarToast();
  };

  const handleSelectVariable = (variable) => {
    setUserData((prevData) => ({
      ...prevData,
      user_message: (prevData.user_message || "") + " " + variable,
    }));
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col items-center w-full p-6 overflow-x-hidden overflow-y-auto">
      <>
        <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center">
          <div className="relative w-full bg-bg1 p-6 border-2 border-cinza6 rounded-[25px] lg:mt-28 mt-28 mb-3">
            <div className="flex items-center justify-between mb-6 sm:ml-2.5">
              <h2 className="text-[#0082ba] text-xl sm:text-2xl font-medium font-['Ubuntu']">
                Meus dados
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[#0082ba] text-sm underline flex items-center"
              >
                <div className="mr-1 pr-1 text-sky-600 text-base font-medium relative">
                  Editar dados
                </div>
                <EditIcon />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row justify-start gap-x-[182px] sm:ml-2.5">
              <div className="flex w-full lg:max-w-[360px] mb-6 lg:mb-0">
                {/* For screens >= 1100px (lg) - Original Layout */}
                <div className="hidden lg:flex lg:w-10 lg:h-10 aspect-square bg-[#33b8d1] rounded-full justify-center items-center -mt-1">
                  {userData.photoUrl ? (
                    <img
                      src={userData.photoUrl}
                      alt="Foto de perfil"
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="flex items-center justify-center text-xl font-bold text-white">
                      {userData.user_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block ">
                  <div className="text-black text-xl font-medium font-['Ubuntu'] ml-4 mb-6">
                    {userData.user_name}
                  </div>
                  <div className="text-texto1 -ml-10 text-[17px] font-normal tracking-tight">
                    <span className="font-semibold">CPF/CNPJ: </span>
                    <span className="text-texto1">
                      {userData.user_cpf || userData.user_cnpj}
                    </span>
                  </div>
                  <div className="text-texto1 -ml-10 text-[17px] font-normal tracking-tight ">
                    <span className="font-semibold">CRP: </span>
                    <span className="text-texto1">{userData.crp_number}</span>
                  </div>
                  <div className="flex -ml-10 text-texto1 text-[17px] font-normal tracking-tight  items-start">
                    <span className="self-start mr-1 whitespace-nowrap font-semibold">
                      E-mail:
                    </span>
                    <span className="text-texto1 break-all">
                      {userData.user_email}
                    </span>
                  </div>

                  <div className="text-texto1 -ml-10 text-[17px] font-normal tracking-tight">
                    <span className="font-semibold">Telefone: </span>
                    <span className="text-texto1">{userData.user_phone}</span>
                  </div>
                </div>

                {/* For screens < 1100px - New Aligned Layout */}
                <div className="flex flex-col w-full lg:hidden">
                  <div className="flex mb-4">
                    <div className="w-7 h-7 aspect-square bg-[#33b8d1] rounded-full flex justify-center items-center">
                      {userData.photoUrl ? (
                        <img
                          src={userData.photoUrl}
                          alt="Foto de perfil"
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <span className="text-xl font-bold text-white">
                          {userData.user_name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="text-black text-xl font-medium font-['Ubuntu'] ml-4 mb-2">
                      {userData.user_name}
                    </div>
                  </div>

                  {/* Aligned fields section for mobile */}
                  <div className="ml-0">
                    <div className="text-texto1 text-[17px] font-normal tracking-tight">
                      <span className="font-semibold">CPF/CNPJ: </span>
                      <span className="text-texto1">
                        {userData.user_cpf || userData.user_cnpj}
                      </span>
                    </div>
                    <div className="text-texto1 text-[17px] font-normal tracking-tight mt-2">
                      <span className="font-semibold">CRP: </span>
                      <span className="text-texto1">{userData.crp_number}</span>
                    </div>
                    <div className="flex text-texto1 text-[17px] font-normal tracking-tight mt-2 items-start">
                      <span className="self-start mr-1 whitespace-nowrap font-semibold">
                        E-mail:
                      </span>
                      <span className="text-texto1 break-all">
                        {userData.user_email}
                      </span>
                    </div>

                    <div className="text-texto1 text-[17px] font-normal tracking-tight mt-2">
                      <span className="font-semibold">Telefone: </span>
                      <span className="text-texto1">{userData.user_phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:max-w-[520px] lg:ml-[30px]">
                <div className="text-black text-xl font-medium font-['Ubuntu'] mb-2 lg:mb-6">
                  Dados para recibo
                </div>
                <div className="text-texto1 text-[17px] font-normal tracking-tight">
                  <span className="font-semibold">Nome/Clínica: </span>
                  <span className="text-texto1">{userData.clinic_name}</span>
                </div>
                <div className="text-texto1 text-[17px] font-normal tracking-tight mt-2 lg:mt-0">
                  <span className="font-semibold">CPF/CNPJ: </span>
                  <span className="text-texto1">
                    {userData.user_cpf || userData.user_cnpj}
                  </span>
                </div>
                <div className="text-texto1 text-[17px] font-normal tracking-tight mt-2 lg:mt-0">
                  <span className="font-semibold">CRP: </span>
                  <span className="text-texto1">{userData.crp_number}</span>
                </div>
                <div className="text-texto1 text-[17px] font-normal tracking-tight mt-2 lg:mt-0">
                  <span className="font-semibold">Logo: </span>
                  <span className="text-texto1">
                    {userData.image
                      ? userData.image instanceof File
                        ? userData.image.name
                        : typeof userData.image === "string" &&
                            userData.image.includes("/")
                          ? userData.image.split("/").pop()
                          : userData.image
                      : "(Imagem não carregada)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-start justify-between w-full gap-4 lg:flex-nowrap lg:space-x-4">
            <div className="w-full lg:max-w-[540px] h-[385px] lg:h-[370px] bg-bg1 shadow p-6 border-2 border-cinza6 rounded-[25px] overflow-hidden">
              <div className="flex justify-between">
                <h3 className="text-[#0082ba] lg:w-[200px] w-[200px] text-xl sm:text-2xl font-medium ml-2.5">
                  Minhas agendas
                </h3>
              </div>

              <p className="mt-8 ml-2.5 text-xl font-semibold">
                {userData.user_name}
              </p>
              <p className="text-[#8d8d8d] ">
                <span className="text-[#5c5c5c] ml-2.5 font-semibold">
                  E-mail:
                </span>{" "}
                {userData.user_email}
              </p>

              <div className="mt-6 ml-2.5">
                <h4 className="text-texto1 text-lg font-medium">
                  Agendas sincronizadas
                </h4>

                <div className="mt-3 space-y-4 max-h-[120px] overflow-y-auto">
                  {calendars.map((calendar) => (
                    <div
                      key={calendar.calendar_id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCalendars.has(calendar.calendar_id)}
                        onChange={() =>
                          openConfirmationModal(calendar.calendar_id)
                        }
                        className={`appearance-none w-5 h-5 rounded-full border-2 transition-colors cursor-pointer ${
                          selectedCalendars.has(calendar.calendar_id)
                            ? "bg-[#0082ba] border-[#0082ba] shadow-inner"
                            : "bg-white border-[#0082ba]"
                        }`}
                        style={{
                          boxShadow: selectedCalendars.has(calendar.calendar_id)
                            ? "inset 0 0 0 3px white"
                            : "none",
                        }}
                      />
                      <span
                        className={`font-medium ${
                          selectedCalendars.has(calendar.calendar_id)
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        {calendar.calendar_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {isModalOpen && (
                <div className="fixed inset-0 z-30 flex items-center backdrop-blur-[6px] justify-center bg-[#33B8D14D] bg-opacity-30">
                  <div className="w-[335px] h-[202px] bg-white rounded-lg border-2 border-[#81a0ae] p-6 shadow-lg">
                    <div className="w-full mx-auto mb-12 text-center">
                      <span className="text-[#5c5c5c] text-[21px] font-medium font-['Ubuntu'] tracking-tight">
                        Você tem certeza que <br />
                        deseja
                        <span className="text-[#0082ba]">
                          {" "}
                          trocar de conta?{" "}
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-around">
                      <button
                        onClick={closeModal}
                        className="h-10 w-[100px] bg-white border border-[#0082ba] text-[#0082ba] rounded-full text-center font-semibold hover:bg-[#e6f4f8]"
                      >
                        Não
                      </button>
                      <button
                        onClick={() => {
                          closeModal();
                          handleChangeAccount();
                        }}
                        className="h-10 w-[100px] bg-[#0082ba] text-white rounded-full text-center font-semibold hover:bg-[#007bb8]"
                      >
                        Sim
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isConfirmationModalOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-[6px] bg-[#33B8D14D] bg-opacity-30">
                  <div className="w-[335px] h-[202px] bg-white rounded-lg border-2 border-[#81a0ae] p-6 shadow-lg transform translate-x-[117px] translate-y-[-169px]">
                    <div className="w-full mx-auto mb-12 text-center">
                      <span className="text-[#5c5c5c] text-[21px] font-medium font-['Ubuntu'] tracking-tight">
                        Você tem certeza que deseja
                        <br />
                        {selectedCalendars.has(activeCalendarId) ? (
                          <span className="text-[#0082ba]">
                            desativar a agenda?
                          </span>
                        ) : (
                          <span className="text-[#0082ba]">
                            ativar a agenda?
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-around">
                      <button
                        onClick={closeConfirmationModal}
                        className="h-10 w-[100px] bg-white border border-[#0082ba] text-[#0082ba] rounded-full text-center font-semibold hover:bg-[#e6f4f8]"
                      >
                        Não
                      </button>
                      <button
                        onClick={() => handleToggleCalendar(activeCalendarId)}
                        className="h-10 w-[100px] bg-[#0082ba] text-white rounded-full text-center font-semibold hover:bg-[#007bb8]"
                      >
                        Sim
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-start w-full gap-4 lg:flex-nowrap lg:space-x-4">
              <div className="w-full lg:max-w-[520px] h-[370px] bg-bg1 p-6 border-2 border-cinza6 rounded-[25px] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#0082ba] text-xl sm:text-2xl font-medium">
                    Mensagem de cobrança
                  </h3>
                  <div className="relative flex items-center gap-4">
                    <button
                      onClick={() =>
                        isEditingMessage && setIsDropdownOpen(!isDropdownOpen)
                      }
                      disabled={!isEditingMessage}
                      className={`flex items-center mt-2 ${isEditingMessage ? "cursor-pointer text-[#0082ba] font-bold" : "cursor-not-allowed opacity-50"}`}
                    >
                      {isEditingMessage ? "{Variáveis}" : null}
                    </button>

                    {isEditingMessage && isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 z-10 mt-1 top-full lg:mt-0"
                      >
                        <VariableDropdown
                          onSelectVariable={handleSelectVariable}
                        />
                      </div>
                    )}

                    {isEditingMessage ? (
                      <button
                        onClick={saveMessage}
                        className="text-[#0082ba] text-sm flex items-center "
                      >
                        <CheckMessage />
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditingMessage(true)}
                        className="flex items-center"
                      >
                        <EditIcon />
                      </button>
                    )}
                  </div>
                </div>

                {isEditingMessage ? (
                  <textarea
                    name="user_message"
                    value={userData.user_message || ""}
                    onChange={(e) =>
                      setUserData((prevData) => ({
                        ...prevData,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    className="w-full h-[250px] max-h-[250px] p-4 border border-gray-300 rounded-md resize-none text-texto1 text-[15px] bg-white overflow-y-auto"
                    placeholder="Escreva sua mensagem de cobrança aqui..."
                  />
                ) : (
                  <div className="text-texto1 text-[15px] whitespace-pre-line">
                    {userData.user_message || (
                      <span className="text-gray-400">
                        Escreva sua mensagem de cobrança aqui...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[#33B8D14D] backdrop-blur-[6px]">
              <div className="w-[90%] lg:max-w-[1076px] max-h-[90vh] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] shadow-lg p-6 lg:p-8 overflow-y-auto m-auto">
                <div className="flex flex-col gap-6 lg:flex-row lg:ml-9">
                  <div className="mr-0 space-y-6 lg:mr-20">
                    <h2 className="text-lg lg:text-[25px] font-medium text-[#0082ba] font-['Ubuntu']">
                      Editar meus dados
                    </h2>

                    <div>
                      <label className="block text-sm lg:text-base font-normal font-['Open Sans'] text-texto1 tracking-wide mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="user_name"
                        value={userData.user_name || ""}
                        onChange={handleChange}
                        placeholder="Nome do psicólogo"
                        className="w-full lg:w-[418px] h-[50px] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c] text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                      />
                    </div>

                    <div>
                      <label className="block text-sm lg:text-base font-normal font-['Open Sans'] text-texto1 tracking-wide mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="user_email"
                        value={userData.user_email || ""}
                        onChange={handleChange}
                        placeholder="e-mail.psicologo@gmail.com"
                        className="w-full lg:w-[418px] h-[50px] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c] text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                      />
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row">
                      <div>
                        <label className="block text-sm lg:text-base font-normal font-['Open Sans'] text-texto1 tracking-wide mb-1">
                          Telefone
                        </label>
                        <input
                          type="text"
                          name="user_phone"
                          value={userData.user_phone || ""}
                          onChange={handleChange}
                          placeholder="(00) 0 0000-0000"
                          className="w-full lg:w-[181px] h-[50px] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c] text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                        />
                      </div>

                      <div>
                        <label className="block text-sm lg:text-base  font-['Open Sans'] text-texto1 tracking-wide mb-1">
                          CPF/CNPJ
                        </label>
                        <input
                          type="text"
                          value={userData.user_cpf || userData.user_cnpj || ""}
                          onChange={handleDocumentChange}
                          placeholder="XX.XXX.XXX/0001-XX"
                          className="w-full lg:w-[212px] h-[50px] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c] text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm lg:text-base font-normal font-['Open Sans'] text-texto1 tracking-wide mb-1">
                        CRP
                      </label>
                      <input
                        type="text"
                        name="crp_number"
                        value={userData.crp_number || ""}
                        onChange={handleCRPChange}
                        placeholder="XX/XXXXX"
                        className="w-full lg:w-[181px] h-[50px] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c] text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-lg lg:text-[25px] font-medium text-[#0082ba] font-['Ubuntu']">
                      Dados para recibo
                    </h2>

                    <div>
                      <label className="block text-sm lg:text-base font-normal font-['Open Sans'] text-texto1 tracking-wide mb-1">
                        Nome/Clínica
                      </label>
                      <input
                        type="text"
                        id="clinic_name"
                        value={userData.clinic_name || ""}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            clinic_name: e.target.value,
                          })
                        }
                        placeholder="Nome/Clínica"
                        className="w-full lg:w-[418px] h-[50px] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c] text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                      />
                    </div>

                    <div>
                      <label className="block text-sm lg:text-base font-normal font-['Open Sans'] text-texto1 tracking-wide mb-1">
                        CPF/CNPJ
                      </label>
                      <input
                        type="text"
                        name="clinic_cpf_cnpj"
                        value={userData.clinic_cpf_cnpj || ""}
                        onChange={handleChange}
                        placeholder="XX.XXX.XXX/0001-XX"
                        className="w-full lg:w-[212px] h-[50px] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c] text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                      />
                    </div>

                    <div>
                      <label className="block text-sm lg:text-base font-normal font-['Open Sans'] text-texto1 tracking-wide mb-1">
                        Importar logotipo
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-full lg:w-[212px] h-[50px] bg-bg1 rounded-[15px] border-2 border-[#81a0ae] px-[16px] flex items-center">
                          <span className="text-[#5c5c5c] text-sm font-normal font-['Open Sans']">
                            {fileName}
                          </span>
                        </div>
                        <label className="flex items-center gap-1 text-[#0082ba] cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4-4m0 0l-4 4m4-4v12"
                            />
                          </svg>
                          <span className="underline">Importar arquivo</span>
                          <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border w-[108px] h-[39px] border-primaria text-primaria rounded-[100px]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 w-[90px] h-[40px] bg-primaria text-white rounded-[100px]"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default UserPage;
