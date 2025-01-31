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

  const formattedMonth = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

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
        selected_month: formattedMonth,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return {
      error: errorData.error || "Erro ao enviar a mensagem pelo WhatsApp.",
    };
  }

  return response.json();
};

export const sendEmailMessage = async (
  customerId,
  totalConsultationFee,
  selectedYear,
  selectedMonth
) => {
  const formattedMonth = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/message/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        total_consultation_fee: totalConsultationFee,
        selected_month: formattedMonth,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.error || "Erro ao enviar e-mail." };
  }

  return response.json();
};

export const confirmPayment = async (
  customerId,
  selectedYear,
  selectedMonth
) => {
  const formattedMonth = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/dashboard/confirm-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        month_and_year: formattedMonth,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.error || "Erro ao enviar e-mail." };
  }

  return response.json();
};

export const confirmBillOfSale = async (
  customerId,
  selectedYear,
  selectedMonth
) => {
  const formattedMonth = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/dashboard/confirmBillOfSale`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        month_and_year: formattedMonth,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.error || "Erro ao enviar e-mail." };
  }

  return response.json();
};

export const savePartialPayment = async (
  customerId,
  selectedYear,
  selectedMonth,
  paymentAmount
) => {
  const formattedMonth = `${selectedYear}-${selectedMonth.toString().padStart(2, "0")}`;
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/dashboard/update-partial-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        month_and_year: formattedMonth,
        payment_amount: parseFloat(paymentAmount),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.error || "Erro ao enviar e-mail." };
  }

  return response.json();
};
