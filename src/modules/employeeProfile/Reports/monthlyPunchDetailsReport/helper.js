import axios from "axios";
import { toast } from "react-toastify";
import { monthFirstDate } from "../../../../utility/dateFormatter";
import { todayDate } from "../../../../utility/todayDate";

export const getMonthlyPunchDetailsReport = async (
  empId,
  orgId,
  values,
  setter,
  setLoading,
  setTableRowDto,
  buId,
  wgId,
  wId
) => {
  try {
    setLoading && setLoading(true);
    const res = await axios.get(
      `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_in_out_attendance_report_for_all_employee&AccountId=${orgId}&DteFromDate=${
        values?.fromDate || monthFirstDate()
      }&DteToDate=${
        values?.toDate || todayDate()
      }&EmployeeId=${empId}&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}`
    );
    setter(res?.data);
    setTableRowDto?.(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

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
