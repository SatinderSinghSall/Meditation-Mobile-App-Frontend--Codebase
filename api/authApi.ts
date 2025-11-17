import { API_BASE } from "./api";

async function request(endpoint: string, method = "GET", body?: any) {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Error: ${res.status}`);
  }

  return data;
}

export async function signup(name: string, email: string, password: string) {
  return request("/auth/signup", "POST", { name, email, password });
}

export async function login(email: string, password: string) {
  return request("/auth/login", "POST", { email, password });
}
