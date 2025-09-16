import api from "./api";

// CREATE
export const createPayOSLink = async (amount: number) => {
  const res = await api.post("/PayOS/create", {
    orderCode: 0,
    amount: amount,
    description: "Payment for service",
    returnUrl: "http://localhost:3000/",
    cancelUrl: "http://localhost:3000/",
    signature: ""
  });
  return res.data;
};


