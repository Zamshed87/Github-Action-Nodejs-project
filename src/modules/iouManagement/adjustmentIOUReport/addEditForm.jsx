/* eslint-disable no-unused-vars */
import { AttachmentOutlined, FileUpload } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
import BackButton from "../../../common/BackButton";
import FormikInput from "../../../common/FormikInput";
import FormikTextArea from "../../../common/FormikTextArea";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { todayDate } from "../../../utility/todayDate";
import {
  attachment_delete_action,
  multiple_attachment_action,
} from "../../policyUpload/helper";
import { saveIOUApplication } from "./helper";

const initData = {
  employeeName: "",
  formDate: todayDate(),
  toDate: todayDate(),
  amount: "",
  description: "",
};

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0, "Amount should be positive number")
    .required("Amount is required"),
  // description: Yup.string().required("Description is required"),
});

export default function MgtIOUApplicationCreate() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30268) {
      permission = item;
    }
  });

  // image
  const [imageFile, setImageFile] = useState("");
  const [editImageRow, setEditImageRow] = useState([]);
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const deleteImageHandler = (id) => {
    attachment_delete_action(id, () => {});
  };

  const saveHandler = (values, cb) => {
    if (!values?.employeeName) {
      return toast.warning("Employee Name is required!!!");
    }
    const callback = () => {
      cb();
    };

    const modifyImageArray = imageFile
      ? imageFile.map((image) => {
          return {
            intDocURLId: image?.globalFileUrlId,
          };
        })
      : [];

    const payload = {
      strEntryType: "ENTRY",
      intIOUId: 0,
      intEmployeeId: values?.employeeName?.value,
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
      intCreatedBy: employeeId,
      intUpdatedBy: employeeId,
      urlIdViewModelList: modifyImageArray,
    };
    saveIOUApplication(payload, setLoading, callback);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setImageFile("");
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
              {permission?.isCreate ? (
                <>
                  <div className="table-card">
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "12px" }}
                    >
                      <div className="d-flex align-items-center">
                        <BackButton />
                        <h2>{`Create IOU Request`}</h2>
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
                          <button type="submit" className="btn btn-green w-100">
                            Send Request
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="card-style">
                      <div className="row">
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
                            placeholder=" "
                          />
                        </div>
                        <div className="col-12"></div>
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
                                  `Attachment_${
                                    i <= 8 ? `0${i + 1}` : `${i + 1}`
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
                                  `Attachment_${
                                    i <= 8 ? `0${i + 1}` : `${i + 1}`
                                  }`}{" "}
                                {editImageRow?.length && (
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteImageHandler(
                                        image?.globalFileUrlId
                                      );
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
                </>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
