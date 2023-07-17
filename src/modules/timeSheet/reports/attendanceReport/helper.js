import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";
import { toast } from "react-toastify";

export const attendanceReportColumn = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      width: 150,
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.employeeName}
            />
            <span className="ml-2">{record?.employeeName}</span>
          </div>
        );
      },
      sort: false,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
    },
    {
      title: "Days",
      dataIndex: "workingDays",
    },
    {
      title: "Present",
      dataIndex: "present",
    },
    {
      title: "Absent",
      dataIndex: "absent",
    },
    {
      title: "Late",
      dataIndex: "late",
    },
    {
      title: "Movement",
      dataIndex: "movement",
    },
    {
      title: "Casual Leave",
      dataIndex: "casualLeave",
    },
    {
      title: "Medical Leave",
      dataIndex: "medicalLeave",
    },
    {
      title: "Without Pay Leave",
      dataIndex: "leaveWithoutPay",
    },
    {
      title: "Off Day",
      dataIndex: "weekend",
    },
    {
      title: "Holiday",
      dataIndex: "holiday",
    },
  ];
};

export const getAttendanceReport = async (
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
      `/TimeSheetReport/GetEmpAttendanceReport?FromDate=${fromDate}&ToDate=${toDate}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${WorkplaceGroupId}&PageNo=${pages.current}&PageSize=${pages.pageSize}&IsPaginated=${IsPaginated}${search}&IsXls=false`
      // `/TimeSheetReport/GetAttendanceReport?FromDate=${fromDate}&ToDate=${toDate}&BusinessUnitId=${buId}&AccountId=${AccountId}&IntWorkplaceGroupId=${WorkplaceGroupId}&PageNo=${pages.current}&PageSize=${pages.pageSize}&IsPaginated=${IsPaginated}${search}`
    );
    if (res?.data) {
      setter(res?.data);
      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });
    }
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
