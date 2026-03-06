import api from "./api";

export const getAllContactsService = async () => {
  const { data } = await api.get("/contacts");
  return data;
};

export const getContactsPaginationService = async (
  page: number,
  limit: number
) => {
  const { data } = await api.get(`/contacts/pagination?page=${page}&limit=${limit}`);
  return data;
};

export const createContactService = async (payload: any) => {
  const { data } = await api.post("/contacts", payload);
  return data;
};


export const deleteContactService = async (id: number) => {
  const { data } = await api.delete(`/contacts/${id}`);
  return data;
};



