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
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag, Tooltip } from "antd";
import { getBuDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
// import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
import { empBasicInfo } from "modules/timeSheet/reports/helper";
import {
  createJobCardExcelHandler,
  custom26to25LandingDataHandler,
} from "./utils";
import { getPDFAction } from "utility/downloadFile";
import AttendanceStatus from "common/AttendanceStatus";
import { PModal } from "Components/Modal";
import DownloadAllJobCard from "./DownloadAllJobCard";
// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";

const EmployeeJobCard = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName, userName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 137),
    []
  );
  // menu permission
  const employeeFeature: any = permission;
  const CommonEmployeeDDL = useApiRequest([]);
  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [buDetails, setBuDetails] = useState({});
  const [empInfo, setEmpInfo] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [empActivity, setEmpActivity] = useState<any>({});
  const [attendanceInfo, setAttendanceInfo] = useState<any>([]);

  // Form Instance
  const [form] = Form.useForm();

  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Job Card";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "JobCardLandingNPDF",
      method: "GET",
      params: {
        accountId: orgId,
        workplaceId: 0,
        businessUnitId:buId,
        employeeId: values?.employee?.value,
        isForPdf: false,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      },
      onSuccess: (res) => {
        setEmpActivity(res[0]?.attendanceSummaryInformation);
        setAttendanceInfo(res[0]?.attendanceInformation);
      },
    });
  };
  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();
    const values = form.getFieldsValue(true);

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDLForActiveInactive",
      method: "GET",
      params: {
        workplaceGroupId: wgId,
        searchText: value,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  useEffect(() => {
    // getWorkplaceGroup();
    empBasicInfo(buId, orgId, employeeId, setEmpInfo);

    landingApiCall();
    getBuDetails(buId, setBuDetails, setLoading);
  }, []);
  //   table column
  const header: any = () => {
    return [
      {
        title: "SL",
        render: (_: any, rec: any, index: number) => index + 1,
        width: 35,
        align: "center",
      },
      {
        title: "Attendance Date",
        dataIndex: "attendanceDate",
        render: (date: any) => moment(date).format("DD MMM, YYYY (ddd)"),
        width: 120,
      },
      {
        title: "In-Time",
        dataIndex: "inTime",
        width: 80,
      },
      {
        title: "Out-Time",
        dataIndex: "outTime",
        width: 80,
      },
      {
        title: "Late Min",
        dataIndex: "lateMin",
        width: 80,
      },
      {
        title: "Start Time",
        dataIndex: "startTime",
        width: 80,
      },
      {
        title: "Break Start",
        dataIndex: "breakStartTime",
        width: 80,
      },
      {
        title: "Break End",
        dataIndex: "breakEndTime",
        width: 80,
      },
      {
        title: "End Time",
        dataIndex: "endTime",
        width: 80,
      },

      {
        title: "Early Out",
        dataIndex: "earlyOut",

        width: 75,
      },
      {
        title: "Total Working Hours",
        dataIndex: "totalWorkingHour",

        width: 100,
      },
      {
        title: "Over Time",
        dataIndex: "overTime",
        width: 75,
      },
      {
        title: "Calendar Name",
        dataIndex: "calenderName",
        width: 200,
      },
      {
        title: "Attendance Status",
        render: (_: any, record: any) => (
          <AttendanceStatus status={record?.attendanceStatus} />
        ),
        width: 150,
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        width: 120,
      },
    ];
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          employee: { value: employeeId, label: userName },
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate()),
        }}
        onFinish={() => {
          landingApiCall();
        }}
      >
        <PCard>
          {(loading || landingApi?.loading) && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${attendanceInfo?.length || 0} results`}
            buttonList={[
              {
                type: "primary",
                content: "Download all",
                onClick: () => {
                  setOpen(true);
                },
                info: {
                  isInfo: true,
                  infoTitle:
                    "Download all Employee job card for the current workplace for given date range",
                },
              },
            ]}
            onExport={() => {
              createJobCardExcelHandler({
                BuDetails: buDetails,
                buName,
                rowDto: attendanceInfo,
                empInfo,
                empActivity,
              });
            }}
            printIcon={true}
            pdfExport={() => {
              const values = form.getFieldsValue(true);
              const url = `/PdfAndExcelReport/GetJobCardAllReports?accountId=${orgId}&workplaceId=0&employeeId=${
                values?.employee?.value
              }&fromDate=${moment(values?.fromDate).format(
                "YYYY-MM-DD"
              )}&toDate=${moment(values?.toDate).format(
                "YYYY-MM-DD"
              )}&isForPdf=true
`;
              getPDFAction(url, setLoading);
            }}
          />
          <PCardBody className="">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  name="employee"
                  label="Employee"
                  placeholder="Search Min 2 char"
                  options={CommonEmployeeDDL?.data || []}
                  loading={CommonEmployeeDDL?.loading}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      employee: op,
                    });
                    empBasicInfo(buId, orgId, value, setEmpInfo, setLoading);
                  }}
                  onSearch={(value) => {
                    getEmployee(value);
                  }}
                  showSearch
                  filterOption={false}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="From Date"
                  placeholder="From Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="To Date"
                  placeholder="To Date"
                  disabledDate={disabledDate}
                  onChange={(value) => {
                    form.setFieldsValue({
                      toDate: value,
                    });
                  }}
                />
              </Col>

              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton
                  type="primary"
                  action="submit"
                  content="View"
                  disabled={loading || landingApi?.loading}
                />
              </Col>
              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <Tooltip
                  title="Previous Month 26 to Current Month 25"
                  placement="bottom"
                >
                  <PButton
                    type="primary"
                    action="button"
                    content="Custom [26 - 25]"
                    disabled={loading || landingApi?.loading}
                    onClick={() => {
                      // custom26to25LandingDataHandler(
                      //   (previousMonthDate: any, currentMonthDate: any) => {
                      //     form.setFieldsValue({
                      //       fromDate: moment(previousMonthDate),
                      //       toDate: moment(currentMonthDate),
                      //     });
                      //     landingApiCall();
                      //   }
                      // );
                      const { fromDate } = form.getFieldsValue(true);
                      custom26to25LandingDataHandler(
                        fromDate,
                        (
                          previousMonthStartDate: any,
                          currentMonthEndDate: any
                        ) => {
                          form.setFieldsValue({
                            fromDate: moment(previousMonthStartDate),
                            toDate: moment(currentMonthEndDate),
                          });

                          landingApiCall();
                        }
                      );
                    }}
                  />
                </Tooltip>
              </Col>
            </Row>
          </PCardBody>
          <Form.Item shouldUpdate noStyle>
            {() => {
              return (
                <Row
                  className="mb-1"
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    borderRadius: "6px",
                    padding: "10px",
                    marginRight: "0",
                    marginLeft: "0",
                    marginTop: "15px",
                  }}
                >
                  <Col
                    md={6}
                    sm={12}
                    xs={24}
                    style={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <div
                      className="card-des"
                      style={{
                        fontSize: "17px",
                      }}
                    >
                      <p>
                        Employee:{" "}
                        <strong>
                          {empInfo?.[0]?.EmployeeName} -
                          {empInfo?.[0]?.EmployeeCode}
                        </strong>{" "}
                      </p>
                      <p>
                        Workplace Group:{" "}
                        <strong>{empInfo?.[0]?.WorkplaceGroupName}</strong>{" "}
                      </p>
                      <p>
                        Workplace Name:{" "}
                        <strong>{empInfo?.[0]?.WorkplaceName}</strong>{" "}
                      </p>
                    </div>
                  </Col>
                  <Col
                    md={6}
                    sm={12}
                    xs={24}
                    style={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      paddingLeft: "10px",
                    }}
                  >
                    <div className="card-des" style={{}}>
                      <p>
                        HR Position:{" "}
                        <strong>{empInfo?.[0]?.PositionName}</strong>
                      </p>
                      {/* <p>
                            Business Unit:{" "}
                            <strong>{empInfo?.[0]?.BusinessUnitName}</strong>
                          </p> */}
                      <p>
                        Joining Date:{" "}
                        <strong>
                          {dateFormatter(empInfo?.[0]?.JoiningDate)}
                        </strong>
                      </p>
                      <p>
                        Active Status:{" "}
                        <Tag
                          style={{ borderRadius: "50px" }}
                          color={
                            empInfo?.[0]?.strEmployeeStatusWithDate
                              ?.toLowerCase()
                              ?.includes("inactive")
                              ? "red"
                              : "green"
                          }
                        >
                          {empInfo?.[0]?.strEmployeeStatusWithDate}
                        </Tag>
                      </p>
                    </div>
                  </Col>
                  <Col
                    md={6}
                    sm={12}
                    xs={24}
                    style={{
                      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      paddingLeft: "10px",
                    }}
                  >
                    <div
                      className="card-des"
                      style={{
                        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <p>
                        Designation:{" "}
                        <strong>{empInfo?.[0]?.DesignationName}</strong>
                      </p>
                      <p>
                        Department:{" "}
                        <strong>{empInfo?.[0]?.DepartmentName}</strong>{" "}
                      </p>
                      <p>
                        Section: <strong>{empInfo?.[0]?.SectionName}</strong>{" "}
                      </p>
                    </div>
                  </Col>
                  <Col
                    md={6}
                    sm={12}
                    xs={24}
                    style={{
                      paddingLeft: "10px",
                    }}
                  >
                    <div className="card-des">
                      <p>
                        Employment Type:{" "}
                        <strong>{empInfo?.[0]?.EmploymentTypeName}</strong>
                      </p>
                      <p>
                        {"Supervisor"}:{" "}
                        <strong>{empInfo?.[0]?.SupervisorName}</strong>
                      </p>
                    </div>
                  </Col>
                </Row>
              );
            }}
          </Form.Item>
          {attendanceInfo?.length > 0 ? (
            <Row
              className="mb-1"
              style={{
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: "6px",
                padding: "10px",
                marginRight: "0",
                marginLeft: "0",
                marginTop: "15px",
              }}
            >
              <Col
                md={8}
                sm={12}
                xs={24}
                style={{
                  borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                <div
                  className="card-des"
                  style={{
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    fontSize: "17px",
                  }}
                >
                  <p>
                    Total Present:{" "}
                    <strong>{empActivity?.totalPresent} Days</strong>{" "}
                  </p>
                  <p>
                    Total Manual Present:{" "}
                    <strong>{empActivity?.totalManualPresent} Days</strong>{" "}
                  </p>
                  <p>
                    Total Leave: :{" "}
                    <strong>{empActivity?.totalLeave} Days</strong>{" "}
                  </p>
                  <p>
                    Total Halfday Leave:{" "}
                    <strong>{empActivity?.totalHalfdayLeave}</strong>{" "}
                  </p>
                  <p>
                    Total Late Time:{" "}
                    <strong>{empActivity?.totalLateMin}</strong>{" "}
                  </p>
                </div>
              </Col>
              <Col
                md={8}
                sm={12}
                xs={24}
                style={{
                  borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                  paddingLeft: "10px",
                }}
              >
                <div
                  className="card-des"
                  style={{
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    fontSize: "17px",
                  }}
                >
                  <p>
                    Total Late: <strong>{empActivity?.totalLate} Days</strong>{" "}
                  </p>
                  <p>
                    Total Manual late:{" "}
                    <strong>{empActivity?.totalManualLate} Days</strong>{" "}
                  </p>
                  <p>
                    Total Absent:{" "}
                    <strong>{empActivity?.totalAbsent} Days</strong>{" "}
                  </p>
                  <p>
                    Total Manual Absent:{" "}
                    <strong>{empActivity?.totalManualAbsent} Days</strong>{" "}
                  </p>
                  <p>
                    Total Over Time:{" "}
                    <strong>{empActivity?.totalOvertime} Days</strong>{" "}
                  </p>
                </div>
              </Col>
              <Col
                md={8}
                sm={12}
                xs={24}
                style={{
                  paddingLeft: "10px",
                }}
              >
                <div
                  className="card-des"
                  style={{
                    // borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    fontSize: "17px",
                  }}
                >
                  <p>
                    Total Early Out:{" "}
                    <strong>{empActivity?.totalEarlyOut} Days</strong>{" "}
                  </p>
                  <p>
                    Total Early Out Time:{" "}
                    <strong>{empActivity?.totalEarlyOutMin}</strong>{" "}
                  </p>
                  <p>
                    Total Holiday:{" "}
                    <strong>{empActivity?.totalHoliday} Days</strong>{" "}
                  </p>
                  <p>
                    Total Movement:{" "}
                    <strong>{empActivity?.totalMovement} Days</strong>{" "}
                  </p>
                  <p>
                    Total Off day:{" "}
                    <strong>{empActivity?.totalOffday} Days</strong>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          ) : null}
          <DataTable
            bordered
            data={attendanceInfo?.length > 0 ? attendanceInfo : []}
            loading={landingApi?.loading}
            header={header()}
            // pagination={{
            //   pageSize: pages?.pageSize,
            //   total: landingApi?.data[0]?.totalCount,
            // }}
            // onChange={(pagination, filters, sorter, extra) => {
            //   // Return if sort function is called
            //   if (extra.action === "sort") return;
            //   setFilterList(filters);
            //   setPages({
            //     current: pagination.current,
            //     pageSize: pagination.pageSize,
            //     total: pagination.total,
            //   });
            //   landingApiCall({
            //     pagination,
            //   });
            // }}
          />
        </PCard>
      </PForm>
      <PModal
        open={open}
        title={"Download All Employee Job Card"}
        width=""
        onCancel={() => setOpen(false)}
        maskClosable={false}
        components={
          <>
            <DownloadAllJobCard propsObj={{ loading, setOpen, setLoading }} />
          </>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmployeeJobCard;
