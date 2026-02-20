import api from "./api";

export const loginService = async (
  email: string,
  password: string
) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  /* 👉 Guardar tokens */
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};