import api from "./api";

export const getCasesPaginationService = async (
  page: number,
  limit: number,
  archived: boolean
) => {
  const { data } = await api.get(
    `/cases?page=${page}&limit=${limit}&archived=${archived}`
  );

  return data;
};

export const getCasesService = async () => {
  const { data } = await api.get("/cases/all");
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

export const getCasesByClientIdService = async (id: number) => {
  const { data } = await api.get(`/cases/client/${id}`);
  return data;
};

export const getCasesByLawyerIdService = async (id: number) => {
  const { data } = await api.get(`/cases/lawyer/${id}`);
  return data;
};




