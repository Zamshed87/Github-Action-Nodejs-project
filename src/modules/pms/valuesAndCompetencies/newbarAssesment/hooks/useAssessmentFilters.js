import { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

const useAssessmentFilters = () => {
  const {
      profileData: { orgId, buId, wgId, wId},
    } = useSelector((store) => store?.auth, shallowEqual);
  const [fiscalYearDDL, getFiscalYearDDL] = useAxiosGet();

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`);
  }, [orgId, buId, wgId, wId]);

  return {
    yearDDL: fiscalYearDDL,
    assessmentPeriodDDL: [{
      value: "Yearly",
      label: "Yearly",
    },
    {
      value: "Quarterly",
      label: "Quarterly",
    }],
    quarterDDL:[
      { value: 1, label: "1st Quarter" },
      { value: 2, label: "2nd Quarter" },
      { value: 3, label: "3rd Quarter" },
      { value: 4, label: "4th Quarter" },
    ]
  };
};

export default useAssessmentFilters;
