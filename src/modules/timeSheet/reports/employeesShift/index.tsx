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
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { dateFormatter, getDateOfYear } from "utility/dateFormatter";

// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { column } from "./helper";
import { empBasicInfo } from "../helper";
import { getSerial } from "Utils";
import { getTableDataInactiveEmployees } from "modules/employeeProfile/inactiveEmployees/helper";

const EmployeesShift = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName, userName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30338),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  const CommonEmployeeDDL = useApiRequest([]);
  const [empInfo, setEmpInfo] = useState<any>();

  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        // workplaceId: wId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);

  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Emp Roster Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

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

  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "WorkplaceWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        empId: employeeId,
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
    searchText = "",
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    landingApi.action({
      urlKey: "MonthlyRosterReportForSingleEmployee",
      method: "GET",
      params: {
        BusinessUnitId: buId,
        IsXls: false,
        WorkplaceGroupId: values?.workplaceGroup?.value,
        PageNo: pagination.current || 1,
        EmployeeId: values?.employee?.value,
        PageSize: pagination.pageSize || 25,
        FromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        ToDate: moment(values?.todate).format("YYYY-MM-DD"),
        WorkplaceId: values?.workplace?.value,
        searchTxt: searchText,
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    empBasicInfo(buId, orgId, employeeId, setEmpInfo);

    landingApiCall();
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
      width: 35,
      align: "center",
    },

    {
      title: "Attendance Date",
      dataIndex: "dteAttendanceDate",
      render: (_: any, record: any) => (
        <>
          {record?.dteAttendanceDate
            ? moment(record?.dteAttendanceDate, "YYYY-MM-DDThh:mm:ss").format(
                "DD MMM, YYYY (dddd)"
              )
            : "-"}
        </>
      ),
      width: 100,
    },
    {
      title: "Calendar Name",
      dataIndex: "strCalendarName",
      width: 150,
    },

    {
      title: "Start Time",
      dataIndex: "dteStartTime",
      width: 80,
    },
    {
      title: "Extended Start Time",
      dataIndex: "dteLastStartTime",
      width: 80,
    },

    {
      title: "End Time",
      dataIndex: "dteEndTime",
      width: 80,
    },

    {
      title: "Duration",
      dataIndex: "duration",

      width: 70,
    },
  ];

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

          fromDate: moment(getDateOfYear("first")),
          toDate: moment(getDateOfYear("last")),
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: landingApi?.data?.currentPage,
              pageSize: landingApi?.data?.totalCount,
            },
          });
        }}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.totalCount || 0} employees`}
            // onSearch={(e) => {
            //   searchFunc(e?.target?.value);
            //   form.setFieldsValue({
            //     search: e?.target?.value,
            //   });
            // }}
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const values = form.getFieldsValue(true);
                  // getExcelData(
                  //   `/Employee/GetInactiveEmployeeList?BusinessUnitId=${buId}&WorkplaceGroupId=${
                  //     values?.workplaceGroup?.value || wgId
                  //   }&WorkplaceId=${
                  //     values?.workplace?.value || wId
                  //   }&IsXls=true&PageNo=1&PageSize=10000&FromDate=${moment(
                  //     values?.fromDate
                  //   ).format("YYYY-MM-DD")}&ToDate=${moment(
                  //     values?.toDate
                  //   ).format("YYYY-MM-DD")}`,
                  //   (res: any) => {
                  //     const newData = res?.data?.map(
                  //       (item: any, index: any) => {
                  //         return {
                  //           ...item,
                  //           sl: index + 1,
                  //         };
                  //       }
                  //     );
                  //     createCommonExcelFile({
                  //       titleWithDate: `Inactive Employee list for the month of ${getCurrentMonthName()}-${currentYear()}`,
                  //       fromDate: "",
                  //       toDate: "",
                  //       buAddress: (buDetails as any)?.strAddress,
                  //       businessUnit: values?.workplaceGroup?.value
                  //         ? (buDetails as any)?.strWorkplace
                  //         : buName,
                  //       tableHeader: column,
                  //       getTableData: () =>
                  //         getTableDataInactiveEmployees(
                  //           newData,
                  //           Object.keys(column)
                  //         ),
                  //       getSubTableData: () => {},
                  //       subHeaderInfoArr: [],
                  //       subHeaderColumn: [],
                  //       tableFooter: [],
                  //       extraInfo: {},
                  //       tableHeadFontSize: 10,
                  //       widthList: {
                  //         C: 30,
                  //         D: 30,
                  //         E: 25,
                  //         F: 20,
                  //         G: 25,
                  //         H: 25,
                  //         I: 25,
                  //         K: 20,
                  //       },
                  //       commonCellRange: "A1:J1",
                  //       CellAlignment: "left",
                  //     });
                  //   }
                  // );
                  const newData = landingApi?.data?.data?.map(
                    (item: any, index: any) => {
                      return {
                        ...item,
                        sl: index + 1,
                        dteAttendanceDate: moment(
                          item?.dteAttendanceDate,
                          "YYYY-MM-DDThh:mm:ss"
                        ).format("DD MMM, YYYY (dddd)"),
                      };
                    }
                  );
                  createCommonExcelFile({
                    titleWithDate: `Employee Roster Report `,
                    fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
                    toDate: moment(values?.toDate).format("YYYY-MM-DD"),
                    buAddress: (buDetails as any)?.strAddress,
                    businessUnit: values?.workplaceGroup?.value
                      ? (buDetails as any)?.strWorkplace
                      : buName,
                    tableHeader: column,
                    getTableData: () =>
                      getTableDataInactiveEmployees(
                        newData,
                        Object.keys(column)
                      ),
                    getSubTableData: () => {},
                    subHeaderInfoArr: [],
                    subHeaderColumn: [],
                    tableFooter: [],
                    extraInfo: {},
                    tableHeadFontSize: 10,
                    widthList: {
                      B: 30,
                      C: 30,
                      D: 15,
                      F: 15,
                      E: 15,
                    },
                    commonCellRange: "A1:J1",
                    CellAlignment: "left",
                  });
                  setExcelLoading(false);
                } catch (error: any) {
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                  // console.log(error?.message);
                }
              };
              excelLanding();
            }}
          />
          <PCardBody className="mb-3">
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
                    empBasicInfo(buId, orgId, value, setEmpInfo);
                  }}
                  onSearch={(value) => {
                    getEmployee(value);
                  }}
                  showSearch
                  filterOption={false}
                />
              </Col>
              <Col md={3} sm={12} xs={24}>
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
              <Col md={3} sm={12} xs={24}>
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
              <Col md={5} sm={12} xs={24}>
                <PSelect
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
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
          <Form.Item shouldUpdate noStyle>
            {() => {
              return (
                <Row
                  className="mb-3"
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
          <DataTable
            bordered
            data={landingApi?.data?.data || []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: landingApi?.data?.pageSize,
              total: landingApi?.data?.totalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);

              landingApiCall({
                pagination,
              });
            }}
            // scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default EmployeesShift;
