import axios from "axios";

export const loadUserList = async(v, unAppliedPolicyEmployee) => {
  if (v?.length < 2) return [];
  let employeeList = [];
  await unAppliedPolicyEmployee?.forEach(
    (item) =>
      item?.EmployeeName?.includes(v) &&
      employeeList.push({
        value: +item?.intEmployeeBasicInfoId,
        label: item?.EmployeeName,
        name: item?.EmployeeName,
      })
  );
  return employeeList;
};

export const getUnAppliedPolicyEmployee = async (
  orgId,
  buId,
  setLoading,
  setter
) => {
  const payload = {
    accountId: +orgId,
    businessUnitId: +buId,
    calendarId: 0,
    confirmationDate: null,
    departmentId: 0,
    designationId: 0,
    employeeId: 0,
    employmentTypeId: 0,
    genderId: 0,
    isGivenBirthCertificate: 0,
    isGivenNid: 0,
    joiningDate: null,
    partName: "AllEmployeeListWithFilterForPolicyAssign",
    payrollGroupId: 0,
    religionId: 0,
    rosterGroupId: 0,
    supervisorId: 0,
    workplaceGroupId: 0,
  };
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/AllEmployeeListWithFilter`,
      payload
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};
