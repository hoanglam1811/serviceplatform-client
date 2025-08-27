import { RegisterDTO } from "@/types/user";
import api from "./api";

export const registerCustomer = async (data: RegisterDTO) => {
  const formData = new FormData();

  for (const key in data) {
    if (key === "nationalId") {
      (data.nationalId as File[]).forEach((file, index) => {
        formData.append("nationalId", file);
      });
    } else {
      formData.append(key, (data as any)[key]);
    }
  }

  let response: any;
  if (data.role == "Provider") {
    response = await api.post("/Authentication/register-service-provider", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  else if (data.role == "Customer") {
    response = await api.post("/Authentication/register-customer", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return response.data;
};

export const registerProvider = async (data: RegisterDTO) => {
  const formData = new FormData();

  for (const key in data) {
    if (key === "nationalId") {
      (data.nationalId as File[]).forEach((file) => {
        formData.append("nationalId", file);
      });
    } else {
      formData.append(key, (data as any)[key]);
    }
  }

  const response = await api.post("/Authentication/register-service-provider", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ---------- LOGIN ----------
export const loginCustomer = async (username: string, password: string) => {
  const response = await api.post("/Authentication/login", { username, password });
  return response.data;
};

export const loginProvider = async (username: string, password: string) => {
  const response = await api.post("/Authentication/login-service-provider", { username, password });
  return response.data;
};

export const loginAdmin = async (username: string, password: string) => {
  const response = await api.post("/Authentication/login-admin", { username, password });
  return response.data;
};

// ---------- LOGOUT ----------
export const logoutAPI = async () => {
  const response = await api.post("/Authentication/logout");
  return response.data;
};

// ---------- GET USERS ----------
export const getAllCustomers = async () => {
  const response = await api.get("/Authentication/customers");
  return response.data;
};

export const getAllServiceProviders = async () => {
  const response = await api.get("/Authentication/service-providers");
  return response.data;
};

export const acceptUser = async (id: string, role: "Customer" | "Provider") => {
  const response = await api.put(`/Authentication/accept-user/${id}?role=${role}`);
  return response.data;
};

export const rejectUser = async (id: string, role: "Customer" | "Provider", reason: string) => {
  const response = await api.put(`/Authentication/reject-user/${id}?role=${role}`, reason, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
