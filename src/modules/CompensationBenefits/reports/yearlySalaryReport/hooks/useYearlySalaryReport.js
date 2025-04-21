import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { downloadFile } from "utility/downloadFile";

const formatPayload = (formValues) => {
  return {
    YearType: formValues.yearType?.value,
    Year: formValues.year?.value,
    ReportTypeId: formValues.reportType?.value,
    WorkplaceGroupId: formValues.workplaceGroup?.value,
    WorkplaceId: formValues.workplace?.value,
    DepartmentId: formValues.department?.value,
    SectionId: formValues.section?.value,
    HRPosDesigId:
      formValues.reportType?.value == 0
        ? formValues.hrPosition?.value
        : formValues.designation?.value,
  }
}
const buildQueryParams = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
};
const useYearlySalaryReport = ({ form }) => {
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [reportData, getReportData, loadingReportData, setReportData] =
    useAxiosGet({});
  const [loadingExcel, setLoadingExcel] = useState(false);

  const fetchReportData = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = formatPayload(formValues)

    const filteredParams = buildQueryParams(formattedParams)

    const url = `/Payroll/YearlySalaryReport?${filteredParams}`;

    getReportData(url, (res) => {
      setReportData(res);
    });
  };
  const downloadExcel = async () => {
    try {
      await form.validateFields(); // validate first
      const formValues = form?.getFieldsValue(true);

      const formattedParams = formatPayload(formValues)

      const filteredParams = buildQueryParams(formattedParams)

      const url = `/PdfAndExcelReport/Payroll/YearlySalaryReportExcel?${filteredParams}`;
      downloadFile(url, `YearlySalaryReport`, "xlsx", setLoadingExcel);
    } catch (error) {
      // Validation failed — do nothing or show a toast if needed
      toast.error("Please Select the required fields.");
    }
  };

  return {
    pages,
    setPages,
    reportData,
    fetchReportData,
    loadingReportData,
    downloadExcel,
    loadingExcel,
  };
};

export default useYearlySalaryReport;
