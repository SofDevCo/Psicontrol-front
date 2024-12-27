import React, { useState, useEffect } from "react";
import { CheckMessage, EditIcon, RefreshIcon } from "../../icons/icons";
import { showAlteredToast } from "./components/toastUserPage";

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
        console.error("Erro ao buscar os dados do usuário:", await response.text());
        return;
      }

      const data = await response.json();
      setUserData(data);
    };

    fetchUserData();
  }, []);

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
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/google`);
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Erro ao trocar de conta:", error);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("user_cpf", userData.user_cpf || "");
      formData.append("user_cnpj", userData.user_cnpj || "");
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

      if (!response.ok) {
        throw new Error("Erro ao salvar os dados do usuário.");
      }

      const updatedData = await response.json();
      setUserData((prevData) => ({
        ...prevData,
        ...updatedData,
      }));

      setRefreshKey((prevKey) => prevKey + 1);
      setIsEditing(false);
      showAlteredToast();
    } catch (error) {
      console.error(error);
    }
  };

  const saveMessage = async () => {
    try {
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
        throw new Error("Erro ao salvar a mensagem.");
      }

      const updatedData = await response.json();
      setUserData((prevData) => ({
        ...prevData,
        ...updatedData,
      }));

      setIsEditingMessage(false);
    } catch (error) {
      console.error("Erro ao salvar a mensagem:", error);
      alert("Erro ao salvar a mensagem. Tente novamente.");
    }
  };

  const openModalToChangeAccount = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "user_message") {
      console.log(`Mensagem atualizada: ${value}`);
    }

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleToggleCalendar = (calendarId) => {
    toggleCalendar(calendarId);
    closeConfirmationModal();
  };

  return (
    <div className="flex flex-col ">
      {isEditing && (
        <div className="fixed inset-0 ml-[195px] backdrop-blur-[6px] bg-[#33B8D14D] bg-opacity-30  flex justify-center items-center z-30">
          <div className=" w-[1076px] -mb-14 h-[615px] mr-16 bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] shadow-lg p-8">
            <div className="flex gap-8">
              <div className="space-y-6">
                <h2 className="text-[25px] mx-[25px] font-medium text-[#0082ba] font-['Ubuntu']">
                  Editar meus dados
                </h2>

                <div>
                  <label className="block mx-[42px] text-base font-normal font-['Open Sans'] text-[#232323] tracking-wide mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    value={userData.user_name || ""}
                    onChange={handleChange}
                    placeholder="Nome do psicólogo"
                    className="w-[418px] h-[50px] mx-[23px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                  />
                </div>

                <div>
                  <label className="block mx-[42px] text-base font-normal font-['Open Sans'] text-[#232323] tracking-wide mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    value={userData.user_email || ""}
                    onChange={handleChange}
                    placeholder="e-mail.psicologo@gmail.com"
                    className="w-[418px] h-[50px] mx-[23px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                  />
                </div>

                <div className="flex gap-4">
                  <div>
                    <label className="block mx-[42px] text-base font-normal font-['Open Sans'] text-[#232323] tracking-wide mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="user_phone"
                      value={userData.user_phone || ""}
                      onChange={handleChange}
                      placeholder="(00) 0 0000-0000"
                      className="w-[181px] h-[50px] mx-[23px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                    />
                  </div>

                  <div>
                    <label className="block mx-[18px] text-base font-normal font-['Open Sans'] text-[#232323] tracking-wide mb-1">
                      CPF/CNPJ
                    </label>
                    <input
                      type="text"
                      name="user_cpf"
                      value={userData.user_cpf || ""}
                      onChange={handleChange}
                      placeholder="XX.XXX.XXX/0001-XX"
                      className="w-[212px] h-[50px]  bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mx-[42px] text-base font-normal font-['Open Sans'] text-[#232323] tracking-wide mb-1">
                    CRP
                  </label>
                  <input
                    type="text"
                    name="crp_number"
                    value={userData.crp_number || ""}
                    onChange={handleChange}
                    placeholder="XX/XXXXX"
                    className="w-[181px] h-[50px] mx-[23px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                  />
                </div>
              </div>

              <div className="space-y-6 ml-16">
                <h2 className="text-[25px] font-medium text-[#0082ba] font-['Ubuntu']">
                  Dados para recibo
                </h2>

                <div>
                  <label className="block mx-[18px] text-base font-normal font-['Open Sans'] text-[#232323] tracking-wide mb-1">
                    Nome/Clínica:
                  </label>
                  <input
                    type="text"
                    id="clinic_name"
                    value={userData.clinic_name || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, clinic_name: e.target.value })
                    }
                    placeholder="Nome/Clínica"
                    className="w-[212px] h-[50px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                  />
                </div>
                <div>
                  <label className="block mx-[18px] text-base font-normal font-['Open Sans'] text-[#232323] tracking-wide mb-1">
                    CPF/CNPJ
                  </label>
                  <input
                    type="text"
                    name="clinic_cpf_cnpj"
                    value={userData.clinic_cpf_cnpj || ""}
                    onChange={handleChange}
                    placeholder="XX.XXX.XXX/0001-XX"
                    className="w-[212px] h-[50px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
                  />
                </div>

                <div>
                  <label className="block mx-[18px] text-base font-normal font-['Open Sans'] text-[#232323] tracking-wide mb-1">
                    Importar logotipo
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-[212px] h-[50px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] flex items-center">
                      <span className="text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans']">
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

            <div className="flex mx-[780px] gap-2 mt-[50px]">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-1 border w-[108px] h-[39px] item-center border-primaria text-primaria rounded-[100px] mr-2 "
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 w-[90px] h-[40px] bg-primaria drop-shadow-saveShadow active:drop-shadow-sm text-white rounded-[100px]"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <>
        <div className="relative md:w-[1076px] w-full mx-auto h-auto bg-bg1 p-6 border-2 border-cinza6 rounded-[25px]  mt-20 mb-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#0082ba] md:text-[25px] text-[16px] font-medium font-['Ubuntu']">
              Meus dados
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#0082ba] drop-shadow-editShadow text-sm underline flex items-center"
            >
              <div className="mr-1 mt-[-6px] relative">Editar dados</div>
              <EditIcon />
            </button>
          </div>

          {/* Ajuste no layout para ser responsivo */}
          <div className="flex flex-col md:flex-row justify-between">
            {/* Primeira coluna */}
            <div className="flex md:w-[360px] w-full mb-6 md:mb-0">
              <div className="md:w-10 md:h-10 w-7 h-7 bg-[#33b8d1] rounded-[20px] flex justify-center items-center">
                {userData.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {userData.user_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="text-black text-xl font-medium font-['Ubuntu'] ml-4 mb-2">
                  {userData.user_name}
                </div>
                <div className="text-[#232323] ml-4 text-[17px] font-normal tracking-tight">
                  <span>CPF/CNPJ: </span>
                  <span className="text-[#5c5c5c]">
                    {userData.user_cpf || userData.user_cnpj}
                  </span>
                </div>
                <div className="text-[#232323] ml-4 text-[17px] font-normal tracking-tight mt-2">
                  <span>CRP: </span>
                  <span className="text-[#5c5c5c]">{userData.crp_number}</span>
                </div>
                <div className="flex items-center ml-4 text-[#232323] text-[17px] font-normal tracking-tight mt-2 whitespace-nowrap">
                  <span className="mr-1 whitespace-nowrap">E-mail:</span>
                  <span className="text-[#5c5c5c] whitespace-nowrap">
                    {userData.user_email}
                  </span>
                </div>
                <div className="text-[#232323] ml-4 text-[17px] font-normal tracking-tight mt-2">
                  <span>Telefone: </span>
                  <span className="text-[#5c5c5c]">{userData.user_phone}</span>
                </div>
              </div>
            </div>

            {/* Segunda coluna */}
            <div className="md:w-[316px] w-full mx-[45px]">
              <div className="text-black text-xl  font-medium font-['Ubuntu'] mb-2">
                Dados para recibo
              </div>
              <div className="text-[#232323] text-[17px] font-normal tracking-tight">
                <span>Nome/Clínica: </span>
                <span className="text-[#5c5c5c]">{userData.clinic_name}</span>
              </div>
              <div className="text-[#232323] text-[17px] font-normal tracking-tight mt-2">
                <span>CPF/CNPJ: </span>
                <span className="text-[#5c5c5c]">
                  {userData.user_cpf || userData.user_cnpj}
                </span>
              </div>
              <div className="text-[#232323] text-[17px] font-normal tracking-tight mt-2">
                <span>CRP: </span>
                <span className="text-[#5c5c5c]">{userData.crp_number}</span>
              </div>
              <div className="text-[#232323] text-[17px] font-normal tracking-tight mt-2">
                <span>Logo: </span>
                <span className="text-[#5c5c5c]">
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


        <div className="md:relative flex-col md:space-x-4 w-full  mx-auto">
          {/* Caixa "Minhas agendas" */}
          <div className="md:w-[540px] w-full max-w-[540px] mx-[390px] bg-bg1  shadow p-6 border-2 border-cinza6 rounded-[25px] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#0082ba] md:text-[20px] text-[16px] font-medium">
                Minhas agendas
              </h3>
              <button
                onClick={openModalToChangeAccount}
                className="text-[#0082ba] text-sm underline flex items-center"
              >
                Trocar de conta
                <RefreshIcon className="ml-2" />
              </button>
            </div>
            {/* Conteúdo da caixa */}
            <p className="mt-4 text-[#5c5c5c] font-medium">{userData.user_name}</p>
            <p className="text-[#8d8d8d] mt-2">
              E-mail: <span className="text-[#5c5c5c]">{userData.user_email}</span>
            </p>
          

          <div className="mt-6 ml-10">
            <h4 className="text-[#232323] text-lg font-medium">
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
                    className={`appearance-none w-5 h-5 rounded-full border-2 transition-colors cursor-pointer ${selectedCalendars.has(calendar.calendar_id)
                      ? "bg-[#0082ba] border-[#0082ba] shadow-inner"
                      : "bg-white border-gray-300 opacity-50"
                      }`}
                    style={{
                      boxShadow: selectedCalendars.has(calendar.calendar_id)
                        ? "inset 0 0 0 3px white"
                        : "none",
                    }}
                  />
                  <span
                    className={`font-medium ${selectedCalendars.has(calendar.calendar_id)
                      ? "text-[#5c5c5c]"
                      : "text-gray-500 opacity-50"
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
              <div className="w-[335px] h-[202px] bg-white rounded-lg border-2 border-[#81a0ae] p-6 shadow-lg transform translate-x-[117px] translate-y-[-169px]">
                <div className="w-full text-center mx-auto mb-12">
                  <span className="text-[#5c5c5c] text-[21px] font-medium font-['Ubuntu'] tracking-tight">
                    Você tem certeza que <br />
                    deseja
                    <span className="text-[#0082ba]"> trocar de conta? </span>
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

          {/* Modal de Confirmação */}
          {isConfirmationModalOpen && (
            <div className="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-[6px] bg-[#33B8D14D] bg-opacity-30">
              <div className="w-[335px] h-[202px] bg-white rounded-lg border-2 border-[#81a0ae] p-6 shadow-lg transform translate-x-[117px] translate-y-[-169px]">
                <div className="w-full text-center mx-auto mb-12">
                  <span className="text-[#5c5c5c] text-[21px] font-medium font-['Ubuntu'] tracking-tight">
                    Você tem certeza que deseja
                    <br />
                    {selectedCalendars.has(activeCalendarId) ? (
                      <span className="text-[#0082ba]">
                        desativar a agenda?
                      </span>
                    ) : (
                      <span className="text-[#0082ba]">ativar a agenda?</span>
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


        <div className="">
          <div className="md:w-[520px] w-auto mx-[938px] mt-[-338px] h-[370px] bg-bg1 p-6 border-2 border-cinza6 rounded-[25px] overflow-hidden">
            <div className="flex  justify-between items-center mb-4">
              <h3 className="text-[#0082ba] md:text-[20px] text-[15px] font-medium">
                Mensagem de cobrança
              </h3>
              {isEditingMessage ? (
                <button
                  onClick={saveMessage}
                  className="text-[#0082ba] text-sm"
                >
                  <CheckMessage />
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingMessage(true)}
                  className="text-[#0082ba] drop-shadow-editShadow text-sm underline"
                >
                  <EditIcon />
                </button>
              )}
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
                className="w-full h-[250px] max-h-[250px] p-4 border border-gray-300 rounded-md resize-none text-[#232323] text-[15px] bg-white overflow-y-auto"
                placeholder="Escreva sua mensagem de cobrança aqui..."
              />
            ) : (
              <div className="border border-gray-300 p-4 rounded-md text-[#232323] text-[15px]  h-[250px] bg-white">
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
    </>
    </div >
  );
};

export default UserPage;
