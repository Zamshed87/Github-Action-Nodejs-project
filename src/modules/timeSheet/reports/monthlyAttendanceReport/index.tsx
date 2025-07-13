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
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
// import { downloadEmployeeCardFile } from "../employeeIDCard/helper";
import { debounce } from "lodash";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { column, getTableDataMonthlyAttendance } from "./helper";
import { fromToDateList } from "../helper";
import { gray600 } from "utility/customColor";
import { getChipStyle } from "modules/employeeProfile/dashboard/components/EmployeeSelfCalendar";
import axios from "axios";

const MonthlyAttendanceReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName, wId },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30339),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [, setFilterList] = useState({});
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const { id }: any = useParams();
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);

  const empDepartmentDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const getEmployeDepartment = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };

  const getEmployeDesignation = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Monthly Attendance Report";
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

    // const workplaceList = `${values?.workplace
    //   ?.map((item: any) => item?.intWorkplaceId)
    //   .join(",")}`;
    const deptList = `${values?.department
      ?.map((item: any) => item?.value)
      .join(",")}`;
    const desigList = `${values?.designation?.map((item: any) => item?.value)}`;
    landingApi.action({
      urlKey: "TimeManagementDynamicPIVOTReport",
      method: "GET",
      params: {
        reportType: "monthly_attendance_report_for_all_employee",
        accountId: orgId,
        businessUnitId: buId,
        // error handling from backend
        workplaceGroupId: values?.workplaceGroup?.value || wgId,
        WorkplaceGroupList: values?.workplaceGroup?.value || wgId,
        // WorkplaceId: values?.workplace?.value,
        workplaceList: values?.workplace?.value || wId,
        pageNo: pagination.current || pages?.current,
        pageSize: pagination.pageSize || pages?.pageSize,
        employeeId: 0,
        isPaginated: true,
        dteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        searchTxt: searchText,
        departments: values?.department?.length > 0 ? deptList : "",
        designations: values?.designation?.length > 0 ? desigList : "",
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
  }, []);
  //   table column
  const header: any = () => {
    const values = form.getFieldsValue(true);
    const dateList = fromToDateList(
      moment(values?.fromDate).format("YYYY-MM-DD"),
      moment(values?.toDate).format("YYYY-MM-DD")
    );
    const d =
      dateList?.length > 0 &&
      dateList.map((item: any) => ({
        title: () => <span style={{ color: gray600 }}>{item?.level}</span>,
        render: (_: any, record: any) =>
          record?.[item?.date] ? (
            <span style={getChipStyle(record?.[item?.date])}>
              {record?.[item?.date]}
            </span>
          ) : (
            "-"
          ),
        width: 150,
      }));

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
        dataIndex: "strWorkplaceGroup",
        width: 120,
        fixed: "left",
      },
      {
        title: "Workplace/Concern",
        dataIndex: "strWorkplace",
        width: 130,
        fixed: "left",
      },
      {
        title: "Employee Id",
        dataIndex: "EmployeeCode",
        width: 80,
        fixed: "left",
      },

      {
        title: "Employee Name",
        dataIndex: "strEmployeeName",
        render: (_: any, rec: any) => {
          return (
            <div className="d-flex align-items-center">
              <Avatar title={rec?.strEmployeeName} />
              <span className="ml-2">{rec?.strEmployeeName}</span>
            </div>
          );
        },
        fixed: "left",
        width: 120,
      },

      {
        title: "Designation",
        dataIndex: "strDesignation",

        width: 100,
      },
      {
        title: "Section",
        dataIndex: "strSectionName",

        width: 100,
      },
      {
        title: "Department",
        dataIndex: "strDepartment",

        width: 100,
      },
      ...(d as any),
    ];
  };
  const searchFunc = debounce((value) => {
    landingApiCall({
      pagination: { current: 1, pageSize: paginationSize },
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
          const values = form.getFieldsValue(true);
          landingApiCall({
            searchText: values?.search,
            pagination: {
              current: pages?.current,
              pageSize: landingApi?.data[0]?.totalCount,
            },
          });
        }}
      >
        <PCard>
          {excelLoading && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${landingApi?.data[0]?.totalCount || 0} employees`}
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
                  const deptList = `${values?.department
                    ?.map((item: any) => item?.value)
                    .join(",")}`;
                  const desigList = `${values?.designation?.map(
                    (item: any) => item?.value
                  )}`;
                  const res = await axios.get(
                    `/TimeSheetReport/TimeManagementDynamicPIVOTReport?reportType=monthly_attendance_report_for_all_employee&dteFromDate=${moment(
                      values?.fromDate
                    ).format("YYYY-MM-DD")}&dteToDate=${moment(
                      values?.toDate
                    ).format("YYYY-MM-DD")}&employeeId=0&workplaceGroupId=${
                      values?.workplaceGroup?.value || wgId
                    }&WorkplaceGroupList=${values?.workplaceGroup?.value || wgId}&WorkplaceList=${
                      values?.workplace?.value || wId
                    }&accountId=${orgId}&pageNo=1&pageSize=1000&isPaginated=false&businessUnitId=${buId}&departments=${
                      values?.department?.length > 0 ? deptList : ""
                    }&designations=${
                      values?.designation?.length > 0 ? desigList : ""
                    }`
                  );
                  if (res?.data) {
                    setExcelLoading(false);
                    if (res?.data < 1) {
                      return toast.error("No Attendance Data Found");
                    }

                    const newData = res?.data?.map((item: any, index: any) => {
                      return {
                        ...item,
                        sl: index + 1,
                      };
                    });
                    createCommonExcelFile({
                      titleWithDate: `Monthly Attendance Report - ${dateFormatter(
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
                      tableHeader: column(
                        moment(values?.fromDate).format("YYYY-MM-DD"),
                        moment(values?.toDate).format("YYYY-MM-DD")
                      ),
                      getTableData: () =>
                        getTableDataMonthlyAttendance(
                          newData,
                          Object.keys(
                            column(
                              moment(values?.fromDate).format("YYYY-MM-DD"),
                              moment(values?.toDate).format("YYYY-MM-DD")
                            )
                          )
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
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
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
                      department: undefined,
                      designation: undefined,
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
                  // mode="multiple"
                  disabled={+id ? true : false}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      workplace: op,
                      department: undefined,
                      designation: undefined,
                    });
                    getWorkplaceDetails(value, setBuDetails);
                    getEmployeDesignation();
                    getEmployeDepartment();
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const { workplace } = form.getFieldsValue(true);
                  return (
                    <>
                      <Col md={5} sm={12} xs={24}>
                        <PSelect
                          options={empDepartmentDDL?.data || []}
                          name="department"
                          label="Department"
                          placeholder="Department"
                          mode="multiple"
                          maxTagCount={"responsive"}
                          disabled={workplace?.length > 1 ? true : false}
                          onChange={(value, op) => {
                            form.setFieldsValue({
                              department: op,
                            });
                          }}
                          // rules={[{ required: true, message: "Workplace is required" }]}
                        />
                      </Col>
                      <Col md={5} sm={12} xs={24}>
                        <PSelect
                          options={empDesignationDDL?.data || []}
                          name="designation"
                          label="Designation"
                          placeholder="Designation"
                          mode="multiple"
                          maxTagCount={"responsive"}
                          disabled={workplace?.length > 1 ? true : false}
                          onChange={(value, op) => {
                            form.setFieldsValue({
                              designation: op,
                            });
                          }}
                          // rules={[{ required: true, message: "Workplace is required" }]}
                        />
                      </Col>
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
          </PCardBody>

          <DataTable
            bordered
            data={landingApi?.data?.length > 0 ? landingApi?.data : []}
            loading={landingApi?.loading}
            header={header()}
            pagination={{
              pageSize: pages?.pageSize,
              total: landingApi?.data[0]?.totalCount,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              // Return if sort function is called
              if (extra.action === "sort") return;
              setFilterList(filters);
              setPages({
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
              });
              landingApiCall({
                pagination,
                searchText: form.getFieldValue("search"),
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

export default MonthlyAttendanceReport;
