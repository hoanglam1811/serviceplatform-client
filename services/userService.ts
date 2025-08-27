// src/api/userService.ts
import api from "./api";

// CREATE
export const createUser = async (dto: any) => {
    const res = await api.post("/user", dto);
    return res.data;
};

// READ - Get all
export const getAllUsers = async () => {
    const res = await api.get("/user");
    return res.data;
};

// READ - Get by Id
export const getUserById = async (id: string) => {
    const res = await api.get(`/user/${id}`);
    return res.data;
};

// READ - Get by username
export const getUserByUsername = async (username: string) => {
    const res = await api.get(`/user/by-username/${username}`);
    return res.data;
};

// READ - Get by role
export const getUsersByRole = async (role: string) => {
    const res = await api.get(`/user/role/${role}`);
    return res.data;
};

// UPDATE
export const updateUser = async (id: string, dto: any) => {
    const res = await api.put(`/user/${id}`, dto);
    return res.data;
};

// DELETE
export const deleteUser = async (id: string) => {
    const res = await api.delete(`/user/${id}`);
    return res.data;
};
