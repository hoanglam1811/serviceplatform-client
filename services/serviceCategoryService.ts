import { CreateServiceCategoryDTO, UpdateServiceCategoryDTO, } from "@/types/service";
import api from "./api";

// CREATE
export const createCategory = async (dto: CreateServiceCategoryDTO) => {
  const res = await api.post("/ServiceCategory", dto);
  return res.data;
};

// READ - Get all
export const getAllCategories = async () => {
  const res = await api.get("/ServiceCategory");
  return res.data;
};

// READ - Get by Id
export const getServiceCategoryById = async (id: string) => {
  const res = await api.get(`/ServiceCategory/${id}`);
  return res.data;
};

// UPDATE
export const updateServiceCategory = async (id: string, dto: UpdateServiceCategoryDTO) => {
  const res = await api.put(`/ServiceCategory/${id}`, dto);
  return res.data;
};

// DELETE
export const deleteServiceCategory = async (id: string) => {
  const res = await api.delete(`/ServiceCategory/${id}`);
  return res.data;
};

