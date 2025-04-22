import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import { DataTable, PCard, PCardBody, PCardHeader, PForm } from "Components";
import { Form, Table } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import YearlySalaryReportFilters from "./components/filter/YearlySalaryReportFilters";
import { getHeader } from "./components/helper";
import useYearlySalaryReport from "./hooks/useYearlySalaryReport";
import NoResult from "common/NoResult";

const YearlySalaryReport = () => {
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
  } = useYearlySalaryReport({ form });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Yearly Salary Report";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let permission = null;

  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30580) {
      permission = item;
    }
  });
  return permission?.isView ? (
      <PForm
        form={form}
        initialValues={{
          workplace: { label: "All", value: 0 },
          department: { label: "All", value: 0 },
          section: { label: "All", value: 0 },
          hrPosition: { label: "All", value: 0 },
          designation: { label: "All", value: 0 },
        }}
        onFinish={() => {
          fetchReportData();
        }}
      >
        {(loadingReportData || loadingExcel) && <Loading />}
        <PCard>
          <PCardHeader
            title={`Yearly Salary Report`}
            exportIcon
            onExport={() => {
              downloadExcel();
            }}
          />
          <PCardBody className="mb-3">
            <YearlySalaryReportFilters form={form} />
          </PCardBody>
          {reportData?.reportType ? (
            <DataTable
              header={getHeader(
                reportData?.reportType,
                reportData?.headers,
                pages
              )}
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
              scroll={{ x: "3200px" }}
              summary={() => (
                <Table.Summary.Row>
                  {/* Fixed Base Columns */}
                  <Table.Summary.Cell colSpan={5} align="center" index={0}>
                    Total Amount
                  </Table.Summary.Cell>
                  {reportData?.total?.monthlyData?.map((month) => {
                    return (
                      <React.Fragment key={month.title}>
                        {month.details.map((detail) => (
                          <Table.Summary.Cell
                            key={`${month.title}-${detail.title}`}
                            align="center"
                          >
                            {detail.amount ?? "-"}
                          </Table.Summary.Cell>
                        ))}
                        <Table.Summary.Cell
                          key={`${month.title}-total`}
                          align="center"
                        >
                          {month.totalAmount ?? "-"}
                        </Table.Summary.Cell>
                      </React.Fragment>
                    );
                  })}
                  {(() => {
                    const maxMonths = 12; // max months
                    const currentMonths =
                      reportData?.total?.monthlyData?.length || 0;
                    const missingMonths = maxMonths - currentMonths;
                    const cellsToPad = missingMonths * 4; // 3 details + 1 total per month

                    return Array.from({ length: cellsToPad }).map((_, idx) => (
                      <Table.Summary.Cell key={`pad-${idx}`} align="center">
                        -
                      </Table.Summary.Cell>
                    ));
                  })()}
                  <Table.Summary.Cell align="center">
                    {reportData?.total?.totalAmount}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          ) : (
            <NoResult title="No Result Found" para="" />
          )}
        </PCard>
      </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default YearlySalaryReport;
