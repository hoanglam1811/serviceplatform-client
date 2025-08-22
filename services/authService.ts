import api from "./api";

export const registerCustomer = async (data: any) => {
  const response = await api.post("/authentication/register-customer", { email, password });
  return response.data; // cookie is automatically stored by browser
};

export const login = async (email: string, password: string) => {
  const response = await api.post("/authentication/login", { email, password });
  return response.data; // cookie is automatically stored by browser
};
