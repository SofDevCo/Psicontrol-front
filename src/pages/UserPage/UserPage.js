import React, { useState, useEffect } from "react";
import { CheckMessage, EditIcon } from "../../icons/icons";

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
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState(new Set());
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [fileName, setFileName] = useState("nomedoarquivo.png");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Erro ao buscar os dados do usuário.");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch("http://localhost:3000/events/calendars", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCalendars(data);

          const savedSelectedCalendars = JSON.parse(
            localStorage.getItem("selectedCalendars")
          );
          if (savedSelectedCalendars) {
            const initiallySelected = new Set(savedSelectedCalendars);
            console.log("Initially selected calendars:", initiallySelected); 
            setSelectedCalendars(initiallySelected);
          }
        } else {
          console.error("Erro ao buscar as agendas.");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    };

    fetchCalendars();
  }, []);

  const toggleCalendar = async (calendarId) => {
    const newSelectedCalendars = new Set(selectedCalendars);
    const isEnabled = !newSelectedCalendars.has(calendarId);

    if (isEnabled) {
      newSelectedCalendars.add(calendarId);
    } else {
      newSelectedCalendars.delete(calendarId);
    }

    setSelectedCalendars(newSelectedCalendars);

    localStorage.setItem(
      "selectedCalendars",
      JSON.stringify(Array.from(newSelectedCalendars))
    );

    const calendar = calendars.find((cal) => cal.id === calendarId);
    const calendarName = calendar ? calendar.summary : "Nome padrão"; 

    await fetch(
      `http://localhost:3000/events/calendars/selection/${calendarId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: isEnabled, 
          calendar_name: calendarName, 
        }),
      }
    );
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("user_cpf", userData.user_cpf);
      formData.append("user_cnpj", userData.user_cnpj);
      formData.append("crp_number", userData.crp_number);
      formData.append("user_phone", userData.user_phone);
      formData.append("user_message", userData.user_message);

      if (userData.image) {
        formData.append("image", userData.image);
      }

      const response = await fetch(`http://localhost:3000/user/users`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData((prevData) => ({
          ...prevData,
          ...updatedData,
        }));
        setIsEditing(false);
      } else {
        console.error("Erro ao salvar os dados do usuário.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  return (
    <div className="flex flex-col ">
      {isEditing && (
        <div className="fixed inset-0 ml-[195px] backdrop-blur-[6px] bg-[#33B8D14D] bg-opacity-30  flex justify-center items-center z-30">
          <div className=" w-[1076px] -mb-24 h-[615px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] shadow-lg p-8">
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
                    Nome/Clínica
                  </label>
                  <input
                    type="text"
                    name="clinic_name"
                    value={userData.clinic_name || ""}
                    onChange={handleChange}
                    placeholder="Nome do psicólogo/clínica"
                    className="w-[418px] h-[50px] bg-neutral-100 rounded-[15px] border-2 border-[#81a0ae] px-[16px] text-[#5c5c5c]/50 text-sm font-normal font-['Open Sans'] focus:outline-none focus:ring"
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
        
        <div className="relative w-[1076px] mx-[100px] h-auto bg-bg1 shadow p-6 border-2 border-cinza6 rounded-[15px] text-F15 mt-4 mb-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#0082ba] text-[25px] font-medium font-['Ubuntu']">
              Meus dados
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#0082ba] text-sm underline"
            >
              Editar dados
            </button>
          </div>

          
          <div className="flex justify-between">
            <div className="flex w-[360px]">
              <div className="w-10 h-10 bg-[#33b8d1] rounded-[20px] flex justify-center items-center">
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
                <div className="text-black text-xl font-medium font-['Ubuntu'] ml-[20px] mb-2">
                  {userData.user_name}
                </div>
                <div className="text-[#232323] ml-[20px] text-[17px] font-normal tracking-tight">
                  <span>CPF/CNPJ: </span>
                  <span className="text-[#5c5c5c]">
                    {userData.user_cpf || userData.user_cnpj}
                  </span>
                </div>
                <div className="text-[#232323] ml-[20px] text-[17px] font-normal tracking-tight mt-2">
                  <span>CRP: </span>
                  <span className="text-[#5c5c5c]">{userData.crp_number}</span>
                </div>
                <div className="flex items-center ml-[20px] text-[#232323] text-[17px] font-normal tracking-tight mt-2 whitespace-nowrap">
                  <span className="mr-1 whitespace-nowrap">E-mail:</span>
                  <span className="text-[#5c5c5c] whitespace-nowrap">
                    {userData.user_email}
                  </span>
                </div>
                <div className="text-[#232323] ml-[20px] text-[17px] font-normal tracking-tight mt-2">
                  <span>Telefone: </span>
                  <span className="text-[#5c5c5c]">{userData.user_phone}</span>
                </div>
              </div>
            </div>

            
            <div className="w-[316px]">
              <div className="text-black text-xl font-medium font-['Ubuntu'] mb-2">
                Dados para recibo
              </div>
              <div className="text-[#232323] text-[17px] font-normal tracking-tight">
                <span>Nome/Clínica: </span>
                <span className="text-[#5c5c5c]">{userData.user_name}</span>
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
                  {typeof userData.image === "string" &&
                  userData.image.includes("/")
                    ? userData.image.split("/").pop()
                    : "(Imagem não carregada)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex space-x-4">
          <div className="w-[540px] h-auto bg-white mx-[100px] shadow p-6 border-2 border-cinza6 rounded-[15px]">
            <div className="flex justify-between">
              <h3 className="text-[#0082ba] text-[20px] font-medium">
                Minhas agendas
              </h3>
              <button className="text-[#0082ba] text-sm underline">
                Trocar de conta
              </button>
            </div>

            <p className="mt-4 font-semibold">{userData.user_name}</p>
            <p className="text-[#8d8d8d]">
              <span className="text-[#5c5c5c]">E-mail:</span>{" "}
              {userData.user_email}
            </p>

            <div className="mt-6">
              <h4 className="text-[#232323] text-lg font-medium">
                Selecionar agendas
              </h4>
              <div className="mt-4 space-y-4">
                {calendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCalendars.has(calendar.id)}
                      onChange={() => toggleCalendar(calendar.id)}
                      className={`appearance-none w-5 h-5 rounded-full border-2 transition-colors cursor-pointer ${
                        selectedCalendars.has(calendar.id)
                          ? "bg-[#0082ba] border-[#0082ba] shadow-inner"
                          : "bg-white border-gray-300 opacity-50"
                      } focus:ring-0 checked:bg-[#0082ba] checked:border-[#0082ba]`}
                      style={{
                        boxShadow: selectedCalendars.has(calendar.id)
                          ? "inset 0 0 0 3px white"
                          : "none",
                      }}
                    />

                    <span
                      className={`font-medium ${
                        selectedCalendars.has(calendar.id)
                          ? "text-[#5c5c5c]" 
                          : "text-gray-500 opacity-50"
                      }`}
                    >
                      {calendar.summary}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="flex">
            <div className="w-[520px] h-auto mx-[-100px] bg-white shadow p-6 border-2 border-cinza6 rounded-[15px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#0082ba] text-[20px] font-medium">
                  Mensagem de cobrança
                </h3>
                {isEditingMessage ? (
                  <button
                    onClick={() => setIsEditingMessage(false)} 
                    className="text-[#0082ba] text-sm"
                  >
                    <CheckMessage />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingMessage(true)}
                    className="text-[#0082ba] text-sm underline"
                  >
                    <EditIcon />
                  </button>
                )}
              </div>

              {isEditingMessage ? (
                <textarea
                  name="user_message"
                  value={userData.user_message}
                  onChange={handleChange}
                  rows={3} 
                  className="w-full p-4 border border-gray-300 rounded-md resize-none text-[#232323] text-[15px] h-[250px]"
                  placeholder="Escreva sua mensagem de cobrança aqui..."
                />
              ) : (
                <div className="border border-gray-300 p-4 rounded-md text-[#232323] text-[15px] leading-relaxed whitespace-pre-wrap min-h-[250px]">
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
    </div>
  );
};

export default UserPage;
