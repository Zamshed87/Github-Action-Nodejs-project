import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfProfitShare = (form) => {
  const { wgId, wId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchPfProfitShare = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      AccountId: intAccountId,
      Status: formValues.status,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    const url = `/PFProfitShare/GetAll?${filteredParams}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  useEffect(() => {
    fetchPfProfitShare();
  }, [wgId, wId]);

  return { data, setData, fetchPfProfitShare, loading, pages, setPages };
};

export default usePfProfitShare;
