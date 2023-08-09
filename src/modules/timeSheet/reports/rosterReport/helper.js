import axios from "axios";
import moment from "moment";
import AvatarComponent from "../../../../common/AvatarComponent";
import { gray600 } from "../../../../utility/customColor";
import { fromToDateList } from "../helper";
export const getBuDetails = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter({});
  }
};
export const onGetRosterReportForAll = (
  wId,
  getRosterReportInformation,
  orgId,
  wgId,
  formValues,
  setRowDto,
  pages,
  setPages,
  isPaginated = "true",
  srcTxt
) => {
  getRosterReportInformation(
    `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=monthly_roster_report_for_all_employee&AccountId=${orgId}&DteFromDate=${
      formValues?.fromDate
    }&DteToDate=${
      formValues?.toDate
    }&EmployeeId=0&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&PageNo=${
      pages?.current
    }&PageSize=${pages?.pageSize}&SearchTxt=${
      srcTxt || ""
    }&IsPaginated=${isPaginated}`,
    (data) => {
      setRowDto?.(data);
      setPages({ ...pages, total: data?.[0]?.totalCount });
    }
  );
};

export const monthlyRosterReportColumns = (
  fromDate,
  toDate,
  page,
  paginationSize
) => {
  const dateList = fromToDateList(fromDate, toDate);
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
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      width: 180,
    },
    ...(dateList?.length > 0 &&
      dateList.map((item) => ({
        title: () => <span style={{ color: gray600 }}>{item?.level}</span>,
        render: (_, record) =>
          record?.[item?.date] ? <span>{record?.[item?.date]}</span> : "-",
        width: 150,
        className: "text-center",
      }))),
  ];
};

export const getfromToDateList = (fromDate, toDate) => {
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
