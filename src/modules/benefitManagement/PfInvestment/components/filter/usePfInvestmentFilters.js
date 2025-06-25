import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePfInvestmentFilters = (form) => {
  const {
    profileData: { orgId, buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const [
    investmentType,
    fetchInvestmentType,
    loadingInvestmentType,
    setInvestmentType,
  ] = useAxiosGet([]);
  
  const getInvestmentType = () => {
    const url = `/InvestmentType/GetInvestmentTypeDDL?accountId=${orgId}`;
    fetchInvestmentType(url, (res) => {
      const mappedTypes = res?.data?.map((item) => ({
        ...item,
        value: item.typeId,
        label: item.investmentName,
      }));
      setInvestmentType(mappedTypes);
    });
  }

  useEffect(() => {
    getInvestmentType();
  }, [orgId, buId, wgId, wId]);

  return {
    investmentType,
    loadingInvestmentType,
  };
};

export default usePfInvestmentFilters;
