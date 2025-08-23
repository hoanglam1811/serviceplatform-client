import api from "./api";

export const registerCustomer = async (data: any) => {
  const response = await api.post("/authentication/register-customer", data);
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
