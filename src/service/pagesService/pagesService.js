export const deleteCustomer = async (customerId) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/events/customers/${customerId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleted: true }),
    }
  );

  return response;
};

export const ArchiveCustomer = async (customerId) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/events/customers/${customerId}/archive`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ archived: true }),
    }
  );

  return response;
};

export const fetchCustomerProfile = async (customerId) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/events/customers/${customerId}/profile`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
    }
  );
  return response;
};

export const createOrUpdateCustomer = async (
  customer,
  additionalAlternatives,
  customerId = null
) => {
  const url = customerId
    ? `${process.env.REACT_APP_API_URL}/events/customers/${customerId}`
    : `${process.env.REACT_APP_API_URL}/events/create-customer`;
  const method = customerId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...customer, additionalAlternatives }),
  });

  return response;
};

export const fetchCustomers = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/events/customers`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.json();
};

export const sendWhatsAppMessage = async (
  customerId,
  selectedYear,
  selectedMonth
) => {
  if (!customerId) {
    alert("ID do cliente não encontrado.");
  }

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/message/send-whatsapp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        selected_month: `${selectedYear}-${selectedMonth}`,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || "Erro ao enviar a mensagem pelo WhatsApp."
    );
  }

  return response.json();
};



