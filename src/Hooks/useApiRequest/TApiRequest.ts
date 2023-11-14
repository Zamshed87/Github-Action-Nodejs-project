import { apiPath } from "./apiPath";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export type ApiHookState = {
  data: any;
  error: Error | null;
  loading: boolean;
};
export type TApiInfo<T extends HttpMethod> = T extends "GET"
  ? {
      urlKey: keyof typeof apiPath;
      method: T;
      params?: object;
      payload?: never;
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
    }
  : {
      urlKey: keyof typeof apiPath;
      method: T;
      params?: never;
      payload: any;
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
    };
