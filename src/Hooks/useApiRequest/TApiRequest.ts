import { apiPath } from "./apiPath";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export type ApiHookState = {
  data: any;
  error: Error | null;
  loading: boolean;
};
export type TApiInfo<T extends HttpMethod> = T extends "GET"
  ? {
      url: keyof typeof apiPath;
      method: T;
      params?: string | number;
      payload?: never;
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
    }
  : {
      url: keyof typeof apiPath;
      method: T;
      params?: never;
      payload: any;
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
    };
