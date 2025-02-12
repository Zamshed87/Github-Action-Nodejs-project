import { CreateOutlined } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../common/AvatarComponent";
import Chips from "../../common/Chips";
import * as Yup from "yup";

import {
  dateFormatter,
  dateFormatterForInput,
} from "../../utility/dateFormatter";
import { toast } from "react-toastify";
import { todayDate } from "../../utility/todayDate";
import axios from "axios";

export const onBoardColumns = (
  // setAnchorEl,
  permission
  // orgId,
  // setValues,
  // pages,
  // wgId,
  // headerList
) => {
  const history = useHistory();

  return [
    {
      title: "SL",
      render: (_, index) => +index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    // {
    //   title: "Employee ID",
    //   dataIndex: "employeeCode",
    //   width: 130,
    //   sort: true,
    //   filter: false,
    //   fieldType: "string",
    // },
    {
      title: "Employee Name",
      dataIndex: "fullName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.fullName}
            />
            <span className="ml-2">{record?.fullName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Religion",
      dataIndex: "religion",
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      //   filter: true,
      width: 70,
      fieldType: "string",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      //   filter: true,
      width: 40,

      fieldType: "string",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      width: 100,

      render: (record) => dateFormatter(record?.dateOfBirth),
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      //   filter: true,
      fieldType: "string",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      width: 100,

      //   filter: true,
      fieldType: "string",
    },
    {
      title: "NID",
      dataIndex: "nid",
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      //   filter: true,
      fieldType: "string",
    },

    {
      title: "Permanent Address",
      dataIndex: "permanentAddress",
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      //   filter: true,
      width: 320,

      fieldType: "string",
    },
    {
      title: "Present Address",
      dataIndex: "presentAddress",
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      //   filter: true,
      width: 320,

      fieldType: "string",
    },
    {
      title: "Marital Status",
      dataIndex: "maritalStatus",
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      //   filter: true,
      fieldType: "string",
    },
    {
      title: "Phone No.",
      dataIndex: "phoneNo",
      //   filterDropDownList: headerList[`designationNameList`],
      //   sort: true,
      //   filter: true,
      fieldType: "string",
    },
    {
      title: "Action",
      dataIndex: "confirmationStatus",
      sort: false,
      filter: false,
      width: 140,
      render: (record, index) => {
        return (
          <button
            style={{
              height: "24px",
              fontSize: "12px",
              padding: "0px 12px 0px 12px",
            }}
            className="btn btn-default btn-assign ml-1"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!permission?.isCreate)
                return toast.warn("You don't have permission");
              history.push("/profile/employee/create", record);
            }}
          >
            Onboard
          </button>
          // <div className="d-flex">
          //   {record?.confirmationStatus === "Confirm" ? (
          //     <>
          //       <Chips label="Confirmed" classess="success" />
          //       <button
          //         type="button"
          //         className="iconButton mt-0 mt-md-2 mt-lg-0 ml-2"
          //         onClick={(e) => {
          //           e.stopPropagation();
          //           // setAnchorEl(e.currentTarget);
          //           setSingleData(record);
          //           // setIsEdit(true);
          //           // setValues((prev) => {
          //           //   return {
          //           //     ...prev,
          //           //     designation: {
          //           //       value: record?.designationId,
          //           //       label: record?.designationName,
          //           //     },
          //           //     confirmDate: record?.confirmationDateRaw
          //           //       ? dateFormatterForInput(record?.confirmationDateRaw)
          //           //       : "",
          //           //     pinNo: record?.pinNo,
          //           //   };
          //           // });
          //         }}
          //       >
          //         <CreateOutlined />
          //       </button>
          //     </>
          //   ) : (
          //     <button
          //       style={{
          //         height: "24px",
          //         fontSize: "12px",
          //         padding: "0px 12px 0px 12px",
          //       }}
          //       className="btn btn-default btn-assign ml-1"
          //       type="button"
          //       onClick={(e) => {
          //         e.stopPropagation();
          //         if (!permission?.isCreate)
          //           return toast.warn("You don't have permission");
          //         // setAnchorEl(e.currentTarget);
          //         setIsEdit(true);
          //         setSingleData(record);
          //         //   setValues((prev) => {
          //         //     return {
          //         //       ...prev,
          //         //       designation: {
          //         //         value: record?.designationId,
          //         //         label: record?.designationName,
          //         //       },
          //         //       confirmDate: record?.confirmationDate
          //         //         ? dateFormatterForInput(record?.confirmationDate)
          //         //         : todayDate(),
          //         //     };
          //         //   });
          //       }}
          //     >
          //       Onboard
          //     </button>
          //   )}
          // </div>
        );
      },
    },
    // {
    //   title: "Designation",
    //   dataIndex: "designationName",
    //   filterDropDownList: headerList[`designationNameList`],
    //   sort: true,
    //   filter: true,
    //   fieldType: "string",
    // },
    // {
    //   title: "Department",
    //   dataIndex: "departmentName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`departmentNameList`],
    //   fieldType: "string",
    // },
    // {
    //   title: "Wing",
    //   dataIndex: "wingName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`wingNameList`],
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Sole Depo",
    //   dataIndex: "soleDepoName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`soleDepoNameList`],
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Region",
    //   dataIndex: "regionName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`regionNameList`],
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Area",
    //   dataIndex: "areaName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`areaNameList`],
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Territory",
    //   dataIndex: "territoryName",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`territoryNameList`],
    //   hidden: wgId !== 3 ? true : false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Employment Type",
    //   dataIndex: "employmentType",
    //   sort: true,
    //   filter: true,
    //   filterDropDownList: headerList[`employmentTypeList`],
    //   width: 140,
    //   fieldType: "string",
    // },
    // {
    //   title: "Pin No.",
    //   dataIndex: "pinNo",
    //   render: (record) => (record?.pinNo ? record?.pinNo : "-"),
    //   sort: true,
    //   filter: false,
    //   width: 100,
    //   fieldType: "string",
    // },
    // {
    //   title: "Joining Date",
    //   dataIndex: "joiningDate",
    //   render: (record) => dateFormatter(record?.joiningDate),
    //   fieldType: "string",
    //   sort: true,
    //   width: 150,
    // },
    // {
    //   title: orgId === 10015 ? "Reporting Line" : "Supervisor",
    //   dataIndex: "supervisorName",
    //   sort: true,
    //   filter: false,
    //   fieldType: "string",
    // },
    // {
    //   title: "Confirmation Date",
    //   width: 150,
    //   dataIndex: "confirmationDate",
    //   fieldType: "string",
    //   render: (record) => {
    //     return (
    //       <p>{record?.confirmationDate ? record?.confirmationDate : "-"}</p>
    //     );
    //   },
    // },
    // {
    //   title: "Status",
    //   dataIndex: "confirmationStatus",
    //   sort: false,
    //   filter: false,
    //   width: 140,
    //   render: (record, index) => {
    //     return (
    //       <div className="d-flex">
    //         {record?.confirmationStatus === "Confirm" ? (
    //           <>
    //             <Chips label="Confirmed" classess="success" />
    //             <button
    //               type="button"
    //               className="iconButton mt-0 mt-md-2 mt-lg-0 ml-2"
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 setAnchorEl(e.currentTarget);
    //                 setSingleData(record);
    //                 setIsEdit(true);
    //                 setValues((prev) => {
    //                   return {
    //                     ...prev,
    //                     designation: {
    //                       value: record?.designationId,
    //                       label: record?.designationName,
    //                     },
    //                     confirmDate: record?.confirmationDateRaw
    //                       ? dateFormatterForInput(record?.confirmationDateRaw)
    //                       : "",
    //                     pinNo: record?.pinNo,
    //                   };
    //                 });
    //               }}
    //             >
    //               <CreateOutlined />
    //             </button>
    //           </>
    //         ) : (
    //           <button
    //             style={{
    //               height: "24px",
    //               fontSize: "12px",
    //               padding: "0px 12px 0px 12px",
    //             }}
    //             className="btn btn-default btn-assign ml-1"
    //             type="button"
    //             onClick={(e) => {
    //               e.stopPropagation();
    //               if (!permission?.isCreate)
    //                 return toast.warn("You don't have permission");
    //               setAnchorEl(e.currentTarget);
    //               setSingleData(record);
    //               setValues((prev) => {
    //                 return {
    //                   ...prev,
    //                   designation: {
    //                     value: record?.designationId,
    //                     label: record?.designationName,
    //                   },
    //                   confirmDate: record?.confirmationDate
    //                     ? dateFormatterForInput(record?.confirmationDate)
    //                     : todayDate(),
    //                 };
    //               });
    //             }}
    //           >
    //             Confirm
    //           </button>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ].filter((item) => !item.hidden);
};
export const getPeopleDeskAllLandingForConfirmation = async (
  tableName,
  accId,
  busId,
  id,
  deptId,
  desId,
  empId,
  setter,
  setAllData,
  setLoading,
  statusId,
  joiningDate,
  confirmDate,
  setPages,
  wgId,
  pagination,
  searchText
) => {
  setLoading && setLoading(true);
  let url;

  url = `/EmployeeAllLanding/EmployeeBasicForConfirmation?BusinessUnitId=${busId}&WorkplaceGroupId=${wgId}&FromDate=${joiningDate}&ToDate=${confirmDate}&PageNo=${
    pagination?.current
  }&PageSize=${pagination?.pageSize}&SearchTxt=${searchText || ""}`;
  try {
    const res = await axios.get(url);
    if (res?.data?.data) {
      setter && setter(res?.data?.data);
      setAllData && setAllData(res?.data?.data);
      setLoading && setLoading(false);
      setPages({
        current: pagination?.current,
        pageSize: pagination?.pageSize,
        total: res?.data?.totalCount,
      });
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const initData = {
  fullName: "",
  employeeCode: "",
  religion: "",
  gender: "",
  dateofBirth: "",
  joiningDate: "",
  lastWorkingDate: "",
  employeeType: "",
  department: "",
  designation: "",
  hrPosition: "",
  workplaceGroup: "",
  workplace: "",
  employeeStatus: "",
  supervisor: "",
  lineManager: "",
  dottedSupervisor: "",
  contractualFromDate: "",
  contractualToDate: "",
  isSalaryHold: false,
  isTakeHomePay: false,
  isUsersection: false,
  isSoleDepo: false,
  dteInternCloseDate: "",
  dteProbationaryCloseDate: "",
  dteConfirmationDate: "",
  isCreateUser: false,
  isCreate: true,
  strNID: "",
  wing: "",
  soleDepo: "",
  region: "",
  area: "",
  territory: "",

  // calender assigne
  generateDate: "",
  calenderType: "",
  calender: "",
  startingCalender: "",
  nextChangeDate: "",

  // user info
  loginUserId: "",
  password: "",
  email: "",
  phone: "",
  userType: "",
  isActive: true,
};

export const validationSchema = (supervisor) => {
  return Yup.object().shape({
    fullName: Yup.string().required("Name is required"),
    strNID: Yup.string().required("NID is required"),
    // employeeCode: Yup.string().required("Employee code is required"),
    dateofBirth: Yup.string().required("Date of birth is required"),
    joiningDate: Yup.string().required("Joining date is required"),
    religion: Yup.object()
      .shape({
        label: Yup.string().required("Religion is required"),
        value: Yup.string().required("Religion is required"),
      })
      .typeError("Religion is required"),
    gender: Yup.object()
      .shape({
        label: Yup.string().required("Gender is required"),
        value: Yup.string().required("Gender is required"),
      })
      .typeError("Gender is required"),
    employeeType: Yup.object()
      .shape({
        label: Yup.string().required("Employee type is required"),
        value: Yup.string().required("Employee type is required"),
      })
      .typeError("Employee type is required"),
    department: Yup.object()
      .shape({
        label: Yup.string().required("Department is required"),
        value: Yup.string().required("Department is required"),
      })
      .typeError("Department is required"),
    designation: Yup.object()
      .shape({
        label: Yup.string().required("Designation is required"),
        value: Yup.string().required("Designation is required"),
      })
      .typeError("Designation is required"),
    workplaceGroup: Yup.object()
      .shape({
        label: Yup.string().required("Workplace Group is required"),
        value: Yup.string().required("Workplace Group is required"),
      })
      .typeError("Workplace Group is required"),
    // workplace: Yup.object()
    //   .shape({
    //     label: Yup.string().required("Workplace is required"),
    //     value: Yup.string().required("Workplace is required"),
    //   })
    //   .typeError("Workplace is required"),
    // supervisor: Yup.object()
    //   .shape({
    //     label: Yup.string().required(
    //       `${supervisor || "Supervisor"} is required`
    //     ),
    //     value: Yup.string().required(
    //       `${supervisor || "Supervisor"} is required`
    //     ),
    //   })
    //   .typeError(`${supervisor || "Supervisor"} is required`),
    // lineManager: Yup.object()
    //   .shape({
    //     label: Yup.string().required("Line manager is required"),
    //     value: Yup.string().required("Line manager is required"),
    //   })
    //   .typeError("Line manager is required"),

    // calender assign
    generateDate: Yup.string().when("isCreate", {
      is: true,
      then: Yup.string()
        .min(1, "Minimum 1 symbol")
        .max(100, "Maximum 100 symbols")
        .required("Date of Joining is required")
        .typeError("Date of Joining is required"),
    }),
    calenderType: Yup.object().when("isCreate", {
      is: true,
      then: Yup.object()
        .shape({
          label: Yup.string().required("Calendar Type is required"),
          value: Yup.string().required("Calendar Type is required"),
        })
        .typeError("Calendar Type is required"),
      otherwise: Yup.object().nullable(),
    }),
    calender: Yup.object().when("isCreate", {
      is: true,
      then: Yup.object()
        .shape({
          label: Yup.string().required("Calendar is required"),
          value: Yup.string().required("Calendar is required"),
        })
        .typeError("Calendar is required"),
      otherwise: Yup.object().nullable(),
    }),

    // user info
    loginUserId: Yup.string().when("isUsersection", {
      is: true,
      then: Yup.string()
        .min(4, "Minimum 4 character")
        .required("User id is required")
        .typeError("User id is required"),
      otherwise: Yup.string().nullable(),
    }),
    password: Yup.string().when("isUsersection", {
      is: true,
      then: Yup.string()
        .required("Password is required")
        .typeError("Password is required")
        .min(4, "Minimum 4 character"),
      otherwise: Yup.string().nullable(),
    }),
    email: Yup.string().when("isUsersection", {
      is: true,
      then: Yup.string().required("Invalid email").typeError("Invalid email"),
      otherwise: Yup.string().nullable(),
    }),
    phone: Yup.string().when("isUsersection", {
      is: true,
      then: Yup.string()
        .matches(/^01[1-9]\d{8}$/, "Phone number is invalid")
        .required("Phone number is required")
        .typeError("Phone number is required"),
      otherwise: Yup.string().nullable(),
    }),
    userType: Yup.object().when("isUsersection", {
      is: true,
      then: Yup.object()
        .shape({
          label: Yup.string().required("User type is required"),
          value: Yup.string().required("User type is required"),
        })
        .typeError("User type is required"),
      otherwise: Yup.object().nullable(),
    }),
  });
};

export const getCreateDDLs = ({
  getPeopleDeskAllDDL,
  setReligionDDL,
  setGenderDDL,
  setEmpTypeDDL,
  setDepartmentDDL,
  getPeopleDeskWithoutAllDDL,
  employeeId,
  setWorkplaceGroupDDL,
  orgId,
  wgId,
  buId,
  setDesignationDDL,
  setEmpStatusDDL,
  setHrPositionDDL,
}) => {
  getPeopleDeskAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Religion&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
    "ReligionId",
    "ReligionName",
    setReligionDDL
  );
  getPeopleDeskAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Gender&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
    "GenderId",
    "GenderName",
    setGenderDDL
  );
  getPeopleDeskAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
    "Id",
    "EmploymentType",
    setEmpTypeDDL
  );
  getPeopleDeskAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
    "DepartmentId",
    "DepartmentName",
    setDepartmentDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
    "intWorkplaceGroupId",
    "strWorkplaceGroup",
    setWorkplaceGroupDDL
  );
  getPeopleDeskAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
    "DesignationId",
    "DesignationName",
    setDesignationDDL
  );
  getPeopleDeskAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeStatus&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
    "EmployeeStatusId",
    "EmployeeStatus",
    setEmpStatusDDL
  );
  getPeopleDeskAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Position&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
    "PositionId",
    "PositionName",
    setHrPositionDDL
  );
};

export const getEditDDLs = ({
  singleData,
  getPeopleDeskWithoutAllDDL,
  orgId,
  buId,
  employeeId,
  setWorkplaceDDL,
  setWingDDL,
  setSoleDepoDDL,
  setRegionDDL,
  setAreaDDL,
  setTerritoryDDL,
}) => {
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&intId=${employeeId}`,
    "intWorkplaceId",
    "strWorkplace",
    setWorkplaceDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=0`,
    "WingId",
    "WingName",
    setWingDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=${singleData?.wing?.value}`,
    "SoleDepoId",
    "SoleDepoName",
    setSoleDepoDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=${singleData?.soleDepo?.value}`,
    "RegionId",
    "RegionName",
    setRegionDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=${singleData?.region?.value}`,
    "AreaId",
    "AreaName",
    setAreaDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=TerritoryDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=${singleData?.area?.value}`,
    "TerritoryId",
    "TerritoryName",
    setTerritoryDDL
  );
};

export const submitHandler = ({
  values,
  getData,
  resetForm,
  pages,
  setIsAddEditForm,
  employeeId,
  dispatch,
  updateUerAndEmpNameAction,
  isUserCheckMsg,
  createEditEmpAction,
  isEdit,
  orgId,
  buId,
  intUrlId,
  setLoading,
}) => {
  const cb = () => {
    getData({ current: 1, pageSize: pages?.pageSize }, "false");
    resetForm(initData);
    setIsAddEditForm(false);
    if (values?.empId === employeeId) {
      dispatch(updateUerAndEmpNameAction(values?.fullName));
    }
  };
  if (
    values?.employeeType.label ===
      ("Contractual" || "contractual" || "contract" || "Contract") &&
    (!values?.contractualFromDate || !values?.contractualToDate)
  ) {
    return toast.warn("Please Select Contract Date");
  }
  if (
    values?.employeeType.label === ("Permanent" || "permanent") &&
    !values?.dteConfirmationDate
  ) {
    return toast.warn("Please Select Confirmation Date");
  }

  if (isUserCheckMsg?.statusCode !== 200 && values?.isUsersection === true) {
    return toast.warn("Please provide a valid user !!!");
  }
  if (
    values?.employeeType?.ParentId === 1 &&
    !values?.dteProbationaryCloseDate
  ) {
    return toast.warn("Please provide probation  duration !!!");
  }

  if (values?.workplaceGroup?.value !== 3 && !values?.supervisor) {
    return toast.warn("Supervisor is required! ");
  }

  if (values?.workplaceGroup?.value !== 3 && !values?.lineManager) {
    return toast.warn("line Manager is required! ");
  }

  if (
    (values?.employeeType?.isManual === 1 ||
      values?.employeeType?.isManual === true) &&
    values?.employeeType?.ParentId === 3 &&
    !values?.dteInternCloseDate
  ) {
    return toast.warn("Please provide intern duration !!!");
  }

  if (values?.calenderType?.value === 2) {
    if (!values?.nextChangeDate)
      return toast.warn("Next change date is required");
    if (!values?.startingCalender)
      return toast.warn("Starting calender is required");
  }

  if (values?.workplaceGroup?.label === "Marketing") {
    if (!values?.wing) {
      return toast.warn("Wing is required");
    }
    if (!values?.soleDepo) {
      return toast.warn("Sole Depo is required");
    }
    // if (!values?.region) {
    //   return toast.warn("Region is required");
    // }
    // if (!values?.area) {
    //   return toast.warn("Area is required");
    // }
    // if (!values?.territory) {
    //   return toast.warn("Territory is required");
    // }
  }

  createEditEmpAction(values, buId, intUrlId, setLoading, cb, isEdit);
};
const getYearMonth2 = (value) => {
  let splitMonth = value?.split("-");
  let year2 = splitMonth?.[0];
  let month2 = splitMonth?.[1];
  return { year2, month2 };
};

function getDaysInMonth2(year2, month2) {
  return new Date(year2, month2, 0).getDate();
}
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
export const createEditEmpAction = async (
  values,
  buId,
  intUrlId,
  setLoading,
  cb,
  isEdit
) => {
  let { year2, month2 } = getYearMonth2(values?.dteInternCloseDate);

  let lastDaysInternCloseDate = getDaysInMonth2(year2, month2);
  console.log({ values });
  try {
    let payload = {
      jobApplicationId: values?.jobApplicationId,
      intEmployeeBasicInfoId: values?.empId || 0,
      strEmployeeCode: values?.employeeCode || "",
      strCardNumber: values?.employeeCode || "",
      strEmployeeName: values?.fullName || "",
      intGenderId: values?.gender?.value || 0,
      strGender: values?.gender?.label || "",
      intReligionId: values?.religion?.value || 0,
      strReligion: values?.religion?.label || "",
      strMaritalStatus: values?.strMaritalStatus,
      strBloodGroup: values?.strBloodGroup,
      intDepartmentId: values?.department?.value || 0,
      intDesignationId: values?.designation?.value || 0,
      dteDateOfBirth: values?.dateofBirth || "",
      dteJoiningDate: values?.joiningDate || "",
      dteInternCloseDate: values?.dteInternCloseDate
        ? values?.dteInternCloseDate + "-" + lastDaysInternCloseDate
        : null,
      dteProbationaryCloseDate: values?.dteProbationaryCloseDate || null,
      dteConfirmationDate: values?.dteConfirmationDate || null,
      dteContactFromDate: values?.contractualFromDate || null,
      dteContactToDate: values?.contractualToDate || null,
      intSupervisorId: values?.supervisor?.value || 0,
      intLineManagerId: values?.lineManager?.value || 0,
      intDottedSupervisorId: values?.dottedSupervisor?.value || 0,
      isSalaryHold: values?.isSalaryHold,
      isTakeHomePay: values?.isTakeHomePay,
      isActive: true,
      isUserInactive: false,
      isRemoteAttendance: false,
      intWorkplaceGroupId: values?.workplaceGroup?.value || 0,
      intWorkplaceId: values?.workplace?.value || 0,
      wingId: values?.wing?.value || 0,
      soleDepoId: values?.soleDepo?.value || 0,
      regionId: values?.region?.value || values?.regionFactory?.value || 0,
      areaId: values?.area?.value || values?.areaFactory?.value || 0,
      territoryId: values?.territory?.value || 0,
      intBusinessUnitId: buId,
      dteCreatedAt: todayDate(),
      intEmploymentTypeId: values?.employeeType?.value || 0,
      strEmploymentType: values?.employeeType?.label || "",
      intEmployeeStatusId: values?.employeeStatus?.value || 0,
      strEmployeeStatus: values?.employeeStatus?.label || "",
      intCalenderId: 0,
      strCalenderName: "",
      intHrpositionId: values?.hrPosition?.value || 0,
      strHrpostionName: values?.hrPosition?.label || "",
      strPersonalMail: "",
      strOfficeMail: "",
      strPersonalMobile: "",
      strOfficeMobile: "",
      isCreateUser: values?.isUsersection,
      calendarAssignViewModel: null,
      strNID: values?.strNID || null,
    };
    if (!isEdit) {
      payload = {
        ...payload,
        calendarAssignViewModel: {
          employeeId: 0,
          joiningDate: values?.joiningDate,
          generateStartDate: values?.generateDate,
          runningCalendarId:
            values?.calenderType?.value === 2
              ? values?.startingCalender?.value
              : values?.calender?.value,
          calendarType: values?.calenderType?.label,
          nextChangeDate: values?.nextChangeDate || null,
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
          strContactNo: values?.phone,
          dteCreatedAt: todayDate(),
        },
      };
    }
    setLoading(true);
    let res = await axios.post(
      `/Employee/CreateNUpdateEmployeeBasicInfo`,
      payload
    );
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message, { toastId: 1 });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 1 });
  }
};
