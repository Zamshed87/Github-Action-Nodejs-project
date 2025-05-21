import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfInvestmentConfig = (form, config = {}) => {
  const { fetch = false } = config;

  const {
    profileData: { orgId, buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const [
    investmentType,
    fetchInvestmentType,
    loadingInvestmentType,
    setInvestmentType,
  ] = useAxiosGet([]);

  useEffect(() => {
    const url = `/InvestmentType/GetAll?accountId=${orgId}`;
    fetchInvestmentType(url, (res) => {
      setInvestmentType(res);
    });
  }, [orgId, buId, wgId, wId]);

  return {
    investmentType,
    loadingInvestmentType,
  };
};

export default usePfInvestmentConfig;
