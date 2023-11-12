import { useState } from "react";
import { ApiHookState, HttpMethod, TApiInfo } from "./TApiRequest";
import axios from "axios";
import { apiPath } from "./apiPath";

export const useApiRequest = (initialState: any) => {
  const [state, setState] = useState<ApiHookState>({
    data: initialState,
    error: null,
    loading: false,
  });

  const action = async <T extends HttpMethod>(apiInfo: TApiInfo<T>) => {
    // Setting Loading State True
    setState((prevState) => ({ ...prevState, loading: true, error: null }));

    const { method, urlKey, params, payload, onSuccess, onError } = apiInfo;
    try {
      const response = await axios({
        method: method || "GET",
        url: apiPath[urlKey],
        data: payload,
        params: params,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        data: response.data,
      }));
      onSuccess && onSuccess(response.data);
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error as Error,
      }));
      setState((prevState) => ({ ...prevState, loading: false }));
      onError && onError(error as Error);
    }
  };

  // Reset the state to initial state
  const reset = () => {
    setState((prevState) => ({
      data: initialState,
      error: null,
      loading: false,
    }));
  };
  // Return the state and the action dispatcher
  return { ...state, action, reset };
};
