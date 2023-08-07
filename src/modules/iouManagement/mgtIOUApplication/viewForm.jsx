import {
  AttachmentOutlined,
  DateRange,
  FilePresentOutlined,
  FileUpload,
  ModeEditOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import moneyIcon from "../../../assets/images/moneyIcon.png";
import BackButton from "../../../common/BackButton";
import CircleButton from "../../../common/CircleButton";
import FormikInput from "../../../common/FormikInput";
import Loading from "../../../common/loading/Loading";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray700, gray900 } from "../../../utility/customColor";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { multiple_attachment_action } from "./../../../common/api/index";
import Accordion from "./accordion/index";
import {
  getAllIOULanding,
  getEmployeeProfileViewData,
  saveIOUApplication,
} from "./helper";

const initData = {
  adjustedAmount: "",
  payableAmount: "",
  receivableAmount: "",
  pendingAmount: "",
};

const validationSchema = Yup.object().shape({
  adjustedAmount: Yup.number()
    .min(0, "Adjusted amount should be positive number")
    .required("Adjusted amount is required"),
  payableAmount: Yup.number().required("Payable amount is required"),
  receivableAmount: Yup.number()
    .min(0, "Receivable amount should be positive number")
    .required("Receivable amount is required"),
  pendingAmount: Yup.number()
    .min(0, "Pending amount should be positive number")
    .required("Pending amount is required"),
});

export default function MgtIOUApplicationView() {
  const params = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [imgRow, setImgRow] = useState([]);
  const [billImgRow, setBillImgRow] = useState([]);
  const [empBasic, setEmpBasic] = useState([]);
  const [edit, setEdit] = useState(false);

  let pendingAmount = 0;
  let payableAmount = 0;

  const { orgId, buId, employeeId, wgId, intWorkplaceId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // image
  const [imageFile, setImageFile] = useState("");
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleData?.employeeId) {
      getEmployeeProfileViewData(
        singleData?.employeeId,
        setEmpBasic,
        setLoading,
        singleData?.businessUnitId,
        singleData?.workplaceGroupId
      );
    }
  }, [singleData, buId, wgId]);

  useEffect(() => {
    if (params?.id) {
      getAllIOULanding(
        intWorkplaceId,
        "ViewById",
        buId,
        wgId,
        +params?.id,
        "",
        "",
        "",
        "",
        setSingleData,
        setLoading,
        1,
        1
      );
      getAllIOULanding(
        intWorkplaceId,
        "DocList",
        buId,
        wgId,
        +params?.id,
        "",
        "",
        "",
        "ADVANCE",
        setImgRow,
        setLoading,
        1,
        1
      );
      getAllIOULanding(
        intWorkplaceId,
        "DocList",
        buId,
        wgId,
        +params?.id,
        "",
        "",
        "",
        "ADJUSTMENT",
        setBillImgRow,
        setLoading,
        1,
        1
      );
    }
  }, [orgId, buId, employeeId, params?.id, wgId, intWorkplaceId]);

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb();
      setEdit(false);
      setImageFile("");
      getAllIOULanding(
        intWorkplaceId,
        "ViewById",
        buId,
        wgId,
        +params?.id,
        "",
        "",
        "",
        "",
        setSingleData,
        setLoading,
        1,
        1
      );
      getAllIOULanding(
        intWorkplaceId,
        "DocList",
        buId,
        wgId,
        +params?.id,
        "",
        "",
        "",
        "ADVANCE",
        setImgRow,
        setLoading,
        1,
        1
      );
      getAllIOULanding(
        intWorkplaceId,
        "DocList",
        buId,
        wgId,
        +params?.id,
        "",
        "",
        "",
        "ADJUSTMENT",
        setBillImgRow,
        setLoading,
        1,
        1
      );
    };

    if (values?.pendingAmount < 0) {
      return toast.warning("Pending amount should be positive number!!!");
    }

    if (values?.payableAmount < 0) {
      return toast.warning("Payable amount should be positive number!!!");
    }

    if (params?.id && values?.adjustedAmount <= 0) {
      return toast.warning("Adjusted amount must be greater than zero !!!", {
        toastId: "AMZ",
      });
    }

    /*
        for management required by BA
          - values?.payableAmount => Cash Received Amount (Pay to Accounts)
          - values?.receivableAmount => Receive from Accounts
    */

    const modifyImageArray =
      imageFile?.length > 0
        ? imageFile.map((image) => {
            return {
              intDocURLId: image?.globalFileUrlId,
            };
          })
        : [];

    const payload = {
      strEntryType: params?.id ? "EDIT" : "ENTRY",
      intIOUId: params?.id ? params?.id : 0,
      intEmployeeId: singleData?.employeeId,
      intBusinessUnitId: buId,
      intWorkplaceGroupId: params?.id ? singleData?.workplaceGroupId : wgId,
      dteFromDate: dateFormatterForInput(singleData?.dteFromDate),
      dteToDate: dateFormatterForInput(singleData?.dteToDate),
      numIOUAmount: singleData?.numIOUAmount,
      numAdjustedAmount: values?.adjustedAmount,
      numPayableAmount: values?.payableAmount,
      numReceivableAmount: values?.receivableAmount,
      strDiscription: singleData?.discription,
      isAdjustment: true,
      intIOUAdjustmentId: singleData?.intIOUAdjustmentId || 0,
      isActive: true,
      urlIdViewModelList: modifyImageArray,
    };

    saveIOUApplication(payload, setLoading, callback);
  };

  // pending amount
  pendingAmount =
    +singleData?.numIOUAmount -
    (+singleData?.numAdjustedAmount + +singleData?.numReceivableAmount);

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={
          params?.id
            ? {
                adjustedAmount: singleData?.numAdjustedAmount,
                receivableAmount: singleData?.numReceivableAmount,
                pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
                payableAmount: singleData?.numPayableAmount,
              }
            : initData
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (params?.id) {
              resetForm({
                adjustedAmount: singleData?.numAdjustedAmount,
                payableAmount: singleData?.numPayableAmount,
                receivableAmount: singleData?.numReceivableAmount,
              });
            } else {
              resetForm(initData);
              setImageFile("");
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
          isValid,
          setValues,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div
                  className="table-card-heading"
                  style={{ marginBottom: "12px" }}
                >
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>{`View IOU`}</h2>
                  </div>
                  {edit && (
                    <>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <button
                            type="submit"
                            className="btn btn-default flex-center"
                          >
                            Save
                          </button>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
                <div className="card-style">
                  <div className="row">
                    <div className="col-12">
                      <div className="mt-2">
                        <Accordion empBasic={empBasic} loading={loading} />
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ margin: "12px 0 0" }}
                    ></div>
                    <div className="col-lg-2">
                      <CircleButton
                        icon={<DateRange style={{ fontSize: "24px" }} />}
                        title={
                          dateFormatter(singleData?.applicationDate) || "-"
                        }
                        subTitle="Application Date"
                      />
                    </div>
                    <div className="col-lg-2">
                      <CircleButton
                        icon={<DateRange style={{ fontSize: "24px" }} />}
                        title={dateFormatter(singleData?.dteFromDate) || "-"}
                        subTitle="From Date"
                      />
                    </div>
                    <div className="col-lg-2">
                      <CircleButton
                        icon={<DateRange style={{ fontSize: "24px" }} />}
                        title={dateFormatter(singleData?.dteToDate) || "-"}
                        subTitle="To Date"
                      />
                    </div>
                    <div className="col-lg-2">
                      <CircleButton
                        icon={<img src={moneyIcon} alt="iBOS" />}
                        title={
                          numberWithCommas(singleData?.numIOUAmount) || "-"
                        }
                        subTitle="IOU Amount"
                      />
                    </div>
                    <div className="col-12">
                      <div className="card-save-border"></div>
                    </div>
                    <div className="col-12">
                      <div className="salary-breakdown-details">
                        <div className="row">
                          <div className="col-6">
                            <h2>Description</h2>
                            {singleData?.discription && (
                              <p
                                style={{
                                  margin: "6px 0 0",
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  lineHeight: "18px",
                                  color: gray700,
                                }}
                              >
                                {singleData?.discription || "N/A"}
                              </p>
                            )}
                          </div>
                          <div className="col-6 d-flex flex-column flex-wrap">
                            <h2>Attachment</h2>
                            <div className="d-flex flex-wrap">
                              {imgRow?.length
                                ? imgRow.map((image, i) => (
                                    <p
                                      style={{
                                        margin: "6px 0 0",
                                        fontWeight: "400",
                                        fontSize: "12px",
                                        lineHeight: "18px",
                                        color: "#009cde",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          dispatch(
                                            getDownlloadFileView_Action(
                                              image?.intDocURLId
                                            )
                                          );
                                        }}
                                      >
                                        {image?.intDocURLId !== 0 && (
                                          <div className="mr-1">
                                            <FilePresentOutlined />{" "}
                                            {`Attachment_${i + 1}`}
                                          </div>
                                        )}
                                      </span>
                                    </p>
                                  ))
                                : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="card-save-border"></div>
                    </div>
                    <div className="col-12">
                      <h2 style={{ marginBottom: "12px" }}>
                        Adjustment Details
                      </h2>
                    </div>
                    {edit ? (
                      <>
                        <div className="col-12">
                          <div className="row">
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>Adjusted Amount</label>
                                <FormikInput
                                  placeholder=" "
                                  classes="input-sm"
                                  name="adjustedAmount"
                                  value={values?.adjustedAmount || ""}
                                  type="number"
                                  onChange={(e) => {
                                    // pending amount
                                    pendingAmount =
                                      +singleData?.numIOUAmount -
                                      (+e.target.value +
                                        +values?.receivableAmount);

                                    // payable  amount
                                    if (pendingAmount > 0) {
                                      payableAmount = 0;
                                      setFieldValue(
                                        "pendingAmount",
                                        pendingAmount
                                      );
                                    } else {
                                      payableAmount = Math.abs(pendingAmount);
                                      pendingAmount = 0;
                                      setFieldValue("pendingAmount", 0);
                                    }

                                    if (
                                      +e.target.value >
                                      +singleData?.numIOUAmount
                                    ) {
                                      setFieldValue("receivableAmount", 0);
                                    }

                                    setFieldValue(
                                      "payableAmount",
                                      payableAmount
                                    );

                                    setFieldValue(
                                      "adjustedAmount",
                                      e.target.value
                                    );
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>Cash Received Amount</label>
                                <FormikInput
                                  placeholder=" "
                                  classes="input-sm"
                                  name="receivableAmount"
                                  value={values?.receivableAmount || "0"}
                                  type="number"
                                  onChange={(e) => {
                                    // pending amount
                                    pendingAmount =
                                      +singleData?.numIOUAmount -
                                      (+values?.adjustedAmount +
                                        +e.target.value);

                                    // payable  amount
                                    if (pendingAmount > 0) {
                                      payableAmount = 0;
                                      setFieldValue(
                                        "pendingAmount",
                                        pendingAmount
                                      );
                                    } else {
                                      payableAmount = Math.abs(pendingAmount);
                                      pendingAmount = 0;
                                      setFieldValue("pendingAmount", 0);
                                    }
                                    setFieldValue(
                                      "payableAmount",
                                      payableAmount
                                    );

                                    setFieldValue(
                                      "receivableAmount",
                                      e.target.value
                                    );
                                  }}
                                  disabled
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>Pay to Accounts</label>
                                <FormikInput
                                  placeholder=" "
                                  classes="input-sm"
                                  name="pendingAmount"
                                  value={values?.pendingAmount || "0"}
                                  type="number"
                                  onChange={(e) => {
                                    return;
                                  }}
                                  errors={errors}
                                  touched={touched}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="input-field-main">
                                <label>Receive from Accounts</label>
                                <FormikInput
                                  placeholder=" "
                                  classes="input-sm"
                                  name="payableAmount"
                                  value={values?.payableAmount || "0"}
                                  type="number"
                                  onChange={(e) => {
                                    return;
                                  }}
                                  errors={errors}
                                  touched={touched}
                                  disabled
                                />
                              </div>
                            </div>
                            {edit && (
                              <div className="col-lg-4 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEdit(false);
                                    // single data
                                    getAllIOULanding(
                                      intWorkplaceId,
                                      "ViewById",
                                      buId,
                                      wgId,
                                      +params?.id,
                                      "",
                                      "",
                                      "",
                                      "",
                                      setSingleData,
                                      setLoading,
                                      1,
                                      1
                                    );
                                    // advance attachment
                                    getAllIOULanding(
                                      intWorkplaceId,
                                      "DocList",
                                      buId,
                                      wgId,
                                      +params?.id,
                                      "",
                                      "",
                                      "",
                                      "ADVANCE",
                                      setImgRow,
                                      setLoading,
                                      1,
                                      1
                                    );
                                    // bill attachment
                                    getAllIOULanding(
                                      intWorkplaceId,
                                      "DocList",
                                      buId,
                                      wgId,
                                      +params?.id,
                                      "",
                                      "",
                                      "",
                                      "ADJUSTMENT",
                                      setBillImgRow,
                                      setLoading,
                                      1,
                                      1
                                    );
                                  }}
                                  className="btn btn-edit"
                                >
                                  <SettingsBackupRestoreOutlined
                                    sx={{
                                      color: gray900,
                                      fontSize: "16px",
                                      marginRight: "10px",
                                    }}
                                  />
                                  Reset
                                </button>
                              </div>
                            )}
                            <div className="col-12">
                              <p
                                onClick={onButtonClick}
                                className="d-inline-block mt-2 pointer uplaod-para"
                              >
                                <input
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      multiple_attachment_action(
                                        orgId,
                                        "IOU Adjustment",
                                        28,
                                        buId,
                                        employeeId,
                                        e.target.files,
                                        setLoading
                                      )
                                        .then((data) => {
                                          setImageFile(data);
                                        })
                                        .catch((error) => {
                                          setImageFile("");
                                        });
                                    }
                                  }}
                                  type="file"
                                  id="file"
                                  accept="image/png, image/jpeg, image/jpg, .pdf"
                                  ref={inputFile}
                                  style={{ display: "none" }}
                                  multiple
                                />
                                <span style={{ fontSize: "14px" }}>
                                  <FileUpload
                                    sx={{
                                      marginRight: "5px",
                                      fontSize: "18px",
                                    }}
                                  />{" "}
                                  Upload files
                                </span>
                              </p>
                              {imageFile?.length
                                ? imageFile.map((image, i) => (
                                    <div
                                      className="d-flex align-items-center"
                                      onClick={() => {
                                        dispatch(
                                          getDownlloadFileView_Action(
                                            image?.globalFileUrlId ||
                                              image?.intDocURLId
                                          )
                                        );
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
                                        {image?.fileName ||
                                          `Attachment_${
                                            i <= 8 ? `0${i + 1}` : `${i + 1}`
                                          }`}{" "}
                                      </div>
                                    </div>
                                  ))
                                : ""}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-12">
                          <div
                            className="row"
                            style={{ alignItems: "flex-start" }}
                          >
                            <div className="col-lg-2">
                              <CircleButton
                                icon={<img src={moneyIcon} alt="iBOS" />}
                                title={
                                  numberWithCommas(
                                    singleData?.numAdjustedAmount
                                  ) || "-"
                                }
                                subTitle="Adjusted Amount"
                              />
                            </div>
                            <div className="col-lg-2">
                              <CircleButton
                                icon={<img src={moneyIcon} alt="iBOS" />}
                                title={
                                  numberWithCommas(
                                    singleData?.numReceivableAmount
                                  ) || "-"
                                }
                                subTitle="Cash Received Amount"
                              />
                            </div>
                            <div className="col-lg-2">
                              <CircleButton
                                icon={<img src={moneyIcon} alt="iBOS" />}
                                title={
                                  numberWithCommas(pendingAmount || 0) || "-"
                                }
                                subTitle="Pay to Accounts"
                              />
                            </div>
                            <div className="col-lg-2">
                              <CircleButton
                                icon={<img src={moneyIcon} alt="iBOS" />}
                                title={
                                  numberWithCommas(
                                    singleData?.numPayableAmount
                                  ) || "-"
                                }
                                subTitle="Receive from Accounts"
                              />
                            </div>
                            <div className="col-lg-2"></div>
                            {!edit &&
                              singleData?.status === "Approved" &&
                              singleData?.adjustmentStatus !== "Adjusted" && (
                                <div className="col-lg-2 text-right">
                                  {(singleData?.adjustmentStatus !==
                                    "Completed" ||
                                    singleData?.adjustmentStatus !==
                                      "Rejected") && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEdit(true);
                                      }}
                                      className="btn btn-edit"
                                    >
                                      <ModeEditOutlined
                                        sx={{
                                          color: gray900,
                                          fontSize: "16px",
                                          marginRight: "10px",
                                        }}
                                      />
                                      Edit
                                    </button>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                        {billImgRow?.length > 0 ? (
                          <div className="col-12">
                            <h2 style={{ margin: "12px 0 8px" }}>
                              Bill Attachment
                            </h2>
                            {billImgRow.map((image, i) => (
                              <p
                                style={{
                                  margin: "6px 0 0",
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  lineHeight: "18px",
                                  color: "#009cde",
                                  cursor: "pointer",
                                }}
                                key={i}
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        image?.globalFileUrlId ||
                                          image?.intDocURLId
                                      )
                                    );
                                  }}
                                >
                                  <FilePresentOutlined />
                                  {image?.fileName ||
                                    `Attachment_${
                                      i <= 8 ? `0${i + 1}` : `${i + 1}`
                                    }`}{" "}
                                </span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          ""
                        )}
                      </>
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
