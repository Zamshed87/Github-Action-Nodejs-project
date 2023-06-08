import { gray600 } from "../../../../utility/customColor";
import moment from "moment";
import axios from "axios";
export const getBuDetails = async (buId, setter, setLoading) => {
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
export const onGetEmployeeInfoForEmployeesShift = (
  getEmployeeInformation,
  accId,
  buId,
  employeeId,
  cb
) => {
  getEmployeeInformation(
    `/Employee/PeopleDeskAllLanding?TableName=EmployeeBasicById&AccountId=${accId}&BusinessUnitId=${buId}&intId=${employeeId}`,
    (response) => {
      cb?.(response?.[0]);
    }
  );
};
export const onGetEmployeeShiftInformation = (
  getEmployeesShiftImpormation,
  orgId,
  employeeId,
  workplaceGroupId,
  workplaceId,
  fromDate,
  toDate,
  pages,
  setPages,
  isPaginated=true
) => {
  getEmployeesShiftImpormation(
    `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_roster_report_for_single_employee&AccountId=${orgId}&DteFromDate=${fromDate}&DteToDate=${toDate}&EmployeeId=${employeeId}&WorkplaceGroupId=${
      workplaceGroupId || 0
    }&WorkplaceId=${workplaceId || 0}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&IsPaginated=${isPaginated}`
  );
};

export const employeesShiftInformationTableColumn = (page,
  paginationSize) => {
  return [
    {
      title: () => (
        <div style={{ color: gray600, textAlign: "center" }}>SL</div>
      ),
      render: (_, __, index) => (
        <>{(page - 1) * paginationSize + index + 1}</>
      ),
      width: 40,
      className:"text-center"
    },
    {
      title: () => <span style={{ color: gray600 }}>Attendance Date</span>,
      render: (_, record) => (
        <>
          {record?.dteAttendanceDate
            ? moment(record?.dteAttendanceDate, "YYYY-MM-DDThh:mm:ss").format(
                "DD MMM, YYYY (dddd)"
              )
            : "-"}
        </>
      ),
    },
    {
      title: "Calendar Name",
      dataIndex: "strCalendarName",
      sorter: true,
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Start Time</span>,
      dataIndex: "dteStartTime",
      className: "text-center",
    },
    {
      title: () => <span style={{ color: gray600 }}>Extended Start Time</span>,
      dataIndex: "dteLastStartTime",
      className: "text-center",
    },
    {
      title: () => <span style={{ color: gray600 }}>End Time</span>,
      dataIndex: "dteEndTime",
      className: "text-center",
    },
  ];
};
