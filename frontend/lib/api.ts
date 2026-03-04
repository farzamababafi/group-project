import api from "@/lib/axios";
import type { Helloworld } from "@/lib/types";

export const hello = async (): Promise<Helloworld> => {
  const response = await api.get<Helloworld>("/api/hellow");
  return response.data;
};