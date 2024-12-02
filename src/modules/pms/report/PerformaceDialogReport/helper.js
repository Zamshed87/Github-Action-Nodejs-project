import axios from "axios";
import { toast } from "react-toastify";
// import { erpBaseUrl } from "../../../../common/ErpBaseUrl";

export const getYearDDL = async (accId, setYearDDl, buId) => {
  try {
    const res = await axios.get(
      `/pms/CommonDDL/YearDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.data) {
      setYearDDl && setYearDDl(res?.data);
    }
  } catch (e) {
    console.log(e);
    return toast.error(
      e?.response?.message ||
        e?.response?.data.message ||
        e?.message ||
        "Something went wrong"
    );
  }
};

export const quaterDDL = [
  { value: 1, label: "Q1" },
  { value: 2, label: "Q2" },
  { value: 3, label: "Q3" },
  { value: 4, label: "Q4" },
];

export const getPerformanceDialogReport = async (
  reportTypeId,
  reportTypeName,
  yearId,
  quarterId,
  employeeId,
  buId,
  setLoading,
  setRowDto
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/pms/PerformanceMgmt/PerformanceDialogueReport?ReportTypeId=${reportTypeId}&ReportTypeName=${reportTypeName}&YearId=${yearId}&QuarterId=${quarterId}&EmployeeId=${employeeId}&BusinessUnitId=${buId}`
    );
    setLoading && setLoading(false);
    if (res?.data) {
      setRowDto && setRowDto(res?.data);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
