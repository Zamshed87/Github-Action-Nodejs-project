import { useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { downloadFile } from "utility/downloadFile";

const useBankSalaryReport = ({ form }) => {
  const [reportData, getReportData, loadingReportData, setReportData] =
    useAxiosGet({});
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const fetchReportData = () => {
    const { WorkplaceGroupId, Year, Month, ReportTypeId } =
      form?.getFieldsValue(true);
    getReportData(
      `/Payroll/BankSalaryReport?WorkplaceGroupId=${WorkplaceGroupId}&Year=${Year}&Month=${Month}&ReportTypeId=${ReportTypeId}`,
      (res) => {
        setReportData(res);
      }
    );
  };
  const downloadExcel = () => {
    const url = `/PdfAndExcelReport/PMS/YearlyPerformanceReportExcel`;
    downloadFile(url, `YearlyPerformanceReport`, "xlsx", setLoadingExcel);
  };
  const downloadPdf = () => {
    const url = `/PdfAndExcelReport/PMS/YearlyPerformanceReportExcel`;
    downloadFile(url, `YearlyPerformanceReport`, "xlsx", setLoadingPdf);
  };

  return {
    reportData,
    fetchReportData,
    loadingReportData,
    downloadExcel,
    loadingExcel,
    downloadPdf,
    loadingPdf,
  };
};

export default useBankSalaryReport;
