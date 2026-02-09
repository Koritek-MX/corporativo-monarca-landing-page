import api from "./api";

export const getClientsService = async () => {
  const { data } = await api.get("/clients");
  return data;
};

export const createClientService = async (payload: any) => {
  const { data } = await api.post("/clients", payload);
  return data;
};

export const updateClientService = async (id: number, payload: any) => {
  const { data } = await api.put(`/clients/${id}`, payload);
  return data;
};

export const deleteClientService = async (id: number) => {
  const { data } = await api.delete(`/clients/${id}`);
  return data;
};

export const updatePasswordClientService = async (id: number, password: string) => {
  const { data } = await api.patch(`/clients/${id}/password`, {
    "password": password
  });
  return data;
};