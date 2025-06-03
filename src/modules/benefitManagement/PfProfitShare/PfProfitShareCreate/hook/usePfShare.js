import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import useAxiosPost from "utility/customHooks/useAxiosPost";

const usePfShare = (form) => {
  const [visible, setVisible] = useState({ open: false, data: "" });
  const closeModal = () => {
    setVisible(false);
  };
  const { buId, wgId, wId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [data, getData, loading, setData, error, setLoading] = useAxiosGet({});
  const [detailsData, postDetailsData, detailsLoading, setDetailsData] =
    useAxiosPost({});

  const fetchPfShare = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      AccountId: intAccountId,
      ProfitShareType: formValues.profitShareType,
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
      setData(res?.data || []);
    });
  };

  const getPfProfitDetailsData = async () => {
    const formValues = form?.getFieldsValue(true);
    const isPercentage = formValues?.profitShareTypeId === 1;

    const formattedParams = {
      AccountId: intAccountId,
      businessUnitId: buId,
      FromDate: formValues.fromDate,
      ToDate: formValues.toDate,
      profitShareType: formValues?.profitShareType,
      profitShareTypeId: formValues?.profitShareTypeId,
      profitAmount: isPercentage ? 0 : Number(formValues?.profitShare) || 0,
      profitSharePercentage: isPercentage
        ? Number(formValues?.profitShare) || 0
        : 0,
    };


    const url = `/PFProfitShare/GetUnadjustData`;
    postDetailsData(
      url,
      formattedParams,
      (res) => {
        setDetailsData(res?.data || []);
      },
      true,
      "Data Retrieved Successfully",
      "Data Retrieval Unsuccessful",
      (err) => {
        console.log("the error => ",err);
      }
    );
  };

  useEffect(() => {
    fetchPfShare();
  }, [wgId, wId]);

  return {
    visible,
    closeModal,
    setVisible,
    data,
    setData,
    fetchPfShare,
    getPfProfitDetailsData,
    loading,
    pages,
    setLoading,
    setPages,
    detailsData,
    detailsLoading,
  };
};

export default usePfShare;
