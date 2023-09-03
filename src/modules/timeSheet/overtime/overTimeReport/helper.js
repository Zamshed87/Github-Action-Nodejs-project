import axios from "axios";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    if (!keywords) {
      setRowDto(allData);
      return;
    }
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.employee?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (e) {
    setRowDto([]);
  }
};

export const getOvertimeReportLanding = async (
  partType,
  buId,
  workplaceGroupId,
  deptId,
  desigId,
  employeeId,
  formDate,
  toDate,
  setAllData,
  setter,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/OvertimeReportLanding?PartType=${partType}&BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&WorkplaceId=0&DepartmentId=${deptId}&DesignationId=${desigId}&EmployeeId=${employeeId}&FromDate=${formDate}&ToDate=${toDate}`
    );
    cb && cb();
    if (res?.data) {
      setAllData && setAllData(res.data);
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
