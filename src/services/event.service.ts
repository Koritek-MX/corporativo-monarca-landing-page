import api from "./api";

export const getEventService = async () => {
  const { data } = await api.get("/events");
  return data;
};

export const createEventService = async (payload: any) => {
  const { data } = await api.post("/events", payload);
  return data;
};

export const updateEventService = async (id: number, payload: any) => {
  console.log("///Esto se manda al servicio de editar:", payload);
  const { data } = await api.put(`/events/${id}`, payload);
  return data;
};

export const deleteEventService = async (id: number) => {
  const { data } = await api.delete(`/events/${id}`);
  return data;
};



