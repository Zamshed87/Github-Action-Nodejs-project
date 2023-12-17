import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import { gray600 } from "../../../utility/customColor";

export const attendanceDetailsReport = async (
  empId,
  frmDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetAttendanceDetailsReport?TypeId=0&EmployeeId=${empId}&FromDate=${frmDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const empBasicInfo = async (buId, orgId, empId, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=EmployeeBasicById&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${empId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
export const getBuDetails = async (buId, setter, setLoading) => {
  // used in many component
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};
export const getAttendenceReport = async (
  AccountId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading,
  WorkplaceGroupId,
  pages,
  setPages,
  srcText,
  IsPaginated = true
) => {
  let search = srcText ? `&SearchTxt=${srcText}` : "";

  try {
    setLoading(true);

    const res = await axios.get(
      `/TimeSheetReport/GetAttendanceReport?FromDate=${fromDate}&ToDate=${toDate}&BusinessUnitId=${buId}&AccountId=${AccountId}&IntWorkplaceGroupId=${WorkplaceGroupId}&PageNo=${pages.current}&PageSize=${pages.pageSize}&IsPaginated=${IsPaginated}${search}`
    );
    if (res?.data) {
      setter(res?.data);
      setPages({
        ...pages,
        current: pages.current,
        pageSize: pages.pageSize,
        total: res?.data[0]?.totalCount,
      });
    }
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getAttendenceDetailsReport = async (
  typeId,
  empId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/TimeSheetReport/GetAttendanceDetailsReport?TypeId=${typeId}&EmployeeId=${empId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getRosterReport = async (
  accId,
  buId,
  workplaceId,
  workplaceGroupId,
  calendarId,
  departmentId,
  designationId,
  date,
  calendarType,
  rosterGroupId,
  setter,
  setLoading,
  setTableRowDto,
  fromDate,
  toDate,
  srcText,
  pages,
  setPages,
  isPaginated = true
) => {
  let search = srcText ? `&SearchTxt=${srcText}` : "";
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_in_out_attendance_report_for_all_employee&AccountId=${accId}&DteFromDate=${fromDate}&DteToDate=${toDate}&EmployeeId=0&WorkplaceGroupId=${workplaceGroupId}&WorkplaceId=${workplaceId}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&IsPaginated=${isPaginated}${search}`
    );
    setter?.(res?.data);
    setTableRowDto?.(res?.data);
    setLoading?.(false);
    setPages({
      ...pages,
      current: pages.current,
      pageSize: pages.pageSize,
      total: res?.data[0]?.totalCount,
    });
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getRosterDetails = async (
  monthId,
  yearId,
  buId,
  depList,
  designationId,
  workplaceGroupId,
  employeeTypeId,
  serachText,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/TimeSheetReport/GetRosterDetailsReport?monthId=${monthId}&yearId=${yearId}&businessUnitId=${buId}&departmentList=${depList}&designationId=${designationId}&workplaceGroupId=${workplaceGroupId}&employmentTypeId=${employeeTypeId}&srcText=${serachText}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getAttendanceByRoster = async (
  monthId,
  yearId,
  buId,
  depList,
  workplaceGroupId,
  employmentType,
  srcText,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/TimeSheetReport/GetAttendanceByRosterReport?monthId=${monthId}&yearId=${yearId}&businessUnitId=${buId}&departmentList=${depList}&workplaceGroupId=${workplaceGroupId}&employmentTypeId=${employmentType}&srcText=${srcText}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getAllLveLeaveType = async (accId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(`/SaasMasterData/GetAllLveLeaveType`);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const fromToDateList = (fromDate, toDate) => {
  fromDate = moment(fromDate, "YYYY-MM-DD");
  toDate = moment(toDate, "YYYY-MM-DD");
  const difference = moment(toDate, "YYYY-MM-DD").diff(fromDate, "days");
  let dateList = [];
  for (let i = 0; i <= difference; i++) {
    const newDate = moment(fromDate).add(i, "days").format("YYYY-MM-DD");
    const dateLevel = moment(newDate, "YYYY-MM-DD").format("DD MMM, YYYY");
    dateList.push({ date: newDate, level: dateLevel });
  }
  return dateList;
};

export const rosterReportDtoCol = (page, paginationSize, columnList) => {
  return [
    {
      title: () => <span style={{ color: gray600, minWidth: "25px" }}>SL</span>,
      render: (_, __, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      width: 40,
      fixed: "left",
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      sorter: false,
      filter: false,
      width: 180,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace ",
      sorter: false,
      filter: false,
      width: 180,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      width: 180,
    },
    {
      title: "Section",
      dataIndex: "strSectionName",
      sorter: true,
      filter: true,
      width: 180,
    },
    {
      title: () => <span style={{ color: gray600 }}>Employee ID</span>,
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
      fixed: "left",
      width: 120,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName}
            />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
      fixed: "left",
      width: 200,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      width: 180,
    },

    ...(columnList?.length > 0 &&
      columnList.map((item) => ({
        title: () => <span style={{ color: gray600 }}>{item?.level}</span>,
        dataIndex: item?.date,
        width: 150,
      }))),
  ];
};
