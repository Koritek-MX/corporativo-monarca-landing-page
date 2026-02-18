import api from "./api";

export const getStatsService = async () => {
  const { data } = await api.get("/stats");
  return data;
};

export const getDashboardStatsService = async () => {
  const { data } = await api.get("/stats/dashboard-kpis");
  return data;
};
