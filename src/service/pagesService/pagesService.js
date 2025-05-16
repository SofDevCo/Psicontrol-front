export const deleteCustomer = async (customerId) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/events/customers/${customerId}/delete`,
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

export const revertSendingInvoice = async (customerId, year, month) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/dashboard/revert-sending-invoice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          month_and_year: `${year}-${month}`,
        }),
      }
    );

    if (response.ok) {
      return response;
    } else {
      const errorData = await response.json();
      console.error("Erro ao reverter cobrança:", errorData);
      return null;
    }
  } catch (error) {
    console.error("Erro ao realizar requisição:", error);
    return null;
  }
};

export const savePayment = async (
  customer_id,
  year,
  month,
  tipoPagamento,
  dataPagamento,
  formaPagamento,
  valorPago
) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/save-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
      body: JSON.stringify({
        customer_id,
        month_and_year: `${year}-${String(month).padStart(2, "0")}`,
        payment_date: dataPagamento,
        payment_method: formaPagamento,
        payment_amount:
          tipoPagamento === "total"
            ? undefined
            : parseFloat(valorPago.replace("R$", "").replace(",", ".")),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Erro ao salvar pagamento:", text);
      return { error: true };
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao salvar pagamento:", error);
    return { error: true };
  }
};

export const revertPaymentConfirmation = async (customerId, year, month) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/dashboard/revert-payment-confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          month_and_year: `${year}-${month}`,
        }),
      }
    );

    if (response.ok) {
      return response;
    } else {
      const errorData = await response.json();
      console.error("Erro ao reverter confirmação de pagamento:", errorData);
      return null;
    }
  } catch (error) {
    console.error("Erro ao realizar requisição:", error);
    return null;
  }
};

export const revertBillOfSale = async (customerId, year, month) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/dashboard/revert-bill-of-sale`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({
          customer_id: customerId,
          month_and_year: `${year}-${month}`,
        }),
      }
    );

    if (response.ok) {
      return response;
    } else {
      const errorData = await response.json();
      console.error("Erro ao reverter recibo:", errorData);
      return null;
    }
  } catch (error) {
    console.error("Erro ao realizar requisição:", error);
    return null;
  }
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

export const confirmBillOfSale = async ({ customer_id, month_and_year }) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/dashboard/confirmBillOfSale`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
        body: JSON.stringify({ customer_id, month_and_year }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Erro ao emitir recibo." };
    }

    return response.json();
  } catch (error) {
    console.error("Erro ao emitir recibo:", error);
    return { error: "Erro na conexão com o servidor." };
  }
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

export const AddDay = async (customerId, days, month, year) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/events/customers/${customerId}/add-day`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
      body: JSON.stringify({ customerId, days, month, year }),
    }
  );

  return response;
};

export const RemoveDay = async (customerId, days, month, year) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/events/customers/${customerId}/remove-day`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
      body: JSON.stringify({ customerId, days, month, year }),
    }
  );
  return response;
};

export const fetchUnmatchedPatients = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/events/unmatched-patients`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
    }
  );

  return response.ok ? response.json() : null;
};

export const HandleFetchBillingRecords = async (month, year) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/dashboard/billing-records?month=${month}&year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
      },
    }
  );

  return response;
};
