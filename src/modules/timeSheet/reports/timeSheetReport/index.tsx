import { Avatar, DataTable, PCard, PCardHeader, PForm } from "Components";
import type { RangePickerProps } from "antd/es/date-picker";
import { Form } from "antd";
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
import axios from "axios";
import { debounce } from "lodash";
import { getChipStyle } from "modules/employeeProfile/dashboard/components/EmployeeSelfCalendar";
import { gray600 } from "utility/customColor";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { column, getTimeSheetReport } from "./helper";
import { getTableDataMonthlyAttendance } from "../joineeAttendanceReport/helper";
import { fromToDateList } from "../helper";
import CommonFilter from "common/CommonFilter";
import { getFilteredValues } from "modules/approvalList/commonApproval/filterValues";

interface ValuesType {
  fromDate?: string;
  toDate?: string;
  [key: string]: any;
}

interface EmployeeData {
  intEmployeeId: number;
  strEmployeeCode: string;
  strEmployeeName: string;
  strDepartmentName: string;
  strDesignationName: string;
  strWorkplaceGroupName: string;
  strWorkplaceName: string;
  lstAttendanceDate: AttendanceDate[];
}

interface AttendanceDate {
  dteAttendenceDate: string;
  strCalenderName: string;
}

interface FormattedEmployee {
  EmployeeCode: string;
  strEmployeeName: string;
  strDepartment: string;
  strDesignation: string;
  strWorkplaceGroup: string;
  strWorkplace: string;
  strSectionName: string;
  [key: string]: any;
}

const RosterReport = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<ValuesType>({});
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const {
    permissionList,
    profileData: { buId, wgId, wId, employeeId, orgId, buName, intAccountId },
    tokenData,
  } = useSelector((state: any) => state?.auth, shallowEqual);

  const permission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30340),
    []
  );

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  // menu permission
  const employeeFeature: any = permission;

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
  //   api states
  // navTitle
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Flexible TimeSheet Report";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  const { fromDate, toDate } = getFilteredValues(values, wId, wgId);
  //   table column
  const header: any = () => {
    const dateList = fromToDateList(fromDate, toDate);

    const dateColumns = dateList.map((item: any) => ({
      title: () => <span style={{ color: gray600 }}>{item.level}</span>,
      dataIndex: item.date, // Use the date as the key
      render: (_: any, record: any) =>
        record?.[item.date] ? (
          <span style={getChipStyle(record?.[item.date])}>
            {record?.[item.date]}
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
        render: (_: any, rec: any) => (
          <div className="d-flex align-items-center">
            <Avatar title={rec?.strEmployeeName} />
            <span className="ml-2">{rec?.strEmployeeName}</span>
          </div>
        ),
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
      ...dateColumns, // Append the dynamic date columns
    ];
  };

  const searchFunc = debounce((value) => {
    getTimeSheetReport({
      wId: values?.workplace?.value || wId,
      wgId: values?.workplaceGroup?.value || wgId,
      pages,
      fromDate,
      toDate,
      accountId: intAccountId,
      setter: setData,
      setLoading,
      searchText: value || "",
    });
  }, 500);

  useEffect(() => {
    getTimeSheetReport({
      wId,
      wgId,
      pages,
      fromDate: values?.fromDate || fromDate,
      toDate: values?.toDate || toDate,
      accountId: intAccountId,
      setter: setData,
      setLoading,
      searchText: values?.search,
    });
  }, []);

  interface FilterValues {
    [key: string]: any;
  }

  const handleFilter = (values: FilterValues): void => {
    setValues(values);
    const fromDate = values.fromDate
      ? moment(values.fromDate).format("YYYY-MM-DD")
      : moment(monthFirstDate()).format("YYYY-MM-DD");

    const toDate = values.toDate
      ? moment(values.toDate).format("YYYY-MM-DD")
      : moment(monthLastDate()).format("YYYY-MM-DD");

    getTimeSheetReport({
      wId: values?.workplace?.value || wId,
      wgId: values?.workplaceGroup?.value || wgId,
      pages,
      fromDate,
      toDate,
      accountId: intAccountId,
      setter: setData,
      setLoading,
      searchText: values?.search,
    });
  };
  return employeeFeature?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          // landingApiCall({
          //   pagination: {
          //     current: pages?.current,
          //     pageSize: landingApi?.data[0]?.totalCount,
          //   },
          // });
        }}
      >
        <PCard>
          {(excelLoading || loading) && <Loading />}
          <PCardHeader
            exportIcon={true}
            title={`Total ${data?.length || 0} employees`}
            onSearch={(e) => {
              if (e?.target?.value) {
                searchFunc(e?.target?.value);
              } else {
                searchFunc("");
              }

              form.setFieldsValue({
                search: e?.target?.value,
              });
            }}
            onExport={() => {
              const excelLanding = async () => {
                setExcelLoading(true);
                try {
                  const res = await axios.get(
                    `/TimeSheet/GetFlexibleTimesheetReport?WorkplaceId=${wId}&AccountId=${intAccountId}&FromDate=${fromDate}&ToDate=${toDate}`
                  );
                  if (res?.data) {
                    setExcelLoading(true);
                    if (res?.data < 1) {
                      setExcelLoading(false);
                      return toast.error("No Data Found");
                    }

                    const transformedData = res?.data?.map(
                      (employee: EmployeeData, index: any) => {
                        let formattedEmployee: FormattedEmployee = {
                          sl: index + 1,
                          EmployeeCode: employee.strEmployeeCode,
                          strEmployeeName: employee.strEmployeeName,
                          strDepartment: employee.strDepartmentName,
                          strDesignation: employee.strDesignationName,
                          strWorkplaceGroup: employee.strWorkplaceGroupName,
                          strWorkplace: employee.strWorkplaceName,
                          strSectionName: employee.strDesignationName,
                        };

                        employee.lstAttendanceDate.forEach(
                          (attendance: AttendanceDate) => {
                            formattedEmployee[
                              attendance.dteAttendenceDate.split("T")[0]
                            ] = attendance.strCalenderName;
                          }
                        );

                        return formattedEmployee;
                      }
                    );
                    createCommonExcelFile({
                      titleWithDate: `Time Sheet Report - ${dateFormatter(
                        moment(fromDate).format("YYYY-MM-DD")
                      )} to ${dateFormatter(
                        moment(toDate).format("YYYY-MM-DD")
                      )}`,
                      fromDate: "",
                      toDate: "",
                      buAddress: (buDetails as any)?.strAddress,
                      businessUnit: values?.workplaceGroup?.value
                        ? (buDetails as any)?.strWorkplace
                        : buName,
                      tableHeader: column(
                        moment(fromDate).format("YYYY-MM-DD"),
                        moment(toDate).format("YYYY-MM-DD")
                      ),
                      getTableData: () =>
                        getTableDataMonthlyAttendance(
                          transformedData,
                          Object.keys(
                            column(
                              moment(fromDate).format("YYYY-MM-DD"),
                              moment(toDate).format("YYYY-MM-DD")
                            )
                          )
                        ),

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
                }
              };
              excelLanding();
            }}
            filterComponent={
              <CommonFilter
                visible={isFilterVisible}
                onClose={(visible) => setIsFilterVisible(visible)}
                onFilter={handleFilter}
                isDate={true}
                isWorkplaceGroup={true}
                isWorkplace={true}
                isDepartment={false}
                isDesignation={false}
                isAllValue={false}
              />
            }
          />

          <DataTable
            bordered
            data={data || []}
            header={header()}
            pagination={{
              pageSize: pages?.pageSize,
              // total: landingApi?.data[0]?.totalCount,
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
              // landingApiCall({
              //   pagination,
              //   searchText: form.getFieldValue("search"),
              // });
            }}
            //scroll={{ x: 2000 }}
          />
        </PCard>
      </PForm>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default RosterReport;
