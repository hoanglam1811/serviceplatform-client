import { CreateProviderProfileDTO, UpdateProviderProfileDTO } from "@/types/providerProfile";
import api from "./api";

export const createProviderProfile = async (dto: CreateProviderProfileDTO) => {
    const res = await api.post("/providerprofile", dto);
    return res.data;
};

// READ - Get all
export const getAllProviderProfiles = async () => {
    const res = await api.get("/providerprofile");
    return res.data;
};

// READ - Get by Id
export const getProviderProfileById = async (id: string) => {
    const res = await api.get(`/providerprofile/${id}`);
    return res.data;
};

// READ - Get by UserId
export const getProviderProfileByUserId = async (userId: string) => {
    const res = await api.get(`/providerprofile/user/${userId}`);
    return res.data;
};

// UPDATE
export const updateProviderProfile = async (dto: UpdateProviderProfileDTO) => {
    const res = await api.put(`/providerprofile`, dto);
    return res.data;
};

// DELETE
export const deleteProviderProfile = async (id: string) => {
    const res = await api.delete(`/providerprofile/${id}`);
    return res.data;
};