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
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { column, getTableDataMonthlyAttendance } from "./helper";
import { fromToDateList } from "../helper";
import { gray600 } from "utility/customColor";
import { getChipStyle } from "modules/employeeProfile/dashboard/components/EmployeeSelfCalendar";
import axios from "axios";

const JoineeAttendanceReport = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, employeeId, orgId, buName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30379),
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
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Joinee Attendance Report";
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
      urlKey: "TimeManagementDynamicPIVOTReport",
      method: "GET",
      params: {
        ReportType: "new_joinee_in_out_attendance_report_for_all_employee",
        AccountId: orgId,
        WorkplaceGroupId: values?.workplaceGroup?.value,
        WorkplaceId: values?.workplace?.value,
        PageNo: pagination.current || pages?.current,
        PageSize: pagination.pageSize || pages?.pageSize,
        EmployeeId: 0,
        IsPaginated: true,
        DteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        DteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        SearchTxt: searchText,
        intYearId: moment(values?.attendanceMonth).format("YYYY"),
        intMonthId: moment(values?.attendanceMonth).format("MM"),
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
    console.log("values", values);
    // const dateList = fromToDateList(
    //   moment(values?.fromDate).format("YYYY-MM-DD"),
    //   moment(values?.toDate).format("YYYY-MM-DD")
    // );
    // const d =
    //   dateList?.length > 0 &&
    //   dateList.map((item: any) => ({
    //     title: () => <span style={{ color: gray600 }}>{item?.level}</span>,
    //     render: (_: any, record: any) =>
    //       record?.[item?.date] ? (
    //         <span style={getChipStyle(record?.[item?.date])}>
    //           {record?.[item?.date]}
    //         </span>
    //       ) : (
    //         "-"
    //       ),
    //     width: 150,
    //   }));

    // new code start from here
    let d : any = [];

    if (values?.attendanceMonth) {
      // Extract the selected year and month from attendanceMonth
      const attendanceMonth = moment(values?.attendanceMonth);
      const selectedYear = attendanceMonth.year();
      const selectedMonth = attendanceMonth.month(); // Month is 0-based in moment.js
    
      // Get the full month name
      const monthName = attendanceMonth.format("MMMM");
    
      // Generate the full date list for the selected month
      const daysInMonth = attendanceMonth.daysInMonth();
      const dateList = Array.from({ length: daysInMonth }, (_, index) => {
        const date = moment([selectedYear, selectedMonth, index + 1]).format("YYYY-MM-DD");
        return {
          date,
          level: `${monthName} ${index + 1}`, // Label with the month name and day number
        };
      });
    
      d = dateList.map((item: any) => ({
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
    }

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
        // fixed: "left",
        width: 120,
      },

      {
        title: "Designation",
        dataIndex: "strDesignation",

        width: 100,
      },
      {
        title: "Department",
        dataIndex: "strDepartment",

        width: 100,
      },
      {
        title: "Section",
        dataIndex: "strSectionName",

        width: 100,
      },
      ...(d as any),
    ];
  };
  //   const searchFunc = debounce((value) => {
  //     landingApiCall({
  //       searchText: value,
  //     });
  //   }, 500);
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

                  const res = await axios.get(
                    `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=new_joinee_in_out_attendance_report_for_all_employee&AccountId=${orgId}&DteFromDate=${moment(
                      values?.fromdate
                    ).format("YYYY-MM-DD")}&DteToDate=${moment(
                      values?.toDate
                    ).format("YYYY-MM-DD")}&EmployeeId=0&WorkplaceGroupId=${
                      values?.workplaceGroup?.value
                    }&WorkplaceId=${
                      values?.workplace?.value
                    }&PageNo=1&PageSize=10000000&IsPaginated=false&intYearId=${moment(
                      values?.attendanceMonth
                    ).format("YYYY")}&intMonthId=${moment(
                      values?.attendanceMonth
                    ).format("MM")}`
                  );
                  if (res?.data) {
                    setExcelLoading(false);
                    if (res?.data < 1) {
                      return toast.error("No Data Found");
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
              <Col md={4} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="attendanceMonth"
                  label="Attendance Month"
                  placeholder="Attendance Month"
                  format="MMM-YYYY"
                  picker="month"
                  onChange={(value) => {
                    console.log(moment(value).format("MM/YYYY"));
                    form.setFieldsValue({
                      attendanceMonth: value,
                    });
                  }}
                />
              </Col>
              <Col md={4} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="fromDate"
                  label="Joining From Date"
                  placeholder="From Date"
                  onChange={(value) => {
                    form.setFieldsValue({
                      fromDate: value,
                    });
                  }}
                />
              </Col>
              <Col md={4} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="toDate"
                  label="Joining To Date"
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
              <Col md={4} sm={12} xs={24}>
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

export default JoineeAttendanceReport;
