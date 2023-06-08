import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";

export const getEmployeeProfileViewData = async (
  id,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${id}&businessUnitId=${buId}&workplaceGroupId=${wgId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    console.log(error.message);
    setLoading && setLoading(false);
  }
};

export const saveIOUApplication = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/IOUApplicationCreateEdit`, payload);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAllIOULanding = async (
  partType,
  buId,
  wgId,
  iouId,
  fromDate,
  toDate,
  search,
  docType,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  setLoading && setLoading(true);
  let searchTxt = search ? `&searchTxt=${search}` : "";
  let docTypeTxt = docType ? `&strDocFor=${docType}` : "";

  try {
    const res = await axios.get(
      `/Employee/GetAllIOULanding?strReportType=${partType}&intBusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intIOUId=${iouId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}${searchTxt}${docTypeTxt}`
    );
    if (res?.data) {
      const modfiedData = res?.data?.map((item, index) => ({
        ...item,
        sl: index + 1,
        strEmployeeCode: item?.employeeCode,
        dteApplicationDate: item.dteApplicationDate
          ? moment(item?.dteApplicationDate).format("DD MMM, yyyy")
          : "N/A",
        dteFromDate: item?.dteFromDate
          ? moment(item?.dteFromDate).format("DD MMM, yyyy")
          : "N/A",
        dteToDate: item?.dteToDate
          ? moment(item?.dteToDate).format("DD MMM, yyyy")
          : "N/A",
        AdjustmentStatus: item?.AdjustmentStatus || "",
        Status: item?.Status || "",
      }));
      setter(modfiedData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
