import { LoyaltyPointDTO } from "@/types/loyaltyPoints"
import api from "./api"

export const getPointsByUserId = async (userId: string): Promise<number | null> => {
  const res = await api.get(`/loyaltypoints/${userId}`)
  return res.data.data
}

export const addPoints = async (userId: string, points: number): Promise<string> => {
  const res = await api.post(`/loyaltypoints/${userId}/add`, null, {
    params: { points },
  })
  return res.data.data
}

export const deleteLoyaltyPoint = async (id: string): Promise<LoyaltyPointDTO> => {
  const res = await api.delete(`/loyaltypoints/${id}`)
  return res.data.data
}

export const redeemLoyaltyPoints = async (userId: string, points: number): Promise<string> => {
  const res = await api.post(`/loyaltypoints/${userId}/redeem?points=${points}`);
  return res.data.data;
};
