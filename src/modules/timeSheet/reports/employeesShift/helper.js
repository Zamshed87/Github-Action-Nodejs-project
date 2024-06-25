import axios from "axios";
import moment from "moment";

export const getEmployeeInfo = async (
  accId,
  buId,
  employeeId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=EmployeeBasicById&AccountId=${accId}&BusinessUnitId=${buId}&intId=${employeeId}`
    );

    setter && setter(res?.data);

    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const onGetEmployeeShiftInformation = async (
  buId,
  wgId,
  employeeId,
  formDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize,
  setPages
) => {
  setLoading && setLoading(true);

  try {
    const apiUrl = `/TimeSheetReport/MonthlyRosterReportForSingleEmployee?BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&EmployeeId=${employeeId}&FromDate=${formDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}`;

    const res = await axios.get(apiUrl);

    if (res?.data) {
      const modifiedData = res?.data?.data?.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));
      setter && setter?.(modifiedData);

      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });

      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const employeesShiftInformationTableColumn = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Attendance Date",
      dataIndex: "dteAttendanceDate",
      render: (record) => (
        <>
          {record?.dteAttendanceDate
            ? moment(record?.dteAttendanceDate, "YYYY-MM-DDThh:mm:ss").format(
                "DD MMM, YYYY (dddd)"
              )
            : "-"}
        </>
      ),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Calendar Name",
      dataIndex: "strCalendarName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Start Time",
      dataIndex: "dteStartTime",
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Extended Start Time",
      dataIndex: "dteLastStartTime",
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "End Time",
      dataIndex: "dteEndTime",
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      sort: true,
      filter: false,
      fieldType: "string",
    },
  ];
};
export const column = {
  sl: "SL",
  dteAttendanceDate: "Attendance Date",
  strCalendarName: "Calendar Name",
  dteStartTime: "Start Time",
  dteLastStartTime: "Extended Start Time",
  dteEndTime: "End Time",
};
