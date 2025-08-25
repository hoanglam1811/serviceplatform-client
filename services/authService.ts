import { RegisterDTO } from "@/types/user";
import api from "./api";

export const registerCustomer = async (data: RegisterDTO) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, (data as any)[key])
  }
  let response: any;
  if(data.role == "Provider"){
    response = await api.post("/authentication/register-service-provider", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  else if(data.role == "Customer"){
    response = await api.post("/authentication/register-customer", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return response.data; // cookie is automatically stored by browser
};

export const loginCustomer = async (username: string, password: string) => {
  const response = await api.post("/authentication/login", { username, password });
  return response.data; // cookie is automatically stored by browser
};

export const logoutAPI = async () => {
  const response = await api.post("/authentication/logout");
  return response.data; // cookie is automatically stored by browser
};
