import api from "./api";

export const getAllBlogsService = async (limit?: number) => {
    const url = limit ? `/blogs?limit=${limit}` : "/blogs";
    const { data } = await api.get(url);
    return data;
};

export const getAllBlogsByUserIdService = async (userId?: number) => {
      const { data } = await api.get(`/blogs/user/${userId}`);
    return data;
};

export const createBlogService = async (payload: any) => {
    const { data } = await api.post("/blogs", payload);
    return data;
};

export const getBlogByIdService = async (id: number) => {
    const { data } = await api.get(`/blogs/${id}`);
    return data;
};

export const updateBlogService = async (id: number, payload: any) => {
  const { data } = await api.put(`/blogs/${id}`, payload);
  return data;
};

export const deleteBlogService = async (id: number) => {
  const { data } = await api.delete(`/blogs/${id}`);
  return data;
};



