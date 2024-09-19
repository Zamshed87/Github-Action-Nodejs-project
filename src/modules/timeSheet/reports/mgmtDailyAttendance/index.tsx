import {
  Avatar,
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
import { getSerial } from "Utils";
import { Col, Form, Row, Tooltip, Typography } from "antd";
import { getWorkplaceDetails } from "common/api";
import { paginationSize } from "common/peopleDeskTable";
import { MdLocalPrintshop } from "react-icons/md";

import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { gray500 } from "utility/customColor";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { convertTo12HourFormat } from "utility/timeFormatter";
import { todayDate } from "utility/todayDate";
import {
  column,
  getTableDataDailyAttendance,
  getTableDataSummaryHeadData,
  subHeaderColumn,
} from "./helper";
import { getPDFAction } from "utility/downloadFile";
import { isDevServer } from "App";
import { dateFormatter } from "utility/dateFormatter";
import moment from "moment";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { debounce } from "lodash";
import { MdFileDownload } from "react-icons/md";

const MgmtDailyAttendance = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName, wgName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30327),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});

  const [filters, setFilterList] = useState<any>({});
  const [buDetails, setBuDetails] = useState({});
  const [, setLoading] = useState({});

  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Daily Attendance Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // workplace wise
  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId, // This should be removed
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  type TLandingApi = {
    pagination?: {
      current?: number;
      pageSize?: number;
    };
    filerList?: any;
    searchText?: string;
    excelDownload?: boolean;
    IsForXl?: boolean;
    date?: string;
  };
  const landingApiCall = ({
    pagination = { current: 1, pageSize: paginationSize },
    filerList,
    searchText = "",
    IsForXl = false,
    date = todayDate(),
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    const workplaceList = values?.workplace?.length
      ? values.workplace.map((item: any) => item.intWorkplaceId).join(",")
      : "";

    const payload = {
      intBusinessUnitId: buId,
      intWorkplaceGroupId: values?.workplaceGroup?.value || 0,
      // intWorkplaceId: values?.workplace?.value || 0,
      workplaceList: workplaceList || "",
      pageNo: pagination?.current,
      pageSize: pagination?.pageSize,
      isPaginated: true,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      isXls: IsForXl || false,
      attendanceDate: moment(values?.date).format("YYYY-MM-DD") || date,

      departmentList: filerList?.department || [],
      calenderList: filerList?.calender || [],
      actualStatusList: filerList?.actualStatus || [],
      designationList: filerList?.designation || [],
      hrPositionList: filerList?.hrPosition || [],
      manualStatusList: filerList?.manualStatus || [],
      sectionList: filerList?.section || [],
    };
    landingApi.action({
      urlKey: "GetDateWiseAttendanceReport",
      method: "POST",
      payload: payload,
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  }, []);
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: landingApi?.data?.currentPage,
          pageSize: landingApi?.data?.pageSize,
          index,
        }),
      fixed: "left",
      width: 15,
      align: "center",
    },

    {
      title: "Work. Group/Location",
      dataIndex: "workplaceGroup",
      width: 60,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplace",
      width: 60,
      fixed: "left",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 55,
      fixed: "left",
    },

    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.employeeName} />
            <span className="ml-2">{rec?.employeeName}</span>
          </div>
        );
      },
      sorter: true,
      fixed: "left",
      width: 70,
    },

    {
      title: "Designation",
      dataIndex: "designation",
      sorter: true,
      filter: true,
      filterKey: "designationList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      filter: true,
      filterKey: "departmentList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: true,
      filter: true,
      filterKey: "sectionList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      sorter: true,
      filter: true,
      filterKey: "hrPositionList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      width: 55,
    },
    {
      title: "Calendar Name",
      dataIndex: "calender",
      sorter: true,
      filter: true,
      filterKey: "calenderList",
      filterSearch: true,
      width: 70,
    },

    {
      title: "In Time",
      dataIndex: "inTime",
      render: (_: any, rec: any) => {
        return rec?.inTime ? convertTo12HourFormat(rec?.inTime) : "N/A";
      },
      width: 35,
    },
    {
      title: "Out Time",
      dataIndex: "outTime",
      render: (_: any, rec: any) => {
        return rec?.outTime ? convertTo12HourFormat(rec?.outTime) : "N/A";
      },
      width: 35,
    },
    {
      title: "Duration",
      dataIndex: "dutyHours",
      render: (_: any, rec: any) => rec?.dutyHours,
      width: 35,
    },
    {
      title: "Status",
      dataIndex: "actualStatus",
      filter: true,
      filterKey: "actualStatusList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Manual Status",
      dataIndex: "manualStatus",
      filter: true,
      filterKey: "manualStatusList",
      filterSearch: true,
      width: 50,
    },
    {
      title: "Address",
      dataIndex: "location",

      width: 35,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",

      width: 35,
    },
  ];
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          date: moment(todayDate()),
          workplaceGroup: { value: wgId, label: wgName },
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: landingApi?.data?.currentPage,
              pageSize: landingApi?.data?.pageSize,
            },
          });
        }}
      >
        <PCard>
          <PCardHeader
            title="Daily Attendance Report"
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
          ></PCardHeader>
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={5} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="date"
                  label="Date"
                  placeholder="Date"
                  rules={[
                    {
                      required: true,
                      message: "Date is required",
                    },
                  ]}
                  onChange={(value) => {
                    form.setFieldsValue({
                      date: value,
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
                    getWorkplace();
                  }}
                  rules={
                    [
                      //   { required: true, message: "Workplace Group is required" },
                    ]
                  }
                />
              </Col>
              <Col md={8} sm={12} xs={24}>
                <PSelect
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  mode="multiple"
                  maxTagCount={"responsive"}
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                    });
                    getWorkplaceDetails(value, setBuDetails);
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
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
          <div className="d-flex justify-content-between">
            <div>
              <h2
                style={{
                  color: gray500,
                  fontSize: "14px",
                  margin: "5px 0px 10px 0px",
                }}
              >
                Daily Attendance Report
              </h2>
            </div>

            <div>
              <ul className="d-flex flex-wrap">
                {landingApi?.data?.data?.length > 0 && (
                  <>
                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const { date, workplace, workplaceGroup } =
                          form.getFieldsValue();
                        return (
                          <>
                            <li className="pr-2">
                              <Tooltip placement="bottom" title="Export CSV">
                                <MdFileDownload
                                  style={{
                                    color: "#101828",
                                    width: "25px",
                                    height: "25px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const excelLanding = async () => {
                                      try {
                                        if (
                                          landingApi?.data?.data?.length > 0
                                        ) {
                                          const newData =
                                            landingApi?.data?.data?.map(
                                              (item: any, index: any) => {
                                                return {
                                                  ...item,
                                                  sl: index + 1,
                                                };
                                              }
                                            );
                                          // const date = todayDate();

                                          createCommonExcelFile({
                                            titleWithDate: `Daily Attendance ${dateFormatter(
                                              date
                                            )} `,
                                            fromDate: "",
                                            toDate: "",
                                            buAddress: (buDetails as any)
                                              ?.strAddress,
                                            businessUnit: workplaceGroup?.value
                                              ? (buDetails as any)?.strWorkplace
                                              : buName,
                                            tableHeader: column,
                                            getTableData: () =>
                                              getTableDataDailyAttendance(
                                                newData,
                                                Object.keys(column)
                                              ),
                                            getSubTableData: () =>
                                              getTableDataSummaryHeadData(
                                                landingApi?.data
                                              ),
                                            subHeaderInfoArr: [
                                              landingApi?.data?.workplaceGroup
                                                ? `Workplace Group-${landingApi?.data?.data[0]?.workplaceGroup}`
                                                : "",
                                              landingApi?.data?.workplace
                                                ? `Workplace-${landingApi?.data?.data[0]?.workplace}`
                                                : "",
                                            ],
                                            subHeaderColumn,
                                            tableFooter: [],
                                            extraInfo: {},
                                            tableHeadFontSize: 10,
                                            widthList: {
                                              B: 30,
                                              C: 30,
                                              D: 15,
                                              E: 25,
                                              F: 20,
                                              G: 25,
                                              H: 15,
                                              I: 15,
                                              J: 20,
                                              K: 20,
                                            },
                                            commonCellRange: "A1:J1",
                                            CellAlignment: "left",
                                          });
                                        } else {
                                          toast.warn("Empty Employee Data");
                                        }
                                      } catch (error) {
                                        isDevServer && console.log(error);
                                        toast.warn("Failed to download excel");
                                      }
                                    };
                                    excelLanding();
                                  }}
                                ></MdFileDownload>
                              </Tooltip>
                            </li>
                            <li className="pr-2 ">
                              <Tooltip placement="bottom" title="Print">
                                <MdLocalPrintshop
                                  style={{
                                    color: "#101828",
                                    width: "25px",
                                    height: "25px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const isFilter =
                                      filters?.department?.length > 0 ||
                                      filters?.calender?.length > 0 ||
                                      filters?.actualStatus?.length > 0 ||
                                      filters?.designation?.length > 0 ||
                                      filters?.hrPosition?.length > 0 ||
                                      filters?.manualStatus?.length > 0 ||
                                      filters?.section?.length > 0;
                                    console.log({ isFilter });
                                    const list = landingApi?.data?.data?.map(
                                      (item: any) => item?.employeeId
                                    );
                                    getPDFAction(
                                      `/PdfAndExcelReport/DailyAttendanceReportPDF?IntAccountId=${orgId}&AttendanceDate=${moment(
                                        date
                                      ).format("YYYY-MM-DD")}${
                                        buId ? `&IntBusinessUnitId=${buId}` : ""
                                      }${
                                        workplaceGroup?.value
                                          ? `&IntWorkplaceGroupId=${
                                              workplaceGroup?.value || 0
                                            }`
                                          : ""
                                      }${
                                        landingApi?.data?.data?.length !==
                                          landingApi?.data?.totalCount ||
                                        isFilter
                                          ? `&EmployeeIdList=${list}`
                                          : ""
                                      }${
                                        workplace?.value
                                          ? `&IntWorkplaceId=${
                                              workplace?.value || 0
                                            }`
                                          : ""
                                      }`,
                                      setLoading
                                    );
                                  }}
                                ></MdLocalPrintshop>
                              </Tooltip>
                            </li>
                          </>
                        );
                      }}
                    </Form.Item>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div
            style={{ marginLeft: "-7px" }}
            className=" d-flex justify-content-between align-items-center my-2"
          >
            <div className="d-flex align-items-center">
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "8px",
                  fontSize: "12px",
                }}
              >
                Total Employee:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.totalEmployee || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                {" "}
                Present:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.presentCount || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                {" "}
                Absent:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.absentCount || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center ">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                {" "}
                Late:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.lateCount || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center ">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                {" "}
                Leave:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.leaveCount || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center ">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                {" "}
                Movement:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.movementCount || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center ">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                {" "}
                Weekend:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {landingApi?.data?.weekendCount || 0}
              </Typography.Title>
            </div>
            <div className="d-flex align-items-center ">
              <Typography.Title
                level={5}
                style={{ marginLeft: "32px", fontSize: "12px" }}
              >
                Holiday:
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{
                  marginLeft: "5px",
                  marginTop: "-.5px",
                  fontSize: "12px",
                }}
              >
                {/* <Typography fontWeight={500} className="ml-2" > */}
                {landingApi?.data?.holidayCount || 0}
              </Typography.Title>
            </div>
          </div>
          <DataTable
            bordered
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            filterData={landingApi?.data?.dailyAttendanceHeader}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);
              landingApiCall({
                pagination,
                filerList: filters,
              });
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default MgmtDailyAttendance;
