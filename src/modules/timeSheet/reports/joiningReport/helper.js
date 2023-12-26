import axios from "axios";
import AvatarComponent from "common/AvatarComponent";
import { Cell } from "utility/customExcel/createExcelHelper";
import { dateFormatter } from "utility/dateFormatter";

export const getJoiningData = async (
  buId,
  setter,
  setLoading,
  srcTxt,
  pageNo,
  pageSize,
  forExcel = false,
  wgId,
  setPages,
  wId,
  orgId
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/Employee/GetEmployeeSalaryReportByJoining?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}`
    );

    if (res?.data) {
      setter(res?.data);
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
// for excel
export const getTableData = (row, keys, summary) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => {
      return new Cell(item[key], "center", "text").getCell();
    });
  });
  // return [...summaryData, ...data];
  return data;
};

// UI Table columns
export const joiningDtoCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      //   width: 30,
    },
    {
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
      sort: false,
      filter: false,
      render: (record) => record?.workplaceGroup || "N/A",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      sort: false,
      filter: false,
      render: (record) => record?.workplace || "N/A",
    },
    {
      title: "Department",
      dataIndex: "department",
      sort: false,
      filter: false,
      render: (record) => record?.department || "N/A",
    },
    {
      title: "Section",
      dataIndex: "section",
      sort: true,
      fieldType: "string",
      filter: false,
      render: (record) => record?.section || "N/A",
    },

    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: false,
      filter: false,
      width: 120,
      render: (record) => record?.employeeCode || "N/A",
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      sort: false,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.employeeName}
            />
          </div>
          <div className="ml-2">
            <span>{item?.employeeName}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },

    {
      title: "Designation",
      dataIndex: "designation",
      sort: false,
      filter: false,
      render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Payroll Group",
      dataIndex: "payrollGroup",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Basic",
      dataIndex: "basic",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "House Rent",
      dataIndex: "houseRent",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Medical",
      dataIndex: "medical",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Conveyance",
      dataIndex: "conveyance",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Overtime Category",
      dataIndex: "overtimeCategory",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Tiffin to Salary",
      dataIndex: "tiffinToSalary",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Salary Category",
      dataIndex: "salaryCategory",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.joinDate) || "N/A",
      fieldType: "date",
    },
    {
      title: "Job Duration",
      dataIndex: "duration",
      sort: false,
      filter: false,
      //   render: (record) => dateFormatter(record?.joinDate) || "N/A",
      fieldType: "string",
    },
  ];
};
// excel columns
export const column = {
  sl: "SL",
  workplaceGroup: "Workplace Group",
  workplace: "workplace",
  department: "Department",
  section: "Section",
  employeeCode: "Code",
  employeeName: "Employee Name",
  designation: "Designation",
  PayrollGroup: "Payroll Group",
  Basic: "Basic",
  HouseRent: "House Rent",
  Medical: "Medical",
  Conveyance: "Conveyance",
  GrossSalary: "Gross Salary",
  OvertimeCategory: "Overtime Category",
  TiffintoSalary: "Tiffin to Salary",
  SalaryCategory: "Salary Category ",
  PaymentMode: "PaymentMode",
  JoinDate: "Join Date",
  JobDuration: "Job Duration",
};
