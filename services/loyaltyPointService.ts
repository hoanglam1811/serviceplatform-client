import api from "./api";
import { CreateChatDTO, UpdateChatDTO } from "@/types/chat";

// CREATE
export const createChat = async (dto: CreateChatDTO) => {
  const res = await api.post("/chat", dto);
  return res.data;
};

// READ - Get all
export const getAllChats = async () => {
  const res = await api.get("/chat");
  return res.data;
};

// READ - Get by Id
export const getChatById = async (id: string) => {
  const res = await api.get(`/chat/${id}`);
  return res.data;
};

// UPDATE
export const updateChat = async (id: string, dto: UpdateChatDTO) => {
  const res = await api.put(`/chat/${id}`, dto);
  return res.data;
};

// DELETE
export const deleteChat = async (id: string) => {
  const res = await api.delete(`/chat/${id}`);
  return res.data;
};

// GET conversation between two users
export const getConversation = async (user1: string, user2: string) => {
  const res = await api.get("/chat/conversation", {
    params: { user1, user2 },
  });
  return res.data;
};

// MARK messages as read
export const markAsRead = async (senderId: string, receiverId: string) => {
  const res = await api.put("/chat/mark-as-read", null, {
    params: { senderId, receiverId },
  });
  return res.data;
};
