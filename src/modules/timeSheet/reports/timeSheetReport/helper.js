import moment from "moment";
import AvatarComponent from "../../../../common/AvatarComponent";
import { gray600 } from "../../../../utility/customColor";
import { fromToDateList } from "../helper";
import axios from "axios";

export const timeSheetReportColumn = (
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
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroup",
      sorter: false,
      fixed: "left",
      filter: false,
      width: 180,
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      sorter: false,
      filter: false,
      fixed: "left",
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
      // fixed: "left",
      width: 200,
    },
    {
      title: () => <span style={{ color: gray600 }}>Employee ID</span>,
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
      // fixed: "left",
      width: 120,
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
  const dateList = [];
  for (let i = 0; i <= difference; i++) {
    const newDate = moment(fromDate).add(i, "days").format("YYYY-MM-DD");
    const dateLevel = moment(newDate, "YYYY-MM-DD").format("DD MMM, YYYY");
    dateList.push({ date: newDate, level: dateLevel });
  }
  return dateList;
};
export const column = (fromDate, toDate) => {
  const dateList = fromToDateList(fromDate, toDate);
  let tempObj = {};
  dateList?.length > 0 &&
    dateList.forEach((item, index) => {
      tempObj = {
        ...tempObj,
        [item?.date]: item?.level,
      };
    });
  return {
    sl: "SL",
    strWorkplaceGroup: "Workplace Group",
    strWorkplace: "Workplace",
    strDepartment: "Department",
    strSectionName: "Section",
    EmployeeCode: "Code",
    strEmployeeName: "Employee Name",
    strDesignation: "Designation",
    ...tempObj,
  };
};

export const getTimeSheetReport = async ({
  wId,
  wgId,
  pages,
  fromDate,
  toDate,
  accountId,
  setter,
  setLoading,
  searchText = "",
}) => {
  try {
    setLoading(true);
    let res = await axios.get(
      `/TimeSheet/GetFlexibleTimesheetReport?WorkplaceId=${wId}&AccountId=${accountId}&FromDate=${fromDate}&ToDate=${toDate}&PageNumber=${pages?.current}&PageSize=${pages?.pageSize}&WorkplaceGroupId=${wgId}&Search=${searchText}`
    );
    setLoading(false);
    if (res.data && Array.isArray(res.data.data)) {
      // Transform response
      const transformedData = res.data.data.map((employee) => {
        let formattedEmployee = {
          intEmployeeBasicInfoId: employee.intEmployeeId,
          EmployeeCode: employee.strEmployeeCode,
          strEmployeeName: employee.strEmployeeName,
          strDepartment: employee.strDepartmentName,
          strDesignation: employee.strDesignationName,
          strWorkplaceGroup: employee.strWorkplaceGroupName,
          strWorkplace: employee.strWorkplaceName,
          strSectionName: employee.strDesignationName,
        };

        employee.lstAttendanceDate.forEach((attendance) => {
          formattedEmployee[attendance.dteAttendenceDate.split("T")[0]] =
            attendance.strCalenderName;
        });

        return formattedEmployee;
      });

      setter(transformedData);
    } else {
      setLoading(false);
      console.warn("Unexpected response format:", res.data);
      return [];
    }
  } catch (error) {
    setLoading(false);
    console.error("Error fetching time sheet report:", error);
    return [];
  }
};
