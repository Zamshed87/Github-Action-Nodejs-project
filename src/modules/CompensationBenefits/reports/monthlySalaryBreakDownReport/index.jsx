import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form, Table } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { getHeader } from "./components/helper";
import useMonthlySalaryBreakDownReport from "./hooks/useMonthlySalaryBreakDownReport";
import MonthlySalaryBreakDownReportFilters from "./components/filter/MonthlySalaryBreakDownReportFilters";
import NoResult from "common/NoResult";

const MonthlySalaryBreakDownReport = () => {
  const [form] = Form.useForm();
  const { permissionList } = useSelector((store) => store?.auth, shallowEqual);
  const dispatch = useDispatch();

  const {
    pages,
    setPages,
    reportData,
    fetchReportData,
    loadingReportData,
    downloadExcel,
    loadingExcel,
    downloadPdf,
    loadingPdf,
  } = useMonthlySalaryBreakDownReport({ form });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Monthly Salary Break Down Report";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;

  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30581) {
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
            title={`Monthly Salary Break Down Report.`}
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
            <MonthlySalaryBreakDownReportFilters form={form} />
          </PCardBody>
          {reportData?.details?.[0] ? (
            <DataTable
              header={getHeader(reportData?.details?.[0], pages)}
              bordered
              data={reportData?.details}
              loading={loadingReportData}
              // pagination={{
              //   pageSize: reportData?.pageSize,
              //   total: reportData?.totalCount,
              //   pageSizeOptions: ["25", "50", "100"],
              // }}
              onChange={(pagination, _, __, extra) => {
                if (extra.action === "paginate") {
                  fetchReportData();
                  setPages(pagination);
                }
              }}
              scroll={{ x: "3000px" }}
              summary={() => (
                <Table.Summary.Row>
                  {/* Fixed Base Columns */}
                  <Table.Summary.Cell colSpan={2} align="center" index={0}>
                    Total
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="center">
                    {reportData?.total?.manpower ?? "-"}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="center">
                    {reportData?.total?.manHour ?? "-"}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="center">
                    {reportData?.total?.grossSalary ?? "-"}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="center">
                    {reportData?.total?.overtime ?? "-"}
                  </Table.Summary.Cell>
                  {(reportData?.total?.allowanceDetail ?? []).map((item) => (
                    <Table.Summary.Cell
                      key={`allowance-${item.title}`}
                      align="center"
                    >
                      {item.amount ?? "-"}
                    </Table.Summary.Cell>
                  ))}
                  <Table.Summary.Cell align="center">
                    {reportData?.total?.allowanceTotal ?? "-"}
                  </Table.Summary.Cell>

                  {(reportData?.total?.deductionDetail ?? []).map((item) => (
                    <Table.Summary.Cell
                      key={`deduction-${item.title}`}
                      align="center"
                    >
                      {item.amount ?? "-"}
                    </Table.Summary.Cell>
                  ))}
                  <Table.Summary.Cell align="center">
                    {reportData?.total?.deductionTotal ?? "-"}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell align="center">
                    {reportData?.total?.netpayAmount ?? "-"}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          ) : (
            <NoResult title="No Result Found" para="" />
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default MonthlySalaryBreakDownReport;
