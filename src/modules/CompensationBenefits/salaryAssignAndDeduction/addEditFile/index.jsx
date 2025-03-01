/* eslint-disable no-unused-vars */
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getSearchEmployeeList } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import Chips from "../../../../common/Chips";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import ResetButton from "../../../../common/ResetButton";
import {
  gray500,
  gray700,
  gray900,
  greenColor,
} from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import Accordion from "../accordion";
import {
  createEditAllowanceAndDeduction,
  getAllAllowanceAndDeduction,
  getEmployeeProfileViewData,
  getSalaryAdditionAndDeductionById,
} from "../helper";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { todayDate } from "utility/todayDate";
import { useApiRequest } from "Hooks";

const initData = {
  searchString: "",
  employee: "",
  isAutoRenew: "",
  fromMonth: "",
  toMonth: "",
  salaryType: "",
  allowanceAndDeduction: "",
  amountDimension: "",
  amount: "",
  intAllowanceDuration: {
    value: 2,
    label: "Per Month",
  },
  intAllowanceAttendenceStatus: "",
  maxAmount: "",
};
//
const validationSchema = Yup.object({
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  fromMonth: Yup.string().required("From month is required"),
  salaryType: Yup.object()
    .shape({
      label: Yup.string().required("Allowance type is required"),
      value: Yup.string().required("Allowance type is required"),
    })
    .typeError("Allowance type is required"),
  allowanceAndDeduction: Yup.object()
    .shape({
      label: Yup.string().required("Allowance and deduction type is required"),
      value: Yup.string().required("Allowance and deduction type is required"),
    })
    .typeError("Allowance and deduction type is required"),
  amountDimension: Yup.object()
    .shape({
      label: Yup.string().required("Amount dimension is required"),
      value: Yup.string().required("Amount dimension type is required"),
    })
    .typeError("Amount dimension type is required"),
  amount: Yup.number()
    .min(0, "Amount should be positive number")
    .required("Amount is required"),
  intAllowanceAttendenceStatus: Yup.object()
    .nullable()
    .when("intAllowanceDuration.value", {
      is: (value) => value === 1 || value === 2, // Required for both Per Day and Per Month
      then: Yup.object()
        .shape({
          label: Yup.string().required("Attendance status is required"),
          value: Yup.number().required("Attendance status is required"),
        })
        .typeError("Attendance status is required"),
    }),
  maxAmount: Yup.number()
    .nullable()
    .when("intAllowanceDuration.value", {
      is: (value) => value === 1, // Required only for Per Day
      then: Yup.number()
        .min(0, "Max amount should be a positive number")
        .required("Max amount is required"),
      otherwise: Yup.number().nullable(), // Optional for other cases
    }),
});

const validationSchema2 = Yup.object({
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  fromMonth: Yup.string().required("From month is required"),
  salaryType: Yup.object()
    .shape({
      label: Yup.string().required("Allowance type is required"),
      value: Yup.string().required("Allowance type is required"),
    })
    .typeError("Allowance type is required"),
  amount: Yup.number().min(0, "Amount should be positive number"),
});

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function AddEditForm() {
  const location = useLocation();
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const { isCreate, isView, empId, businessUnitId, workplaceGroupId } =
    location?.state?.state;
  const [isEdit, setIsEdit] = useState(false);
  const [singleData, setSingleData] = useState("");
  const empWiseData = useApiRequest({});
  const deleteAllowance = useApiRequest({});
  //redux data
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // States
  const [loading, setLoading] = useState(false);
  const [empBasic, setEmpBasic] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [allowanceAndDeductionDDL, setAllowanceAndDeductionDDL] =
    useState(false);
  const [isFromOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAdditionAndDeductionById = () => {
    // getSalaryAdditionAndDeductionById(
    //   empId,
    //   workplaceGroupId,
    //   businessUnitId,
    //   setRowDto,
    //   setLoading
    // );

    empWiseData?.action({
      urlKey: "EmployeeWiseAllowance",
      method: "get",
      params: {
        EmployeeId: empId,
      },
      onSuccess: (res) => {
        setRowDto(res);
      },
    });
  };

  const getData = () => {
    getEmployeeProfileViewData(
      empId ? empId : employeeId,
      setEmpBasic,
      setLoading,
      businessUnitId ? businessUnitId : buId,
      workplaceGroupId ? workplaceGroupId : wgId
    );
    isView && getAdditionAndDeductionById();
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  const saveHandler = (values, cb) => {
    if (!values?.isAutoRenew && !values?.toMonth) {
      return toast.warn("Auto Renew or to date must be selected!!");
    }
    const additionAndDeductionExists = rowDto.filter(
      (item) =>
        item?.intAdditionNDeductionTypeId ===
        values?.allowanceAndDeduction?.value
    );
    if (!isEdit && additionAndDeductionExists?.length > 0)
      return toast.warn("Already exists this allowance and deduction!!");
    const data = [...rowDto];
    const obj = {
      strEntryType: "ENTRY",
      intSalaryAdditionAndDeductionId: 0,
      intAccountId: orgId,
      intBusinessUnitId:
        empBasic?.employeeProfileLandingView?.intBusinessUnitId || buId,
      intWorkplaceGroupId:
        empBasic?.employeeProfileLandingView?.intWorkplaceGroupId || wgId,
      intWorkplaceId:
        empBasic?.employeeProfileLandingView?.intWorkplaceId || wId,
      intEmployeeId: values?.employee?.value,
      isAutoRenew: values?.isAutoRenew ? true : false,
      intYear: +values?.fromMonth?.split("-")[0] || null,
      intMonth: +values?.fromMonth?.split("-")[1] || null,
      strMonth: months[+values?.fromMonth?.split("-")[1] - 1] || null,
      isAddition: values?.salaryType?.value === "Allowance" ? true : false,
      strAdditionNDeduction: values?.allowanceAndDeduction?.label,
      intAdditionNDeductionTypeId: values?.allowanceAndDeduction?.value,
      intAmountWillBeId: values?.amountDimension?.value,
      strAmountWillBe: values?.amountDimension?.label,
      numAmount: +values?.amount,
      isActive: true,
      isReject: false,
      intActionBy: employeeId,
      intToYear: +values?.toMonth?.split("-")[0] || null,
      intToMonth: +values?.toMonth?.split("-")[1] || null,
      strToMonth: months[+values?.toMonth?.split("-")[1] - 1] || null,
    };
    data.push(obj);
    setRowDto(data);
    cb();
  };

  const deleteHandler = (index) => {
    const newData = rowDto.filter((item, ind) => ind !== index);
    setRowDto(newData);
  };

  const editHandler = (values, cb) => {
    if (!values?.isAutoRenew && !values?.toMonth) {
      return (
        toast.warn("Auto Renew or to date must be selected!!"),
        getAdditionAndDeductionById()
      );
    }
    const obj = {
      accountId: orgId,
      businessUnitId:
        empBasic?.employeeProfileLandingView?.intBusinessUnitId || buId,
      workplaceGroupId:
        empBasic?.employeeProfileLandingView?.intWorkplaceGroupId || wgId,
      workplaceId: empBasic?.employeeProfileLandingView?.intWorkplaceId || wId,
      employeeId: values?.employee?.value && `${values?.employee?.value}`,
      // ------
      allowanceItems: [
        {
          isAutoRenew: values?.isAutoRenew ? true : false,
          fromDate: values?.fromMonth + "-01",
          toDate: values?.toMonth
            ? moment(values?.toMonth).endOf("month").format("YYYY-MM-DD")
            : todayDate(),
          allowanceAttendenceStatusId:
            values?.intAllowanceAttendenceStatus?.value,
          allowanceDuration: values?.intAllowanceDuration?.value || 0,
          numMaxLimitAmount: +values?.maxAmount || 0,

          isAddition: values?.salaryType?.value === "Allowance" ? true : false,
          allowanceName: values?.allowanceAndDeduction?.label,
          allowanceTypeId: values?.allowanceAndDeduction?.value,
          amountWillBeId: values?.amountDimension?.value,
          amountWillBe: values?.amountDimension?.label,
          numAmount: +values?.amount || 0,
          allowanceId: singleData?.allowanceId ? singleData?.allowanceId : 0,
        },
      ],
    };
    createEditAllowanceAndDeduction(
      obj,
      setLoading,
      cb,
      singleData?.allowanceId ? true : false
    );
  };

  const demoPopup = (values) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you delete allowance & deduction?",
      yesAlertFunc: () => {
        deleteAllowance?.action({
          urlKey: "DeleteAllowance",
          method: "delete",
          params: {
            AllowanceId: values?.allowanceId,
          },
          onSuccess: () => {
            getAdditionAndDeductionById();
          },
        });
      },
      noAlertFunc: () => {
        //   history.push("/components/dialogs")
      },
    };
    IConfirmModal(confirmObject);
  };

  const addHandler = (values, cb) => {
    rowDto?.length > 0
      ? createEditAllowanceAndDeduction(rowDto, setLoading, cb)
      : toast.warn("Please add at least one row!!");
  };

  const isDisabled = (values) => {
    const isFromMonthMissing = !values?.fromMonth;
    const isSalaryTypeMissing = !values?.salaryType;
    const isAllowanceAndDeductionMissing = !values?.allowanceAndDeduction;
    const isAmountDimensionMissing = !values?.amountDimension;
    const isAmountMissing = !values?.amount;
    const isShortDurationInvalid =
      values?.intAllowanceDuration?.value === 1 &&
      (!values?.intAllowanceAttendenceStatus ||
        Number(values?.maxAmount) < 0 ||
        !values?.maxAmount);
    const isLongDurationInvalid =
      values?.intAllowanceDuration?.value === 2 &&
      !values?.intAllowanceAttendenceStatus;

    const isDisabled =
      isFromMonthMissing ||
      isSalaryTypeMissing ||
      isAllowanceAndDeductionMissing ||
      isAmountDimensionMissing ||
      isAmountMissing ||
      isShortDurationInvalid ||
      isLongDurationInvalid;

    return isDisabled;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          !isView
            ? initData
            : {
                ...initData,
                employee: {
                  value: empId,
                  label: empBasic?.employeeProfileLandingView?.strEmployeeName,
                },
              }
        }
        validationSchema={
          rowDto?.length ? validationSchema2 : !isView && validationSchema
        }
        onSubmit={(values, { setFieldValue }) => {
          saveHandler(values, () => {
            setFieldValue("allowanceAndDeduction", "");
            setFieldValue("amountDimension", "");
            setFieldValue("amount", "");
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          setValues,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <Form
              onSubmit={handleSubmit}
              className="employeeProfile-form-main w-100"
            >
              <div className="employee-profile-main">
                <div className="table-card w-100">
                  <div
                    className="table-card-heading"
                    style={{ marginBottom: "12px" }}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <BackButton
                        title={
                          !isView
                            ? "Create Allowance & Deduction"
                            : !isFromOpen && isView
                            ? "View Allowance & Deduction"
                            : "Edit Allowance & Deduction"
                        }
                      />
                    </div>
                    {!isView /* || (isFromOpen && !isEdit) */ && (
                      <ul className="d-flex flex-wrap">
                        <li>
                          <button
                            type="button"
                            className="btn btn-green btn-green-disable"
                            style={{ width: "auto" }}
                            onClick={() => {
                              addHandler(values, () => {
                                resetForm(initData);
                                setRowDto([]);
                                isView && getAdditionAndDeductionById();
                              });
                            }}
                          >
                            Save
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                  <div className="card-style pb-0">
                    <div className="px-1 mt-2">
                      {isView && (
                        <div>
                          <Accordion empBasic={empBasic} />
                          {!isFromOpen && (
                            <button
                              type="button"
                              className="btn btn-default btn-default-outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFormOpen(!isFromOpen);
                              }}
                            >
                              <AddOutlinedIcon />
                              Add More
                            </button>
                          )}
                        </div>
                      )}
                      {(isCreate || isFromOpen) && (
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <label>Select Employee</label>
                              {values?.employee && !isView && (
                                <ResetButton
                                  classes="btn-filter-reset w-50 mt-0 pt-0"
                                  title="Reset Employee"
                                  icon={
                                    <RefreshIcon
                                      sx={{
                                        marginRight: "4px",
                                        fontSize: "12px",
                                      }}
                                    />
                                  }
                                  onClick={() => {
                                    resetForm(initData);
                                    setRowDto([]);
                                    setEmpBasic([]);
                                  }}
                                  styles={{ height: "auto", fontSize: "12px" }}
                                />
                              )}
                            </div>
                            {/* <FormikSelect
                              menuPosition="fixed"
                              name="employee"
                              options={employeeDDL || []}
                              value={values?.employee}
                              onChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                                getEmployeeProfileViewData(
                                  valueOption?.value,
                                  setEmpBasic,
                                  setLoading,
                                  buId,
                                  wgId
                                );
                              }}
                              styles={customStyles}
                              errors={errors}
                              placeholder=""
                              touched={touched}
                              isDisabled={values?.employee}
                            /> */}
                            <AsyncFormikSelect
                              selectedValue={values?.employee}
                              isSearchIcon={true}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                                getEmployeeProfileViewData(
                                  valueOption?.value,
                                  setEmpBasic,
                                  setLoading,
                                  buId,
                                  wgId
                                );
                              }}
                              placeholder="Search (min 3 letter)"
                              loadOptions={(v) =>
                                getSearchEmployeeList(buId, wgId, v)
                              }
                              isDisabled={values?.employee}
                            />
                          </div>

                          <div className="col-lg-3 pt-3">
                            <>
                              {values?.employee && (
                                <div className="d-flex flex-column">
                                  <p
                                    style={{
                                      color: gray700,
                                      fontSize: "14px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {
                                      empBasic?.employeeProfileLandingView
                                        ?.strDesignation
                                    }
                                  </p>
                                  <p
                                    style={{
                                      color: gray700,
                                      fontSize: "12px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Designation
                                  </p>
                                </div>
                              )}
                            </>
                          </div>
                          <div className="col-lg-6"></div>
                          <div className="col-lg-2">
                            <FormikCheckBox
                              label="Auto Renewal"
                              name="isAutoRenew"
                              height="15px"
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                                padding: "0px 0px 0px 5px",
                              }}
                              checked={values?.isAutoRenew}
                              onChange={(e) => {
                                setFieldValue("toMonth", "");
                                setFieldValue("isAutoRenew", e.target.checked);
                              }}
                            />
                          </div>
                          <div className="col-lg-10"></div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>From Month</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.fromMonth}
                                name="fromMonth"
                                type="month"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("fromMonth", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>To Month</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.toMonth}
                                name="toMonth"
                                type="month"
                                min={values?.fromMonth}
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("toMonth", e.target.value);
                                }}
                                disabled={values?.isAutoRenew}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <label>Select Type</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              placeholder={" "}
                              name="salaryType"
                              options={
                                [
                                  {
                                    value: "Allowance",
                                    label: "Allowance",
                                  },
                                  {
                                    value: "Deduction",
                                    label: "Deduction",
                                  },
                                ] || []
                              }
                              value={values?.salaryType}
                              onChange={(valueOption) => {
                                setFieldValue("allowanceAndDeduction", "");
                                setFieldValue("salaryType", valueOption);
                                getAllAllowanceAndDeduction(
                                  orgId,
                                  buId,
                                  wId,
                                  setAllowanceAndDeductionDDL,
                                  valueOption?.value === "Allowance"
                                    ? true
                                    : false,
                                  setLoading
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Select Allowance/Deduction</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              placeholder={" "}
                              name="allowanceAndDeduction"
                              options={allowanceAndDeductionDDL || []}
                              value={values?.allowanceAndDeduction}
                              onChange={(valueOption) => {
                                setFieldValue(
                                  "allowanceAndDeduction",
                                  valueOption
                                );
                              }}
                              isDisabled={!values?.salaryType}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Select Amount Dimension</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              placeholder={" "}
                              name="amountDimension"
                              options={
                                [
                                  {
                                    value: 1,
                                    label: "Percentage Of Basic",
                                  },
                                  {
                                    value: 2,
                                    label: "Percentage Of Gross",
                                  },
                                  {
                                    value: 3,
                                    label: "Fixed Amount",
                                  },
                                  // {
                                  //   value: 4,
                                  //   label: "One Day Salary",
                                  // },
                                ] || []
                              }
                              value={values?.amountDimension}
                              onChange={(valueOption) => {
                                setFieldValue("amountDimension", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>
                                Enter Amount{" "}
                                {(values?.amountDimension?.value === 1 ||
                                  values?.amountDimension?.value === 2) && (
                                  <span>(%)</span>
                                )}
                                {(values?.amountDimension?.value === 3 ||
                                  values?.amountDimension?.value === 4) && (
                                  <span>(BDT)</span>
                                )}
                              </label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.amount}
                                name="amount"
                                type="number"
                                className="form-control"
                                onChange={(e) => {
                                  if (e.target.value < 0) {
                                    return toast.warn(
                                      "Amount can't be negative"
                                    );
                                  }
                                  setFieldValue("amount", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <label>Allowance Duration</label>
                            <FormikSelect
                              classes="input-sm"
                              styles={customStyles}
                              placeholder={" "}
                              name="intAllowanceDuration"
                              options={
                                [
                                  {
                                    value: 1,
                                    label: "Perday",
                                  },
                                  {
                                    value: 2,
                                    label: "Per Month",
                                  },
                                ] || []

                                /* 
            🔥 from backend -- 
            public enum AllowanceDuration
            {
                [Description ("Perday") ]
                PERDAY = 1,
                [Description("Per Month")]
                PER_MONTH = 2
            }
            */
                              }
                              value={values?.intAllowanceDuration}
                              onChange={(valueOption) => {
                                setFieldValue("maxAmount", "");
                                setFieldValue(
                                  "intAllowanceAttendenceStatus",
                                  ""
                                );
                                setFieldValue(
                                  "intAllowanceDuration",
                                  valueOption
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {values?.intAllowanceDuration?.value === 1 ||
                          values?.intAllowanceDuration?.value === 2 ? (
                            <>
                              <div className="col-lg-3">
                                <label>
                                  Allowanc Attendence Status{" "}
                                  <span className="text-danger fs-3">*</span>
                                </label>
                                <FormikSelect
                                  classes="input-sm"
                                  styles={customStyles}
                                  placeholder={" "}
                                  name="intAllowanceAttendenceStatus"
                                  options={
                                    [
                                      {
                                        value: 1,
                                        label: "Payable Days",
                                      },
                                      {
                                        value: 2,
                                        label: "Based On InTime",
                                      },
                                      {
                                        value: 3,
                                        label: "Based On Attendance",
                                      },
                                      {
                                        value: 4,
                                        label: "Not Depend On Attendance",
                                      },
                                    ] || []
                                    /* 
            🔥 from backend -- 
              public enum AllowanceAttendenceStatus
              {
              [Description("Default")] 
              DEFAULT = 1,  //Default value is for all.No restiction
              [Description("Based On InTime")]
              BASED_ON_INTIME = 2, //Will be implemented on only attendence intime
              [Description("Based On Attendence")]
              BASED_ON_ATTENDENCE = 3  
              }
            */
                                  }
                                  value={values?.intAllowanceAttendenceStatus}
                                  onChange={(valueOption) => {
                                    setFieldValue(
                                      "intAllowanceAttendenceStatus",
                                      valueOption
                                    );
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                              {values?.intAllowanceDuration?.value === 1 && (
                                <div className="col-lg-3">
                                  <label>
                                    Max Amount{" "}
                                    <small>
                                      [ for a month ]{" "}
                                      <span className="text-danger fs-3">
                                        *
                                      </span>
                                    </small>
                                  </label>
                                  <FormikInput
                                    classes="input-sm"
                                    value={values?.maxAmount}
                                    placeholder={" "}
                                    name="maxAmount"
                                    type="number"
                                    min={0}
                                    className="form-control"
                                    onChange={(e) =>
                                      setFieldValue("maxAmount", e.target.value)
                                    }
                                    errors={errors}
                                    touched={touched}
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                          <div
                            style={{
                              marginTop: "22px",
                              marginBottom: "22px",
                            }}
                            className="col-md-6 d-flex align-items-center-justify-content-center"
                          >
                            {!isEdit && !isView && (
                              <button
                                type="submit"
                                className="btn btn-green btn-green-disable"
                                style={{ width: "auto" }}
                                label="Add"
                                onClick={() => {
                                  // resetForm(initData);
                                  setIsEdit(false);
                                }}
                              >
                                Add
                              </button>
                            )}

                            {isEdit && (
                              <button
                                type="button"
                                className="btn btn-green btn-green-disable"
                                disabled={isDisabled(values)}
                                style={{ width: "auto" }}
                                label="Add"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEdit(true);
                                  editHandler(values, () => {
                                    getAdditionAndDeductionById();
                                    setSingleData({});
                                  });
                                  setIsFormOpen(!isFromOpen);
                                  resetForm(initData);
                                }}
                              >
                                Update
                              </button>
                            )}
                            {!isEdit && isView && (
                              <button
                                type="button"
                                disabled={isDisabled(values)}
                                className="btn btn-green btn-green-disable"
                                style={{ width: "auto" }}
                                label="Add"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEdit(false);
                                  editHandler(values, () =>
                                    getAdditionAndDeductionById()
                                  );
                                  setIsFormOpen(!isFromOpen);
                                  resetForm(initData);
                                }}
                              >
                                Save
                              </button>
                            )}
                            {isFromOpen && (
                              <button
                                type="button"
                                className="btn btn-green btn-green-disable mx-2"
                                style={{ width: "auto" }}
                                label="Add"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsFormOpen(!isFromOpen);
                                  setIsEdit(false);
                                  resetForm(initData);
                                  setSingleData("");
                                  isView &&
                                    isEdit &&
                                    getAdditionAndDeductionById();
                                }}
                              >
                                {isEdit ? "Reset" : "Cancel"}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {(loading || deleteAllowance?.loading) && <Loading />}
                  <div className="table-card-styled pt-3 pb-3" ref={scrollRef}>
                    {rowDto?.length > 0 ? (
                      <>
                        <p
                          style={{
                            color: gray500,
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "10px",
                          }}
                        >
                          Allowance & Deduction
                        </p>
                        <div className="table-card-body  tableOne">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Allowance/Deduction</th>
                                <th>Type</th>
                                <th>Auto Renewal</th>
                                <th>Applicable Month</th>
                                <th>Dimension</th>
                                <th>Amount/Percentage</th>
                                {isView && (
                                  <th className="text-center">Status</th>
                                )}
                                <th className="text-center"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item?.allowanceName || "N/A"}</td>
                                  <td>{item?.type}</td>
                                  <td>{item?.autoRenew}</td>
                                  <td>
                                    {moment(item?.fromDate).format("MMM-YYYY")}-
                                    {moment(item?.toDate).format("MMM-YYYY")}
                                    {!item?.toDate && "Continue"}
                                  </td>
                                  <td>{item?.basedOn}</td>
                                  <td>
                                    {item?.basedOn !== "Fixed Amount"
                                      ? `${item?.basedOnAmount}%`
                                      : item?.basedOnAmount}
                                  </td>
                                  <td className="text-center">
                                    {item?.status === "Approved" && (
                                      <Chips
                                        label={item?.status}
                                        classess="success"
                                      />
                                    )}
                                    {item?.status === "Pending" && (
                                      <Chips
                                        label={item?.status}
                                        classess="warning"
                                      />
                                    )}
                                    {item?.status === "Reject" && (
                                      <Chips
                                        label={item?.status}
                                        classess="danger"
                                      />
                                    )}
                                    {item?.status === "Process" && (
                                      <Chips
                                        label={item?.status}
                                        classess="primary"
                                      />
                                    )}
                                  </td>

                                  <td width="40px">
                                    <div className="d-flex">
                                      {isView && (
                                        <Tooltip title="Edit" arrow>
                                          <button
                                            className="iconButton"
                                            type="button"
                                          >
                                            <EditOutlinedIcon
                                              onClick={(e) => {
                                                setIsEdit(true);
                                                e.stopPropagation();
                                                scrollRef.current.scrollIntoView(
                                                  {
                                                    behavior: "smooth",
                                                  }
                                                );
                                                setSingleData(item);
                                                setValues({
                                                  ...values,
                                                  employee: {
                                                    value: empId,
                                                    label:
                                                      empBasic
                                                        ?.employeeProfileLandingView
                                                        ?.strEmployeeName,
                                                  },
                                                  isAutoRenew:
                                                    item?.autoRenew === "No"
                                                      ? false
                                                      : true,
                                                  fromMonth: `${moment(
                                                    item?.fromDate
                                                  ).format("YYYY")}-${moment(
                                                    item?.fromDate
                                                  ).format("MM")}`,
                                                  toMonth: `${moment(
                                                    item?.toDate
                                                  ).format("YYYY")}-${moment(
                                                    item?.toDate
                                                  ).format("MM")}`,
                                                  salaryType: {
                                                    value: item?.type,
                                                    label: item?.type,
                                                  },
                                                  allowanceAndDeduction: {
                                                    value:
                                                      item?.allowanceNameId,
                                                    label: item?.allowanceName,
                                                  },
                                                  amountDimension: {
                                                    value: item?.basedOnId,
                                                    label: item?.basedOn,
                                                  },
                                                  amount: item?.basedOnAmount,
                                                  intAllowanceDuration:
                                                    [
                                                      {
                                                        value: 1,
                                                        label: "Perday",
                                                      },
                                                      {
                                                        value: 2,
                                                        label: "Per Month",
                                                      },
                                                    ].find(
                                                      (el) =>
                                                        el.value ===
                                                        item?.allowanceDuration
                                                    ) || "",
                                                  maxAmount: item?.maxAmount,
                                                  intAllowanceAttendenceStatus:
                                                    [
                                                      {
                                                        value: 1,
                                                        label: "Default",
                                                      },
                                                      {
                                                        value: 2,
                                                        label:
                                                          "Based On InTime",
                                                      },
                                                      {
                                                        value: 3,
                                                        label:
                                                          "Based On Attendance",
                                                      },
                                                      {
                                                        value: 4,
                                                        label:
                                                          "Not Depend On Attendance",
                                                      },
                                                    ].find(
                                                      (el) =>
                                                        el.value ===
                                                        item?.allowanceAttendanceStatus
                                                    ) || "",
                                                });
                                                !isFromOpen &&
                                                  setIsFormOpen(!isFromOpen);
                                                deleteHandler(index);
                                              }}
                                            />
                                          </button>
                                        </Tooltip>
                                      )}
                                      {isView && (
                                        <Tooltip title="Delete" arrow>
                                          <button
                                            type="button"
                                            className="iconButton"
                                          >
                                            <DeleteOutlineOutlinedIcon
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                demoPopup(item);
                                              }}
                                            />
                                          </button>
                                        </Tooltip>
                                      )}
                                      {!isView &&
                                        item?.strStatus === "Pending" && (
                                          <Tooltip title="Delete" arrow>
                                            <button
                                              type="button"
                                              className="iconButton"
                                            >
                                              <DeleteOutlineOutlinedIcon
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSingleData("");
                                                  demoPopup(item);
                                                  // deleteHandler(
                                                  //   item?.allowanceId
                                                  // );
                                                }}
                                              />
                                            </button>
                                          </Tooltip>
                                        )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <NoResult />
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default AddEditForm;
