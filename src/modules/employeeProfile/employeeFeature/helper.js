import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Avatar } from "Components";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import AvatarComponent from "../../../common/AvatarComponent";
import { Cell } from "../../../utility/customExcel/createExcelHelper";
import { dateFormatter } from "../../../utility/dateFormatter";

// const getYearMonth2 = (value) => {
//   let splitMonth = value?.split("-");
//   let year2 = splitMonth?.[0];
//   let month2 = splitMonth?.[1];
//   return { year2, month2 };
// };

// function getDaysInMonth2(year2, month2) {
//   return new Date(year2, month2, 0).getDate();
// }

export const getBuDetails = async (buId, setter, setLoading) => {
  setLoading && setLoading(true);
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

export const createEditEmpAction = async (
  values,
  buId,
  intUrlId,
  setLoading,
  cb,
  isEdit,
  intSignature = 0
) => {
  // let { year2, month2 } = getYearMonth2(values?.dteInternCloseDate);
  // let lastDaysInternCloseDate = getDaysInMonth2(year2, month2);
  // console.log("values?.dateofBirth", values?.dateofBirth)
  // console.log({values})
  try {
    let payload = {
      intPayscaleGradeId: values?.payScaleGrade?.value,
      strPayscaleGradeName: values?.payScaleGrade?.label,
      intSalaryTypeId: values?.salaryType?.value,
      strSalaryTypeName: values?.salaryType?.label,
      intEmployeeBasicInfoId: values?.empId || 0,
      strEmployeeCode: String(values?.employeeCode),
      strCardNumber: String(values?.employeeCode),
      strEmployeeName: values?.fullName,
      intGenderId: values?.gender?.value,
      strGender: values?.gender?.label,
      intReligionId: values?.religion?.value,
      strReligion: values?.religion?.label,
      strMaritalStatus: "",
      strBloodGroup: "",
      IntSectionId: values?.section?.value || 0,
      intDepartmentId: values?.department?.value,
      intDesignationId: values?.designation?.value,
      dteDateOfBirth: moment(values?.dateofBirth).format("YYYY-MM-DD"),
      dteJoiningDate: moment(values?.joiningDate).format("YYYY-MM-DD"),
      dteInternCloseDate:
        values?.dteInternCloseDate & values?.lastDaysInternCloseDate
          ? moment(values?.dteInternCloseDate).format("YYYY-MM-DD") +
            "-" +
            moment(values?.lastDaysInternCloseDate).format("YYYY-MM-DD")
          : null,
      dteProbationaryCloseDate: values?.dteProbationaryCloseDate
        ? moment(values?.dteProbationaryCloseDate).format("YYYY-MM-DD")
        : null,
      dteConfirmationDate: values?.dteConfirmationDate
        ? moment(values?.dteConfirmationDate).format("YYYY-MM-DD")
        : null,
      dteContactFromDate: values?.contractualFromDate
        ? moment(values?.contractualFromDate).format("YYYY-MM-DD")
        : null,
      dteContactToDate: values?.contractualToDate
        ? moment(values?.contractualToDate).format("YYYY-MM-DD")
        : null,
      intSupervisorId: values?.supervisor?.value,
      intLineManagerId: values?.lineManager?.value,
      intDottedSupervisorId: values?.dottedSupervisor?.value,
      isSalaryHold: values?.isSalaryHold,
      isTakeHomePay: values?.isTakeHomePay,
      isActive: true,
      isUserInactive: false,
      isRemoteAttendance: false,
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      intWorkplaceId: values?.workplace?.value,
      // wingId: values?.wing?.value || 0,
      // soleDepoId: values?.soleDepo?.value || 0,
      // regionId: values?.region?.value || 0,
      // areaId: values?.area?.value || 0,
      // territoryId: values?.territory?.value || 0,
      intBusinessUnitId: buId,
      dteCreatedAt: moment().format("YYYY-MM-DD"),
      intEmploymentTypeId: values?.employeeType?.value,
      strEmploymentType: values?.employeeType?.label,
      intEmployeeStatusId: values?.employeeStatus?.value || 1,
      strEmployeeStatus: values?.employeeStatus?.label || "Active",
      intCalenderId: 0,
      strCalenderName: "",
      intHrpositionId: values?.hrPosition?.value || 0,
      strHrpostionName: values?.hrPosition?.label || "",
      strPersonalMail: values?.email || "",
      strOfficeMail: values?.workMail || "",
      strPersonalMobile: values?.phone || "",
      strOfficeMobile: values?.workPhone || "",
      isCreateUser: values?.isUsersection,
      calendarAssignViewModel: null,

      intSignature: values?.intSignature,
      intProbationayClosedByInDate: +values?.probationayClosedBy?.value,
      strProbationayClosedByInDate: values?.probationayClosedBy?.label,
    };
    if (!isEdit) {
      payload = {
        ...payload,
        calendarAssignViewModel: {
          employeeId: 0,
          joiningDate: moment(values?.joiningDate).format("YYYY-MM-DD"),
          generateStartDate: moment(values?.generateDate).format("YYYY-MM-DD"),
          generateEndDate: null,
          runningCalendarId:
            values?.calenderType?.value === 2
              ? values?.startingCalender?.value
              : values?.calender?.value,
          calendarType: values?.calenderType?.label,
          nextChangeDate: values?.nextChangeDate
            ? moment(values?.nextChangeDate).format("YYYY-MM-DD")
            : null,
          rosterGroupId:
            values?.calenderType?.value === 2 ? values?.calender?.value : 0,
          isAutoGenerate: false,
        },
      };
    }
    if (values?.isUsersection === true) {
      payload = {
        ...payload,
        userViewModel: {
          intUserId: 0,
          strLoginId: values?.loginUserId,
          strPassword: values?.password,
          strOldPassword: values?.password,
          strDisplayName: values?.fullName,
          intUserTypeId: values?.userType?.value,
          intRefferenceId: 0,
          isOfficeAdmin: values?.userType?.value === 7 ? true : false,
          isSuperuser: true,
          dteLastLogin: "2022-09-20T12:33:00.573Z",
          isOwner: false,
          isActive: values?.isActive,
          intUrlId: intUrlId,
          intCountryId: 0,
          intOfficeMail: values?.email,
          strContactNo: values?.phone || "",
          dteCreatedAt: moment().format("YYYY-MM-DD"),
        },
      };
    }
    setLoading(true);
    const res = await axios.post(
      `/Employee/CreateNUpdateEmployeeBasicInfo`,
      payload
    );
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message, { toastId: 1 });
  } catch (error) {
    // console.log("Come Here 3");
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 1 });
  }
};

export const getEmployeeProfileLanding = async (
  accId,
  buId,
  employeeId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search,
  setAllData
) => {
  setLoading && setLoading(true);
  let searchTxt = search ? `&searchTxt=${search}` : "";
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileLandingPagination?accountId=${accId}&businessUnitId=${buId}&EmployeeId=${employeeId}${searchTxt}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    if (res?.data) {
      setter(res?.data);
      setAllData?.(res.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};

export const employeeFilter = async ({
  orgId,
  buId,
  values,
  setter,
  setLoading,
  cb,
}) => {
  const payload = {
    strPart: "EmployeeBasicInfoMasterFilter",
    employeeId: 0,
    employmentTypeId: values?.employementType?.value || 0,
    departmentId: values?.department?.value || 0,
    designationId: values?.designation?.value || 0,
    positionId: 0,
    positionGroupId: 0,
    joiningDate: values?.joiningDate || null,
    confirmationDate: values?.confirmDate || null,
    dateOfBirth: null,
    religionId: values?.religion?.value || 0,
    genderId: values?.gender?.value || 0,
    supervisorId: values?.supervisor?.value || 0,
    lineManagerId: 0,
    workplaceId: 0,
    workplaceGroupId: values?.workplaceGroup?.value || 0,
    sbuId: 0,
    businessUnitId: buId,
    accountId: orgId,
    employmentStatusId: values?.employmentStatus?.value || 0,
    maritalStatus: "",
    bloodGroupId: 0,
    email: "",
    officialEmail: "",
    phone: "",
    officialPhone: "",
    payrollGroupId: values?.payrollGroup?.value || 0,
    payscaleGradeId: 0,
    isNID: values?.isNID?.value,
    isBIRTHID: values?.birthCertificate?.value,
    RosterGroupId: values?.rosterGroup?.value,
    CalenderId: values?.calendar?.value,
    dteContactFromDate: values?.contractualFromDate || null,
    dteContactToDate: values?.contractualToDate || null,
  };
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/emp/EmployeeProfile/EmployeeBasicInfoMasterFilter`,
      payload
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
      cb && cb();
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getEmployeeProfileViewDataForAddress = async (
  id,
  buId,
  wgId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?businessUnitId=${buId}&workplaceGroupId=${wgId}&employeeId=${id}`
    );
    if (res?.data) {
      const presentAddress = res?.data?.empEmployeeAddress?.filter(
        (item) => item?.intAddressTypeId === 1
      );
      const permanentAddress = res?.data?.empEmployeeAddress?.filter(
        (item) => item?.intAddressTypeId === 2
      );
      const otherAddress = res?.data?.empEmployeeAddress?.filter(
        (item) => item?.intAddressTypeId === 3
      );
      const newData = {
        ...res?.data,
        presentAddress,
        permanentAddress,
        otherAddress,
      };
      setter && setter(newData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getEmployeeProfileViewData = async (
  id,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${id}&businessUnitId=${buId}&workplaceGroupId=${wgId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getPeopleDeskWithoutAllDDL = async (
  apiUrl,
  value,
  label,
  setter,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data
      ?.filter((itm) => itm[value] !== 0)
      ?.map((itm) => ({
        ...itm,
        value: itm[value],
        label: itm[label],
      }));
    setter(newDDL);
    setLoading && setLoading(false);
    cb && cb();
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const userExistValidation = async (payload, setter, cb) => {
  try {
    const res = await axios.post(`/Auth/UserIsExistsRemoteValidation`, payload);
    cb && cb(res?.data);
    setter((prev) => {
      return { ...prev, ...res?.data };
    });
  } catch (error) {
    cb && cb(error?.response);
    setter(error?.response?.data);
  }
};

//UI table column
export const empListColumn = (
  page,
  paginationSize,
  headerList,
  wgName,
  history,
  orgId
) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      width: 130,
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (record) => {
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
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Reference Id",
      dataIndex: "strReferenceId",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`strDesignationList`],
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`strDepartmentList`],
      fieldType: "string",
    },
    {
      title: "Wing",
      dataIndex: "wingName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`wingNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Sole Depo",
      dataIndex: "soleDepoName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`soleDepoNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Region",
      dataIndex: "regionName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`regionNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Area",
      dataIndex: "areaName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`areaNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Territory",
      dataIndex: "territoryName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`territoryNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Supervisor",
      dataIndex: "strSupervisorName",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`strSupervisorNameList`],
      fieldType: "string",
    },
    {
      title: "Line Manager",
      dataIndex: "strLinemanager",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`strLinemanagerList`],
      fieldType: "string",
    },
    {
      title: "Pin Number",
      dataIndex: "pinNo",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sort: true,
      filter: true,
      filterDropDownList: headerList[`strEmploymentTypeList`],
      fieldType: "string",
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      render: (record) => dateFormatter(record?.dteJoiningDate),
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "",
      dataIndex: "",
      width: 100,
      className: "text-center",
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={() =>
                  history.push({
                    pathname: `/profile/employee/${record?.intEmployeeBasicInfoId}`,
                    state: {
                      buId: record?.intBusinessUnitId,
                      wgId: record?.intWorkplaceGroupId,
                    },
                  })
                }
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ].filter((itm) => !itm?.hidden);
};
//UI table column
export const newEmpListColumn = (
  page,
  paginationSize,
  headerList,
  wgName,
  history,
  orgId
) => {
  return [
    {
      title: "SL",
      render: (_, rec, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 50,
      fixed: "left",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      sorter: true,
      filter: false,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          // <div className="d-flex align-items-center">
          //   <AvatarComponent
          //     classess=""
          //     letterCount={1}
          //     label={record?.strEmployeeName}
          //   />
          //   <span className="ml-2">{record?.strEmployeeName}</span>
          // </div>
          <div className="d-flex align-items-center">
            <Avatar title={record?.strEmployeeName} />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      fixed: "left",
    },
    {
      title: "Reference Id",
      dataIndex: "strReferenceId",
      sorter: true,
      filter: false,
      filterSearch: true,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      filterKey: "strDesignationList",
      filterSearch: true,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      filter: true,
      filterKey: "strDepartmentList",
      filterSearch: true,
    },
    {
      title: "Wing",
      dataIndex: "wingName",
      sorter: true,
      filter: true,
      filterDropDownList: headerList[`wingNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Sole Depo",
      dataIndex: "soleDepoName",
      sorter: true,
      filter: true,
      filterDropDownList: headerList[`soleDepoNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Region",
      dataIndex: "regionName",
      sorter: true,
      filter: true,
      filterDropDownList: headerList[`regionNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Area",
      dataIndex: "areaName",
      sorter: true,
      filter: true,
      filterDropDownList: headerList[`areaNameList`],
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Territory",
      dataIndex: "territoryName",
      sorter: true,
      filter: true,
      hidden: wgName === "Marketing" ? false : true,
      fieldType: "string",
    },
    {
      title: "Supervisor",
      dataIndex: "strSupervisorName",
      sorter: true,
      filter: true,
      filterKey: "strSupervisorNameList",
    },
    {
      title: "Line Manager",
      dataIndex: "strLinemanager",
      sorter: true,
      filter: true,
      filterKey: "strLinemanagerList",
    },
    {
      title: "Pin Number",
      dataIndex: "pinNo",
      sorter: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      sorter: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: true,
      filterKey: "strEmploymentTypeList",
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      render: (_, record) => dateFormatter(record?.dteJoiningDate),
      sorter: true,
      filter: false,
      dataType: "date",
    },
    {
      title: "",
      dataIndex: "",
      width: 100,
      className: "text-center",
      align: "center",
      render: (_, record) => (
        <div className="table_button">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={() =>
                  history.push({
                    pathname: `/profile/employee/${record?.intEmployeeBasicInfoId}`,
                    state: {
                      buId: record?.intBusinessUnitId,
                      wgId: record?.intWorkplaceGroupId,
                    },
                  })
                }
                style={{ fontSize: "15px" }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ].filter((itm) => !itm?.hidden);
};

// for excel
export const getTableDataEmployee = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => {
      const cellValue = item[key];
      const formattedValue =
        typeof cellValue === "string" && cellValue !== "" && !isNaN(cellValue)
          ? parseFloat(cellValue)
          : cellValue;

      return new Cell(
        formattedValue,
        "center",
        typeof formattedValue === "number" ? "amount" : "text"
      ).getCell();
    });
  });
  return data;
};
// excel columns
export const columnForHeadOffice = {
  sl: "SL",
  strWorkplaceGroup: "Work. Group/Location",
  strWorkplace: "Workplace/Concern",
  strEmployeeName: "Employee Name",
  strEmployeeCode: "Employee Id",
  strReferenceId: "Reference Id",
  strDesignation: "Designation",
  strDepartment: "Department",
  sectionName: "Section",
  strSupervisorName: "Supervisor",
  strLinemanager: "Line Manager",
  strEmploymentType: "Employment Type",
  contactNo: "Contact No",
  JoiningDate: "Joining Date",
  strEmployeeStatus: "Status",
};

export const columnForMarketing = {
  sl: "SL",
  strEmployeeCode: "Employee Id",
  strEmployeeName: "Employee Name",
  strReferenceId: "Reference Id",
  strDesignation: "Designation",
  strDepartment: "Department",
  wingName: "Wing",
  soleDepoName: "Sole Depo",
  regionName: "Region",
  areaName: "Area",
  territoryName: "Territory",
  strSupervisorName: "Supervisor",
  strLinemanager: "Line Manager",
  strEmploymentType: "Employment Type",
  JoiningDate: "Joining Date",
};
