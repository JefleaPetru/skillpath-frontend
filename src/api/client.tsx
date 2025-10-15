import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

export type ApiErrorBody = {
  error?: string;
  field?: string;
  code?: "EMAIL_TAKEN" | "EMAIL_NOT_VERIFIED" | string;
};

export function asApiError(e: unknown): { status?: number; data?: ApiErrorBody } {
  const anyErr = e as any;
  const status: number | undefined = anyErr?.response?.status;
  const data: ApiErrorBody | undefined = anyErr?.response?.data;
  return { status, data };
}
