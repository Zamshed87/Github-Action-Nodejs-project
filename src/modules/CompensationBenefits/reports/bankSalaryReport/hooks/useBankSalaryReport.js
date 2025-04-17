import { useState } from "react";
import { toast } from "react-toastify";
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
      `/PdfAndExcelReport/Payroll/BankSalaryReport?WorkplaceGroupId=${WorkplaceGroupId}&Year=${Year}&Month=${Month}&ReportTypeId=${ReportTypeId}`,
      (res) => {
        setReportData(res);
      }
    );
  };
  const downloadExcel = async () => {
    try {
      const { WorkplaceGroupId, ReportTypeId } = await form.validateFields(); // validate first
      const { Year, Month } = form?.getFieldsValue(true);
      
      const url = `/PdfAndExcelReport/Payroll/BankSalaryReportExcel?WorkplaceGroupId=${WorkplaceGroupId}&Year=${Year}&Month=${Month}&ReportTypeId=${ReportTypeId}`;
      downloadFile(url, `BankSalaryReport`, "xlsx", setLoadingExcel);
    } catch (error) {
      // Validation failed — do nothing or show a toast if needed
      toast.error("Please Select the required fields.");
    }
  };

  const downloadPdf = async () => {
    try {
      const { WorkplaceGroupId, ReportTypeId } = await form.validateFields(); // validate first
      const { Year, Month } = form?.getFieldsValue(true);

      const url = `/PdfAndExcelReport/Payroll/BankSalaryReportPdf?WorkplaceGroupId=${WorkplaceGroupId}&Year=${Year}&Month=${Month}&ReportTypeId=${ReportTypeId}`;
      downloadFile(url, `BankSalaryReport`, "pdf", setLoadingPdf);
    } catch (error) {
      toast.error("Please Select the required fields.");
    }
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
