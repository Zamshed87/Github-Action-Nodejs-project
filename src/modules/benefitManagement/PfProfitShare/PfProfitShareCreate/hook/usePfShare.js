import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfShare = (form) => {
  const { wgId, wId, accountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData, error, setLoading] = useAxiosGet({});

  const fetchPfShare = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      AccountId:accountId,
      FromDate: formValues.fromDate,
      ToDate: formValues.toDate,
      PageNo: pages.current,
      PageSize: pages.pageSize,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    const url = `/PFProfitShare/Get?${filteredParams}`;

    getData(url, (res) => {
      console.log("res", res);
      setData(res?.detailsData || []);
    });
  };

  useEffect(() => {
    fetchPfShare();
  }, [wgId, wId]);

  return { data, setData, fetchPfShare, loading, pages, setLoading, setPages };
};

export default usePfShare;
