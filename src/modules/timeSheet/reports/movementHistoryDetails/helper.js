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
