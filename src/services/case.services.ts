import api from "./api";

export const getCaseService = async () => {
  const { data } = await api.get("/cases");
  return data;
};

export const createCaseService = async (payload: any) => {
  const { data } = await api.post("/cases", payload);
  return data;
};

export const updateCaseService = async (id: number, payload: any) => {
  const { data } = await api.put(`/cases/${id}`, payload);
  return data;
};

export const deleteCaseService = async (id: number) => {
  const { data } = await api.delete(`/cases/${id}`);
  return data;
};

export const getCaseByIdService = async (id: number) => {
  const { data } = await api.get(`/cases/${id}`);
  return data;
};



