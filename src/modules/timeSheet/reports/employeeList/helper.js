import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { Cell } from "../../../../utility/customExcel/createExcelHelper";
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
export const allEmployeeList = async (
  { orgId, buId, wgId },
  values,
  setLoading,
  setter,
  setAllData,
  cb,
  pages = {},
  srcText = "",
  setPages
) => {
  const payload = {
    accountId: orgId,
    businessUnitId: buId,
    employeeId: 0,
    workplaceGroupId: wgId || 0,
    payrollGroupId: values?.payrollGroup?.value || 0,
    departmentId: values?.department?.value || 0,
    designationId: values?.designation?.value || 0,
    supervisorId: values?.supervisor?.value || 0,
    rosterGroupId: values?.rosterGroup?.value || 0,
    calendarId: values?.calendar?.value || 0,
    genderId: values?.gender?.value || 0,
    religionId: values?.religion?.value || 0,
    employmentTypeId: values?.employmentType?.value || 0,
    joiningDate: values?.joiningDate || null,
    confirmationDate: values?.confirmDate || null,
    isGivenNid: values?.isNID?.value || 0,
    isGivenBirthCertificate: values?.birthCertificate?.value || 0,
    partName: "AllEmployeeListWithFilter",
    searchTxt: srcText,
    pageNo: pages?.current || 1,
    pageSize: pages?.pageSize || 2000,
  };
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/AllEmployeeListWithFilter`,
      payload
    );
    setter(res?.data);
    setAllData(res?.data);
    setPages?.({
      ...pages,
      current: pages.current,
      pageSize: pages.pageSize,
      total: res?.data[0]?.totalCount,
    });
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
    setAllData([]);
  }
};
// UI Table Columns
export const empReportListColumns = (pages, wgId) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => {
        return (
          <span>
            {pages?.current === 1
              ? index + 1
              : (pages.current - 1) * pages?.pageSize + (index + 1)}
          </span>
        );
      },
      sorter: false,
      filter: false,
      className: "text-center",
      fixed: "left",
      width: 50,
    },
    {
      title: "Code",
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      fixed: "left",
      width: 200,
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.EmployeeName}
            />
            <span className="ml-2">{record?.EmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "Designation",
      sorter: true,
      filter: true,
      width: "200px",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      width: "200px",
    },
    {
      title: "Pin No.",
      dataIndex: "strPinNo",
      sorter: true,
      filter: true,
      width: "200px",
    },
    {
      title: "Wing",
      dataIndex: "wingName",
      sorter: true,
      filter: true,
      width: "200px",
      hidden: wgId !== 3 ? true : false,
    },
    {
      title: "Sole Depo",
      dataIndex: "soleDepoName",
      sorter: true,
      filter: true,
      width: "200px",
      hidden: wgId !== 3 ? true : false,
    },
    {
      title: "Region",
      dataIndex: "regionName",
      sorter: true,
      filter: true,
      width: "200px",
      hidden: wgId !== 3 ? true : false,
    },
    {
      title: "Area",
      dataIndex: "areaName",
      sorter: true,
      filter: true,
      width: "200px",
      hidden: wgId !== 3 ? true : false,
    },
    {
      title: "Territory",
      dataIndex: "TerritoryName",
      sorter: true,
      filter: true,
      width: "200px",
      hidden: wgId !== 3 ? true : false,
    },
    {
      title: "Employment Type",
      dataIndex: "EmploymentType",
      sorter: true,
      filter: true,
      width: "200px",
      render: (_, record) => {
        return (
          <div>{record?.EmploymentType ? record?.EmploymentType : "-"}</div>
        );
      },
    },
    {
      title: "Date of Joining",
      dataIndex: "DateOfJoining",
      isDate: true,
      render: (DateOfJoining) => dateFormatter(DateOfJoining),
      width: "150px",
    },
    {
      title: "Payroll Group",
      dataIndex: "PayrollGroup",
      sorter: true,
      filter: true,
      width: "200px",
    },
    {
      title: "Supervisor",
      dataIndex: "Supervisor",
      sorter: true,
      filter: true,
      width: "200px",
    },
    {
      title: "Date of Permanent",
      dataIndex: "DateOfConfirmation",
      isDate: true,
      render: (DateOfConfirmation) => dateFormatter(DateOfConfirmation),
      width: "150px",
    },
    {
      title: "Father's Name",
      dataIndex: "FatherName",
      width: "200px",
    },
    {
      title: "Mother's Name",
      dataIndex: "MotherName",
      width: "200px",
    },
    {
      title: "Present Address",
      dataIndex: "PresentAddress",
      filter: true,
      width: "250px",
    },
    {
      title: "Permanent Address",
      dataIndex: "PermanentAddress",
      filter: true,
      width: "250px",
    },
    {
      title: "Employee Email",
      dataIndex: "OfficeEmail",
      filter: true,
      width: "180px",
    },
    {
      title: "DoB",
      dataIndex: "DateOfBirth",
      isDate: true,
      render: (DateOfBirth) => dateFormatter(DateOfBirth),
      width: "150px",
    },
    {
      title: "Religion",
      dataIndex: "Religion",
      filter: true,
      width: "100px",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      filter: true,
      width: "80px",
    },
    {
      title: "Marital Status",
      dataIndex: "MaritialStatus",
      filter: true,
      width: "180px",
    },
    {
      title: "Blood Group",
      dataIndex: "BloodGroup",
      filter: true,
      width: "180px",
    },
    {
      title: "Mobile",
      dataIndex: "strPersonalMobile",
      // filter: true,
      width: "150px",
    },
    {
      title: "NID",
      dataIndex: "NID",
      width: "180px",
    },
    {
      title: "Vehicle Number",
      dataIndex: "strVehicleNo",
      width: "180px",
    },
    {
      title: "BID",
      dataIndex: "BirthID",
      key: "BirthID",
      width: "180px",
    },
    {
      title: "Bank Name",
      dataIndex: "BankName",
      key: "BankName",
      filter: true,
      width: "200px",
    },
    {
      title: "Branch",
      dataIndex: "BranchName",
      key: "BranchName",
      filter: true,
      width: "200px",
    },
    {
      title: "Account No",
      dataIndex: "AccountNo",
      key: "AccountNo",
      width: "150px",
    },
    {
      title: "Gross Salary",
      dataIndex: "numGrossSalary",
      key: "numGrossSalary",
      width: "150px",
    },
    {
      title: "Routing",
      dataIndex: "RoutingNo",
      key: "AccountNo",
      width: "150px",
    },
    {
      title: "Status",
      dataIndex: "EmpStatus",
      key: "EmpStatus",
      filter: true,
      width: "100px",
      render: (_, record) => {
        return (
          <div>
            {record?.EmpStatus === "Active" ? (
              <Chips label="Active" classess="success" />
            ) : (
              <Chips label="Inactive" classess="mx-2 danger" />
            )}
          </div>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "strRemarks",
      key: "strRemarks",
      width: "150px",
    },
  ].filter((item) => !item.hidden);
};

// excel Column
export const columnForMarketingForExcel = {
  sl: "SL",
  strEmployeeName: "Employee Name",
  strEmployeeCode: "Code",
  strDesignation: "Designation",
  strDepartment: "Department",
  strPinNo: "Pin No.",
  wingName: "Wing",
  soleDepoName: "Sole Depo",
  regionName: "Region",
  areaName: "Area/Depo",
  TerritoryName: "Territory",
  strEmploymentType: "Employment Type",
  JoiningDate: "Date of Joining",
  strPayrollGroupName: "Payroll Group",
  Supervisor: "Supervisor",
  ConfirmationDate: "Date of Permanent",
  FatherName: "Father's Name",
  MotherName: "Mother's Name",
  PresentAddress: "Present Address",
  PermanentAddress: "Permanent Address",
  strOfficeMail: "Employee Email",
  DateOfBirth: "Date Of Birth",
  strReligion: "Religion",
  strGender: "Gender",
  MaritialStatus: "Maritial Status",
  BloodGroup: "Blood Group",
  strPersonalMobile: "Mobile No",
  NID: "NID",
  strVehicleNo: "Vehicle No",
  BirthID: "BID",
  BankName: "Bank Name",
  BranchName: "Branch",
  AccountNo: "Account No",
  numGrossSalary: "Gross Salary",
  RoutingNo: "Routing",
  strEmployeeStatus: "Status",
  strRemarks: "Remarks",
};
// excel Column
export const columnForExcel = {
  sl: "SL",
  strEmployeeName: "Employee Name",
  strEmployeeCode: "Code",
  strDesignation: "Designation",
  strDepartment: "Department",
  strPinNo: "Pin No.",
  strEmploymentType: "Employment Type",
  JoiningDate: "Date of Joining",
  strPayrollGroupName: "Payroll Group",
  Supervisor: "Supervisor",
  ConfirmationDate: "Date of Permanent",
  FatherName: "Father's Name",
  MotherName: "Mother's Name",
  PresentAddress: "Present Address",
  PermanentAddress: "Permanent Address",
  strOfficeMail: "Employee Email",
  DateOfBirth: "Date Of Birth",
  strReligion: "Religion",
  strGender: "Gender",
  MaritialStatus: "Maritial Status",
  BloodGroup: "Blood Group",
  strPersonalMobile: "Mobile No",
  NID: "NID",
  strVehicleNo: "Vehicle No",
  BirthID: "BID",
  BankName: "Bank Name",
  BranchName: "Branch",
  AccountNo: "Account No",
  numGrossSalary: "Gross Salary",
  RoutingNo: "Routing",
  strEmployeeStatus: "Status",
  strRemarks: "Remarks",
};
// for excel
export const getTableDataEmployeeReports = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => {
      return new Cell(item[key] ? item[key] : "-", "center", "text").getCell();
    });
  });
  return data;
};
