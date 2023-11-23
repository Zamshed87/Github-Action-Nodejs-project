import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import { ApiHookState, HttpMethod, TApiInfo } from "./TApiRequest";
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

    const { method, urlKey, params, payload, toast, onSuccess, onError } =
      apiInfo;
    try {
      const response = await axios({
        method: method || "GET",
        url: apiPath[urlKey],
        data: payload,
        params: params,
      });
      onSuccess && onSuccess(response.data);
      toast &&
        message.success(response?.data?.message || "Submitted Successfully");
      setState((prevState) => ({
        ...prevState,
        loading: false,
        data: response.data,
      }));
    } catch (error: any) {
      onError && onError(error as Error);
      toast &&
        message.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        );
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error as Error,
      }));
    }
  };

  // Reset the state to initial state
  const reset = () => {
    setState(() => ({
      data: initialState,
      error: null,
      loading: false,
    }));
  };
  // Return the state and the action dispatcher
  return { ...state, action, reset };
};
