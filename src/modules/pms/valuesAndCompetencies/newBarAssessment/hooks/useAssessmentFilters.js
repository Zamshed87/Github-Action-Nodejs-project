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
      { value: "1st Quarter", label: "1st Quarter" },
      { value: "2nd Quarter", label: "2nd Quarter" },
      { value: "3rd Quarter", label: "3rd Quarter" },
      { value: "4th Quarter", label: "4th Quarter" },
    ]
  };
};

export default useAssessmentFilters;
