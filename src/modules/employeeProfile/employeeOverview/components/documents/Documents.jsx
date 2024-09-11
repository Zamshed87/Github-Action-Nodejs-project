import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import {
  AttachmentOutlined,
  ControlPoint,
  DeleteOutline,
  ModeEditOutlined,
  Folder,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import placeholderImg from "../../../../../assets/images/placeholderImg.png";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import { getEmployeeProfileViewData } from "../../../employeeFeature/helper";
import ActionMenu from "../../../../../common/ActionMenu";
import FormikInput from "../../../../../common/FormikInput";
import Loading from "../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../utility/customColor";
import { todayDate } from "../../../../../utility/todayDate";
import {
  attachment_action,
  saveEmployeeDocument,
  deleteEmployeeDocumentManagement,
  getEmployeeDocumentManagement,
} from "./helper";
import "./education.css";
import NocSlider from "./NocSlider";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const initData = {
  documentName: "",
};

const validationSchema = Yup.object().shape({
  documentName: Yup.string().required("Documnet name is required"),
});

function Documents({
  index,
  tabIndex,
  empId,
  buId: businessUnitId,
  wgId: workplaceGroupId,
}) {
  const dispatch = useDispatch();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [empBasic, setEmpBasic] = useState({});

  // image
  const inputFile = useRef(null);

  const { orgId, buId, employeeId, userName, intAccountId, isOfficeAdmin } =
    useSelector((state) => state?.auth?.profileData, shallowEqual);

  useEffect(() => {
    if (params?.empId) {
      getEmployeeDocumentManagement(
        orgId,
        params?.empId,
        setRowDto,
        setLoading
      );
      getEmployeeProfileViewData(
        params?.empId,
        setEmpBasic,
        setLoading,
        businessUnitId,
        workplaceGroupId
      );
    } else {
      getEmployeeDocumentManagement(orgId, empId, setRowDto, setLoading);
    }
  }, [orgId, empId, params?.empId, workplaceGroupId, businessUnitId]);

  const saveHandler = (values, cb) => {
    if (!imageFile?.globalFileUrlId) {
      return toast.warn("Document is required!!!");
    }
    if (singleData?.intDocumentManagementId) {
      const callback = () => {
        cb();
        if (params?.empId) {
          getEmployeeDocumentManagement(
            orgId,
            params?.empId,
            setRowDto,
            setLoading
          );
        } else {
          getEmployeeDocumentManagement(orgId, empId, setRowDto, setLoading);
        }
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
        setImageFile("");
      };
      const payload = {
        intDocumentManagementId: singleData?.intDocumentManagementId || 0,
        intAccountId: orgId,
        intEmployeeId: params?.empId || employeeId,
        strEmployeeName: params?.empId
          ? empBasic?.employeeProfileLandingView?.strEmployeeName
          : userName,
        intDocumentTypeId: 29,
        strDocumentType: values?.documentName || "",
        isActive: true,
        dteCreatedAt: todayDate(),
        intCreatedBy: 0,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
      };
      if (imageFile) {
        saveEmployeeDocument(
          { ...payload, intFileUrlId: imageFile?.globalFileUrlId },
          setLoading,
          callback
        );
      } else {
        saveEmployeeDocument(
          { ...payload, intFileUrlId: 0 },
          setLoading,
          callback
        );
      }
    } else {
      const callback = () => {
        cb();
        if (params?.empId) {
          getEmployeeDocumentManagement(
            orgId,
            params?.empId,
            setRowDto,
            setLoading
          );
        } else {
          getEmployeeDocumentManagement(orgId, empId, setRowDto, setLoading);
        }
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
        setImageFile("");
      };
      const payload = {
        intDocumentManagementId: 0,
        intAccountId: orgId,
        intEmployeeId: params?.empId || employeeId,
        strEmployeeName: params?.empId
          ? empBasic?.employeeProfileLandingView?.strEmployeeName
          : userName,
        intDocumentTypeId: 29,
        strDocumentType: values?.documentName || "",
        isActive: true,
        dteCreatedAt: todayDate(),
        intCreatedBy: employeeId,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: 0,
      };
      if (imageFile) {
        saveEmployeeDocument(
          { ...payload, intFileUrlId: imageFile?.globalFileUrlId },
          setLoading,
          callback
        );
      } else {
        saveEmployeeDocument(
          { ...payload, intFileUrlId: 0 },
          setLoading,
          callback
        );
      }
    }
  };

  const deleteHandler = (id) => {
    const callback = () => {
      if (params?.empId) {
        getEmployeeDocumentManagement(
          orgId,
          params?.empId,
          setRowDto,
          setLoading
        );
      } else {
        getEmployeeDocumentManagement(orgId, empId, setRowDto, setLoading);
      }
      setStatus("empty");
      setSingleData("");
      setImageFile("");
    };
    deleteEmployeeDocumentManagement(id, setLoading, callback);
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    index === tabIndex && (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            documentName: singleData ? singleData?.documentName : "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
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
              {loading && <Loading />}
              <Form onSubmit={handleSubmit} className="common-overview-part">
                <div className="common-overview-content">
                  <div className="education check">
                    <div>
                      <h5>Documents</h5>
                      <div
                        className="d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setStatus("input");
                          setIsCreateForm(true);
                        }}
                      >
                        <div className="item">
                          <ControlPoint
                            sx={{ color: success500, fontSize: "16px" }}
                          />
                        </div>
                        <div className="item">
                          <p>Add your document</p>
                        </div>
                      </div>
                    </div>
                    {isCreateForm ? (
                      <>
                        {/* addEdit form */}
                        {status === "input" && (
                          <>
                            <div
                              className="attachment-upload"
                              style={{
                                marginBottom: "25px",
                              }}
                            >
                              <FormikInput
                                value={values?.documentName}
                                onChange={(e) =>
                                  setFieldValue("documentName", e.target.value)
                                }
                                name="documentName"
                                type="text"
                                className="form-control"
                                placeholder="Document name"
                                errors={errors}
                                touched={touched}
                                classes="input-sm"
                              />
                              <div className="input-main position-group-select my-2">
                                <label className="lebel-bold mr-2">
                                  Upload Documnet
                                </label>
                                {imageFile?.globalFileUrlId && (
                                  <VisibilityOutlined
                                    sx={{
                                      color: gray900,
                                      fontSize: "18px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          imageFile?.globalFileUrlId
                                        )
                                      );
                                    }}
                                  />
                                )}
                              </div>
                              <div
                                className={
                                  imageFile?.globalFileUrlId
                                    ? "image-upload-box with-img d-inline-block"
                                    : "image-upload-box"
                                }
                                onClick={onButtonClick}
                                style={{
                                  cursor: "pointer",
                                  position: "relative",
                                  height: "40px",
                                }}
                              >
                                <input
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      attachment_action(
                                        orgId,
                                        "Employee Document",
                                        29,
                                        buId,
                                        employeeId,
                                        e.target.files,
                                        setLoading
                                      )
                                        .then((data) => {
                                          setImageFile(data?.[0]);
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
                                />
                                <div>
                                  {!imageFile?.globalFileUrlId && (
                                    <img
                                      style={{
                                        maxWidth: "40px",
                                        objectFit: "contain",
                                      }}
                                      src={placeholderImg}
                                      className="img-fluid"
                                      alt="Drag or browse"
                                    />
                                  )}
                                </div>
                                {imageFile?.globalFileUrlId && (
                                  <div
                                    className="d-flex align-items-center"
                                    onClick={() => {
                                      // dispatch(getDownlloadFileView_Action(imageFile?.id));
                                    }}
                                  >
                                    <AttachmentOutlined
                                      sx={{
                                        marginRight: "5px",
                                        color: "#0072E5",
                                      }}
                                    />
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        color: "#0072E5",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {imageFile?.fileName || "Attachment"}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div
                                className="d-flex align-items-center justify-content-end"
                                style={{ marginTop: "24px" }}
                              >
                                <button
                                  type="button"
                                  variant="text"
                                  className="btn btn-cancel"
                                  style={{ marginRight: "16px" }}
                                  onClick={() => {
                                    setStatus("empty");
                                    setSingleData("");
                                    setIsCreateForm(false);
                                    setFieldValue("documentName", "");
                                    setImageFile("");
                                  }}
                                >
                                  Cancel
                                </button>

                                <button
                                  variant="text"
                                  type="submit"
                                  className="btn btn-green btn-green-disable"
                                  disabled={!values.documentName}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {/* landing */}
                        {rowDto?.length > 0 && !singleData && (
                          <>
                            {rowDto?.map((item, index) => {
                              return (
                                <div className="view" key={index}>
                                  <div className="row row-exp-details">
                                    <div className="col-lg-1">
                                      <Avatar className="overviewAvatar">
                                        <Folder
                                          sx={{
                                            color: gray900,
                                            fontSize: "18px",
                                          }}
                                        />
                                      </Avatar>
                                    </div>
                                    <div className="col-lg-10 exp-info">
                                      <h4>{item?.strDocumentType}</h4>
                                      {item?.intFileUrlId > 0 && (
                                        <div className="common-slider">
                                          <div
                                            className="slider-main"
                                            style={{ height: "auto" }}
                                          >
                                            <NocSlider item={item} />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-1">
                                      <ActionMenu
                                        color={gray900}
                                        fontSize={"18px"}
                                        options={[
                                          ...(isOfficeAdmin ||
                                          (intAccountId === 5 &&
                                            !rowDto.isMarkCompleted)
                                            ? [
                                                {
                                                  value: 1,
                                                  label: "Edit",
                                                  icon: (
                                                    <ModeEditOutlined
                                                      sx={{
                                                        marginRight: "10px",
                                                        fontSize: "16px",
                                                      }}
                                                    />
                                                  ),
                                                  onClick: () => {
                                                    setStatus("input");
                                                    setIsCreateForm(true);
                                                    setSingleData({
                                                      documentName:
                                                        item?.strDocumentType,
                                                      intDocumentManagementId:
                                                        item?.intDocumentManagementId,
                                                    });
                                                    setImageFile({
                                                      globalFileUrlId:
                                                        item?.intFileUrlId,
                                                    });
                                                  },
                                                },
                                                {
                                                  value: 2,
                                                  label: "Delete",
                                                  icon: (
                                                    <DeleteOutline
                                                      sx={{
                                                        marginRight: "10px",
                                                        fontSize: "16px",
                                                      }}
                                                    />
                                                  ),
                                                  onClick: () => {
                                                    deleteHandler(
                                                      item?.intDocumentManagementId
                                                    );
                                                  },
                                                },
                                              ]
                                            : []),
                                        ]}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </>
    )
  );
}

export default Documents;
