import { Method } from "axios";
import { apiList } from "data/apiList";

export interface IApiInfoBase {
  urlKey: keyof typeof apiList;
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
