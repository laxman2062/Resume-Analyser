import api from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const res = await api.post("/auth/login", payload);
  return res.data; // { user, token }
};

export const registerUser = async (payload: RegisterPayload) => {
  const res = await api.post("/auth/register", payload);
  return res.data; // { user, token }
};