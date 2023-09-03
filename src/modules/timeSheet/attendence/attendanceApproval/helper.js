import axios from "axios";
import { toast } from "react-toastify";

// search
export const filterData = (keywords, gridData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newData = gridData?.filter((item) =>
      regex.test(item?.strEmployeeName?.toLowerCase())
    );
    setRowDto(newData);
  } catch {
    setRowDto([]);
  }
};

//advance filter
export const getAdvancedFilterAllDDL = async (
  businessUnitId,
  workplaceGroupId,
  deptId,
  desigId,
  supervisorId,
  setter
) => {
  try {
    const res = await axios.get(
      `/Employee/CombineDataSetByWorkplaceGDeptDesigSupEmpType?BusinessUnitId=${businessUnitId}&WorkplaceGroupId=${workplaceGroupId}&DeptId=${deptId}&DesigId=${desigId}&SupervisorId=${supervisorId}`
    );

    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// approval landing
export const getAttendanceApprovalLanding = async (
  payload,
  setter,
  setAllData,
  setLoading,
  setFilterLanding
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/ManualAttendanceLandingEngine`,
      payload
    );
    if (res?.data) {
      setter && setter(res?.data?.listData);
      setAllData && setAllData(res?.data?.listData);
      setFilterLanding?.(res?.data?.listData)
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// approvReject
export const approveAttendance = async (data, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/ManualAttendanceApprovalEngine`,
      data
    );
    toast.success(res?.data || "Submitted Successfully");
    res?.status === 200 && cb?.();
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
