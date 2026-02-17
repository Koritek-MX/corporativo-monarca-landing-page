import api from "./api";

export const getInstallmentsByPaymentService = async (paymentId: number) => {
  const { data } = await api.get(`/payment-installments/payment/${paymentId}`);
  return data;
};

export const createInstallmentService = async (payload: any) => {
  const { data } = await api.post("/payment-installments", payload);
  return data;
};



export const updateInstallmentService = async (id: number, payload: any) => {
  const { data } = await api.put(`/payment-installments/${id}`, payload);
  return data;
};

export const deleteInstallmentService = async (id: number) => {
  const { data } = await api.delete(`/payment-installments/${id}`);
  return data;
};