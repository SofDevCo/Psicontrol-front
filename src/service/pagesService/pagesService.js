export const deleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:3000/events/customers/${customerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authentication_token")}`,
          "Content-Type": "application/json",
        },
      });
  
      return response;
    } catch (error) {
      console.error("Erro na requisição de delete", error);
      throw new Error("Erro ao tentar deletar");
    }
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