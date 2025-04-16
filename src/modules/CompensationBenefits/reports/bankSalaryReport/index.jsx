import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import { PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form } from "antd";
import useBankSalaryReport from "./hooks/useBankSalaryReport";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import BankSalaryReportFilters from "./components/filter/BankSalaryReportFilters";
import ReportLanding from "./components";

const BankSalaryReport = () => {
  const [form] = Form.useForm();
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();

  const {
    reportData,
    fetchReportData,
    loadingReportData,
    downloadExcel,
    loadingExcel,
    downloadPdf,
    loadingPdf,
  } = useBankSalaryReport({ form });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30579) {
      permission = item;
    }
  });

  return permission?.isView ? (
    <>
      <PForm
        form={form}
        onFinish={() => {
          fetchReportData();
        }}
      >
        {(loadingReportData || loadingExcel || loadingPdf) && <Loading />}
        <PCard>
          <PCardHeader
            title={`Bank Salary Report.`}
            exportIcon
            onExport={() => {
              downloadExcel();
            }}
            printIcon
            pdfExport={() => {
              downloadPdf();
            }}
          />
          <PCardBody className="mb-3">
            <BankSalaryReportFilters form={form} />
            <ReportLanding data={reportData} />
          </PCardBody>
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default BankSalaryReport;
