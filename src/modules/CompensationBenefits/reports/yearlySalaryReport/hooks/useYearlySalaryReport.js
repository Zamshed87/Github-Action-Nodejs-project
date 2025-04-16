import { useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { downloadFile } from "utility/downloadFile";

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

    const formattedParams = {
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
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/Payroll/YearlySalaryReport?${filteredParams}`;

    getReportData(url, (res) => {
      setReportData(res);
    });
  };

  const downloadExcel = () => {
    const url = `/PdfAndExcelReport/PMS/YearlyPerformanceReportExcel`;
    downloadFile(url, `YearlyPerformanceReport`, "xlsx", setLoadingExcel);
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
