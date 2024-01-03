import { message } from "antd";
import axios, { Method } from "axios";
import { useState } from "react";
import { ApiHookState, TApiInfo } from "./TApiRequest";
import { apiList } from "data/apiList";

export const useApiRequest = (initialState: any) => {
  const [state, setState] = useState<ApiHookState>({
    data: initialState,
    error: null,
    loading: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumns, setSearchColumns] = useState<string[]>([]);
  const [dataField, setDataField] = useState<string>("");

  const action = async <T extends Method>(apiInfo: TApiInfo<T>) => {
    // Setting Loading State True
    setState((prevState) => ({ ...prevState, loading: true, error: null }));

    const { method, urlKey, params, payload, toast, onSuccess, onError } =
      apiInfo;

    try {
      const response = await axios({
        method: method,
        url: apiList[urlKey],
        data: payload,
        params: params,
      });
      toast &&
        message.success(response?.data?.message || "Submitted Successfully");

      onSuccess && onSuccess(response.data);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        data: response.data,
      }));
    } catch (error: any) {
      toast &&
        message.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"
        );
      onError && onError(error as Error);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error as Error,
      }));
    }
  };
  // Search
  const searchFunc = (term: string, columns: string[], dataField?: string) => {
    setSearchTerm(term);
    setSearchColumns(columns);
    if (dataField) {
      setDataField(dataField);
    }
  };

  let data = state.data;
  if (searchTerm) {
    let actualData = state.data;
    if (dataField) actualData = state.data[dataField];

    data = actualData.filter((item: any) =>
      searchColumns.some((column) =>
        item[column].toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (dataField) data[dataField] = data;
  }

  // Reset the state to initial state
  const reset = () => {
    setState(() => ({
      data: initialState,
      error: null,
      loading: false,
    }));
  };
  // Return the state and the action dispatcher
  return { ...state, data, action, reset, searchFunc };
};
