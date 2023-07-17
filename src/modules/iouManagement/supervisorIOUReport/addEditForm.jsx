/* eslint-disable react-hooks/exhaustive-deps */
import { AttachmentOutlined, FileUpload } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
import BackButton from "../../../common/BackButton";
import FormikInput from "../../../common/FormikInput";
import FormikTextArea from "../../../common/FormikTextArea";
import Loading from "../../../common/loading/Loading";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";
import {
  attachment_delete_action,
  multiple_attachment_action,
} from "../../policyUpload/helper";
import { getAllIOULanding, saveIOUApplication } from "./helper";
import { toast } from "react-toastify";

const initData = {
  formDate: todayDate(),
  toDate: todayDate(),
  amount: "",
  description: "",
  employeeName: "",
};

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0, "Amount should be positive number")
    .required("Amount is required"),
  // description: Yup.string().required("Description is required"),
});

export default function SupervisorIOUReportCreate() {
  const params = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [, setImgRow] = useState([]);

  const { orgId, buId, employeeId, userName, isSupNLMORManagement, wgId } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/Auth/GetUserList?businessUnitId=${buId}&workplaceGroupId=${wgId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  // image
  const [imageFile, setImageFile] = useState("");
  const [editImageRow, setEditImageRow] = useState([]);
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let getData = () => {
    params?.id &&
      getAllIOULanding(
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
    params?.id &&
      getAllIOULanding(
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
  };

  useEffect(() => {
    params?.id && getData();
  }, [wgId, buId, params?.id]);

  useEffect(() => {
    if (params?.id && editImageRow?.length) {
      const modifyImageArray = editImageRow.map((image) => {
        return {
          globalFileUrlId: image?.intDocURLId,
        };
      });
      setEditImageRow(modifyImageArray);
    }
  }, [editImageRow, params?.id]);

  const deleteImageHandler = (id) => {
    attachment_delete_action(id, () => {
      getData();
    });
  };

  const saveHandler = (values, cb) => {
    if (isSupNLMORManagement && !values?.employeeName?.value) {
      return toast.warning("Employee name is required", {
        toastId: "ENIR",
      });
    }
    const callback = () => {
      cb();
      getData();
      setImageFile("");
    };

    const modifyImageArray = imageFile
      ? imageFile.map((image) => {
        return {
          intDocURLId: image?.globalFileUrlId,
        };
      })
      : [];

    const payload = {
      strEntryType: params?.id ? "EDIT" : "ENTRY",
      intIOUId: params?.id ? params?.id : 0,
      intBusinessUnitId: buId,
      intWorkplaceGroupId: params?.id ? singleData?.workplaceGroupId : wgId,
      intEmployeeId: isSupNLMORManagement
        ? values?.employeeName?.value
        : employeeId,
      dteFromDate: values?.formDate,
      dteToDate: values?.toDate,
      numIOUAmount: values?.amount,
      numAdjustedAmount: 0,
      numPayableAmount: 0,
      numReceivableAmount: 0,
      strDiscription: values?.description,
      isAdjustment: false,
      intIOUAdjustmentId: 0,
      isActive: true,
      urlIdViewModelList: modifyImageArray,
    };
    saveIOUApplication(payload, setLoading, callback);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={
          params?.id
            ? {
              formDate: dateFormatterForInput(singleData?.dteFromDate),
              toDate: dateFormatterForInput(singleData?.dteToDate),
              amount: singleData?.numIOUAmount,
              description: singleData?.discription,
              employeeName: {
                value: singleData?.employeeId,
                label: singleData?.employeeName,
              },
            }
            : {
              ...initData,
              employeeName: {
                value: employeeId,
                label: userName,
              },
            }
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (params?.id) {
              resetForm({
                formDate: dateFormatterForInput(singleData?.dteFromDate),
                toDate: dateFormatterForInput(singleData?.dteToDate),
                amount: singleData?.numIOUAmount,
                description: singleData?.strDiscription,
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
                <div className="table-card-heading mb12">
                  <div className="d-flex align-items-center">
                    <BackButton />
                    <h2>
                      {params?.id ? `Edit IOU Request` : `Create IOU Request`}
                    </h2>
                  </div>
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        className="btn btn-cancel mr-2"
                        onClick={() => {
                          resetForm(initData);
                          setImageFile("");
                        }}
                      >
                        Reset
                      </button>
                    </li>
                    <li>
                      <button
                        type="submit"
                        className="btn btn-default flex-center"
                      >
                        Send Request
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="card-style">
                  <div className="row">
                    {isSupNLMORManagement && (
                      <>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Select Employee</label>
                          </div>
                          <AsyncFormikSelect
                            selectedValue={values?.employeeName}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {
                              setFieldValue("employeeName", valueOption);
                            }}
                            loadOptions={loadUserList}
                            placeholder="Search (min 3 letter)"
                            isDisabled={params?.id}
                          />
                        </div>
                        <div className="col-12"></div>
                      </>
                    )}
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>From Date</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="formDate"
                          value={values?.formDate}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("formDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>To Date</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="toDate"
                          value={values?.toDate}
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                          }}
                          min={values?.formDate}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>IOU Amount</label>
                        <FormikInput
                          placeholder=" "
                          classes="input-sm"
                          name="amount"
                          value={values?.amount}
                          type="number"
                          onChange={(e) => {
                            setFieldValue("amount", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-12"></div>
                    <div className="col-lg-9">
                      <label>Description</label>
                      <FormikTextArea
                        classes="textarea-with-label"
                        value={values?.description}
                        name="description"
                        type="text"
                        placeholder=" "
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <p
                    onClick={onButtonClick}
                    className="d-inline-block mt-2 pointer uplaod-para"
                  >
                    <input
                      onChange={(e) => {
                        if (e.target.files) {
                          multiple_attachment_action(
                            orgId,
                            "IOU",
                            24,
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
                        key={i}
                        className="d-flex align-items-center"
                        style={{ width: "160px" }}
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(
                              image?.globalFileUrlId || image?.intDocURLId
                            )
                          );
                        }}
                      >
                        <AttachmentOutlined
                          sx={{ marginRight: "5px", color: "#0072E5" }}
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
                            `Attachment_${i <= 8 ? `0${i + 1}` : `${i + 1}`
                            }`}{" "}
                        </div>
                      </div>
                    ))
                    : ""}
                  {editImageRow?.length
                    ? editImageRow.map((image, i) => (
                      <div
                        key={i}
                        className="d-flex align-items-center"
                        style={{ width: "160px" }}
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(
                              image?.globalFileUrlId || image?.intDocURLId
                            )
                          );
                        }}
                      >
                        <AttachmentOutlined
                          sx={{ marginRight: "5px", color: "#0072E5" }}
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
                            `Attachment_${i <= 8 ? `0${i + 1}` : `${i + 1}`
                            }`}{" "}
                          {editImageRow?.length && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteImageHandler(image?.globalFileUrlId);
                              }}
                              size="small"
                              style={{
                                fontSize: "18px",
                                padding: "0px 5px",
                                color: "#175CD3",
                              }}
                            >
                              <CloseIcon fontSize="inherit"> </CloseIcon>
                            </IconButton>
                          )}
                        </div>
                      </div>
                    ))
                    : ""}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
