import { CreateServiceDTO, UpdateServiceDTO } from "@/types/service";
import api from "./api";

// CREATE
export const createService = async (dto: CreateServiceDTO) => {
  
  const formData = new FormData();

  for (const key in dto) {
    if(key == "images"){
      for(const image of dto.images){
        formData.append("images", image);
      }
    }
    else if(dto.hasOwnProperty(key)) {
      formData.append(key, dto[key]);
    }
  }
  const res = await api.post("/service", formData,{
	header: {
		"Content-Type": "multipart/form-data"
	}
  });
  return res.data;
};

// READ - Get all
export const getAllServices = async () => {
  const res = await api.get("/service");
  return res.data;
};

// READ - Get all
export const getAllServicesByUserId = async (userId: string) => {
  const res = await api.get("/service/by-user/" + userId);
  return res.data;
};

// READ - Get by Id
export const getServiceById = async (id: string) => {
  const res = await api.get(`/service/${id}`);
  return res.data;
};

// UPDATE
export const updateService = async (id: string, dto: UpdateServiceDTO) => {
  const res = await api.put(`/service/${id}`, dto);
  return res.data;
};

// DELETE
export const deleteService = async (id: string) => {
  const res = await api.delete(`/service/${id}`);
  return res.data;
};

