import api from "./api";

/* 👉 Landing (solo activos) */
export const getSuccessCasesPublicService = async () => {
  const { data } = await api.get("/success-cases/public");
  return data;
};

/* 👉 Dashboard (todos) */
export const getAllSuccessCasesService = async () => {
  const { data } = await api.get("/success-cases");
  return data;
};

export const createSuccessCaseService = async (payload: any) => {
  const { data } = await api.post("/success-cases", payload);
  return data;
};

export const updateSuccessCaseService = async (
  id: number,
  payload: any
) => {
  const { data } = await api.put(`/success-cases/${id}`, payload);
  return data;
};

export const deleteSuccessCaseService = async (id: number) => {
  const { data } = await api.delete(`/success-cases/${id}`);
  return data;
};