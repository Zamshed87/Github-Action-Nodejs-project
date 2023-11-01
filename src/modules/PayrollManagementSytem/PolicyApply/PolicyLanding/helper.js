import axios from "axios";
import { toast } from "react-toastify";

export const AllEmployeeListWithFilterForPolicyReAssign = async (
  accId,
  buId,
  employeeId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const response = await axios.post(`/Employee/AllEmployeeListWithFilter`, {
      partName: "AllEmployeeListWithFilterForPolicyReAssign",
      accountId: +accId,
      businessUnitId: +buId,
      employeeId: 0,
      workplaceGroupId: 0,
      payrollGroupId: 0,
      departmentId: 0,
      designationId: 0,
      supervisorId: 0,
      rosterGroupId: 0,
      calendarId: 0,
      genderId: 0,
      religionId: 0,
      employmentTypeId: 0,
      isGivenNid: 0,
      isGivenBirthCertificate: 0,
    });
    setter(response?.data);
    setAllData && setAllData(response?.data);
    setLoading(false);
  } catch (error) {
    toast.warn("Something wrong");
    setLoading(false);
  }
};
