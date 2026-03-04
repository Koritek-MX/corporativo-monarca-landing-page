import api from "./api";

/* 👉 Landing */
export const getFaqsPublicService = async () => {
  const { data } = await api.get("/faqs/public");
  return data;
};

/* 👉 Dashboard */
export const getAllFaqsService = async () => {
  const { data } = await api.get("/faqs");
  return data;
};

export const createFaqService = async (payload: any) => {
  const { data } = await api.post("/faqs", payload);
  return data;
};

export const updateFaqService = async (
  id: number,
  payload: any
) => {
  const { data } = await api.put(`/faqs/${id}`, payload);
  return data;
};

export const deleteFaqService = async (id: number) => {
  const { data } = await api.delete(`/faqs/${id}`);
  return data;
};