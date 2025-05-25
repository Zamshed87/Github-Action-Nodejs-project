import axios from "axios";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfInvestments = (form) => {
  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [otherLoading, setOtherLoading] = useState(false);
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchPfInvestment = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      BusinessUnitId: buId,
      FromDate: formValues?.FromDate,
      ToDate: formValues?.ToDate,
      InvestmentTypeId: formValues?.InvestmentTypeId?.join(",") || '',
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
  const inActivatePfInvestment = async (
    InvestmentId,
  ) => {
    setOtherLoading?.(true);
    try {
      const res = await axios.delete(
        `/PFInvestment/DeleteById?BusinessUnitId=${buId}&InvestmentId=${InvestmentId}`
      );
      toast.success(res?.data?.message || "InActive Successfully");
      setOtherLoading?.(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setOtherLoading?.(false);
    }
  };

  return { data, setData, fetchPfInvestment, loading, pages, setPages , otherLoading, setOtherLoading, inActivatePfInvestment };
};

export default usePfInvestments;
