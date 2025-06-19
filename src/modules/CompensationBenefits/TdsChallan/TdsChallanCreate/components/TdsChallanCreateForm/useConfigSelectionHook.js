import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { getEnumData } from "common/api/commonApi";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useConfigSelectionHook = (form, config = {}) => {
  const {
    fetchWorkplace = false,
    fetchEmploymentType = false,
    fetchEligibilityEnum = false,
    fetchContributionEnum = false,
    fetchPaidAfterEnum = false,
    fetchInvestmentEnum = false,
  } = config;

  const {
    profileData: { orgId, buId, wgId, wId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const workplaceDDL = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);

  const [eligibilityOpts, fetchEligibility, loadingEligibility, setEligibility] = useAxiosGet([]);
  const [contributionOpts, fetchContribution, loadingContribution, setContribution] = useAxiosGet([]);
  const [paidAfterOpts, fetchPaidAfter, loadingPaidAfter, setPaidAfter] = useAxiosGet([]);
  const [investmentOpts, fetchInvestment, loadingInvestment, setInvestment] = useAxiosGet([]);

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
    if (fetchWorkplace) getWorkplaceDDL();
    if (fetchEmploymentType) getEmploymentTypeDDL();
    if (fetchEligibilityEnum)
      fetchEligibility(getEnumData("PfEligibilityDependOn", setEligibility));
    if (fetchContributionEnum)
      fetchContribution(getEnumData("PfContributionDependOn", setContribution));
    if (fetchPaidAfterEnum)
      fetchPaidAfter(
        getEnumData("EmployeeContributionPaidAfter", setPaidAfter)
      );
    if (fetchInvestmentEnum)
      fetchInvestment(getEnumData("MonthlyInvestmentWith", setInvestment));
  }, [orgId, buId, wgId, wId]);

  return {
    workplaceDDL,
    getWorkplaceDDL,
    employmentTypeDDL,
    getEmploymentTypeDDL,
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
