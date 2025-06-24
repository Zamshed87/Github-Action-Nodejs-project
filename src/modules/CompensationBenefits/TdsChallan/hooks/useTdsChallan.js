import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useTdsChallan = (form) => {
  const { wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchTdsChallan = () => {
    const formValues = form?.getFieldsValue(true);
    const formattedParams = {
      StrListOfFiscalYear: formValues.ListOfFiscalYear,
      StrListOfWorkplace: formValues.ListOfWorkplace,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/TaxChallan/GetAll?${filteredParams}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  useEffect(() => {
    fetchTdsChallan();
  }, [wgId, wId]);

  return { data, setData, fetchTdsChallan, loading, pages, setPages };
};

export default useTdsChallan;
