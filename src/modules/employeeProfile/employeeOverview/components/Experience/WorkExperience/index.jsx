import { Avatar } from "@material-ui/core";
import {
  AttachmentOutlined,
  ControlPoint,
  DeleteOutline,
  ModeEditOutlined,
  VisibilityOutlined,
  Work,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import placeholderImg from "../../../../../../assets/images/placeholderImg.png";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikInput from "../../../../../../common/FormikInput";
import Loading from "../../../../../../common/loading/Loading";
import { getDownlloadFileView_Action } from "../../../../../../commonRedux/auth/actions";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import {
  dateFormatter,
  dateFormatterForInput,
} from "./../../../../../../utility/dateFormatter";
import { todayDate } from "./../../../../../../utility/todayDate";
import { attachment_action, updateEmployeeProfile } from "./../helper";
import NocSlider from "./NocSlider";
import { fromDateToDateDiff } from "./../../../../../../utility/fromDateToDateDiff";
import { gray900, success500 } from "../../../../../../utility/customColor";

const initData = {
  companyName: "",
  jobTitle: "",
  location: "",
  jobDescription: "",
  fromDate: todayDate(),
  toDate: todayDate(),
};

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  jobTitle: Yup.string().required("Job location is required"),
  location: Yup.string().required("Location is required"),
  jobDescription: Yup.string().required("Job description is required"),
  fromDate: Yup.date().required("From Date is required"),
  toDate: Yup.date().required("To Date is required"),
});

function WorkExperience({ empId, buId: businessUnit, wgId: workplaceGroup }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [imageFile, setImageFile] = useState("");

  // image
  const inputFile = useRef(null);

  const { orgId, buId, employeeId, isOfficeAdmin } = useSelector(
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
        partType: "JobExperience",
        employeeId:
          rowDto?.empJobExperience[0]?.intEmployeeBasicInfoId || empId,
        autoId: singleData?.intJobExperienceId || 0,
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
        companyName: values?.companyName || "",
        jobTitle: values?.jobTitle || "",
        location: values?.location || "",
        fromDate: values?.fromDate || todayDate(),
        toDate: values?.toDate || todayDate(),
        description: values?.jobDescription || "",
        isForeign: true,
        instituteName: "",
        degree: "",
        fieldOfStudy: "",
        cgpa: "",
        outOf: "",
        startDate: todayDate(),
        endDate: todayDate(),
        fileUrl: "",
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
        trainingName: "",
        organizationName: "",
        expirationDate: todayDate(),
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
        partType: "JobExperience",
        employeeId: empId,
        autoId: singleData?.intJobExperienceId || 0,
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
        companyName: values?.companyName || "",
        jobTitle: values?.jobTitle || "",
        location: values?.location || "",
        fromDate: values?.fromDate || todayDate(),
        toDate: values?.toDate || todayDate(),
        description: values?.jobDescription || "",
        isForeign: true,
        instituteName: "",
        degree: "",
        fieldOfStudy: "",
        cgpa: "",
        outOf: "",
        startDate: todayDate(),
        endDate: todayDate(),
        fileUrl: "",
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
        trainingName: "",
        organizationName: "",
        expirationDate: todayDate(),
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
      partType: "JobExperience",
      employeeId: rowDto?.empJobExperience[0]?.intEmployeeBasicInfoId || empId,
      autoId: id || 0,
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
      companyName: item?.strCompanyName || "",
      jobTitle: item?.strJobTitle || "",
      location: item?.strLocation || "",
      fromDate: item?.dteFromDate || todayDate(),
      toDate: item?.dteToDate || todayDate(),
      description: item?.strRemarks || "",
      isForeign: true,
      instituteName: "",
      degree: "",
      fieldOfStudy: "",
      cgpa: "",
      outOf: "",
      startDate: todayDate(),
      endDate: todayDate(),
      fileUrl: "",
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
      trainingName: "",
      organizationName: "",
      expirationDate: todayDate(),
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
console.log({isOfficeAdmin})
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          companyName: singleData ? singleData?.companyName : "",
          jobTitle: singleData ? singleData?.jobTitle : "",
          location: singleData ? singleData?.location : "",
          jobDescription: singleData ? singleData?.jobDescription : "",
          fromDate: singleData
            ? dateFormatterForInput(singleData?.fromDate)
            : todayDate(),
          toDate: singleData
            ? dateFormatterForInput(singleData?.toDate)
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
                <h5>Work Experience</h5>
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
                      <p>Add your work experience</p>
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
                          value={values?.companyName}
                          onChange={(e) =>
                            setFieldValue("companyName", e.target.value)
                          }
                          name="companyName"
                          type="text"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Company Name"
                          classes="input-sm"
                        />
                        <FormikInput
                          value={values?.jobTitle}
                          onChange={(e) =>
                            setFieldValue("jobTitle", e.target.value)
                          }
                          name="jobTitle"
                          type="text"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Job Title"
                          classes="input-sm"
                        />
                        <FormikInput
                          value={values?.location}
                          onChange={(e) =>
                            setFieldValue("location", e.target.value)
                          }
                          name="location"
                          type="text"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Location"
                          classes="input-sm"
                        />
                        <FormikInput
                          value={values?.jobDescription}
                          onChange={(e) =>
                            setFieldValue("jobDescription", e.target.value)
                          }
                          name="jobDescription"
                          type="text"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="Job Description"
                          classes="input-sm"
                        />
                        <FormikInput
                          label="From Date"
                          value={values?.fromDate}
                          onChange={(e) => {
                            // setFieldValue("toDate", todayDate());
                            setFieldValue("fromDate", e.target.value);
                          }}
                          name="fromDate"
                          type="date"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="From Date"
                        />
                        <FormikInput
                          label="To Date"
                          value={values?.toDate}
                          onChange={(e) =>
                            setFieldValue("toDate", e.target.value)
                          }
                          name="toDate"
                          type="date"
                          className="form-control"
                          errors={errors}
                          touched={touched}
                          placeholder="To Date"
                          min={values?.fromDate}
                        />

                        <div className="input-main position-group-select my-2">
                          <label className="lebel-bold mr-2">
                            Upload Files
                          </label>
                          {imageFile?.globalFileUrlId && (
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
                                  "EmployeeJobHistory",
                                  12,
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

                        {isOfficeAdmin && (
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
                                setFieldValue("companyName", "");
                                setFieldValue("jobTitle", "");
                                setFieldValue("location", "");
                                setFieldValue("jobDescription", "");
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
                                !values.companyName ||
                                !values.jobTitle ||
                                !values.location ||
                                !values.jobDescription ||
                                !values?.fromDate ||
                                !values?.toDate
                              }
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* landing */}
                  {rowDto?.empJobExperience?.length > 0 && !singleData && (
                    <>
                      {rowDto?.empJobExperience?.map((item, index) => {
                        return (
                          <>
                            <div className="view" key={index}>
                              <div className="row row-exp-details">
                                <div className="col-lg-1">
                                  <Avatar className="overviewAvatar">
                                    <Work
                                      sx={{
                                        color: gray900,
                                        fontSize: "18px",
                                      }}
                                    />
                                  </Avatar>
                                </div>
                                <div className="col-lg-10 exp-info">
                                  <h4>
                                    {item?.strJobTitle} at{" "}
                                    {item?.strCompanyName}
                                  </h4>
                                  <div className="row m-0 row-exp-time">
                                    <div className="col-8 exp-date">
                                      {dateFormatter(item?.dteFromDate)} -{" "}
                                      {dateFormatter(item?.dteToDate)}
                                    </div>
                                    <div className="col-4 exp-duration">
                                      {fromDateToDateDiff(
                                        item?.dteFromDate,
                                        item?.dteToDate
                                      )}
                                    </div>
                                  </div>
                                  <small>{item?.strLocation}</small>
                                  {item?.intNocUrlId > 0 && (
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
                                {isOfficeAdmin && (
                                  <div className="col-lg-1">
                                    <ActionMenu
                                      color={gray900}
                                      fontSize={"18px"}
                                      options={[
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
                                              companyName: item?.strCompanyName,
                                              jobTitle: item?.strJobTitle,
                                              location: item?.strLocation,
                                              jobDescription:
                                                item?.strDescription,
                                              fromDate: item?.dteFromDate,
                                              toDate: item?.dteToDate,
                                              intJobExperienceId:
                                                item?.intJobExperienceId,
                                            });
                                            setImageFile({
                                              globalFileUrlId:
                                                item?.intNocUrlId,
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
                                              item?.intJobExperienceId,
                                              item
                                            );
                                          },
                                        },
                                      ]}
                                    />
                                  </div>
                                )}
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

export default WorkExperience;
