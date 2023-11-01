import axios from "axios";

export const allEmployeeList = async (
  { orgId, buId },
  values,
  setLoading,
  setter,
//   setAllData,
//   cb
) => {
  const payload = {
    accountId: orgId,
    businessUnitId: buId,
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
    partName: "AllEmployeeListWithFilter",
  };
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/AllEmployeeListWithFilter`,
      payload
    );
    const modifyData = res?.data.map((data) => {
      return {
        id: data?.intEmployeeBasicInfoId,
        ...data,
      };
    });
    setter(modifyData);
    // setAllData(modifyData);
    // cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
    // setAllData([]);
  }
};
