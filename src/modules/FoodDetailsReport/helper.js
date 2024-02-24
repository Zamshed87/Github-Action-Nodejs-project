import axios from "axios";
import AvatarComponent from "../../common/AvatarComponent";

export const getDailyCafeteriaReport = async (
  accId,
  mealPlace,
  mealDate,
  isDownload,
  setter,
  setIsLoading,
  cb
) => {
  setIsLoading(true);
  try {
    const res = await axios.get(
      `/Cafeteria/GetDailyCafeteriaReport?accountId=${accId}&mealDate=${mealDate}&isDownload=${isDownload}&MealConsumePlaceId=${mealPlace }`
    );
    setIsLoading(false);
    setter(res?.data);
    cb && cb();
  } catch (err) {
    setIsLoading(false);
    setter([]);
  }
};

export const getMonthlyCafeteriaReport = async (
  accId,
  fromDate,
  toDate,
  isDownload,
  setter,
  setIsLoading,
  placeId
) => {
  setIsLoading(true);
  try {
    const res = await axios.get(
      `/Cafeteria/GetCafeteriaReportALL?PartId=1&FromDate=${fromDate}&ToDate=${toDate}&ReportType=0&LoginBy=0&BusinessUnitId=0&MealConsumePlaceId=${placeId}`
    );
    setIsLoading(false);
    setter(res?.data);
  } catch (err) {
    setIsLoading(false);
    setter([]);
  }
};
export const getPlaceDDL = async (
  ddlType,
  accId,
  setter,
  id
) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&AccountId=${accId}&intId=${
        id || 0
      }`
    );

    setter(res?.data)
  } catch (error) {}
};
export const mealColumns = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      width: 60,
    },
    {
      title: "Enroll",
      sorter: true,
      filter: true,
      dataIndex:"employeeId"
    },
    {
      title: "Employee Name",
      dataIndex: "employeeFullName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.employeeFullName}
            />
            <span className="ml-2">{record?.employeeFullName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
      filter: true,
    },
    {
      title: "Business Unit",
      dataIndex: "businessUnitName",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
      filter: true,
    },
    {
      title: "Meal Count",
      dataIndex: "mealCount",
      sorter: true,
      filter: true,
    },
    {
      title: "Meal Date",
      dataIndex: "mealDate",
      sorter: true,
      filter: true,
    },
    {
      title: "Consumption Place",
      dataIndex: "mealConsumePlaceName",
      sorter: true,
      filter: true,
    },
  ];
};

export const mealColumnsType2 = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, __, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      fixed:"left", 
      width: 60,
    },
    {
      title: "Enroll",
      sorter: true,
      filter: true,
      dataIndex:"employeeId",
      width: 100,
      fixed:"left", 
    },
    {
      title: "Employee Name",
      dataIndex: "employeeFullName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.employeeFullName}
            />
            <span className="ml-2">{record?.employeeFullName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
      width:150,
      fixed:"left", 
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
      filter: true,
      width: 150,
    },
    {
      title: "Business Unit",
      dataIndex: "businessUnitName",
      sorter: true,
      filter: true,
      width: 150,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
      filter: true,
      width: 150,
    },
    {
      title: "Consume Place",
      dataIndex: "MealConsumePlace",
      sorter: true,
      filter: true,
      width: 150,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      sorter: true,
      width:100
    },
    {
      title: "Own Meal",
      dataIndex: "own",
      sorter: true,
      width:100,
    },
    {
      title: "Guest Meal",
      dataIndex: "guest",
      sorter: true,
      width:100,
    },
    {
      title: "Total Meal",
      dataIndex: "total",
      sorter: true,
      width:100,
    },
    {
      title: "Own Tk",
      dataIndex: "ownTk",
      sorter: true,
      width:100,
    },
    {
      title: "Company Tk",
      dataIndex: "companyPay",
      sorter: true,
      width:100,
    },
    {
      title: "Guest Tk",
      dataIndex: "guestTk",
      sorter: true,
      width:100,
    },
    {
      title: "Total Tk",
      dataIndex: "totalTk",
      sorter: true,
      width:100,
    },
  ];
};
