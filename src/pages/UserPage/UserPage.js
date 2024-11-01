import React, { useState, useEffect } from "react";

const UserPage = () => {
  const [userData, setUserData] = useState({
    user_name: "",
    user_email: "",
    user_cpf: "",
    user_cnpj: "",
    crp_number: "",
    user_phone: "",
    user_message: "", // Novo campo de mensagem
    image: null, // Campo de imagem para armazenar o arquivo
  });

  const [isEditing, setIsEditing] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState(new Set());
  const [isEditingMessage, setIsEditingMessage] = useState(false);

  // Função para buscar os dados do usuário
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

  // Função para buscar agendas
  // Buscando as agendas
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

          // Obter os calendários selecionados do localStorage
          const savedSelectedCalendars = JSON.parse(
            localStorage.getItem("selectedCalendars")
          );
          if (savedSelectedCalendars) {
            // Converte o array salvo em um Set para manter consistência com selectedCalendars
            const initiallySelected = new Set(savedSelectedCalendars);
            console.log("Initially selected calendars:", initiallySelected); // Log para verificar
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

  // Função para alternar o estado de um calendário
  const toggleCalendar = async (calendarId) => {
    const newSelectedCalendars = new Set(selectedCalendars);
    const isEnabled = !newSelectedCalendars.has(calendarId);

    if (isEnabled) {
      newSelectedCalendars.add(calendarId);
    } else {
      newSelectedCalendars.delete(calendarId);
    }

    setSelectedCalendars(newSelectedCalendars);

    // Atualize o localStorage
    localStorage.setItem(
      "selectedCalendars",
      JSON.stringify(Array.from(newSelectedCalendars))
    );

    // Obtém o nome do calendário atual
    const calendar = calendars.find((cal) => cal.id === calendarId);
    const calendarName = calendar ? calendar.summary : "Nome padrão"; // Define um padrão se não tiver nome

    // Envia a atualização de `enabled` e `calendar_name` para o servidor
    await fetch(
      `http://localhost:3000/events/calendars/selection/${calendarId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: isEnabled, // Define o estado conforme alternado
          calendar_name: calendarName, // Nome do calendário
        }),
      }
    );
  };

  // Função para enviar os dados editados
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("user_cpf", userData.user_cpf);
      formData.append("user_cnpj", userData.user_cnpj);
      formData.append("crp_number", userData.crp_number);
      formData.append("user_phone", userData.user_phone);
      formData.append("user_message", userData.user_message);

      // Adiciona o arquivo de imagem, se houver
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

  // Função para manipular alterações nos campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para manipular o upload da imagem
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserData((prevData) => ({
      ...prevData,
      image: file, // Atualiza o estado com o arquivo da imagem
    }));
  };

  return (
    <div className="flex flex-col ">
      {isEditing ? (
        <div>
          <p>
            <strong>Nome:</strong> {userData.user_name}
          </p>
          <p>
            <strong>Email:</strong> {userData.user_email}
          </p>
          <label>
            CPF:
            <input
              type="text"
              name="user_cpf"
              value={userData.user_cpf}
              onChange={handleChange}
            />
          </label>
          <label>
            CNPJ:
            <input
              type="text"
              name="user_cnpj"
              value={userData.user_cnpj}
              onChange={handleChange}
            />
          </label>
          <label>
            CRP:
            <input
              type="text"
              name="crp_number"
              value={userData.crp_number}
              onChange={handleChange}
            />
          </label>
          <label>
            Telefone:
            <input
              type="text"
              name="user_phone"
              value={userData.user_phone}
              onChange={handleChange}
            />
          </label>
          <label>
            Imagem:
            <input
              type="file"
              name="image"
              onChange={handleFileChange} // Função para lidar com o upload de imagem
            />
          </label>
          <button onClick={handleSave}>Salvar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      ) : (
        <>
          {/* Quadrado grande dos dados pessoais */}
          <div className="relative w-[1076px] mx-auto h-auto bg-bg1 shadow p-6 border-2 border-cinza6 rounded-[15px] text-F15 mt-4 mb-3">
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

            {/* Informação do usuário */}
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
                    <span className="text-[#5c5c5c]">
                      {userData.crp_number}
                    </span>
                  </div>
                  <div className="flex items-center ml-[20px] text-[#232323] text-[17px] font-normal tracking-tight mt-2 whitespace-nowrap">
                    <span className="mr-1 whitespace-nowrap">E-mail:</span>
                    <span className="text-[#5c5c5c] whitespace-nowrap">
                      {userData.user_email}
                    </span>
                  </div>
                  <div className="text-[#232323] ml-[20px] text-[17px] font-normal tracking-tight mt-2">
                    <span>Telefone: </span>
                    <span className="text-[#5c5c5c]">
                      {userData.user_phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coluna Direita - Dados para Recibo */}
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
                    {userData.image
                      ? userData.image.split("/").pop()
                      : "(Imagem não carregada)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quadrado "Minhas agendas" separado */}
          <div className="flex space-x-4">
            <div className="w-[563px] h-auto bg-white mx-[52px] shadow p-6 border-2 border-cinza6 rounded-[10px]">
              <div className="flex justify-between">
                <h3 className="text-[#0082ba] text-[20px] font-medium">
                  Minhas agendas
                </h3>
                <button className="text-[#0082ba] text-sm underline">
                  Trocar de conta
                </button>
              </div>

              <p className="mt-4 font-semibold">{userData.user_name}</p>
              <p className="text-[#8d8d8d]">{userData.user_email}</p>

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
                      <button
                        onClick={() => toggleCalendar(calendar.id)}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          selectedCalendars.has(calendar.id)
                            ? "bg-[#0082ba]"
                            : "bg-gray-300"
                        } relative`}
                      >
                        <span
                          className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${
                            selectedCalendars.has(calendar.id)
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        ></span>
                      </button>

                      <span className="text-[#232323] font-medium">
                        {calendar.summary}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Caixa "Mensagem de cobrança" */}
            <div className="w-[563px] h-auto bg-white shadow p-6 border-2 border-cinza6 rounded-[10px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#0082ba] text-[20px] font-medium">
                  Mensagem de cobrança
                </h3>
                <button
                  onClick={() => setIsEditingMessage(true)}
                  className="text-[#0082ba] text-sm underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 inline-block"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 11l4 4-4-4zm0 4h4m1 1a2.5 2.5 0 003.536 0L21 11m0 0a5.002 5.002 0 01-1.464 3.536A5.002 5.002 0 0116 17h-.59"
                    />
                  </svg>
                  Editar
                </button>
              </div>

              {isEditingMessage ? (
                <textarea
                  name="user_message"
                  value={userData.user_message}
                  onChange={handleChange}
                  rows={15} // Aumenta a altura do textarea no modo de edição
                  className="w-full p-4 border border-gray-300 rounded-md resize-none text-[#232323] text-[15px] leading-relaxed"
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

              {isEditingMessage && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      handleSave(); // Salva a mensagem de cobrança
                      setIsEditingMessage(false); // Sai do modo de edição da mensagem
                    }}
                    className="bg-[#0082ba] text-white px-4 py-2 rounded-md mr-2"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setIsEditingMessage(false)}
                    className="text-[#0082ba] px-4 py-2"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
