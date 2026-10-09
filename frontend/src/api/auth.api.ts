import { apiClient } from "@/api/client";
import type { LoginPayload, RegisterPayload, User } from "@/types/auth";

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await apiClient.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<User> {
  const { data } = await apiClient.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");
  return data;
}
