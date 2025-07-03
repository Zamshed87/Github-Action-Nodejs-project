import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfPolicyAssign = (form) => {
  const { state } = useLocation();
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

  const fetchPfPolicyAssign = () => {
    const formValues = form?.getFieldsValue(true);
    const formattedParams = {
      IntPolicyId: state?.intPfConfigHeaderId ?? 0,
      StrEmploymentTypeList: formValues?.employmentType,
      IntServiceFrom: formValues?.serviceFrom,
      IntServiceTo: formValues?.serviceTo,
      PageSize: pages.pageSize,
      PageNo: pages.current,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/PfPolicy/GetPolicyWiseEmployee?${filteredParams}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  useEffect(() => {
    fetchPfPolicyAssign();
  }, [wgId, wId]);

  return { data, setData, fetchPfPolicyAssign, loading, pages, setPages };
};

export default usePfPolicyAssign;
