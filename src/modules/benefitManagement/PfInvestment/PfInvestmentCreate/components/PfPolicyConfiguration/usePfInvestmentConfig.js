import axios from "axios";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfInvestmentConfig = (form, config = {}) => {
  const {
    profileData: { orgId, buId, wgId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const [createLoading, setCreateLoading] = useState(false);

  const [
    investmentType,
    fetchInvestmentType,
    loadingInvestmentType,
    setInvestmentType,
  ] = useAxiosGet([]);

  const [
    investmentOrganization,
    fetchInvestmentOrganization,
    loadingInvestmentOrganization,
    setInvestmentOrganization,
  ] = useAxiosGet([]);
  const getInvestmentType = () => {
    const url = `/InvestmentType/GetAll?accountId=${orgId}`;
    fetchInvestmentType(url, (res) => {
      const mappedTypes = res?.data?.map((item) => ({
        ...item,
        value: item.typeId,
        label: item.investmentName,
      }));
      setInvestmentType(mappedTypes);
    });
  }
  const getInvestmentOrganization = () => {
    const url = `/InvestmentOrganization/GetAll?accountId=${orgId}`;
    fetchInvestmentOrganization(url, (res) => {
      const mappedOrgs = res?.data?.map((item) => ({
        ...item,
        value: item.typeId,
        label: item.organizationName,
      }));
      setInvestmentOrganization(mappedOrgs);
    });
  }
  const createInvestmentType = async (values, resetData) => {
    setCreateLoading?.(true);
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        investmentName: values?.investmentName,
        remark: values?.remark,
      };
      const res = await axios.post(`/InvestmentType/Create`, payload);
      toast.success(res?.data?.message?.[0] || "Created Successfully");
      setCreateLoading?.(false);
      resetData?.();
      getInvestmentType();
    } catch (error) {
      toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
      setCreateLoading?.(false);
    }
  };
  const createInvestmentOrganization = async (values, resetData) => {
    setCreateLoading?.(true);
    try {
      const payload = {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        organizationName: values?.organizationName,
        remark: values?.remark,
      };
      const res = await axios.post(`/InvestmentOrganization/Create`, payload);
      toast.success(res?.data?.message?.[0] || "Created Successfully");
      setCreateLoading?.(false);
      resetData?.();
      getInvestmentOrganization();
    } catch (error) {
      toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
      setCreateLoading?.(false);
    }
  };
  useEffect(() => {
    getInvestmentType();
    getInvestmentOrganization();   
  }, [orgId]);

  return {
    investmentType,
    investmentOrganization,
    loadingInvestmentType,
    loadingInvestmentOrganization,
    createLoading,
    createInvestmentType,
    createInvestmentOrganization,
    getInvestmentType,
    getInvestmentOrganization,
  };
};

export default usePfInvestmentConfig;
