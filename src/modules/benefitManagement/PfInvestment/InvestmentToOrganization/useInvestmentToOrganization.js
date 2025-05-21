import axios from "axios";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useInvestmentOrganization = (form) => {
  const { wgId, wId, orgId } = useSelector(
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

  const fetchInvestmentOrganization = () => {

    const url = `/InvestmentOrganization/GetAll?accountId=${orgId}`;

    getData(url, (res) => {
      setData(res);
    });
  };

  const createInvestmentOrganization = async (values, resetData) => {
    setCreateUpdateLoading?.(true);
    try {
      const formValues = form?.getFieldsValue(true);
      const payload = {
        businessUnitId: formValues?.businessUnit?.value,
        workplaceGroupId: formValues?.workplaceGroup?.value,
        organizationName: values?.organizationName,
        remark: values?.remark,
      };
      const res = await axios.post(`/InvestmentOrganization/Create`, payload);
      toast.success(res?.data?.message?.[0] || "Created Successfully");
      setCreateUpdateLoading?.(false);
      resetData?.();
      fetchInvestmentOrganization();
    } catch (error) {
      toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
      setCreateUpdateLoading?.(false);
    }
  };
  const updateInvestmentOrganization = async (values, resetData) => {
    setCreateUpdateLoading?.(true);
    try {
      const payload = {
        investmentOrganizationId: values?.typeId,
        businessUnitId: values?.businessUnitId,
        workplaceGroupId: values?.workplaceGroupId,
        organizationName: values?.organizationName,
        remark: values?.remark,
      };
      const res = await axios.put(`/InvestmentOrganization/Update`, payload);
      toast.success(res?.data?.message?.[0] || "Updated Successfully");
      setCreateUpdateLoading?.(false);
      resetData?.();
      fetchInvestmentOrganization();
    } catch (error) {
      toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
      setCreateUpdateLoading?.(false);
    }
  };

  useEffect(() => {
    fetchInvestmentOrganization();
  }, [wgId, wId]);
  return {
    data,
    setData,
    fetchInvestmentOrganization,
    createInvestmentOrganization,
    updateInvestmentOrganization,
    createUpdateLoading,
    loading,
    pages,
    setPages,
  };
};

export default useInvestmentOrganization;
