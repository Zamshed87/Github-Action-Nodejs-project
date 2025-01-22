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
import type { RangePickerProps } from "antd/es/date-picker";

import { useApiRequest } from "Hooks";
import { Col, Form, Row, Tag, Tooltip } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { debounce } from "lodash";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import axios from "axios";
import { getTableDataMonthlyAttendance } from "../monthlyAttendanceReport/helper";
import { column } from "./helper";
import PFilter from "utility/filter/PFilter";
import { formatFilterValueList } from "utility/filter/helper";
import { EyeOutlined } from "@ant-design/icons";
import { PModal } from "Components/Modal";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const MonthlyLeaveReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, wId, employeeId, orgId, buName, isOfficeAdmin },
    tokenData,
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30420),
    []
  );

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  // menu permission
  const employeeFeature: any = permission;

  //   const debounce = useDebounce();
  //states
  const [, setFilterList] = useState({});
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [pages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const landingApi = useApiRequest({});
  const empDepartmentDDL = useApiRequest({});
  const supervisorDDL = useApiRequest([]);
  const [apporveStatus, getapporveStatus, apporveStatusLoading] = useAxiosGet(
    []
  );
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Monthly Leave report";
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

  // workplace wise
  const getEmployeDepartment = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        workplaceId: workplace?.value,

        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        empId: employeeId,
      },
      onSuccess: (res) => {
        res?.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };
  const getSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return supervisorDDL?.reset();
    const { workplaceGroup, workplace } = form.getFieldsValue(true);
    supervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: orgId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: workplaceGroup?.value,
        strWorkplaceIdList: workplace?.value.toString(),
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);

  // data call
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
      urlKey: "MonthlyleaveReport",
      method: "POST",
      payload: {
        accountId: orgId,
        businessUnitId: buId,
        workPlaceGroupId: wgId,
        workPlaceId: wId,
        employeeId: 0,
        fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        toDate: moment(values?.toDate).format("YYYY-MM-DD"),
        pageNo: pagination?.current || 1,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pageSize: pagination.pageSize! > 1 ? pagination?.pageSize : 500,
        isPaginated: true,
        SearchText: searchText,
        departmentIdList: formatFilterValueList(values?.department) || [0],
        designationIdList: formatFilterValueList(values?.designation) || [0],
        supervisorId: values?.supervisor?.value || 0,
        workplaceGroupList:
          values?.workplaceGroup?.value == 0 ||
          values?.workplaceGroup?.value == undefined
            ? decodedToken.workplaceGroupList
            : values?.workplaceGroup?.value.toString(),
        workplaceList:
          values?.workplace?.value == 0 || values?.workplace?.value == undefined
            ? decodedToken.workplaceList
            : values?.workplace?.value.toString(),
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
  }, []);
  //   table column
  const header: any = () => {
    return [
      {
        title: "SL",
        render: (_: any, rec: any, index: number) =>
          (pages?.current - 1) * pages?.pageSize + index + 1,
        fixed: "left",
        width: 35,
        align: "center",
      },

      {
        title: "Work. Group/Location",
        dataIndex: "StrWorkPlaceGroupName",
        width: 120,
        fixed: "left",
      },
      {
        title: "Workplace/Concern",
        dataIndex: "StrWorkPlaceName",
        width: 120,
        fixed: "left",
      },
      {
        title: "Department",
        dataIndex: "StrDepartmentName",
        fixed: "left",

        width: 70,
      },
      {
        title: "Section",
        dataIndex: "StrSectionName",
        fixed: "left",

        width: 70,
      },

      {
        title: "Employee Id",
        dataIndex: "StrEmployeeCode",
        width: 80,
        fixed: "left",
      },

      {
        title: "Employee Name",
        dataIndex: "StrEmployeeName",
        render: (_: any, rec: any) => {
          return (
            <div className="d-flex align-items-center">
              <Avatar title={rec?.StrEmployeeName} />
              <span className="ml-2">{rec?.StrEmployeeName}</span>
            </div>
          );
        },
        fixed: "left",
        width: 120,
      },

      {
        title: "Designation",
        dataIndex: "StrDesignation",

        width: 100,
      },
      {
        title: "Supersvisor",
        dataIndex: "StrSupersvisorName",

        width: 100,
      },
      {
        title: "Leave Type",
        dataIndex: "StrLeaveTypeName",

        width: 100,
      },
      {
        title: "Location",
        dataIndex: "StrAddressDuetoLeave",

        width: 100,
      },
      {
        title: "From Date",
        dataIndex: "LeaveStartDate",
        render: (_: any, item: any) => dateFormatter(item?.LeaveStartDate),
        width: 100,
      },
      {
        title: "Duration",
        dataIndex: "StartEndTime",

        width: 100,
      },
      {
        title: "To Date",
        dataIndex: "LeaveEndDate",
        render: (_: any, item: any) => dateFormatter(item?.LeaveEndDate),

        width: 100,
      },

      {
        title: "Half Day (Hours)",
        dataIndex: "HalfDayHours",

        width: 100,
      },
      {
        title: "Days",
        dataIndex: "TotalDays",

        width: 100,
      },
      {
        title: "Application Date",
        dataIndex: "ApplicationDate",
        render: (_: any, item: any) => dateFormatter(item?.ApplicationDate),

        width: 100,
      },
      {
        title: "Total Approver",
        dataIndex: "TotalApprover",
        width: 100,
      },
      {
        title: "Approved Application",
        dataIndex: "ApprovedApplications",
        width: 100,
      },
      {
        title: "Pending Application",
        dataIndex: "PendingApplications",
        width: 100,
      },
      {
        title: "Action",
        dataIndex: "",
        render: (rec: any) => (
          <Tooltip placement="bottom" title={"View"}>
            <EyeOutlined
              style={{ color: "green", fontSize: "14px", cursor: "pointer" }}
              onClick={() => {
                console.log(rec);
                getapporveStatus(
                  `/LeaveMovement/MonthlyLeaveReportApprovalStatus?applicationId=${rec.IntLeaveTypeId}&employeeId=${rec.IntEmployeeId}`,
                  () => {
                    setViewModal(true);
                  }
                );
              }}
            />
          </Tooltip>
        ),
        align: "center",
        width: 80,
      },
    ];
  };

  const modalheader: any = () => {
    return [
      {
        title: "Approver Name",
        dataIndex: "ApproverName",
        width: 100,
      },
      {
        title: "Approver Type",
        dataIndex: "ApproverTypeName",
        width: 100,
      },
      {
        title: "Approve Status",
        dataIndex: "AfterApproveStatus",
        width: 100,
      },
      {
        title: "Approved",
        dataIndex: "IsApprove",
        render: (_: any, rec: any) => (
          <div className="d-flex align-items-center justify-content-center">
            <div>
              {rec?.IsApprove === true && <Tag color="success">Approved</Tag>}
              {rec?.IsApprove === false && <Tag color="warning">Pending</Tag>}
            </div>
          </div>
        ),
        width: 100,
      },
      {
        title: "Rejected",
        dataIndex: "IsReject",
        render: (_: any, rec: any) => (
          <div className="d-flex align-items-center justify-content-center">
            <div>
              {rec?.IsReject === true && <Tag color="red">Rejected</Tag>}
            </div>
          </div>
        ),
        width: 100,
      },
    ];
  };
  const searchFunc = debounce((value) => {
    landingApiCall({
      searchText: value,
    });
  }, 500);
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
          fromDate: moment(monthFirstDate()),
          toDate: moment(monthLastDate()),
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: pages?.current,
              pageSize: landingApi?.data?.TotalCount,
            },
          });
        }}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data?.TotalCount || 0} employees`}
            onSearch={(e) => {
              searchFunc(e?.target?.value);
              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const values = form.getFieldsValue(true);
                  const res = await axios.post(
                    "/LeaveMovement/MonthlyleaveReport",
                    {
                      accountId: orgId,
                      businessUnitId: buId,
                      workPlaceGroupId: wgId,
                      workPlaceId: wId,
                      employeeId: 0,
                      fromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
                      toDate: moment(values?.toDate).format("YYYY-MM-DD"),
                      pageNo: 1,
                      pageSize: 500,
                      isPaginated: false,
                      SearchText: "",
                      departmentIdList: formatFilterValueList(
                        values?.department
                      ) || [0],
                      designationIdList: formatFilterValueList(
                        values?.designation
                      ) || [0],
                      supervisorId: values?.supervisor?.value || 0,
                      workplaceGroupList:
                        values?.workplaceGroup?.value == 0 ||
                        values?.workplaceGroup?.value == undefined
                          ? decodedToken.workplaceGroupList
                          : values?.workplaceGroup?.value.toString(),
                      workplaceList:
                        values?.workplace?.value == 0 ||
                        values?.workplace?.value == undefined
                          ? decodedToken.workplaceList
                          : values?.workplace?.value.toString(),
                    }
                  );
                  if (res?.data?.Data) {
                    setExcelLoading(true);
                    if (res?.data?.Data?.length < 1) {
                      return toast.error("No Attendance Data Found");
                    }
                    const newData = res?.data?.Data?.map(
                      (item: any, index: any) => {
                        return {
                          ...item,
                          sl: index + 1,
                          EndDate: dateFormatter(item?.LeaveEndDate),
                          StartDate: dateFormatter(item?.LeaveStartDate),
                          ApplicationDate: dateFormatter(item?.ApplicationDate),
                        };
                      }
                    );
                    createCommonExcelFile({
                      titleWithDate: `Monthly Leave Report - ${dateFormatter(
                        moment(values?.fromDate).format("YYYY-MM-DD")
                      )} to ${dateFormatter(
                        moment(values?.toDate).format("YYYY-MM-DD")
                      )}`,
                      fromDate: "",
                      toDate: "",
                      buAddress: (buDetails as any)?.strAddress,
                      businessUnit: values?.workplaceGroup?.value
                        ? (buDetails as any)?.strWorkplace
                        : buName,
                      tableHeader: column,
                      getTableData: () =>
                        getTableDataMonthlyAttendance(
                          newData,
                          Object.keys(column)
                        ),

                      // eslint-disable-next-line @typescript-eslint/no-empty-function
                      getSubTableData: () => {},
                      subHeaderInfoArr: [],
                      subHeaderColumn: [],
                      tableFooter: [],
                      extraInfo: {},
                      tableHeadFontSize: 10,
                      widthList: {
                        C: 30,
                        B: 30,
                        D: 30,
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
                    setExcelLoading(false);
                  }
                } catch (error: any) {
                  toast.error("Failed to download excel");
                  setExcelLoading(false);
                  // console.log(error?.message);
                }
              };
              excelLanding();
            }}
          />
          <PFilter
            form={form}
            landingApiCall={landingApiCall}
            resetApiCall={() => {
              form.setFieldValue("supervisor", null);
            }}
          >
            <Form.Item shouldUpdate noStyle>
              {() => {
                const { workplaceGroup } = form.getFieldsValue(true);
                return (
                  <>
                    {isOfficeAdmin && (
                      <Col md={12} sm={24}>
                        <PSelect
                          options={supervisorDDL?.data || []}
                          name="supervisor"
                          label="Supervisor"
                          placeholder={`${
                            workplaceGroup?.value
                              ? "Search minimum 2 character"
                              : "Select Workplace Group first"
                          }`}
                          //disabled={!workplaceGroup?.value}
                          onChange={(value, op) => {
                            form.setFieldsValue({
                              supervisor: op,
                            });
                          }}
                          showSearch
                          filterOption={false}
                          // notFoundContent={null}
                          loading={supervisorDDL?.loading}
                          onSearch={(value) => {
                            getSuperVisorDDL(value);
                          }}
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "Supervisor is required",
                          //   },
                          // ]}
                        />
                      </Col>
                    )}
                  </>
                );
              }}
            </Form.Item>
          </PFilter>
          {/* <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
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

              <Col md={4} sm={12} xs={24}>
                <PSelect
                  allowClear
                  options={workplaceGroup?.data || []}
                  name="workplaceGroup"
                  label="Workplace Group"
                  placeholder="Workplace Group"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplaceGroup: op,
                      workplace: undefined,
                      department: undefined,
                    });
                    getWorkplace();
                  }}
                  rules={[
                    { required: true, message: "Workplace Group is required" },
                  ]}
                />
              </Col>
              <Col md={4} sm={12} xs={24}>
                <PSelect
                  allowClear
                  options={workplace?.data || []}
                  name="workplace"
                  label="Workplace"
                  placeholder="Workplace"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                      department: undefined,
                    });
                    getWorkplaceDetails(value, setBuDetails);
                    getEmployeDepartment();
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>
              <Col md={7} sm={12} xs={24}>
                <PSelect
                  mode="multiple"
                  allowClear
                  options={
                    empDepartmentDDL?.data?.length > 0
                      ? empDepartmentDDL?.data
                      : []
                  }
                  name="department"
                  label="Department"
                  placeholder="Department"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      department: op,
                    });
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>

              <Form.Item shouldUpdate noStyle>
                {() => {
                  const { workplaceGroup } = form.getFieldsValue(true);
                  return (
                    <>
                      {isOfficeAdmin && (
                        <Col md={6} sm={24}>
                          <PSelect
                            options={supervisorDDL?.data || []}
                            name="supervisor"
                            label="Supervisor"
                            placeholder={`${
                              workplaceGroup?.value
                                ? "Search minimum 2 character"
                                : "Select Workplace Group first"
                            }`}
                            disabled={!workplaceGroup?.value}
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                supervisor: op,
                              });
                            }}
                            showSearch
                            filterOption={false}
                            // notFoundContent={null}
                            loading={supervisorDDL?.loading}
                            onSearch={(value) => {
                              getSuperVisorDDL(value);
                            }}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Supervisor is required",
                            //   },
                            // ]}
                          />
                        </Col>
                      )}
                    </>
                  );
                }}
              </Form.Item>
              <Col
                style={{
                  marginTop: "23px",
                }}
              >
                <PButton type="primary" action="submit" content="View" />
              </Col>
            </Row>
          </PCardBody> */}

          <DataTable
            bordered
            data={
              landingApi?.data?.Data?.length > 0 ? landingApi?.data?.Data : []
            }
            loading={landingApi?.loading}
            header={header()}
            pagination={{
              pageSize: landingApi?.data?.PageSize,
              total: landingApi?.data?.TotalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);

              landingApiCall({
                pagination,
              });
            }}
            scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
      <PModal
        open={viewModal}
        title={"Approver History"}
        width={1000}
        onCancel={() => {
          setViewModal(false);
        }}
        maskClosable={false}
        components={
          <DataTable
            bordered
            header={modalheader()}
            loading={apporveStatusLoading}
            data={apporveStatus}
          />
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default MonthlyLeaveReport;
