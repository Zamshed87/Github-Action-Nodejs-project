import {
  AttachmentOutlined,
  DeleteOutline,
  FileUpload,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  getPeopleDeskAllDDLWithCode,
  getSearchEmployeeList,
  PeopleDeskSaasDDL,
} from "../../../../common/api";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import FormikTextArea from "../../../../common/FormikTextArea";
import Loading from "../../../../common/loading/Loading";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { attachment_action } from "../../../policyUpload/helper";
import "../application.css";
import {
  costInputHandler,
  getGurantor,
  handleAmendmentClick,
  handleDeleteClick,
  loanCrudAction,
  subTotal,
} from "../helper";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import { gray600, success500 } from "utility/customColor";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { Tag } from "antd";
import { IconButton, Tooltip } from "@mui/material";
import { formatMoney } from "utility/formatMoney";
import DefaultInput from "common/DefaultInput";
import moment from "moment";
import Required from "common/Required";

const validationSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  loanAmount: Yup.number()
    .integer("Must be integer")
    .min(0, "Loan amount cannot be negative")
    .required("Loan amount is required"),
  installmentNumber: Yup.number()
    .integer("Must be integer")
    .min(0, "Installment Number cannot be negative")
    .required("Installment number is required"),
  effectiveDate: Yup.string().required("Effective date is required"),
  amountPerInstallment: Yup.number()
    .integer("Must be integer")
    .min(0, "Amount Per Installment Number cannot be negative")
    .required("Amount per installment is required"),
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  loanType: Yup.object()
    .shape({
      label: Yup.string().required("Loan type is required"),
      value: Yup.string().required("Loan type is required"),
    })
    .typeError("Loan type is required"),
  approveLoanAmount: Yup.number().integer("Must be integer"),
  approveInstallmentNumber: Yup.number().integer("Must be integer"),
  approveAmountPerInstallment: Yup.number().integer("Must be integer"),
});

const initData = {
  search: "",
  employee: "",
  loanType: "",
  loanAmount: "",
  installmentNumber: "",
  amountPerInstallment: "",
  approveLoanAmount: "",
  approveInstallmentNumber: "",
  approveAmountPerInstallment: "",
  description: "",
  effectiveDate: "",
  guarantor: "",
  interest: "",
  totalwithinterest: "",
};

const CreateLoanApplicationModal = ({
  setShow,
  getData,
  singleData,
  fileId,
  setFileId,
  setSingleData,
  isSelf,
}) => {
  const [loanType, setLoanType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [guarantorDDL, setGuarantorDDL] = useState([]);
  const [grossSalary, setGrossSalary] = useState();
  const [isLoan, setIsloan] = useState(false);

  const { orgId, buId, employeeId, wgId, wId, userName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (singleData?.loanApplicationId) {
      getGurantor(singleData?.loanApplicationId, setGuarantorDDL);
      setSingleData({ ...singleData, guarantor: guarantorDDL });
    }
  }, [tableData]);

  useEffect(() => {
    getPeopleDeskAllDDLWithCode(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}&businessUnitId=${buId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeName",
      setEmployeeDDL
    );
  }, [employeeId, wgId]);

  const saveHandler = (values, cb) => {
    // approveLoanAmount approveInstallmentNumber approveAmountPerInstallment
    if (!singleData?.loanApplicationId) {
      if (+values?.installmentNumber > +values?.loanAmount)
        return toast.warn("Installment number can't be greather than amount");
    } else {
      if (!+values?.approveLoanAmount && +values?.approveLoanAmount < 0)
        return toast.warn("Approve loan amount is required");

      if (
        !+values?.approveInstallmentNumber &&
        +values?.approveInstallmentNumber < 0
      )
        return toast.warn("Approve installment number is required");

      if (
        !+values?.approveAmountPerInstallment &&
        +values?.approveAmountPerInstallment < 0
      )
        return toast.warn("Approve amount per installment is required");

      if (+values?.approveLoanAmount > +values?.loanAmount)
        return toast.warn("Approve loan amount can't be greather than amount");

      if (+values?.approveInstallmentNumber > +values?.approveLoanAmount)
        return toast.warn(
          "Approve Installment number can't be greather than amount"
        );
    }
    const total = subTotal(tableData);
    if (singleData?.loanApplicationId) {
      if (values?.totalwithinterest != total) {
        return toast.warn(
          "Total Actual Payment Amount and Loan Amount Must Be Equal"
        );
      }
    }
    loanCrudAction(
      values,
      cb,
      setLoading,
      employeeId,
      fileId,
      orgId,
      false,
      buId,
      wgId,
      tableData
    );
  };

  useEffect(() => {
    PeopleDeskSaasDDL(
      "LoanType",
      wgId,
      buId,
      setLoanType,
      "LoanTypeId",
      "LoanType",
      0,
      wId
    );
  }, [wgId, buId]);

  const [forView, getForView] = useAxiosGet([]);

  useEffect(() => {
    if (singleData?.loanApplicationId) {
      getForView(
        `/Employee/LoanInstallmentRowGetById?loanId=${singleData?.loanApplicationId}`,
        (data) => {
          const effectiveDate = moment(singleData.effectiveDate); // Parse effective date
          const modifyData = {
            row: data?.map((item, index) => {
              const repaymentDate = effectiveDate.clone().add(index, "months"); // Start from effective date month
              return {
                isHold: item?.isHold || false,
                date: repaymentDate.format("YYYY-MM"), // Format as "YYYY-MM"
                paymentYear: repaymentDate.year() || 0,
                paymentMonth: repaymentDate.month() + 1,
                strRemarks: item?.strRemarks || "",
                loanApplicationId: item?.loanApplicationId || 0,
                intInterest: +item?.intInterest || 0,
                totalLoanAmount: +item?.totalLoanAmount || 0,
                intInstallmentNumber: +item?.intInstallmentNumber || 0,
                intInstallmentAmount: +item?.intInstallmentAmount || 0,
                strApplicantName: item?.strApplicantName || "",
              };
            }),
          };
          setTableData(modifyData?.row);
        }
      );
    }
  }, [singleData?.loanApplicationId]);
  const labelShowLastInstallmentAmt = (values) => {
    const lastAmount = values?.loanAmount % values?.amountPerInstallment;
    if (lastAmount > 0) {
      return <p>Last Installment Amount : {lastAmount}</p>;
    } else {
      return null;
    }
  };
  // image
  const inputFile = useRef(null);

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        singleData?.loanApplicationId
          ? singleData
          : isSelf
          ? { ...initData, employee: { value: employeeId, label: userName } }
          : initData
      }
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        saveHandler(values, (res) => {
          if (isSelf) {
            getData();
            resetForm(initData);
            setFileId("");
            setSingleData(null);
            setFileId("");
            setShow(false);
          }
          if (!isSelf && tableData?.length !== 0) {
            getData();
            resetForm(initData);
            setFileId("");
            setSingleData(null);
            setFileId("");
            setShow(false);
          }
          if (!isSelf && tableData?.length === 0) {
            getForView(
              `/Employee/LoanInstallmentRowGetById?loanId=${res?.autoId}`,
              (data) => {
                const effectiveDate = moment(values?.effectiveDate); // Parse effective date
                const modifyData = {
                  row: data?.map((item, index) => {
                    const repaymentDate = effectiveDate
                      .clone()
                      .add(index, "months"); // Start from effective date month
                    return {
                      isHold: item?.isHold || false,
                      date: repaymentDate.format("YYYY-MM"), // Format as "YYYY-MM"
                      paymentYear: repaymentDate.year() || 0,
                      paymentMonth: repaymentDate.month() + 1,
                      strRemarks: item?.strRemarks || "",
                      loanApplicationId: item?.loanApplicationId || 0,
                      intInterest: +item?.intInterest || 0,
                      totalLoanAmount: +item?.totalLoanAmount || 0,
                      intInstallmentNumber: +item?.intInstallmentNumber || 0,
                      intInstallmentAmount: +item?.intInstallmentAmount || 0,
                      strApplicantName: item?.strApplicantName || "",
                    };
                  }),
                };
                setTableData(modifyData?.row);
              }
            );
          }
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <>
          <Form onSubmit={handleSubmit}>
            {loading && <Loading />}
            <div className="businessUnitModal">
              <div
                className="modalBody"
                style={{ padding: "0px 16px", minHeight: "400px" }}
              >
                <div className="row">
                  <div className="col-4">
                    <label>
                      Employee <Required />
                    </label>
                    <AsyncFormikSelect
                      isDisabled={singleData?.loanApplicationId || isSelf}
                      selectedValue={values?.employee}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                        setIsloan(valueOption?.isLoan);
                        if (orgId === 4 || orgId === 5) {
                          const doubleGross = valueOption?.numGrossSalary * 2;
                          setGrossSalary(doubleGross);
                        }
                      }}
                      placeholder="Search (min 3 letter)"
                      loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                    />
                    {isLoan && (
                      <div
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          marginTop: "10px",
                          fontSize: "12px",
                        }}
                      >
                        Please note: This employee is associated with a loan.
                      </div>
                    )}
                  </div>
                  <div className="col-4">
                    <label>
                      Loan Type <Required />
                    </label>
                    <FormikSelect
                      name="loanType"
                      options={loanType}
                      value={values?.loanType}
                      isDisabled={singleData?.loanApplicationId}
                      label=""
                      onChange={(valueOption) => {
                        setFieldValue("loanType", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-4">
                    <label>
                      Loan Amount <Required />
                    </label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.loanAmount}
                      name="loanAmount"
                      type="number"
                      step="1"
                      onChange={(e) => {
                        setFieldValue("installmentNumber", "");
                        setFieldValue("amountPerInstallment", "");
                        setFieldValue("totalwithinterest", +e.target.value);

                        if (orgId === 4 || orgId === 5) {
                          if (e.target.value > grossSalary) {
                            return toast.warn(
                              "Loan Amount cannot be greater than gross salary",
                              { toastId: "toastId" }
                            );
                          }
                          setFieldValue("loanAmount", e.target.value);
                        } else {
                          setFieldValue("loanAmount", e.target.value);
                        }

                        if (values?.interest || e.target.value) {
                          const totalAmountwithInterest =
                            +e.target.value +
                            +e.target.value * (values?.interest / 100);

                          if (orgId === 4 || orgId === 5) {
                            if (totalAmountwithInterest > grossSalary) {
                              setFieldValue("interest", "");
                              setFieldValue("totalwithinterest", +grossSalary);
                              return toast.warn(
                                "Total amount with interest cannot exceed gross salary",
                                { toastId: "toastId" }
                              );
                            } else {
                              setFieldValue(
                                "totalwithinterest",
                                +totalAmountwithInterest
                              );
                            }
                          } else {
                            setFieldValue(
                              "totalwithinterest",
                              +totalAmountwithInterest
                            );
                          }
                        }
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      disabled={singleData?.loanApplicationId}
                    />
                  </div>
                  {!isSelf && (
                    <div className="col-4">
                      <label>Interest (%)</label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.interest}
                        name="interest"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("interest", e.target.value);
                          if (values?.loanAmount || e.target.value) {
                            const totalAmountwithInterest = (
                              +values?.loanAmount +
                              +values?.loanAmount * (e.target.value / 100)
                            ).toFixed(2);

                            if (orgId === 4 || orgId === 5) {
                              if (totalAmountwithInterest > grossSalary) {
                                toast.warn(
                                  "Total amount with interest cannot exceed gross salary",
                                  { toastId: "toastId" }
                                );
                                setFieldValue(
                                  "totalwithinterest",
                                  +grossSalary
                                );
                              } else {
                                setFieldValue(
                                  "totalwithinterest",
                                  +totalAmountwithInterest
                                );
                              }
                            } else {
                              setFieldValue(
                                "totalwithinterest",
                                +totalAmountwithInterest
                              );
                            }
                          }
                          setFieldValue("amountPerInstallment", "");
                          setFieldValue("installmentNumber", "");
                        }}
                        max={100}
                        min={0}
                        step="0.01" // Accepts fractional values
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                        disabled={
                          !values?.loanAmount || singleData?.loanApplicationId
                        }
                      />
                    </div>
                  )}
                  <div className="col-4">
                    <div className="d-flex justify-content-between">
                      <label>Total Loan Amount with interest</label>
                      {(orgId === 4 || orgId === 5) && (
                        <span
                          style={{ fontSize: "14px", position: "relative" }}
                        >
                          {formatMoney(grossSalary)}
                          <i
                            className="bi bi-info-circle"
                            style={{ cursor: "pointer", marginLeft: "5px" }}
                          ></i>
                          <span
                            style={{
                              visibility: "hidden",
                              width: "150px",
                              backgroundColor: "black",
                              color: "#fff",
                              textAlign: "center",
                              borderRadius: "6px",
                              padding: "5px 0",
                              position: "absolute",
                              zIndex: 1,
                              bottom: "125%",
                              left: "50%",
                              marginLeft: "-75px",
                              fontSize: "12px",
                              opacity: 0,
                              transition: "opacity 0.3s",
                            }}
                            className="tooltip-text"
                          >
                            This is the maximum loan amount you can apply for,
                            based on your gross salary.
                          </span>
                        </span>
                      )}
                    </div>
                    <FormikInput
                      classes="input-sm"
                      value={values?.totalwithinterest}
                      name="totalwithinterest"
                      type="number"
                      step="1"
                      onChange={(e) => {
                        setFieldValue("totalwithinterest", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-4">
                    <label>
                      Guarantor Employee <Required />
                    </label>

                    <FormikSelect
                      name="guarantor"
                      isClearable={false}
                      options={employeeDDL || []}
                      value={values?.guarantor}
                      onChange={(valueOption) => {
                        setFieldValue("guarantor", valueOption);
                      }}
                      styles={{
                        ...customStyles,
                        control: (provided) => ({
                          ...provided,
                          minHeight: "auto",
                          height:
                            values?.guarantor?.length > 1 ? "auto" : "auto",
                          borderRadius: "4px",
                          boxShadow: `${success500}!important`,
                          ":hover": {
                            borderColor: `${gray600}!important`,
                          },
                          ":focus": {
                            borderColor: `${gray600}!important`,
                          },
                        }),
                        valueContainer: (provided) => ({
                          ...provided,
                          height:
                            values?.guarantor?.length > 1 ? "auto" : "auto",
                          padding: "0 6px",
                        }),
                        multiValue: (styles) => {
                          return {
                            ...styles,
                            position: "relative",
                            top: "-1px",
                          };
                        },
                        multiValueLabel: (styles) => ({
                          ...styles,
                          padding: "0",
                        }),
                      }}
                      isMulti
                      isDisabled={singleData}
                      errors={errors}
                      placeholder="Guarantor Employee"
                      touched={touched}
                    />
                  </div>

                  {/* <div className="col-4">
                    <label>Closing Date</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.loanClosingDate}
                      name="loanClosingDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("loanClosingDate", e.target.value);
                      }}
                      min={!singleData && todayDate()}
                      className="form-control"
                      placeholder=""
                      disabled={singleData}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}

                  <div className="col-4">
                    <label>
                      Installment Number
                      <Required />
                    </label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.installmentNumber}
                      name="installmentNumber"
                      type="number"
                      onChange={(e) => {
                        const amountPI =
                          (values?.totalwithinterest || 0) / e.target.value;
                        setFieldValue(
                          "amountPerInstallment",
                          Math.ceil(amountPI)
                        );
                        const approveAmountPI =
                          (values?.approveLoanAmount || 0) / e.target.value;
                        setFieldValue(
                          "approveAmountPerInstallment",
                          Math.ceil(approveAmountPI)
                        );
                        setFieldValue(
                          "approveInstallmentNumber",
                          e.target.value
                        );
                        setFieldValue("installmentNumber", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      disabled={singleData?.loanApplicationId}
                      // disabled={
                      //   singleData?.loanApplicationId &&
                      //   singleData?.intCreatedBy !== employeeId
                      // }
                    />
                  </div>
                  <div className="col-4">
                    <label>
                      Amount Per Installment <Required />
                    </label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.amountPerInstallment}
                      name="amountPerInstallment"
                      type="number"
                      onChange={(e) => {
                        const installmentNum =
                          (values?.totalwithinterest || 0) / e.target.value;
                        setFieldValue(
                          "installmentNumber",
                          Math.ceil(installmentNum)
                        );
                        const approveInstallmentNum =
                          (values?.approveLoanAmount || 0) / e.target.value;
                        setFieldValue(
                          "approveInstallmentNumber",
                          Math.ceil(approveInstallmentNum)
                        );
                        setFieldValue(
                          "approveAmountPerInstallment",
                          e.target.value
                        );
                        setFieldValue("amountPerInstallment", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      disabled={singleData?.loanApplicationId}
                      // disabled={
                      //   singleData?.loanApplicationId &&
                      //   singleData?.intCreatedBy !== employeeId
                      // }
                    />
                  </div>
                  {singleData?.loanApplicationId && (
                    <>
                      <div className="col-4 d-none">
                        <label>Approve Loan Amount</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.approveLoanAmount}
                          name="approveLoanAmount"
                          type="number"
                          step="1"
                          onChange={(e) => {
                            setFieldValue("approveInstallmentNumber", "");
                            setFieldValue("approveAmountPerInstallment", "");
                            setFieldValue("approveLoanAmount", e.target.value);
                          }}
                          className="form-control"
                          placeholder=""
                          errors={errors}
                          touched={touched}
                          disabled={singleData?.loanApplicationId}
                        />
                      </div>
                      <div className="col-4 d-none">
                        <label>Approve Installment Number</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.approveInstallmentNumber}
                          name="approveInstallmentNumber"
                          type="number"
                          onChange={(e) => {
                            const amountPI =
                              (values?.approveLoanAmount || 0) / e.target.value;
                            setFieldValue(
                              "approveAmountPerInstallment",
                              Math.ceil(amountPI)
                            );
                            setFieldValue(
                              "approveInstallmentNumber",
                              e.target.value
                            );
                          }}
                          className="form-control"
                          placeholder=""
                          errors={errors}
                          touched={touched}
                          disabled={singleData?.loanApplicationId}
                        />
                      </div>
                      <div className="col-4 d-none">
                        <label>Approve Amount Per Installment</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.approveAmountPerInstallment}
                          name="approveAmountPerInstallment"
                          type="number"
                          onChange={(e) => {
                            const installmentNum =
                              (values?.approveLoanAmount || 0) / e.target.value;
                            setFieldValue(
                              "approveInstallmentNumber",
                              Math.ceil(installmentNum)
                            );
                            setFieldValue(
                              "approveAmountPerInstallment",
                              e.target.value
                            );
                          }}
                          className="form-control"
                          placeholder=""
                          errors={errors}
                          touched={touched}
                          disabled={singleData?.loanApplicationId}
                        />
                      </div>
                    </>
                  )}
                  <div className="col-4">
                    <label>
                      Effective Month <Required />
                    </label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.effectiveDate}
                      name="effectiveDate"
                      disabled={singleData}
                      type="month"
                      onChange={(e) => {
                        setFieldValue("effectiveDate", e.target.value);
                      }}
                      min={!singleData}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-4">
                    <label>
                      Description <Required />
                    </label>
                    <FormikTextArea
                      classes="textarea-with-label"
                      value={values?.description}
                      name="description"
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => {
                        setFieldValue("description", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      style={{ height: "60px" }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Family Guarantor</label>
                    <FormikTextArea
                      classes="textarea-with-label"
                      value={values?.familyGuarantor}
                      name="familyGuarantor"
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => {
                        setFieldValue("familyGuarantor", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      style={{ height: "60px" }}
                    />
                  </div>
                  <div className="col-4 mt-4">
                    <div className="input-main position-group-select">
                      {fileId ? (
                        <>
                          <label className="lebel-bold mr-2">Upload File</label>
                          <VisibilityOutlined
                            sx={{
                              color: "rgba(0, 0, 0, 0.6)",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              dispatch(
                                getDownlloadFileView_Action(
                                  values?.loanApplicationId &&
                                    !fileId?.globalFileUrlId
                                    ? fileId
                                    : fileId?.globalFileUrlId
                                )
                              );
                            }}
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <div
                      className={fileId ? " mt-0 " : "mt-3"}
                      onClick={onButtonClick}
                      style={{ cursor: "pointer" }}
                      // style={{ cursor: "pointer", position: "relative" }}
                    >
                      <input
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            attachment_action(
                              orgId,
                              "LoanType",
                              14,
                              buId,
                              values?.employee?.value,
                              e.target.files,
                              setLoading
                            )
                              .then((data) => {
                                setFileId(data?.[0]);
                              })
                              .catch(() => {
                                setFileId("");
                              });
                          }
                        }}
                        type="file"
                        id="file"
                        ref={inputFile}
                        style={{ display: "none" }}
                      />
                      <div style={{ fontSize: "14px" }}>
                        {!fileId ? (
                          <>
                            <FileUpload
                              sx={{
                                marginRight: "5px",
                                fontSize: "18px",
                              }}
                            />{" "}
                            Click to upload
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      {fileId ? (
                        <div
                          className="d-flex align-items-center"
                          onClick={() => {
                            // dispatch(getDownlloadFileView_Action(imageFile?.globalFileUrlId));
                          }}
                        >
                          <AttachmentOutlined
                            sx={{
                              marginRight: "5px",
                              color: "#0072E5",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#0072E5",
                              cursor: "pointer",
                            }}
                          >
                            {fileId?.fileName || "Attachment"}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="col-4">
                    {labelShowLastInstallmentAmt(values)}
                  </div>
                </div>
              </div>
              {(singleData?.loanApplicationId || tableData?.length > 0) && (
                <div style={{ textAlign: "right", marginRight: "10px" }}>
                  <span
                    style={{
                      cursor: "pointer",
                    }}
                    disabled={true}
                    onClick={() => {
                      handleAmendmentClick(tableData, setTableData);
                    }}
                  >
                    <Tag color={"green"}>{"Add Installment"}</Tag>
                  </span>
                </div>
              )}

              {/* row table start */}
              {(singleData?.loanApplicationId || tableData?.length > 0) && (
                <div className="table-card-body pt-3">
                  <div
                    className=" table-card-styled tableOne"
                    style={{ padding: "0px 12px" }}
                  >
                    <table className="table align-middle">
                      <thead style={{ color: "#212529" }}>
                        <tr>
                          <th>
                            <div className="d-flex align-items-center">
                              Installment no
                            </div>
                          </th>
                          <th>
                            <div className="d-flex align-items-center">
                              Repayment Month
                            </div>
                          </th>
                          <th>
                            <div className="d-flex align-items-center">
                              Total Actual Payment Amount
                            </div>
                          </th>
                          <th>
                            <div className="d-flex align-items-center">
                              Remarks
                            </div>
                          </th>
                          <th>
                            <div className="d-flex align-items-center justify-content-end">
                              Action
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.length > 0 && (
                          <>
                            {tableData.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <DefaultInput
                                      classes="input-sm"
                                      value={item?.date}
                                      name="date"
                                      type="month"
                                      className="form-control"
                                      disabled={true}
                                      onChange={(e) => {
                                        setFieldValue("date", e.target.value);
                                      }}
                                      errors={errors}
                                      touched={touched}
                                    />
                                  </td>
                                  <td>
                                    <FormikInput
                                      classes="input-sm"
                                      value={+item?.intInstallmentAmount}
                                      name="intInstallmentAmount"
                                      type="number"
                                      onChange={(e) => {
                                        if (e.target.value < 0) {
                                          return toast.warn(
                                            "Non-positive values not allowed",
                                            { toastId: "toastId" }
                                          );
                                        } else {
                                          setFieldValue(
                                            "intInstallmentAmount",
                                            ""
                                          );
                                        }
                                        costInputHandler(
                                          "intInstallmentAmount",
                                          +e.target.value,
                                          index,
                                          tableData,
                                          setTableData,
                                          values
                                        );
                                      }}
                                      className="form-control"
                                      placeholder=""
                                      errors={errors}
                                      touched={touched}
                                    />
                                  </td>
                                  <td>
                                    <FormikInput
                                      classes="input-sm"
                                      value={item?.strRemarks}
                                      name="strRemarks"
                                      type="string"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "strRemarks",
                                          e.target.value
                                        );
                                        costInputHandler(
                                          "strRemarks",
                                          e.target.value,
                                          index,
                                          tableData,
                                          setTableData,
                                          values
                                        );
                                      }}
                                      className="form-control"
                                      placeholder=""
                                      errors={errors}
                                      touched={touched}
                                    />
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-end justify-content-end">
                                      <span
                                        style={{
                                          cursor: `${
                                            !item?.isHold ? "pointer" : ""
                                          }`,
                                        }}
                                        disabled={true}
                                        onClick={() => {
                                          if (item?.isHold) return;
                                          handleAmendmentClick(
                                            tableData,
                                            setTableData,
                                            item,
                                            index
                                          );
                                        }}
                                      >
                                        <Tag
                                          color={`${
                                            item?.isHold ? "gray" : "green"
                                          }`}
                                        >
                                          Amendment!
                                        </Tag>
                                      </span>
                                      {index === tableData.length - 1 && (
                                        <IconButton
                                          disabled={item?.isHold}
                                          type="button"
                                          style={{
                                            height: "25px",
                                            width: "25px",
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(
                                              index,
                                              tableData,
                                              setTableData
                                            );
                                          }}
                                        >
                                          <Tooltip title="Delete">
                                            <DeleteOutline
                                              sx={{
                                                height: "25px",
                                                width: "25px",
                                              }}
                                            />
                                          </Tooltip>
                                        </IconButton>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            <tr>
                              <td></td>
                              <td
                                style={{
                                  textAlign: "right",
                                  fontWeight: "bold",
                                }}
                              >
                                Total:{" "}
                              </td>
                              <td style={{ fontWeight: "bold" }}>
                                {formatMoney(subTotal(tableData))}
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* row table end  */}
              <div className="modal-footer form-modal-footer">
                <button
                  type="button"
                  className="btn btn-cancel"
                  style={{
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    setShow(false);
                    resetForm(initData);
                    setFileId("");
                    setSingleData(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-green btn-green-disable"
                  style={{ width: "auto" }}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default CreateLoanApplicationModal;
