import api from "./api";

export const loginService = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", {
        email,
        password,
    });

    // 👉 guardar token automáticamente
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
};

export const logoutService = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};



