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
      toast?: boolean;
      onSuccess?: (data: any) => any;
      onError?: (error: Error) => void;
    }
  : {
      urlKey: keyof typeof apiPath;
      method: T;
      params?: any;
      payload: any;
      toast?: boolean;
      onSuccess?: (data: any) => any;
      onError?: (error: Error) => void;
    };
