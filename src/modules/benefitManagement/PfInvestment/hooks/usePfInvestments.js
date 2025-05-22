import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfInvestments = (form) => {
  const { buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchPfInvestment = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      BusinessUnitId: buId,
      FromDate: formValues?.FromDate,
      ToDate: formValues?.ToDate,
      InvestmentTypeId: formValues?.InvestmentTypeId,
      Status: formValues.status,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    const url = `/PFInvestment/GetAll?${filteredParams}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  return { data, setData, fetchPfInvestment, loading, pages, setPages };
};

export default usePfInvestments;
