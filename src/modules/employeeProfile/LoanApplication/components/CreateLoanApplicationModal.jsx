import {
  AttachmentOutlined,
  FileUpload,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  getSearchEmployeeList,
  PeopleDeskSaasDDL,
} from "../../../../common/api";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import FormikTextArea from "../../../../common/FormikTextArea";
import Loading from "../../../../common/loading/Loading";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import { attachment_action } from "../../../policyUpload/helper";
import "../application.css";
import { loanCrudAction } from "../helper";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";

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
}) => {
  const [loanType, setLoanType] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();

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
    loanCrudAction(
      values,
      cb,
      setLoading,
      employeeId,
      fileId,
      orgId,
      false,
      buId,
      wgId
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
      initialValues={singleData?.loanApplicationId ? singleData : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        saveHandler(values, () => {
          getData();
          resetForm(initData);
          setFileId("");
          setSingleData(null);
          setFileId("");
          setShow(false);
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
              <div className="modalBody" style={{ padding: "0px 16px" }}>
                <div className="row">
                  <div className="col-6">
                    <label>Employee</label>
                    <AsyncFormikSelect
                      selectedValue={values?.employee}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      placeholder="Search (min 3 letter)"
                      loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                    />
                  </div>
                  <div className="col-6">
                    <label>Loan Type</label>
                    <FormikSelect
                      name="loanType"
                      options={loanType}
                      value={values?.loanType}
                      label=""
                      onChange={(valueOption) => {
                        setFieldValue("loanType", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                  <div className="col-6">
                    <label>Loan Amount</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.loanAmount}
                      name="loanAmount"
                      type="number"
                      step="1"
                      onChange={(e) => {
                        setFieldValue("installmentNumber", "");
                        setFieldValue("amountPerInstallment", "");
                        setFieldValue("approveLoanAmount", e.target.value);
                        setFieldValue("loanAmount", e.target.value);
                        if (values?.interest) {
                          const totalAmountwithInterest = (
                            +e.target.value +
                            +e.target.value * (values?.interest / 100)
                          ).toFixed(2);
                          // console.log({ totalAmountwithInterest });
                          setFieldValue(
                            "totalwithinterest",
                            totalAmountwithInterest
                          );
                        }
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      disabled={
                        singleData?.loanApplicationId &&
                        singleData?.intCreatedBy !== employeeId
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label>Interest (%)</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.interest}
                      name="interest"
                      type="number"
                      step="1"
                      onChange={(e) => {
                        setFieldValue("interest", e.target.value);
                        if (values?.loanAmount) {
                          const totalAmountwithInterest = (
                            +values?.loanAmount +
                            +values?.loanAmount * (e.target.value / 100)
                          ).toFixed(2);
                          // console.log({ totalAmountwithInterest });
                          setFieldValue(
                            "totalwithinterest",
                            totalAmountwithInterest
                          );
                        }
                        setFieldValue("amountPerInstallment", "");
                        setFieldValue("installmentNumber", "");
                      }}
                      max={100}
                      min={0}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      disabled={!values?.loanAmount}
                    />
                  </div>
                  <div className="col-6">
                    <label>Total Loan Amount with interest</label>
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
                  <div className="col-6">
                    <label>Guarantor Employee</label>
                    <AsyncFormikSelect
                      name="guarantor"
                      selectedValue={values?.guarantor}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        if (valueOption?.value === values?.employee?.value) {
                          setFieldValue("guarantor", "");
                          return toast.warn(
                            "Please choose a different employee as the guarantor"
                          );
                        }
                        setFieldValue("guarantor", valueOption);
                      }}
                      placeholder="Search (min 3 letter)"
                      loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                    />
                  </div>
                  <div className="col-6">
                    <label>Installment Number</label>
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
                      disabled={
                        singleData?.loanApplicationId &&
                        singleData?.intCreatedBy !== employeeId
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label>Amount Per Installment</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.amountPerInstallment}
                      name="amountPerInstallment"
                      type="number"
                      onChange={(e) => {
                        const installmentNum =
                          (values?.loanAmount || 0) / e.target.value;
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
                      disabled={
                        singleData?.loanApplicationId &&
                        singleData?.intCreatedBy !== employeeId
                      }
                    />
                  </div>
                  {singleData?.loanApplicationId && (
                    <>
                      <div className="col-6">
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
                        />
                      </div>
                      <div className="col-6">
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
                        />
                      </div>
                      <div className="col-6">
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
                        />
                      </div>
                    </>
                  )}
                  <div className="col-6">
                    <label>Effective Date</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.effectiveDate}
                      name="effectiveDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("effectiveDate", e.target.value);
                      }}
                      min={!singleData && todayDate()}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-6">
                    <label>Description</label>
                    {/* <FormikInput
                      classes="input-sm"
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
                    /> */}
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
                  <div className="col-6 mt-4">
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
                  <div className="col-6">
                    {labelShowLastInstallmentAmt(values)}
                  </div>
                </div>
              </div>
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
