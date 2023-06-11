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
      dataIndex: "employeeCode",
      sorter: true,
      filter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      fixed: "left",
      width: 200,
      render: (_, record) => {
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
      sorter: true,
      filter: true,
    },
    {
      title: "Designation",
      dataIndex: "designation",
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
      dataIndex: "religion",
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
      dataIndex: "territoryName",
      sorter: true,
      filter: true,
      width: "200px",
      hidden: wgId !== 3 ? true : false,
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      sorter: true,
      filter: true,
      width: "200px",
      render: (_, record) => {
        return (
          <div>{record?.employmentType ? record?.employmentType : "-"}</div>
        );
      },
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      isDate: true,
      render: (dateOfJoining) => dateFormatter(dateOfJoining),
      width: "150px",
    },
    {
      title: "Payroll Group",
      dataIndex: "payrollGroup",
      sorter: true,
      filter: true,
      width: "200px",
    },
    {
      title: "Supervisor",
      dataIndex: "supervisor",
      sorter: true,
      filter: true,
      width: "200px",
    },
    {
      title: "Date of Permanent",
      dataIndex: "dateOfConfirmation",
      isDate: true,
      render: (dateOfConfirmation) => dateFormatter(dateOfConfirmation),
      width: "150px",
    },
    {
      title: "Father's Name",
      dataIndex: "fatherName",
      width: "200px",
    },
    {
      title: "Mother's Name",
      dataIndex: "motherName",
      width: "200px",
    },
    {
      title: "Present Address",
      dataIndex: "presentAddress",
      filter: true,
      width: "250px",
    },
    {
      title: "Permanent Address",
      dataIndex: "permanentAddress",
      filter: true,
      width: "250px",
    },
    {
      title: "Employee Email",
      dataIndex: "email",
      filter: true,
      width: "180px",
    },
    {
      title: "DoB",
      dataIndex: "dateOfBirth",
      isDate: true,
      render: (dateOfBirth) => dateFormatter(dateOfBirth),
      width: "150px",
    },
    {
      title: "Religion",
      dataIndex: "religion",
      filter: true,
      width: "100px",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filter: true,
      width: "80px",
    },
    {
      title: "Marital Status",
      dataIndex: "maritialStatus",
      filter: true,
      width: "180px",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
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
      dataIndex: "nid",
      width: "180px",
    },
    {
      title: "Vehicle Number",
      dataIndex: "strVehicleNo",
      width: "180px",
    },
    {
      title: "BID",
      dataIndex: "birthID",
      key: "birthID",
      width: "180px",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      filter: true,
      width: "200px",
    },
    {
      title: "Branch",
      dataIndex: "branchName",
      key: "branchName",
      filter: true,
      width: "200px",
    },
    {
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
      width: "150px",
    },
    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
      width: "150px",
    },
    {
      title: "Routing",
      dataIndex: "routingNo",
      key: "routingNo",
      width: "150px",
    },
    {
      title: "Status",
      dataIndex: "empStatus",
      key: "empStatus",
      filter: true,
      width: "100px",
      render: (_, record) => {
        return (
          <div>
            {record?.empStatus === "Active" ? (
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
  employeeName: "Employee Name",
  employeeCode: "Code",
  designation: "Designation",
  strDepartment: "Department",
  strPinNo: "Pin No.",
  wingName: "Wing",
  soleDepoName: "Sole Depo",
  religion: "Region",
  areaName: "Area/Depo",
  territoryName: "Territory",
  employmentType: "Employment Type",
  dateOfJoining: "Date of Joining",
  payrollGroup: "Payroll Group",
  supervisor: "Supervisor",
  dateOfConfirmation: "Date of Permanent",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  presentAddress: "Present Address",
  permanentAddress: "Permanent Address",
  email: "Employee Email",
  dateOfBirth: "Date Of Birth",
  strReligion: "Religion",
  gender: "Gender",
  maritialStatus: "Maritial Status",
  bloodGroup: "Blood Group",
  strPersonalMobile: "Mobile No",
  nid: "NID",
  strVehicleNo: "Vehicle No",
  birthID: "BID",
  bankName: "Bank Name",
  branchName: "Branch",
  accountNo: "Account No",
  grossSalary: "Gross Salary",
  routingNo: "Routing",
  empStatus: "Status",
  strRemarks: "Remarks",
};
// excel Column
export const columnForExcel = {
  sl: "SL",
  employeeName: "Employee Name",
  employeeCode: "Code",
  designation: "Designation",
  strDepartment: "Department",
  strPinNo: "Pin No.",
  employmentType: "Employment Type",
  dateOfJoining: "Date of Joining",
  payrollGroup: "Payroll Group",
  supervisor: "Supervisor",
  dateOfConfirmation: "Date of Permanent",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  presentAddress: "Present Address",
  permanentAddress: "Permanent Address",
  email: "Employee Email",
  dateOfBirth: "Date Of Birth",
  religion: "Religion",
  gender: "Gender",
  maritialStatus: "Maritial Status",
  bloodGroup: "Blood Group",
  strPersonalMobile: "Mobile No",
  nid: "NID",
  strVehicleNo: "Vehicle No",
  birthID: "BID",
  bankName: "Bank Name",
  branchName: "Branch",
  accountNo: "Account No",
  grossSalary: "Gross Salary",
  routingNo: "Routing",
  empStatus: "Status",
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
