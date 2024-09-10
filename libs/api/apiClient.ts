import axios, { AxiosInstance } from "axios";
import { createUserEndpoints } from "./endpoints/users";
// Import other endpoint creators as needed

const BASE_URL = "/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const createApiClient = (instance: AxiosInstance) => ({
  users: createUserEndpoints(instance),
  // Add other endpoint categories
});

export const apiClient = createApiClient(axiosInstance);

// You can also export the type of the apiClient for better type inference
export type ApiClient = ReturnType<typeof createApiClient>;
