import axios from "axios";
import AvatarComponent from "common/AvatarComponent";
import { Cell } from "utility/customExcel/createExcelHelper";
import { dateFormatter } from "utility/dateFormatter";

export const getJoiningData = async (
  buId,
  setter,
  setLoading,
  srcTxt = " ",
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
      `/Employee/GetEmployeeSalaryReportByJoining?IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&PageNo=${pageNo}&PageSize=${pageSize}&SearchText=${
        srcTxt ? srcTxt : null
      }}`
    );

    if (res?.data) {
      setter(res?.data);
      setPages({
        current: pageNo,
        pageSize: pageSize,
        total: res?.data[0]?.totalCount,
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
export const joiningDtoCol = (page, paginationSize, wName, wgName) => {
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
      // dataIndex: "workplaceGroup",
      sort: false,
      filter: false,
      render: () => wgName || "N/A",
    },
    {
      title: "Workplace",
      // dataIndex: "workplace",
      sort: false,
      filter: false,
      render: () => wName || "N/A",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: false,
      filter: false,
      // render: (record) => record?.strDepartment || "N/A",
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
      dataIndex: "strEmployeeCode",
      sort: false,
      filter: false,
      width: 120,
      render: (record) => record?.strEmployeeCode || "N/A",
    },
    {
      title: "Employee",
      dataIndex: "strEmployeeName",
      sort: false,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.strEmployeeName}
            />
          </div>
          <div className="ml-2">
            <span>{item?.strEmployeeName}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },

    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: false,
      filter: false,
      // render: (record) => record?.designation || "N/A",
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
      dataIndex: "Basic",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "House Rent",
      dataIndex: "House",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Medical",
      dataIndex: "Medical",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Conveyance",
      dataIndex: "Conveyance",
      sort: false,
      filter: false,
      //   render: (record) => record?.designation || "N/A",
      fieldType: "string",
    },
    {
      title: "Gross Salary",
      dataIndex: "numGrossSalary",
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
      // dataIndex: "joinDate",?
      sort: false,
      filter: false,
      render: (record) => dateFormatter(record?.dteJoiningDate) || "N/A",
      fieldType: "date",
    },
    {
      title: "Job Duration",
      dataIndex: "strServiceLength",
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
  strDepartment: "Department",
  section: "Section",
  strEmployeeCode: "Code",
  strEmployeeName: "Employee Name",
  strDesignation: "Designation",
  PayrollGroup: "Payroll Group",
  Basic: "Basic",
  House: "House Rent",
  Medical: "Medical",
  Conveyance: "Conveyance",
  numGrossSalary: "Gross Salary",
  OvertimeCategory: "Overtime Category",
  TiffintoSalary: "Tiffin to Salary",
  SalaryCategory: "Salary Category ",
  PaymentMode: "PaymentMode",
  dteJoiningDate: "Join Date",
  strServiceLength: "Job Duration",
};
