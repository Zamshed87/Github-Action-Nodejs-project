import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { getEnumData } from "common/api/commonApi";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useConfigSelectionHook = (form) => {
  const {
    profileData: { orgId, buId, wgId, wId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const workplaceDDL = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  // State declarations
  const [
    eligibilityOpts,
    fetchEligibility,
    loadingEligibility,
    setEligibility,
  ] = useAxiosGet([]);
  const [
    contributionOpts,
    fetchContribution,
    loadingContribution,
    setContribution,
  ] = useAxiosGet([]);
  const [paidAfterOpts, fetchPaidAfter, loadingPaidAfter, setPaidAfter] =
    useAxiosGet([]);
  const [investmentOpts, fetchInvestment, loadingInvestment, setInvestment] =
    useAxiosGet([]);

  const getWorkplaceDDL = () => {
    workplaceDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };
  const getEmploymentTypeDDL = () => {
    const { workplace } = form?.getFieldsValue(true) || {};
    console.log(workplace);
    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace ?? wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });
  };

  useEffect(() => {
    getWorkplaceDDL();
    getEmploymentTypeDDL();
    fetchEligibility(getEnumData("PfEligibilityDependOn", setEligibility));
    fetchContribution(getEnumData("PfContributionDependOn", setContribution));
    fetchPaidAfter(getEnumData("EmployeeContributionPaidAfter", setPaidAfter));
    fetchInvestment(getEnumData("MonthlyInvestmentWith", setInvestment));
  }, [orgId, buId, wgId, wId]);

  return {
    workplaceDDL,
    getWorkplaceDDL,
    employmentTypeDDL,
    getEmploymentTypeDDL,
    empDesignationDDL,
    eligibilityOpts,
    loadingEligibility,
    contributionOpts,
    loadingContribution,
    paidAfterOpts,
    loadingPaidAfter,
    investmentOpts,
    loadingInvestment,
  };
};

export default useConfigSelectionHook;
