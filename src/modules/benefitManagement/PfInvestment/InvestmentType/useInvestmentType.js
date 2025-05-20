import axios from "axios";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useInvestmentType = (form) => {
  const { wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [createUpdateLoading, setCreateUpdateLoading] = useState(false);
  const [data, getData, loading, setData] = useAxiosGet({});

  const fetchInvestmentType = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      IntWorkPlaceGroupId: formValues.workplaceGroup?.value ?? wgId,
      IntWorkPlaceId: formValues.workplace?.value ?? wId,
      // StrStatus: formValues.status,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/PfPolicy/GetPolicies?${filteredParams}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  const createInvestmentType = async (values, resetData) => {
    setCreateUpdateLoading?.(true);
    try {
      const formValues = form?.getFieldsValue(true);
      const payload = {
        businessUnitId: formValues?.businessUnit?.value,
        workplaceGroupId: formValues?.workplaceGroup?.value,
        investmentName: values?.investmentName,
        remark: values?.remark,
      };
      const res = await axios.post(`/InvestmentType/Create`, payload);
      toast.success(res?.data?.message || "Created Successfully");
      setCreateUpdateLoading?.(false);
      resetData?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setCreateUpdateLoading?.(false);
    }
  };
  const updateInvestmentType = async (values, resetData) => {
    setCreateUpdateLoading?.(true);
    try {
      const payload = {
        typeId: values?.typeId,
        businessUnitId: values?.businessUnitId,
        workplaceGroupId: values?.workplaceGroupId,
        investmentName: values?.investmentName,
        remark: values?.remark,
      };
      const res = await axios.post(`/InvestmentType/Update`, payload);
      toast.success(res?.data?.message || "Updated Successfully");
      setCreateUpdateLoading?.(false);
      resetData?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setCreateUpdateLoading?.(false);
    }
  };

  useEffect(() => {
    fetchInvestmentType();
  }, [wgId, wId]);

  return {
    data,
    setData,
    fetchInvestmentType,
    createInvestmentType,
    updateInvestmentType,
    createUpdateLoading,
    loading,
    pages,
    setPages,
  };
};

export default useInvestmentType;
