import { useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useAbsentPunishment = (form) => {
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchAbsentPunishment = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      WorkPlaceId: formValues.workplace?.value,
      Status: formValues.status,
      PageNo:pages.current,
      PageSize: pages.pageSize,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    const url = `/AbsentPunishment/GetAll?${filteredParams}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  return { data, fetchAbsentPunishment, loading, pages, setPages };
};

export default useAbsentPunishment;
