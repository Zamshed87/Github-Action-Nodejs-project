import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useAbsentPunishment = (form) => {
  const { wId } = useSelector(
      (state) => state?.auth?.profileData,
      shallowEqual
    );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchAbsentPunishment = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      WorkPlaceId: wId,
      status: formValues.status,
      PageNo: pages.current,
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
  useEffect(() => {
    fetchAbsentPunishment();
  }, [wId]);

  return { data, setData, fetchAbsentPunishment, loading, pages, setPages };
};

export default useAbsentPunishment;
