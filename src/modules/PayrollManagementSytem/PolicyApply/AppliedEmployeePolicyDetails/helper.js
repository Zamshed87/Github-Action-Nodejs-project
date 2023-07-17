import axios from "axios";
import { toast } from "react-toastify";

export const getAssignedPolicy = async (
  accId,
  buId,
  employeeId,
  policyId,
  setPolicyDescription,
  setEmployeeDescription,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const descriptionResponse = await axios.get(
      `Employee/EmployeeProfileView?employeeId=${employeeId}`
    );
    setEmployeeDescription(
      descriptionResponse?.data?.employeeProfileLandingView
    );

    const policyDescription = await axios.get(
      `/Payroll/GetSalaryPolicyById?id=${policyId}`
    );
    setPolicyDescription(policyDescription?.data);
    setLoading(false);
  } catch (error) {
    toast.warn("Something wrong");
    setLoading(false);
  }
};
