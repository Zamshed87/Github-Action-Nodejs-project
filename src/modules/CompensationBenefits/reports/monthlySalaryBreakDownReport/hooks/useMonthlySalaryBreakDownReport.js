import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { downloadFile } from "utility/downloadFile";

const useMonthlySalaryBreakDownReport = ({ form }) => {
  const [pages, setPages] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const [reportData, getReportData, loadingReportData, setReportData] =
    useAxiosGet({});
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const fetchReportData = () => {
    const formValues = form?.getFieldsValue(true);

    const formattedParams = {
      WorkplaceGroupId: formValues.workplaceGroup?.value,
      WorkplaceId: formValues.workplace?.value,
      Year: formValues.Year,
      Month: formValues.Month,
    };

    const filteredParams = Object.entries(formattedParams)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/Payroll/MonthlySalaryBreakDownReport?${filteredParams}`;

    getReportData(url, (res) => {
      setReportData(res);
    });
  };

  const downloadExcel = async () => {
    try {
      const { workplaceGroup, workplace } = await form.validateFields(); // validate first
      const { Year, Month } = form?.getFieldsValue(true);

      const url = `/PdfAndExcelReport/Payroll/BankSalaryReportExcel?WorkplaceGroupId=${workplaceGroup?.value}&WorkplaceId=${workplace?.value}&Year=${Year}&Month=${Month}`;
      downloadFile(url, `BankSalaryReport`, "xlsx", setLoadingExcel);
    } catch (error) {
      // Validation failed — do nothing or show a toast if needed
      toast.error("Please Select the required fields.");
    }
  };

  const downloadPdf = async () => {
    try {
      const { workplaceGroup, workplace } = await form.validateFields(); // validate first
      const { Year, Month } = form?.getFieldsValue(true);

      const url = `/PdfAndExcelReport/Payroll/BankSalaryReportPdf?WorkplaceGroupId=${workplaceGroup?.value}&WorkplaceId=${workplace?.value}&Year=${Year}&Month=${Month}`;
      downloadFile(url, `BankSalaryReport`, "pdf", setLoadingPdf);
    } catch (error) {
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
    downloadPdf,
    loadingPdf
  };
};

export default useMonthlySalaryBreakDownReport;
