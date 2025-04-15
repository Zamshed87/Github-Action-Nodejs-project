import { Avatar, DataTable, PCard, PCardHeader, PForm } from "Components";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import axios from "axios";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { paginationSize } from "common/peopleDeskTable";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { debounce } from "lodash";
import { getChipStyle } from "modules/employeeProfile/dashboard/components/EmployeeSelfCalendar";
import { fromToDateList } from "modules/timeSheet/reports/helper";
import { getTableDataMonthlyAttendance } from "modules/timeSheet/reports/joineeAttendanceReport/helper";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { gray600 } from "utility/customColor";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "utility/dateFormatter";
import PFilter from "utility/filter/PFilter";
import { formatFilterValue } from "utility/filter/helper";
import { column } from "./helper";

const MonthlyPunchReportDetails = () => {
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wId, wgId, employeeId, orgId, buName },
    tokenData,
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30337),
    []
  );

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

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
  // Form Instance
  const [form] = Form.useForm();
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Monthly Punch Details Report";

    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

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
        reportType: "monthly_in_out_attendance_report_for_all_employee",
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        pageNo: pagination.current || pages?.current,
        pageSize: pagination.pageSize || pages?.pageSize,
        departments: formatFilterValue(values?.department),
        designations: formatFilterValue(values?.designation),
        sections: formatFilterValue(values?.section),
        employeeId: employeeId,
        isPaginated: true,
        dteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
        dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
        searchTxt: searchText || "",
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
        width: 120,
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
        width: 80,
        fixed: "left",
      },
      {
        title: "Workplace/Concern",
        dataIndex: "strWorkplace",
        width: 120,
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
        width: 150,
      },

      {
        title: "Designation",
        dataIndex: "strDesignation",

        width: 80,
      },
      {
        title: "Department",
        dataIndex: "strDepartment",

        width: 80,
      },
      {
        title: "Section",
        dataIndex: "strSectionName",

        width: 80,
      },
      ...(d as any),
    ];
  };
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
                  const res = await axios.get(
                    `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_in_out_attendance_report_for_all_employee&AccountId=${orgId}&BusinessUnitId=${buId}&DteFromDate=${moment(
                      values?.fromDate
                    ).format("YYYY-MM-DD")}&DteToDate=${moment(
                      values?.toDate
                    ).format(
                      "YYYY-MM-DD"
                    )}&EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&PageNo=1&departments=${
                      formatFilterValue(values?.department) || 0
                    }&designations=${formatFilterValue(
                      values?.designation || 0
                    )}&SearchTxt=${
                      values?.search || ""
                    }&PageSize=1000&IsPaginated=false&WorkplaceGroupList=${
                      values?.workplaceGroup?.value == 0 ||
                      values?.workplaceGroup?.value == undefined
                        ? decodedToken.workplaceGroupList
                        : values?.workplaceGroup?.value.toString()
                    }&WorkplaceList=${
                      values?.workplace?.value == 0 ||
                      values?.workplace?.value == undefined
                        ? decodedToken.workplaceList
                        : values?.workplace?.value.toString()
                    }`
                  );
                  if (res?.data) {
                    setExcelLoading(true);
                    if (res?.data < 1) {
                      setExcelLoading(false);
                      return toast.error("No Attendance Data Found");
                    }

                    const newData = res?.data?.map((item: any, index: any) => {
                      return {
                        ...item,
                        sl: index + 1,
                      };
                    });

                    createCommonExcelFile({
                      titleWithDate: `Monthly Punch Details Report - ${dateFormatter(
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
                        B: 15,
                        D: 30,
                        E: 25,
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
            isSection={true}
          />
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
            // scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default MonthlyPunchReportDetails;
