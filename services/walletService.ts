// src/api/walletService.ts
import api from "./api";

// CREATE - Tạo ví
export const createWallet = async (dto: any) => {
    const res = await api.post("/wallet", dto);
    return res.data;
};

// READ - Lấy tất cả ví
export const getAllWallets = async () => {
    const res = await api.get("/wallet");
    return res.data;
};

// READ - Lấy ví theo Id
export const getWalletById = async (id: string) => {
    const res = await api.get(`/wallet/${id}`);
    return res.data;
};

// READ - Lấy ví theo UserId
export const getWalletByUserId = async (userId: string) => {
    const res = await api.get(`/wallet/by-user/${userId}`);
    return res.data;
};

// UPDATE - Cập nhật ví
export const updateWallet = async (id: string, dto: any) => {
    const res = await api.put(`/wallet/${id}`, dto);
    return res.data;
};

// DELETE - Xoá ví
export const deleteWallet = async (id: string) => {
    const res = await api.delete(`/wallet/${id}`);
    return res.data;
};
