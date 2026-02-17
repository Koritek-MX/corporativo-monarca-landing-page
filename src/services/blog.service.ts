import api from "./api";

export const getAllBlogsService = async (limit?: number) => {
    const url = limit ? `/blogs?limit=${limit}` : "/blogs";
    const { data } = await api.get(url);
    return data;
};

export const createBlogtService = async (payload: any) => {
    const { data } = await api.post("/blogs", payload);
    return data;
};

export const getBlogByIdService = async (id: number) => {
    const { data } = await api.get(`/blogs/${id}`);
    return data;
};



