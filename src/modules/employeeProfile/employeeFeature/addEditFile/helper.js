import moment from "moment";
import { toast } from "react-toastify";
import { calculateNextDate } from "utility/dateFormatter";
import * as Yup from "yup";

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
  dteInternCloseDate: "",
  dteProbationaryCloseDate: "",
  dteConfirmationDate: "",
  isCreateUser: false,
  isCreate: true,

  // wing: "",
  // soleDepo: "",
  // region: "",
  // area: "",
  // territory: "",

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
    employeeCode: Yup.string().required("Employee code is required"),
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
    workplace: Yup.object()
      .shape({
        label: Yup.string().required("Workplace is required"),
        value: Yup.string().required("Workplace is required"),
      })
      .typeError("Workplace is required"),
    supervisor: Yup.object()
      .shape({
        label: Yup.string().required(
          `${supervisor || "Supervisor"} is required`
        ),
        value: Yup.string().required(
          `${supervisor || "Supervisor"} is required`
        ),
      })
      .typeError(`${supervisor || "Supervisor"} is required`),
    lineManager: Yup.object()
      .shape({
        label: Yup.string().required("Line manager is required"),
        value: Yup.string().required("Line manager is required"),
      })
      .typeError("Line manager is required"),

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
  // setWingDDL,
  // setSoleDepoDDL,
  // setRegionDDL,
  // setAreaDDL,
  // setTerritoryDDL,
}) => {
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&intId=${employeeId}`,
    "intWorkplaceId",
    "strWorkplace",
    setWorkplaceDDL
  );
  // getPeopleDeskWithoutAllDDL(
  //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=0`,
  //   "WingId",
  //   "WingName",
  //   setWingDDL
  // );
  // getPeopleDeskWithoutAllDDL(
  //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=${singleData?.wing?.value}`,
  //   "SoleDepoId",
  //   "SoleDepoName",
  //   setSoleDepoDDL
  // );
  // getPeopleDeskWithoutAllDDL(
  //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=${singleData?.soleDepo?.value}`,
  //   "RegionId",
  //   "RegionName",
  //   setRegionDDL
  // );
  // getPeopleDeskWithoutAllDDL(
  //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=${singleData?.region?.value}`,
  //   "AreaId",
  //   "AreaName",
  //   setAreaDDL
  // );
  // getPeopleDeskWithoutAllDDL(
  //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=TerritoryDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${singleData?.workplaceGroup?.value}&ParentTerritoryId=${singleData?.area?.value}`,
  //   "TerritoryId",
  //   "TerritoryName",
  //   setTerritoryDDL
  // );
};

export const submitHandler = ({
  values,
  getData,
  // empBasic,
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
    !isEdit && resetForm();
    setIsAddEditForm(false);
    getData({ current: 1, pageSize: pages?.pageSize }, "false");
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
  // if (
  //   values?.employeeType?.ParentId === 1 &&
  //   !values?.dteProbationaryCloseDate
  // ) {
  //   return toast.warn("Please provide probation  duration !!!");
  // }

  // if (
  //   (values?.employeeType?.isManual === 1 ||
  //     values?.employeeType?.isManual === true) &&
  //   values?.employeeType?.ParentId === 3 &&
  //   !values?.dteInternCloseDate
  // ) {
  //   return toast.warn("Please provide intern duration !!!");
  // }
  if (
    values?.employeeType?.EmploymentType === "Probationary" &&
    !values?.dteProbationaryCloseDate
  ) {
    return toast.warn("Please provide probation  duration !!!");
  }

  if (
    values?.employeeType?.EmploymentType === "Intern" &&
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

  // if (values?.workplaceGroup?.label === "Marketing") {
  //   if (!values?.wing) {
  //     return toast.warn("Wing is required");
  //   }
  //   if (!values?.soleDepo) {
  //     return toast.warn("Sole Depo is required");
  //   }
  //   // if (!values?.region) {
  //   //   return toast.warn("Region is required");
  //   // }
  //   // if (!values?.area) {
  //   //   return toast.warn("Area is required");
  //   // }
  //   // if (!values?.territory) {
  //   //   return toast.warn("Territory is required");
  //   // }
  // }

  createEditEmpAction(values, buId, intUrlId, setLoading, cb, isEdit);
};


function calculateDateAfterMonths(inputDate, month) {
  const currentDate = new Date(inputDate);
  
  // Ensure the input is a valid date
  if (isNaN(currentDate.getTime())) {
    return "Invalid Date";
  }

  // Calculate the target month and year
  const targetMonth = currentDate.getMonth() + month;
  const targetYear = currentDate.getFullYear() + Math.floor(targetMonth / 12);

  // Calculate the target day, considering varying days in each month
  const targetDay = new Date(targetYear, targetMonth % 12, currentDate.getDate());

  // Format the result to "YYYY-MM-DD"
  const formattedDate = targetDay.toISOString().split("T")[0];

  return formattedDate;
} 
export const calculateProbationCloseDateByDateOrMonth = ({
  inputDate= moment().format("YYYY-MM-DD"),
  days = 15,
  month = 6,
}) => {
  // 
  console.log({days, month, inputDate});

  let date = null;
  if(days) {
    console.log("this is days")
    date = calculateNextDate(inputDate, days);
  }else if(month){
    console.log("this is month..")

    date = calculateDateAfterMonths(inputDate, month);
  }
  return date;

};
