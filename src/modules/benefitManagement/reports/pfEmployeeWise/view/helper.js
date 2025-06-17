import axios from "axios";
import { toast } from "react-toastify";

export const getAssignedSalaryDetailsReportRDLC = async (
  partName,
  orgId,
  buId,
  wId,
  setLoading,
  setterData,
  fDate,
  tDate
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/PdfAndExcelReport/GetAssignedSalaryDetailsReport_Matador?strPartName=${partName}&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceId=${wId}&dteFromDate=${fDate}&dteToDate=${tDate}`
    );
    if (res?.data) {
      setterData?.(res?.data);
      //   cb?.(res?.data);
      setLoading?.(false);
    } else {
      toast.warn("No data received !");
      setLoading?.(false);
    }
  } catch (error) {
    setLoading?.(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const getMultipleDepartment = async (setLoading, wg, cb) => {
  setLoading?.(true);

  try {
    let url = `/SaasMasterData/GetDepartmentsByMultipleWorkplace?`;

    if (wg?.length) {
      url += wg
        .map((item, idx) => `${idx === 0 ? "" : "&"}workplaces=${item?.value}`)
        .join("");
    }
    const res = await axios.get(`${url}`);
    if (res?.data) {
      cb?.(res?.data);
      setLoading?.(false);
    } else {
      toast.warn("No data received !");
      setLoading?.(false);
    }
  } catch (error) {
    setLoading?.(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
