import {
  AttachmentOutlined,
  FileUpload,
  VisibilityOutlined
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { PeopleDeskSaasDDL } from "../../../../../common/api";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import FormikTextArea from "../../../../../common/FormikTextArea";
import Loading from "../../../../../common/loading/Loading";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../../utility/todayDate";
import { attachment_action } from "../../../../policyUpload/helper";
import "../application.css";
import { loanCrudAction } from "../helper";

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
});

const initData = {
  search: "",
  employee: "",
  loanType: "",
  loanAmount: "",
  installmentNumber: "",
  amountPerInstallment: "",
  description: "",
  effectiveDate: "",
};

const CreateLoanApplicationModal = ({
  setShow,
  getData,
  singleData,
  fileId,
  setFileId,
  setSingleData,
}) => {
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [loanType, setLoanType] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orgId, buId, employeeId, strDisplayName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();



  const saveHandler = (values, cb) => {
    if (+values?.installmentNumber > +values?.loanAmount)
      return toast.warn("Installment number can't be greather than amount");
    loanCrudAction(values, cb, setLoading, employeeId, fileId, orgId);
  };

  useEffect(() => {
    PeopleDeskSaasDDL(
      "EmployeeBasicInfo",
      wgId,
      buId,
      setEmployeeDDL,
      "EmployeeId",
      "EmployeeName"
    );
    PeopleDeskSaasDDL(
      "LoanType",
      wgId,
      buId,
      setLoanType,
      "LoanTypeId",
      "LoanType"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          : {
            ...initData,
            employee: { value: employeeId, label: strDisplayName },
          }
      }
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          getData();
          resetForm(initData);
          setFileId("");
          setSingleData("");
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
        isValid,
      }) => (
        <>
          <Form onSubmit={handleSubmit}>
            {loading && <Loading />}
            <div className="application-modal">
              <div className="modal-body2 px-0 pt-0">
                <div className="row mx-0">
                  <div className="col-6">
                    <label>Employee</label>
                    <FormikSelect
                      name="employee"
                      options={employeeDDL}
                      isDisabled={values?.employee?.value}
                      value={values?.employee}
                      label=""
                      onChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
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
                        setFieldValue("loanAmount", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      min={0}
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
                          (values?.loanAmount || 0) / e.target.value;
                        setFieldValue(
                          "amountPerInstallment",
                          Math.ceil(amountPI)
                        );
                        setFieldValue("installmentNumber", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      min={0}
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
                        setFieldValue("amountPerInstallment", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                      min={0}
                    />
                  </div>
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

                  <div className="col-3 mt-4">
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
                              employeeId,
                              e.target.files,
                              setLoading
                            )
                              .then((data) => {
                                setFileId(data?.[0]);
                              })
                              .catch((error) => {
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
                  {/* <div className="col-6 loan-attachment">
                    <div className="input-main position-group-select">
                      <label className="lebel-bold mr-2">Upload File</label>
                      {fileId?.globalFileUrlId && (
                        <VisibilityOutlined
                          sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "16px" }}
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(
                                fileId?.globalFileUrlId
                              )
                            );
                          }}
                        />
                      )}
                    </div>
                    <div
                      className={
                        fileId?.globalFileUrlId
                          ? "image-upload-box with-img"
                          : "image-upload-box"
                      }
                      onClick={onButtonClick}
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        height: "59px",
                      }}
                    >
                      <input
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            attachment_action(
                              orgId,
                              "LoanType",
                              14,
                              buId,
                              employeeId,
                              e.target.files,
                              setLoading
                            )
                              .then((data) => {
                                setFileId(data?.[0]);
                              })
                              .catch((error) => {
                                setFileId("");
                              });
                          }
                        }}
                        type="file"
                        ref={inputFile}
                        id="file"
                        style={{ display: "none" }}
                      />
                      <div>
                        {!fileId?.globalFileUrlId && (
                          <img
                            style={{ maxWidth: "40px", objectFit: "contain" }}
                            src={placeholderImg}
                            className="img-fluid"
                            alt="Drag or browse"
                          />
                        )}
                      </div>
                      {fileId?.globalFileUrlId && (
                        <div
                          className="d-flex align-items-center"
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(
                                fileId?.globalFileUrlId
                              )
                            );
                          }}
                        >
                          <AttachmentOutlined
                            sx={{ marginRight: "5px", color: "#0072E5" }}
                          />
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#0072E5",
                              cursor: "pointer",
                            }}
                          >
                            {fileId?.fileName || "Attachment"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div> */}
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
                  onClick={(e) => {
                    setShow(false);
                    resetForm(initData);
                    setFileId("");
                    setSingleData("");
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
