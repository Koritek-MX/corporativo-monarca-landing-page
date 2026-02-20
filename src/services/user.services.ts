import api from "./api";

export const getUsersService = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const getUserByIdService = async (id: number) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUserService = async (payload: any) => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const updateUserService = async (id: number, payload: any) => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
};

export const deleteUserService = async (id: number) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const updatePasswordUserService = async (id: number, password: string) => {
  const { data } = await api.patch(`/users/${id}/password`, {
    "password": password
  });
  return data;
};