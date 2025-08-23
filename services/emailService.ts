import { sendEmailRequest } from "@/types/email";
import api from "./api";

// CREATE
export const email = async (dto: sendEmailRequest) => {
  const res = await api.post("/email", dto);
  return res.data;
};


