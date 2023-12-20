import { Method } from "axios";
import { apiPath } from "./apiPath";

export interface IApiInfoBase {
  urlKey: keyof typeof apiPath;
  method: Method;
  params?: any;
  toast?: boolean;
  onSuccess?: (data: any) => any;
  onError?: (error: Error) => void;
}

export type TApiInfo<T extends Method> = T extends "GET" | "get"
  ? IApiInfoBase & { payload?: never }
  : IApiInfoBase & { payload: any };

export type ApiHookState = {
  data: any;
  error: Error | null;
  loading: boolean;
};
