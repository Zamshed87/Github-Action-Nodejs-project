import axios from "axios";
import { toast } from "react-toastify";

export const getSalaryPolicyList = async (orgId, buId, setter) => {
  try {
    const { data } = await axios.get(
      `/Payroll/GetAllSalaryPolicy?accountId=${orgId}&businessUnitId=${buId}`
    );
    const policyDDL = data?.map((item) => ({
      ...item,
      label: item?.strPolicyName,
      value: item?.intPolicyId,
    }));
    setter(policyDDL);
  } catch (error) {}
};

export const allEmployeeList = async (
  { orgId, buId },
  values,
  setLoading,
  setter,
  setAllData
) => {
  const payload = {
    accountId: orgId,
    businessUnitId: values?.businessUnit?.value,
    employeeId: 0,
    workplaceGroupId: values?.workplaceGroup?.value || 0,
    payrollGroupId: values?.payrollGroup?.value || 0,
    departmentId: values?.department?.value || 0,
    designationId: values?.designation?.value || 0,
    supervisorId: values?.supervisor?.value || 0,
    rosterGroupId: values?.rosterGroup?.value || 0,
    calendarId: values?.calendar?.value || 0,
    genderId: values?.gender?.value || 0,
    religionId: values?.religion?.value || 0,
    employmentTypeId: values?.employmentType?.value || 0,
    joiningDate: values?.joiningDate || null,
    confirmationDate: values?.confirmDate || null,
    isGivenNid: values?.isNID?.value || 0,
    isGivenBirthCertificate: values?.birthCertificate?.value || 0,
    partName: "AllEmployeeListWithFilterForPolicyAssign",
  };
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/AllEmployeeListWithFilter`,
      payload
    );
    setter(res?.data);
    setAllData && setAllData(res?.data);
    res?.data?.length === 0 && toast.warn("There is no employee!");
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
    toast.warn("Something went wrong");
  }
};
