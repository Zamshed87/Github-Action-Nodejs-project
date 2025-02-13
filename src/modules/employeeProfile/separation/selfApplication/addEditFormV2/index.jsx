/* eslint-disable no-unused-vars */
import { AttachmentOutlined, Close, FileUpload } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import BackButton from "common/BackButton";
import DefaultInput from "common/DefaultInput";
import FormikSelect from "common/FormikSelect";
import { getPeopleDeskAllDDL, multiple_attachment_actions } from "common/api";
import Loading from "common/loading/Loading";
import FormikError from "common/login/FormikError";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { dateFormatterForInput } from "utility/dateFormatter";
import { customStyles } from "utility/selectCustomStyle";
import { todayDate } from "utility/todayDate";
import * as Yup from "yup";
import {
  CreateSeparation,
  deleteSeparationAttachment,
  UpdateSeparation,
} from "../helper";

const initData = {
  separationType: "",
  applicationDate: todayDate(),
  lastWorkingDay: "",
  applicationBody: "",
};

const validationSchema = Yup.object().shape({
  separationType: Yup.object()
    .shape({
      label: Yup.string().required("Separation Type is required"),
      value: Yup.string().required("Separation Type is required"),
    })
    .typeError("Separation Type is required"),
  lastWorkingDay: Yup.date().required("Last working day is required"),
  applicationBody: Yup.string().required("Application body is required"),
});

export default function SelfServiceSeparationForm() {
  const params = useParams();
  const dispatch = useDispatch();
  const inputFile = useRef(null);

  const { orgId, buId, employeeId, wgId, wId, userName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [separationTypeDDL, setSeparationTypeDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [, getSeparationDataApi, loadingSeparationData, ,] = useAxiosGet();
  const [lastWorkingDay, getLastWorkingDay, , setLastWorkingDay] =
    useAxiosGet();
  // images
  const [imgRow, setImgRow] = useState([]);
  const [imageFile, setImageFile] = useState([]);
  const [editImageRow, setEditImageRow] = useState([]);

  const onButtonClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SeparationType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intWorkplaceId=${wId}`,
      "SeparationTypeId",
      "SeparationType",
      setSeparationTypeDDL
    );
  }, [wgId, buId, wId]);

  const getEmpSeparationDataHandlerById = () => {
    getSeparationDataApi(
      `/separation/GetSeparationById/${+params?.id}`,
      (res) => {
        setValues((prev) => ({
          ...prev,
          employeeName: {
            value: res?.intEmployeeId,
            label: res?.strEmployeeName,
            employeeId: res?.intEmployeeId,
            employeeName: res?.strEmployeeName,
            employeeCode: res?.strEmployeeCode,
            employmentType: res?.strEmploymentType,
            designationName: res?.strDesignation,
          },
          separationType: {
            value: res?.intSeparationTypeId,
            label: res?.strSeparationTypeName,
          },
          applicationDate: dateFormatterForInput(res?.dteSeparationDate),
          lastWorkingDay: dateFormatterForInput(res?.dteLastWorkingDate),
          applicationBody: `${res?.strReason}`,
        }));
        setImgRow(res?.strDocumentId?.split(","));
        const documentList =
          res?.strDocumentId?.length > 0
            ? res?.strDocumentId?.split(",")?.map((image) => {
                return {
                  globalFileUrlId: +image,
                };
              })
            : [];
        setEditImageRow(documentList);
        setSingleData(res);
        getLastWorkingDay(
          `/SaasMasterData/GetLastWorkingDateOfSeparation?accountId=${orgId}&businessUnitId=${buId}&workPlaceGroup=${wgId}&workplaceId=${wId}&departmentId=${
            res?.intDepertmentId || 0
          }&employmentType=${res?.intEmploymentTypeId || 0}&designationId=${
            res?.intDesignationId || 0
          }`,
          (data) => {
            const formattedLastWorkingDay = new Date(data);
            const formattedMinDate = formattedLastWorkingDay
              .toISOString()
              .split("T")[0];
            setLastWorkingDay(formattedMinDate);
          }
        );
      }
    );
  };

  useEffect(() => {
    if (+params?.id) {
      getEmpSeparationDataHandlerById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId, params?.id]);

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb();
      setImageFile([]);
    };

    const modifyImageArray = imageFile
      ? imageFile?.map((image) => image?.globalFileUrlId)
      : [];

    const modifyAttachmentList = imgRow?.map((image) => +image);

    let payload = {
      intEmployeeId: employeeId,
      strEmployeeName: userName,
      strEmployeeCode: "",
      businessUnitId: buId,
      workplaceGroupId: wgId,
      intSeparationTypeId: values?.separationType?.value || 0,
      strSeparationTypeName: values?.separationType?.label || "",
      dteSeparationDate: values?.applicationDate || "",
      dteLastWorkingDate: values?.lastWorkingDay,
      strReason: values?.applicationBody,
      intAccountId: orgId,
      isActive: true,
      intCreatedBy: employeeId,
    };

    if (params?.id) {
      payload = {
        ...payload,
        partId: 2,
        intSeparationId: +params?.id,
        strDocumentId: [...modifyImageArray, ...modifyAttachmentList],
      };
      UpdateSeparation(payload, setLoading, callback);
    } else {
      payload = {
        ...payload,
        partId: 1,
        intSeparationId: 0,
        strDocumentId: modifyImageArray,
      };
      CreateSeparation(payload, setLoading, callback);
    }
  };

  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: +params?.id
      ? {
          employeeName: {
            value: singleData?.intEmployeeId,
            label: singleData?.strEmployeeName,
          },
          separationType: {
            value: singleData?.intSeparationTypeId,
            label: singleData?.strSeparationTypeName,
          },
          applicationDate: dateFormatterForInput(singleData?.dteSeparationDate),
          lastWorkingDay: dateFormatterForInput(singleData?.dteLastWorkingDate),
          applicationBody: `${singleData?.strReason}`,
        }
      : {
          ...initData,
        },
    onSubmit: (values, { resetForm }) => {
      saveHandler(values, () => {
        if (params?.id) {
          getEmpSeparationDataHandlerById();
        } else {
          resetForm(initData);
        }
      });
    },
  });

  const deleteImageHandler = (documentId) => {
    deleteSeparationAttachment(+params?.id, documentId, () => {
      getEmpSeparationDataHandlerById();
      setImgRow(singleData?.docArr);
    });
  };

  return (
    <>
      {(loading || loadingSeparationData) && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading mb12">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>Separation Application</h2>
            </div>
            <ul className="d-flex flex-wrap">
              <li>
                <button
                  type="button"
                  className="btn btn-cancel mr-2"
                  onClick={() => {
                    resetForm(initData);
                  }}
                >
                  Reset
                </button>
              </li>
              <li>
                <button type="submit" className="btn btn-default flex-center">
                  Save
                </button>
              </li>
            </ul>
          </div>
          <div className="table-card-body">
            <div className="col-md-12 px-0 mt-3">
              <div className="card-style">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Separation Type</label>
                    <FormikSelect
                      placeholder=" "
                      classes="input-sm"
                      styles={customStyles}
                      name="separationType"
                      options={separationTypeDDL || []}
                      value={values?.separationType}
                      onChange={(valueOption) => {
                        setFieldValue("separationType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <div>
                      <label>Application Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.applicationDate}
                        name="applicationDate"
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("lastWorkingDay", "");
                          setFieldValue("applicationDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div>
                      <label>Last Working Date</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.lastWorkingDay}
                        min={
                          values?.applicationDate
                            ? dateFormatterForInput(values?.applicationDate)
                            : lastWorkingDay
                        }
                        onChange={(e) => {
                          setFieldValue("lastWorkingDay", e.target.value);
                        }}
                        name="lastWorkingDay"
                        type="date"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        disabled={
                          !values?.applicationDate || !values?.separationType
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12"></div>
                  <div className="col-lg-3">
                    <p
                      onClick={onButtonClick}
                      className="d-inline-block mt-2 pointer uplaod-para"
                    >
                      <input
                        onChange={(e) => {
                          if (e.target.files) {
                            multiple_attachment_actions(
                              orgId,
                              "Separation",
                              30,
                              buId,
                              employeeId,
                              e.target.files,
                              setLoading
                            )
                              .then((data) => {
                                setImageFile(data);
                              })
                              .catch((error) => {
                                setImageFile([]);
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
                        Attachment
                      </span>
                    </p>
                    {imageFile?.length
                      ? imageFile.map((image, i) => (
                          <div
                            className="d-flex align-items-center"
                            style={{ width: "160px" }}
                            onClick={() => {
                              dispatch(
                                getDownlloadFileView_Action(
                                  image?.globalFileUrlId || image?.intDocURLId
                                )
                              );
                            }}
                            key={i}
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
                  </div>
                  <div className="col-12">
                    <h2 style={{ marginBottom: "12px" }}>Attachment List</h2>
                    {editImageRow?.length
                      ? editImageRow.map((image, i) => (
                          <div
                            className="d-flex align-items-center"
                            style={{ width: "160px" }}
                            onClick={() => {
                              dispatch(
                                getDownlloadFileView_Action(
                                  image?.globalFileUrlId || image?.intDocURLId
                                )
                              );
                            }}
                            key={i}
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
                                    deleteImageHandler(image?.globalFileUrlId);
                                  }}
                                  size="small"
                                  style={{
                                    fontSize: "18px",
                                    padding: "0px 5px",
                                    color: "#175CD3",
                                  }}
                                >
                                  <Close fontSize="inherit" />
                                </IconButton>
                              )}
                            </div>
                          </div>
                        ))
                      : ""}
                  </div>

                  <div className="col-12">
                    <div className="card-save-border"></div>
                  </div>
                  <div className="col-12">
                    <h2 style={{ marginBottom: "12px" }}>
                      Write your application
                    </h2>
                  </div>
                  <div className="col-lg-12">
                    <div>
                      <ReactQuill
                        value={values?.applicationBody}
                        onChange={(value) =>
                          setFieldValue("applicationBody", value)
                        }
                      />
                    </div>
                    <div style={{ marginTop: "-2px" }}>
                      <FormikError
                        errors={errors}
                        name="applicationBody"
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
