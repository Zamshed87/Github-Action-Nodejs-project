import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfInvestmentConfig = (form, config = {}) => {
  const {
    profileData: { orgId },
  } = useSelector((store) => store?.auth, shallowEqual);

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

  useEffect(() => {
    const url = `/InvestmentType/GetAll?accountId=${orgId}`;
    const url2 = `/InvestmentOrganization/GetAll?accountId=${orgId}`;

    fetchInvestmentType(url, (res) => {
      const mappedTypes = res?.data?.map((item) => ({
        ...item,
        value: item.typeId,
        label: item.investmentName,
      }));
      setInvestmentType(mappedTypes);
    });

    fetchInvestmentOrganization(url2, (res) => {
      const mappedOrgs = res?.data?.map((item) => ({
        ...item,
        value: item.typeId,
        label: item.organizationName,
      }));
      setInvestmentOrganization(mappedOrgs);
    });
  }, [orgId]);

  return {
    investmentType,
    investmentOrganization,
    loadingInvestmentType,
    loadingInvestmentOrganization,
  };
};

export default usePfInvestmentConfig;
