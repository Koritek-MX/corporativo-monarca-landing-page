import api from "./api";

export const getStatsService = async () => {
  const { data } = await api.get("/stats");
  return data;
};
