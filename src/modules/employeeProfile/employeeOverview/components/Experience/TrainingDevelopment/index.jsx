import React, { useState, useEffect, useRef } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import Loading from "../../../../../../common/loading/Loading";
import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  EmojiEvents,
  ModeEditOutlined,
  DeleteOutline,
  VisibilityOutlined,
  AttachmentOutlined,
} from "@mui/icons-material";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikInput from "../../../../../../common/FormikInput";
import { todayDate } from "./../../../../../../utility/todayDate";
import { attachment_action } from "./../helper";
import {
  dateFormatter,
  dateFormatterForInput,
} from "./../../../../../../utility/dateFormatter";
import NocSlider from "./NocSlider";
import placeholderImg from "../../../../../../assets/images/placeholderImg.png";
import { getDownlloadFileView_Action } from "../../../../../../commonRedux/auth/actions";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import { fromDateToDateDiff } from "../../../../../../utility/fromDateToDateDiff";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { updateEmployeeProfile } from "../../helper";

const initData = {
  trainingTitle: "",
  issuingOrganization: "",
  fromDate: todayDate(),
  toDate: todayDate(),
  expirationDate: todayDate(),
};

const validationSchema = Yup.object().shape({
  trainingTitle: Yup.string().required("Training title is required"),
  issuingOrganization: Yup.string().required(
    "Issuing organization is required"
  ),
  fromDate: Yup.date().required("Start Date is required"),
  toDate: Yup.date().required("Finish Date is required"),
});

function TrainingDevelopment({
  empId,
  wgId: workplaceGroup,
  buId: businessUnit,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [imageFile, setImageFile] = useState("");

  // image
  const inputFile = useRef(null);

  const { orgId, buId, employeeId, intAccountId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getEmployeeProfileViewData(
      empId,
      setRowDto,
      setLoading,
      businessUnit,
      workplaceGroup
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    if (singleData) {
      const callback = () => {
        cb();
        getEmployeeProfileViewData(
          empId,
          setRowDto,
          setLoading,
          businessUnit,
          workplaceGroup
        );
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
        setImageFile("");
      };
      const payload = {
        partType: "TrainingAndDevelopment",
        employeeId: empId,
        autoId: singleData?.intTrainingId,
        value: "",
        insertByEmpId: employeeId,
        isActive: true,
        bankId: 0,
        bankName: "",
        branchName: "",
        routingNo: "",
        swiftCode: "",
        accountName: "",
        accountNo: "",
        paymentGateway: "",
        digitalBankingName: "",
        digitalBankingNo: "",
        addressTypeId: 0,
        countryId: 0,
        countryName: "",
        divisionId: 0,
        divisionName: "",
        districtId: 0,
        districtName: "",
        postOfficeId: 0,
        postOfficeName: "",
        addressDetails: "",
        companyName: "",
        jobTitle: "",
        location: "",
        fromDate: todayDate(),
        toDate: todayDate(),
        description: "",
        isForeign: true,
        instituteName: "",
        degree: "",
        fieldOfStudy: "",
        cgpa: "",
        outOf: "",
        trainingName: values?.trainingTitle || "",
        organizationName: values?.issuingOrganization || "",
        startDate: values?.fromDate || todayDate(),
        endDate: values?.toDate || todayDate(),
        expirationDate: values?.expirationDate || todayDate(),
        name: "",
        relationId: 0,
        relationName: "",
        phone: "",
        email: "",
        nid: "",
        dateOfBirth: todayDate(),
        remarks: "",
        specialContactTypeId: 0,
        specialContactTypeName: "",
      };
      if (imageFile) {
        updateEmployeeProfile(
          { ...payload, fileUrlId: imageFile?.globalFileUrlId },
          setLoading,
          callback
        );
      } else {
        updateEmployeeProfile(
          { ...payload, fileUrlId: "" },
          setLoading,
          callback
        );
      }
    } else {
      const callback = () => {
        cb();
        getEmployeeProfileViewData(
          empId,
          setRowDto,
          setLoading,
          businessUnit,
          workplaceGroup
        );
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
        setImageFile("");
      };
      const payload = {
        partType: "TrainingAndDevelopment",
        employeeId: empId,
        autoId: 0,
        value: "",
        insertByEmpId: employeeId,
        isActive: true,
        bankId: 0,
        bankName: "",
        branchName: "",
        routingNo: "",
        swiftCode: "",
        accountName: "",
        accountNo: "",
        paymentGateway: "",
        digitalBankingName: "",
        digitalBankingNo: "",
        addressTypeId: 0,
        countryId: 0,
        countryName: "",
        divisionId: 0,
        divisionName: "",
        districtId: 0,
        districtName: "",
        postOfficeId: 0,
        postOfficeName: "",
        addressDetails: "",
        companyName: "",
        jobTitle: "",
        location: "",
        fromDate: todayDate(),
        toDate: todayDate(),
        description: "",
        isForeign: true,
        instituteName: "",
        degree: "",
        fieldOfStudy: "",
        cgpa: "",
        outOf: "",
        trainingName: values?.trainingTitle || "",
        organizationName: values?.issuingOrganization || "",
        startDate: values?.fromDate || todayDate(),
        endDate: values?.toDate || todayDate(),
        expirationDate: values?.expirationDate || todayDate(),
        name: "",
        relationId: 0,
        relationName: "",
        phone: "",
        email: "",
        nid: "",
        dateOfBirth: todayDate(),
        remarks: "",
        specialContactTypeId: 0,
        specialContactTypeName: "",
      };
      if (imageFile) {
        updateEmployeeProfile(
          { ...payload, fileUrlId: imageFile?.globalFileUrlId },
          setLoading,
          callback
        );
      } else {
        updateEmployeeProfile(
          { ...payload, fileUrlId: 0 },
          setLoading,
          callback
        );
      }
    }
  };

  const deleteHandler = (id, item) => {
    const payload = {
      partType: "TrainingAndDevelopmentDelete",
      employeeId: empId,
      autoId: id,
      value: "",
      insertByEmpId: employeeId,
      isActive: true,
      bankId: 0,
      bankName: "",
      branchName: "",
      routingNo: "",
      swiftCode: "",
      accountName: "",
      accountNo: "",
      paymentGateway: "",
      digitalBankingName: "",
      digitalBankingNo: "",
      addressTypeId: 0,
      countryId: 0,
      countryName: "",
      divisionId: 0,
      divisionName: "",
      districtId: 0,
      districtName: "",
      postOfficeId: 0,
      postOfficeName: "",
      addressDetails: "",
      companyName: "",
      jobTitle: "",
      location: "",
      fromDate: todayDate(),
      toDate: todayDate(),
      FileUrl: "",
      description: "",
      isForeign: true,
      instituteName: "",
      degree: "",
      fieldOfStudy: "",
      cgpa: "",
      outOf: "",
      trainingName: item?.TrainingName || "",
      organizationName: item?.OrganizationName || "",
      startDate: item?.StartDate || todayDate(),
      endDate: item?.EndDate || todayDate(),
      expirationDate: item?.ExpirationDate || todayDate(),
      name: "",
      relationId: 0,
      relationName: "",
      phone: "",
      email: "",
      nid: "",
      dateOfBirth: todayDate(),
      remarks: "",
      specialContactTypeId: 0,
      specialContactTypeName: "",
    };
    const callback = () => {
      getEmployeeProfileViewData(
        empId,
        setRowDto,
        setLoading,
        businessUnit,
        workplaceGroup
      );
      setStatus("empty");
      setSingleData("");
      setImageFile("");
    };
    updateEmployeeProfile(
      { ...payload, fileUrlId: imageFile?.globalFileUrlId || 0 },
      setLoading,
      callback
    );
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          trainingTitle: singleData ? singleData?.trainingTitle : "",
          issuingOrganization: singleData
            ? singleData?.issuingOrganization
            : "",
          fromDate: singleData
            ? dateFormatterForInput(singleData?.fromDate)
            : todayDate(),
          toDate: singleData
            ? dateFormatterForInput(singleData?.toDate)
            : todayDate(),
          expirationDate: singleData
            ? dateFormatterForInput(singleData?.expirationDate)
            : todayDate(),
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
            <Form onSubmit={handleSubmit} className="form-add-experience">
              {loading && <Loading />}
              <div>
                <h5>Training</h5>
                {1 && (
                  <div
                    className="d-flex align-items-center"
                    style={{ marginBottom: "25px", cursor: "pointer" }}
                    onClick={() => {
                      setStatus("input");
                      setIsCreateForm(true);
                    }}
                  >
                    <div
                      className="item"
                      style={{ position: "relative", top: "-3px" }}
                    >
                      <ControlPoint
                        sx={{ color: success500, fontSize: "16px" }}
                      />
                    </div>
                    <div className="item">
                      <p>Add your training</p>
                    </div>
                  </div>
                )}
              </div>
              {isCreateForm ? (
                <>
                  {/* addEdit form */}
                  {status === "input" && (
                    <>
                      <div
                        className="attachment-upload"
                        style={{ marginBottom: "25px" }}
                      >
                        <FormikInput
                          value={values?.trainingTitle}
                          onChange={(e) =>
                            setFieldValue("trainingTitle", e.target.value)
                          }
                          name="trainingTitle"
                          type="text"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Training Title"
                          classes="input-sm"
                        />
                        <FormikInput
                          value={values?.issuingOrganization}
                          onChange={(e) =>
                            setFieldValue("issuingOrganization", e.target.value)
                          }
                          name="issuingOrganization"
                          type="text"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Issuing Organization"
                          classes="input-sm"
                        />
                        <FormikInput
                          label="Start Date"
                          value={values?.fromDate}
                          onChange={(e) =>
                            setFieldValue("fromDate", e.target.value)
                          }
                          name="fromDate"
                          type="date"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Start Date"
                        />
                        <FormikInput
                          label="Finish Date"
                          value={values?.toDate}
                          onChange={(e) =>
                            setFieldValue("toDate", e.target.value)
                          }
                          name="toDate"
                          type="date"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Finish Date"
                          min={values?.fromDate}
                        />
                        <FormikInput
                          label="Expiration Date"
                          value={values?.expirationDate}
                          onChange={(e) =>
                            setFieldValue("expirationDate", e.target.value)
                          }
                          name="expirationDate"
                          type="date"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Expiration Date"
                          min={values?.fromDate}
                        />

                        <div className="input-main position-group-select my-2">
                          <label className="lebel-bold mr-2">
                            Upload Files
                          </label>
                          {imageFile && (
                            <VisibilityOutlined
                              sx={{ color: gray900, fontSize: "18px" }}
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
                            imageFile
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
                                  "EmployeeTraining",
                                  10,
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
                            ref={inputFile}
                            style={{ display: "none" }}
                          />
                          <div>
                            {!imageFile && (
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
                          {imageFile && (
                            <div
                              className="d-flex align-items-center"
                              onClick={() => {
                                // dispatch(getDownlloadFileView_Action(imageFile?.id));
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
                              setFieldValue("trainingTitle", "");
                              setFieldValue("issuingOrganization", "");
                              setImageFile("");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            variant="text"
                            type="submit"
                            className="btn btn-green btn-green-disable"
                            disabled={
                              !values.trainingTitle ||
                              !values.issuingOrganization ||
                              !values?.fromDate ||
                              !values?.toDate ||
                              !values?.expirationDate
                            }
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
                  {rowDto?.empEmployeeTraining?.length > 0 && !singleData && (
                    <>
                      {rowDto?.empEmployeeTraining?.map((item, index) => {
                        return (
                          <>
                            <div className="view" key={index}>
                              <div className="row row-exp-details">
                                <div className="col-lg-1">
                                  <Avatar className="overviewAvatar">
                                    <EmojiEvents
                                      sx={{
                                        color: gray900,
                                        fontSize: "18px",
                                      }}
                                    />
                                  </Avatar>
                                </div>
                                <div className="col-lg-10 exp-info">
                                  <h4>
                                    {item?.strTrainingTitle} at{" "}
                                    {item?.strInstituteName}
                                  </h4>
                                  <div className="row m-0 row-exp-time">
                                    <div className="col-8 exp-date">
                                      {dateFormatter(item?.dteStartDate)} -{" "}
                                      {dateFormatter(item?.dteEndDate)}
                                    </div>
                                  </div>
                                  <div>
                                    <small>
                                      {fromDateToDateDiff(
                                        item?.dteStartDate,
                                        item?.dteEndDate
                                      ) && (
                                        <>
                                          Duration -{" "}
                                          {fromDateToDateDiff(
                                            item?.dteStartDate,
                                            item?.dteEndDate
                                          )}
                                        </>
                                      )}
                                    </small>
                                  </div>
                                  <small>
                                    Expiration date -{" "}
                                    {dateFormatter(item?.dteExpiryDate)}
                                  </small>
                                  {item?.intTrainingFileUrlId > 0 && (
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
                                                  trainingTitle:
                                                    item?.strTrainingTitle,
                                                  issuingOrganization:
                                                    item?.strInstituteName,
                                                  fromDate: item?.dteStartDate,
                                                  toDate: item?.dteEndDate,
                                                  expirationDate:
                                                    item?.dteExpiryDate,
                                                  intTrainingId:
                                                    item?.intTrainingId,
                                                });
                                                setImageFile({
                                                  globalFileUrlId:
                                                    item?.intTrainingFileUrlId,
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
                                                  item?.intTrainingId,
                                                  item
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
                          </>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default TrainingDevelopment;
