import api from "./api";

export const getPaymentsService = async () => {
  const { data } = await api.get("/payments");
  return data;
};

export const getPaymentById = async (id: number) => {
  const { data } = await api.get(`/payments/${id}`);
  return data;
};

export const createPaymentsService = async (payload: any) => {
  const { data } = await api.post("/payments", payload);
  return data;
};

export const updatePaymentsService = async (id: number, payload: any) => {
  const { data } = await api.put(`/payments/${id}`, payload);
  return data;
};

export const deletePaymentsService = async (id: number) => {
  const { data } = await api.delete(`/payments/${id}`);
  return data;
};
