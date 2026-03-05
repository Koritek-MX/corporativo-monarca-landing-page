import api from "./api";

/* 👉 Obtener archivos por caso */
export const getCaseFilesService = async (
  caseId: number,
  page: number,
  limit: number
) => {

  const { data } = await api.get(`/case-files/${caseId}/files?page=${page}&limit=${limit}`);
  return data;
};

/* 👉 Crear expediente */
export const createCaseFileService = async (payload: any) => {
  const { data } = await api.post("/case-files", payload);
  return data;
};

/* 👉 Obtener expediente por ID */
export const getCaseFileByIdService = async (id: number) => {
  const { data } = await api.get(`/case-files/${id}`);
  return data;
};

/* 👉 Eliminar expediente */
export const deleteCaseFileService = async (id: number) => {
  const { data } = await api.delete(`/case-files/${id}`);
  return data;
};

/* 👉 Eliminar todos los expedientes de un caso */
export const deleteFilesByCaseService = async (caseId: number) => {
  const { data } = await api.delete(`/case-files/case/${caseId}`);
  return data;
};