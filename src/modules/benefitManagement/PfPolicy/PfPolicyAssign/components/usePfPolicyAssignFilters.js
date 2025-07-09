import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const usePfPolicyAssignFilters = ({ form }) => {
  const { state } = useLocation();
  const {
    profileData: { orgId, buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const employeeDDL = useApiRequest({});
  const employmentTypeDDL = useApiRequest({});
  const getEmployeeDDL = (value = "") => {
    employeeDDL?.action({
      url: "/PeopleDeskDdl/GetPolicyWiseEmployeeDDL",
      method: "GET",
      params: {
        intPolicyId: state?.intPfConfigHeaderId ?? 0,
        strSearchTxt: value,
      }
    });
  };
  const getEmploymentTypeDDL = () => {
    employmentTypeDDL?.action({
      url: `PeopleDeskDdl/GetPfPolicyWiseEmploymentType/${
        state?.intPfConfigHeaderId ?? 0
      }`,
      method: "GET"
    });
  };

  useEffect(() => {
    getEmploymentTypeDDL();
  }, [orgId, buId, wgId, wId]);

  return {
    employeeDDL,
    getEmployeeDDL,
    employmentTypeDDL,
    getEmploymentTypeDDL,
  };
};

export default usePfPolicyAssignFilters;
