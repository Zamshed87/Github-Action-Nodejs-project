/* eslint-disable @typescript-eslint/no-empty-function */
import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { currentYear } from "modules/CompensationBenefits/reports/salaryReport/helper";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { getCurrentMonthName } from "utility/monthIdToMonthName";
import { todayDate } from "utility/todayDate";
import {
  attendanceSummaryReportColumn,
  calculateSummaryObj,
  excelHeadAttandanceSummaryDataForExcel,
  generateAttandanceSummaryDataForExcel,
  generateSubTableDataForExcel,
  summaryHeaders,
} from "./helper";

const AttendanceSummeryReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId, wgId, employeeId, buName, wgName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30422),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApiTable = useApiRequest({});
  const landingApiSummary = useApiRequest({});
  //   const debounce = useDebounce();

  const [excelLoading, setExcelLoading] = useState(false);
  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Attendance Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "WorkplaceGroupWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        empId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);
    landingApiTable.action({
      urlKey: "EmployeeMasterAttendanceReport",
      method: "GET",
      params: {
        typeId: 1,
        WorkPlaceGroupId: values?.workplaceGroup?.value,
        Tdate: moment(values?.toDate).format("YYYY-MM-DD"),
      },
    });
  };
  const landingSummaryAPICall = () => {
    const values = form.getFieldsValue(true);
    landingApiSummary.action({
      urlKey: "EmployeeMasterAttendanceReport",
      method: "GET",
      params: {
        typeId: 2,
        WorkPlaceGroupId: values?.workplaceGroup?.value,
        Tdate: moment(values?.toDate).format("YYYY-MM-DD"),
      },
    });
  };

  useEffect(() => {
    landingSummaryAPICall();
    landingApiCall();
    getWorkplaceGroup();
  }, []);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          toDate: moment(todayDate()),
          workplaceGroup: {
            label: wgName,
            value: wgId,
          },
        }}
        onFinish={() => {
          landingApiCall();
          landingSummaryAPICall();
        }}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApiSummary?.data?.length || 0} workplace`}
            onExport={() => {
              if (
                !landingApiSummary?.data?.length ||
                !landingApiTable?.data?.length
              ) {
                return toast.warn("No data found to export");
              }
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const values = form.getFieldsValue(true);
                  createCommonExcelFile({
                    titleWithDate: `Attendance Summary Report ${getCurrentMonthName()}-${currentYear()}`,
                    fromDate: "",
                    toDate: "",
                    buAddress: values?.workplaceGroup?.label,
                    businessUnit: buName,
                    tableHeader: excelHeadAttandanceSummaryDataForExcel,
                    getTableData: () =>
                      generateAttandanceSummaryDataForExcel(
                        landingApiTable?.data
                      ),
                    getSubTableData: () =>
                      generateSubTableDataForExcel(landingApiSummary?.data),
                    subHeaderInfoArr: [],
                    subHeaderColumn: {
                      strWorkplace: "Concern",
                      TotapEmp: "Total Employee",
                      IntPresent: "Present",
                      IntAbsent: "Absent",
                      IntAbsentPercentage: "Absent %",
                    },
                    tableFooter: [],
                    extraInfo: {},
                    tableHeadFontSize: 10,
                    widthList: {
                      A: 30,
                      B: 20,
                      C: 30,
                      D: 30,
                      E: 25,
                      F: 20,
                      G: 25,
                      H: 25,
                      I: 25,
                    },
                    commonCellRange: "A1:I1",
                    CellAlignment: "left",
                    multiSubtable: true,
                  });

                  setExcelLoading(false);
                } catch (error: any) {
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                }
              };
              excelLanding();
            }}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="Date"
                  placeholder="To Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>

              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                    });
                  }}
                />
              </Col>

              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col>
            </Row>
          </PCardBody>
          <h4 className="mb-2">Attendance Summary By Workplace</h4>
          {landingApiSummary?.data?.length > 0 && (
            <DataTable
              bordered
              data={
                [
                  ...landingApiSummary?.data,
                  calculateSummaryObj(landingApiSummary?.data),
                ] || []
              }
              loading={landingApiSummary?.loading}
              header={summaryHeaders()}
              wrapperClassName="mb-3"
            />
          )}

          <h4 className="mb-2">Attendance Summary By Department</h4>
          {landingApiTable?.data?.length > 0 && (
            <DataTable
              bordered
              data={landingApiTable?.data || []}
              loading={landingApiTable?.loading}
              header={attendanceSummaryReportColumn}
            />
          )}
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default AttendanceSummeryReport;
