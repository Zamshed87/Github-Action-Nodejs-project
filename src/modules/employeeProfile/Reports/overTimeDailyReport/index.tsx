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
import { Col, Form, Row, Tag } from "antd";
import { getWorkplaceDetails } from "common/api";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { dateFormatter } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";
import { debounce } from "lodash";
import axios from "axios";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { column } from "./helper";
import { getTableDataMonthlyAttendance } from "modules/timeSheet/reports/joineeAttendanceReport/helper";
// import { getTableDataMonthlyAttendance } from "modules/timeSheet/reports/monthlyAttendanceReport/helper";

const EmOverTimeDailyReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { orgId, buId, wgId, employeeId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30418),
    []
  );
  // menu permission
  const employeeFeature: any = permission;

  const landingApi = useApiRequest({});
  //   const debounce = useDebounce();

  const [filterList, setFilterList] = useState({});
  const [buDetails, setBuDetails] = useState({});
  const [excelLoading, setExcelLoading] = useState(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  // Form Instance
  const [form] = Form.useForm();
  //   api states
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);
  const departmentDDL = useApiRequest([]);
  const sectionDDL = useApiRequest([]);
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Overtime Daily Report";
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
    // const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "WorkplaceWithRoleExtension",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
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

  useEffect(() => {
    getWorkplace();
  }, [wgId]);

  const getDepartmentDDL = () => {
    const { workplace } = form.getFieldsValue(true);
    departmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        workplaceId: workplace?.value,

        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        empId: employeeId,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };
  const getSectionDDL = () => {
    const { department, workplace } = form.getFieldsValue(true);
    sectionDDL?.action({
      urlKey: "SectionDDL",
      method: "GET",
      params: {
        AccountId: orgId,
        BusinessUnitId: buId,
        DepartmentId: department?.value,
        WorkplaceId: workplace?.value,
      },
      onSuccess: (res: any) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.label;
          res[i].value = item?.value;
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
  }: TLandingApi = {}) => {
    const values = form.getFieldsValue(true);

    const sectionMerge = values?.section?.map((item: any) => {
      return item?.value;
    });
    const sectionList = sectionMerge?.join(",") || "";

    const payload = {
      accountId: orgId,
      strSectionIdList: sectionList || "",
      searchText: searchText || "",
      intOTtype: values?.intOTtype?.value || 3,
      workplaceGroupId: values?.workplaceGroup?.value || wgId,
      strWorkplaceIdList: String(values?.workplace?.value || ""),
      strDepartmentIdList: String(values?.department?.value || ""),
      pageNumber: pagination?.current || 1,
      pageSize: pagination?.pageSize || 500,
      isPaginated: true,
      //   isHeaderNeed: true,
      attendanceDate: values?.fromDate
        ? moment(values?.fromDate).format("YYYY-MM-DD")
        : null,

      //   strDepartmentList: filerList?.strDepartment || [],
      //   strWorkplaceGroupList: filerList?.strWorkplaceGroup || [],
      //   strWorkplaceList: filerList?.strWorkplace || [],
      //   strLinemanagerList: filerList?.strLinemanager || [],
      //   strEmploymentTypeList: filerList?.strEmploymentType || [],
      //   strSupervisorNameList: filerList?.strSupervisorName || [],
      //   strDottedSupervisorNameList: filerList?.strDottedSupervisorName || [],
      //   strDivisionList: filerList?.strDivisionList || [],
      //   strPayrollGroupList: filerList?.strPayrollGroup || [],
      //   strDesignationList: filerList?.strDesignation || [],
      //   strHrPositionList: filerList?.strHrPosition || [],
      //   strBankList: filerList?.strBank || [],
      //   strSectionList: filerList?.strSectionList || [],
      //   //   unnecesary
      //   wingNameList: [],
      //   soleDepoNameList: [],
      //   regionNameList: [],
      //   areaNameList: [],
      //   territoryNameList: [],
    };
    landingApi.action({
      urlKey: "GetDailyOvertimeEmployeeList",
      method: "POST",
      payload: payload,
    });
  };

  useEffect(() => {
    getWorkplaceGroup();
    landingApiCall();
  }, []);
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      fixed: "left",
      width: 35,
      align: "center",
    },

    // {
    //   title: "Work. Group/Location",
    //   dataIndex: "strWorkplaceGroup",
    //   width: 150,
    //   fixed: "left",
    // },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      width: 150,
      fixed: "left",
    },
    {
      title: "Department",
      fixed: "left",
      dataIndex: "strDepartment",
      width: 100,
    },
    {
      title: "Section",
      dataIndex: "strSectionName",
      fixed: "left",
      width: 100,
    },
    {
      title: "ID NO",
      dataIndex: "strEmployeeCode",
      width: 100,
      fixed: "left",
    },

    {
      title: "Name",
      dataIndex: "strEmployeeName",
      render: (_: any, rec: any) => {
        return (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.strEmployeeName} />
            <span className="ml-2">{rec?.strEmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      // fixed: "left",
      width: 150,
    },

    {
      title: "Designation",
      dataIndex: "strDesignation",
      width: 120,
    },

    {
      title: "Basic Salary",
      dataIndex: "numBasicORGross",
      width: 80,
    },
    {
      title: "Gross Salary",
      dataIndex: "numGrossSalary",
      width: 80,
    },
    {
      title: "Calender Name",
      dataIndex: "strCalenderName",
      width: 150,
    },

    // {
    //   title: "HR Position",
    //   dataIndex: "strHRPostionName",

    //   width: 150,
    // },
    // {
    //   title: "Employment Type",
    //   dataIndex: "EmployementType",

    //   width: 150,
    // },

    {
      title: "In Time",
      dataIndex: "tmeInTime",
      width: 80,
    },
    {
      title: "Out Time",
      dataIndex: "tmeLastOutTime",
      width: 80,
    },
    {
      title: "Late",
      dataIndex: "lateHour",
      width: 80,
    },
    {
      title: "OT Hour",
      dataIndex: "numHours",
      width: 80,
    },
    {
      title: "OT Rate",
      dataIndex: "numPerHourRate",
      width: 80,
    },
    {
      title: "Net Payable",
      dataIndex: "numTotalAmount",
      width: 80,
    },
  ];
  const searchFunc = debounce((value) => {
    landingApiCall({
      filerList: filterList,
      searchText: value,
    });
  }, 500);

  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{
          fromDate: moment(todayDate()),
        }}
        onFinish={() => {
          landingApiCall({
            pagination: {
              current: landingApi?.data?.page,
              pageSize: landingApi?.data?.totalCount,
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

                  const sectionMerge = values?.section?.map((item: any) => {
                    return item?.value;
                  });
                  const sectionList = sectionMerge?.join(",") || "";

                  const payload = {
                    accountId: orgId,
                    strSectionIdList: sectionList || "",
                    searchText: "",
                    intOTtype: values?.intOTtype?.value || 3,
                    workplaceGroupId: values?.workplaceGroup?.value || wgId,
                    strWorkplaceIdList: String(values?.workplace?.value || ""),
                    strDepartmentIdList: String(
                      values?.department?.value || ""
                    ),
                    pageNumber: 1,
                    pageSize: 100000,
                    isPaginated: false,

                    attendanceDate: values?.fromDate
                      ? moment(values?.fromDate).format("YYYY-MM-DD")
                      : null,

                    // strDepartmentList: (filterList as any)?.strDepartment || [],
                    // strWorkplaceGroupList:
                    //   (filterList as any)?.strWorkplaceGroup || [],
                    // strWorkplaceList: (filterList as any)?.strWorkplace || [],
                    // strLinemanagerList:
                    //   (filterList as any)?.strLinemanager || [],
                    // strEmploymentTypeList:
                    //   (filterList as any)?.strEmploymentType || [],
                    // strSupervisorNameList:
                    //   (filterList as any)?.strSupervisorName || [],
                    // strDottedSupervisorNameList:
                    //   (filterList as any)?.strDottedSupervisorName || [],
                    // strDivisionList: (filterList as any)?.strDivisionList || [],
                    // strPayrollGroupList:
                    //   (filterList as any)?.strPayrollGroup || [],
                    // strDesignationList:
                    //   (filterList as any)?.strDesignation || [],
                    // strHrPositionList: (filterList as any)?.strHrPosition || [],
                    // strBankList: (filterList as any)?.strBank || [],
                    // strSectionList: (filterList as any)?.strSectionList || [],
                    // //   unnecesary
                    // wingNameList: [],
                    // soleDepoNameList: [],
                    // regionNameList: [],
                    // areaNameList: [],
                    // territoryNameList: [],
                  };

                  const res = await axios.post(
                    `/Payroll/GetDailyOvertimeEmployeeList`,
                    payload
                  );
                  const totalAmount = res?.data.reduce(
                    (sum: any, employee: any) => sum + employee.numTotalAmount,
                    0
                  );
                  if (res?.data?.length < 1) {
                    setExcelLoading(false);
                    return toast.error("No data found");
                  }
                  const newData = res?.data?.map((item: any, index: any) => {
                    return {
                      ...item,
                      sl: index + 1,
                    };
                  });
                  createCommonExcelFile({
                    titleWithDate: `Daily Overtime Report - ${dateFormatter(
                      moment(values?.fromDate).format("YYYY-MM-DD")
                    )} `,
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
                    extraInfo: {},
                    tableHeadFontSize: 10,
                    tableFooter: [
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "Total:",
                      "",
                      totalAmount,
                      "",
                    ],
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
              <Col md={4} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="Attendance Date"
                  placeholder="Attendance Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>

              {/* <Col md={4} sm={12} xs={24}>
                <PSelect
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
                />
              </Col> */}

              <Col md={4} sm={12} xs={24}>
                <PSelect
                  options={[
                    {
                      value: 1,
                      label: "Not Applicable",
                    },
                    { value: 2, label: "With Salary" },
                    {
                      value: 3,
                      label: "Without Salary/Additional OT",
                    },
                  ]}
                  name="intOTtype"
                  label="OT type"
                  placeholder="OT Type"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      intOTtype: op,
                      workplace: undefined,
                      department: undefined,
                    });
                  }}
                />
              </Col>

              <Col md={4} sm={12} xs={24}>
                <PSelect
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
                    getDepartmentDDL();
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>
              {/* de */}
              <Col md={4} sm={12} xs={24}>
                <PSelect
                  options={departmentDDL?.data || []}
                  name="department"
                  label="Department"
                  placeholder="Department"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      department: op,
                      section: undefined,
                    });
                    getWorkplaceDetails(value, setBuDetails);
                    getSectionDDL();
                  }}
                  // rules={[{ required: true, message: "Workplace is required" }]}
                />
              </Col>
              <Col md={4} sm={12} xs={24}>
                <PSelect
                  // rules={[{ required: true, message: "Workplace is required" }]}
                  mode="multiple"
                  options={sectionDDL?.data || []}
                  name="section"
                  label="Section"
                  placeholder="Section"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      section: op,
                    });
                    getWorkplaceDetails(value, setBuDetails);

                    // form.setFieldsValue({
                    //   intEmploymentTypeList: op,
                    // });
                    // const temp = form.getFieldsValue();

                    // isPolicyExist(
                    //   {
                    //     ...temp,
                    //     intEmploymentTypeList: op,
                    //   },
                    //   allPolicies,
                    //   setExistingPolicies
                    // );
                    // value && getWorkplace();
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

          <DataTable
            bordered
            data={landingApi?.data?.length > 0 ? landingApi?.data : []}
            loading={landingApi?.loading}
            header={header}
            pagination={{
              pageSize: pages?.pageSize,
              total: landingApi?.data[0]?.totalCount,
            }}
            filterData={landingApi?.data?.employeeHeader}
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

export default EmOverTimeDailyReport;
