import axios from "axios";
import { toast } from "react-toastify";

export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const getTypeWiseLeaveReport = async (
  wgId,
  buId,
  setter,
  values,
  setLoading
) => {
  setLoading && setLoading(true);
  console.log("values", values);

  const leaveList = values?.leaveType?.map((leave) => leave.value).join(",");

  try {
    let apiUrl = `/LeaveMovement/TypeWiseLeaveReport?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&EmployeeId=${
      values?.employeeName?.value || 0
    }&LeaveTypeId=${leaveList || 0}&YearId=${values?.year?.value || 0}`;

    const res = await axios.get(apiUrl);

    setter && setter?.(res?.data);

    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
