import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import { Cell } from "../../../../utility/customExcel/createExcelHelper";
import { dateFormatter } from "../../../../utility/dateFormatter";
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
export const empReportListColumns = (
  page,
  paginationSize,
  wgId,
  headerList
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      // width: 30,
      fixed: "left",
    },
    {
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: true,
      filterDropDownList: headerList[`strWorkplaceGroupList`],
      width: 200,
      fixed: "left",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: true,
      filterDropDownList: headerList[`strWorkplaceList`],
      width: 200,
      fixed: "left",
    },
    {
      title: "Division",
      dataIndex: "strDivision",
      sorter: true,
      filter: true,
      width: "200px",
      filterDropDownList: headerList[`strDivisionList`],
      fieldType: "string",
      fixed: "left",
    },

    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      width: "200px",
      filterDropDownList: headerList[`strDepartmentList`],
      fieldType: "string",
    },
    {
      title: "Section",
      dataIndex: "strSection",
      sorter: true,
      filter: true,
      width: "200px",
      filterDropDownList: headerList[`strSectionList`],
      fieldType: "string",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sorter: false,
      filter: false,
      width: 100,
      fixed: "left",
    },
    {
      title: "Employee Name",
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
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      width: "200px",
      filterDropDownList: headerList[`strDesignationList`],
      fieldType: "string",
    },

    {
      title: "HR Position/Employee Type",
      dataIndex: "strHrPosition",
      sorter: true,
      filter: true,
      filterDropDownList: headerList[`strHrPositionList`],
      width: 300,
    },

    {
      title: "Employment Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
      width: "200px",
      render: (record) => {
        return (
          <div>
            {record?.strEmploymentType ? record?.strEmploymentType : "-"}
          </div>
        );
      },
      fieldType: "string",
      filterDropDownList: headerList[`strEmploymentTypeList`],
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      isDate: true,
      render: (item) => dateFormatter(item?.dateOfJoining),
      width: "150px",
      sorter: false,
      filter: false,
    },
    {
      title: "Payroll Group",
      dataIndex: "payrollGroup",
      sorter: false,
      filter: false,
      width: "200px",
    },
    {
      title: "Supervisor",
      dataIndex: "strSupervisorName",
      sorter: true,
      filter: true,
      width: "200px",
      filterDropDownList: headerList[`strSupervisorNameList`],
      fieldType: "string",
    },
    {
      title: "Dotted Supervisor",
      dataIndex: "strDottedSupervisorName",
      sorter: true,
      filter: true,
      width: "200px",
      filterDropDownList: headerList[`strDottedSupervisorNameList`],
      fieldType: "string",
    },
    {
      title: "Line Manager",
      dataIndex: "strLinemanager",
      sorter: true,
      filter: true,
      width: "200px",
      filterDropDownList: headerList[`strLinemanagerList`],
      fieldType: "string",
    },
    {
      title: "Date of Permanent",
      dataIndex: "dateOfConfirmation",
      isDate: true,
      render: (item) => dateFormatter(item?.dateOfConfirmation),
      width: "150px",
      sorter: false,
      filter: false,
    },
    {
      title: "Father's Name",
      dataIndex: "fatherName",
      width: "200px",
      sorter: false,
      filter: false,
    },
    {
      title: "Mother's Name",
      dataIndex: "motherName",
      width: "200px",
      sorter: false,
      filter: false,
    },
    {
      title: "Present Address",
      dataIndex: "presentAddress",
      width: "250px",
      sorter: false,
      filter: false,
    },
    {
      title: "Permanent Address",
      dataIndex: "permanentAddress",
      sorter: false,
      filter: false,
      width: "250px",
    },
    {
      title: "Employee Email",
      dataIndex: "email",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Place of Brith",
      dataIndex: "strBirthPlace",
      isDate: true,
      width: "150px",
      sorter: false,
      filter: false,
    },
    {
      title: "Personal Email",
      dataIndex: "email",
      isDate: true,
      width: "150px",
      sorter: false,
      filter: false,
    },
    {
      title: "Office Email",
      dataIndex: "officeEmail",
      isDate: true,
      width: "150px",
      sorter: false,
      filter: false,
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      isDate: true,
      render: (item) => dateFormatter(item?.dateOfBirth),
      width: "150px",
      sorter: false,
      filter: false,
    },
    {
      title: "Religion",
      dataIndex: "religion",
      sorter: false,
      filter: false,
      width: "100px",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: false,
      filter: false,
      width: "80px",
    },
    {
      title: "Marital Status",
      dataIndex: "maritialStatus",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Personal Mobile",
      dataIndex: "personalMobile",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Official Mobile",
      dataIndex: "mobileNo",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Nominee Name",
      dataIndex: "nomineeName",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Relationship",
      dataIndex: "nomineeRelationship",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Nominee NID/BRC",
      dataIndex: "nomineeNID",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Emergency Contact Number",
      dataIndex: "EmeregencyContact",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "Employee NID",
      dataIndex: "nid",
      sorter: false,
      filter: false,
      width: "180px",
    },
    {
      title: "BRC",
      dataIndex: "birthID",
      sorter: false,
      filter: false,
      width: "150px",
    },
    {
      title: "TIN No.",
      dataIndex: "tin",
      width: "180px",
      sorter: false,
      filter: false,
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      sorter: false,
      filter: false,
      width: "200px",
    },
    {
      title: "Branch",
      dataIndex: "branchName",
      key: "branchName",
      sorter: false,
      filter: false,
      width: "200px",
    },
    {
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
      width: "150px",
      sorter: false,
      filter: false,
    },
    // {
    //   title: "Gross Salary",
    //   dataIndex: "grossSalary",
    //   key: "grossSalary",
    //   width: "150px",
    //   sorter: false,
    //   filter: false,
    // },
    {
      title: "Routing",
      dataIndex: "routingNo",
      key: "routingNo",
      width: "150px",
      sorter: false,
      filter: false,
    },
    {
      title: "Status",
      dataIndex: "empStatus",
      key: "empStatus",
      sorter: false,
      filter: false,
      width: "100px",
      render: (record) => {
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
  ].filter((item) => !item.hidden);
};

// excel Column
export const columnForExcel = {
  sl: "SL",
  strWorkplaceGroup: "Workplace Group",
  strWorkplace: "Workplace",
  strDivision: "Division",
  strDepartment: "Department",
  strSection: "Section",
  employeeCode: "Employee Id",
  employeeName: "Employee Name",
  strDesignation: "Designation",
  strHrPosition: "HR Position/Employee Type",
  strEmploymentType: "Employment Type",
  dateOfJoining: "Date of Joining",
  payrollGroup: "Payroll Group",
  strSupervisorName: "Supervisor",
  strDottedSupervisorName: "Dotted Supervisor",
  strLinemanager: "Line Manager",
  dateOfConfirmation: "Date of Permanent",
  fatherName: "Father's Name",
  motherName: "Mother's Name",
  presentAddress: "Present Address",
  permanentAddress: "Permanent Address",
  email: "Employee Email",
  strBirthPlace: "Place of Brith",
  officeEmail: "Office Email",
  dateOfBirth: "Date Of Birth",
  religion: "Religion",
  gender: "Gender",
  maritialStatus: "Maritial Status",
  bloodGroup: "Blood Group",
  personalMobile: "Personal Mobile",
  mobileNo: "Official Mobile",
  nomineeName: "Nominee Name",
  nomineeRelationship: "Relationship",
  nomineeNID: "Nominee NID/BRC",
  EmeregencyContact: "Emergency Contact Number",
  nid: "Employee NID",
  birthID: "BRC",
  tin: "TIN No.",
  bankName: "Bank Name",
  branchName: "Branch",
  accountNo: "Account No",
  routingNo: "Routing",
  empStatus: "Status",
  strRemarks: "Remarks",
};
// for excel
export const getTableDataEmployeeReports = (row, keys) => {
  const data = row?.map((item) => {
    return keys?.map((key) => {
      return new Cell(item[key] ? item[key] : "-", "center", "text").getCell();
    });
  });
  return data;
};
