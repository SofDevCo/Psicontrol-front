export const deleteCustomer = async (customerId) => {
      const response = await fetch(`http://localhost:3000/events/customers/${customerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
      });
  
      return response;
  };

  export const ArchiveCustomer = async (customerId) => {
    const response = await fetch(
      `http://localhost:3000/events/customers/${customerId}/archive`,
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
      `http://localhost:3000/events/customers/${customerId}/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
        },
      }
    );
    return response;
  };

  export const createOrUpdateCustomer = async (customer, additionalAlternatives, customerId = null) => {
    const url = customerId
      ? `http://localhost:3000/events/customers/${customerId}`
      : `http://localhost:3000/events/create-customer`;
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