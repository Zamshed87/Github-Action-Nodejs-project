import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import {
  AttachmentOutlined,
  ControlPoint,
  DeleteOutline,
  ModeEditOutlined,
  School,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import placeholderImg from "../../../../../assets/images/placeholderImg.png";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import { dateFormatterForInput } from "../../../../../utility/dateFormatter";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { getEmployeeProfileViewData } from "../../../employeeFeature/helper";
import ActionMenu from "./../../../../../common/ActionMenu";
import { getPeopleDeskAllDDL } from "./../../../../../common/api/index";
import FormikCheckBox from "./../../../../../common/FormikCheckbox";
import FormikInput from "./../../../../../common/FormikInput";
import FormikSelect from "./../../../../../common/FormikSelect";
import Loading from "./../../../../../common/loading/Loading";
import {
  gray900,
  greenColor,
  success500,
} from "./../../../../../utility/customColor";
import { dateFormatter } from "./../../../../../utility/dateFormatter";
import { todayDate } from "./../../../../../utility/todayDate";
import { attachment_action } from "./../Experience/helper";
import "./education.css";
import NocSlider from "./NocSlider";
import { updateEmployeeProfile } from "../helper";

const initData = {
  isForeign: false,
  instituteName: "",
  degree: "",
  fieldOfStudy: "",
  cgpa: "",
  outOf: "",
  fromDate: todayDate(),
  toDate: todayDate(),
};

const validationSchema = Yup.object().shape({
  instituteName: Yup.string().required("Institute name is required"),
  degree: Yup.object()
    .shape({
      label: Yup.string().required("Degree is required"),
      value: Yup.string().required("Degree is required"),
    })
    .typeError("Degree is required"),
  fieldOfStudy: Yup.string().required("Field of study is required"),
  cgpa: Yup.string().required("Result is required"),
  // outOf: Yup.number()
  //   .min(0, "Scale is Invalid")
  //   .max(5, "Scale is Invalid")
  //   .required("Scale is required"),
  fromDate: Yup.date().required("Start Date is required"),
  toDate: Yup.date().required("Finish Date is required"),
});

function Education({
  index,
  tabIndex,
  empId,
  buId: businessUnit,
  wgId: workplaceGroup,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [degreeDDL, setDegreeDDL] = useState([]);

  // image
  const inputFile = useRef(null);

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=DegreeLevel&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=0`,
      "EmployeeEducationId",
      "DegreeLevelName",
      setDegreeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        partType: "Education",
        employeeId: empId,
        autoId: singleData?.intEmployeeEducationId || 0,
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
        isForeign: values?.isForeign || false,
        instituteName: values?.instituteName || "",
        degreeId: values?.degree?.value || "",
        degree: values?.degree?.label || "",
        fieldOfStudy: values?.fieldOfStudy || "",
        cgpa: values?.cgpa || "",
        outOf: values?.outOf || "",
        trainingName: "",
        organizationName: "",
        startDate: values?.fromDate || todayDate(),
        endDate: values?.toDate || todayDate(),
        expirationDate: todayDate(),
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
        partType: "Education",
        employeeId: empId,
        autoId: singleData?.intEmployeeEducationId || 0,
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
        isForeign: values?.isForeign || false,
        instituteName: values?.instituteName || "",
        degreeId: values?.degree?.value || "",
        degree: values?.degree?.label || "",
        fieldOfStudy: values?.fieldOfStudy || "",
        cgpa: values?.cgpa || "",
        outOf: values?.outOf || "",
        trainingName: "",
        organizationName: "",
        startDate: values?.fromDate || todayDate(),
        endDate: values?.toDate || todayDate(),
        expirationDate: todayDate(),
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
      partType: "EducationDelete",
      employeeId: empId,
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
      companyName: "",
      jobTitle: "",
      location: "",
      fromDate: todayDate(),
      toDate: todayDate(),
      FileUrl: "",
      description: "",
      isForeign: item?.IsForeign || false,
      instituteName: item?.InstituteName || "",
      degree: item?.Degree || "",
      fieldOfStudy: item?.FieldOfStudy || "",
      cgpa: item?.CGPA || "",
      outOf: item?.rOutOf || "",
      trainingName: "",
      organizationName: "",
      startDate: item?.StartDate || todayDate(),
      endDate: item?.EndDate || todayDate(),
      expirationDate: todayDate(),
      name: "",
      relationId: 0,
      relationName: "",
      phone: "",
      email: "",
      nid: "",
      dateOfBirth: todayDate(),
      remarks: "",
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
      { ...payload, fileUrlId: item?.globalFileUrlId || 0 },
      setLoading,
      callback
    );
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
            isForeign: singleData?.isForeign || false,
            instituteName: singleData ? singleData?.instituteName : "",
            degree: singleData?.degree?.value
              ? {
                  value: singleData?.degree?.value,
                  label: singleData?.degree?.label,
                }
              : "",
            fieldOfStudy: singleData ? singleData?.fieldOfStudy : "",
            cgpa: singleData ? singleData?.cgpa : "",
            outOf: singleData ? singleData?.outOf : "",
            fromDate: singleData
              ? dateFormatterForInput(singleData?.fromDate)
              : todayDate(),
            toDate: singleData
              ? dateFormatterForInput(singleData?.toDate)
              : todayDate(),
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
            });
          }}
        >
          {({ handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
              {loading && <Loading />}
              <Form onSubmit={handleSubmit} className="common-overview-part">
                <div className="common-overview-content">
                  <div className="education check">
                    <div>
                      <h5>Education</h5>
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
                          <p>Add your education</p>
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
                              <FormikCheckBox
                                styleObj={{
                                  color: greenColor,
                                }}
                                label="Foreign"
                                checked={values?.isForeign}
                                onChange={(e) => {
                                  setFieldValue("isForeign", e.target.checked);
                                }}
                              />
                              <FormikInput
                                value={values?.instituteName}
                                onChange={(e) =>
                                  setFieldValue("instituteName", e.target.value)
                                }
                                name="instituteName"
                                type="text"
                                className="form-control"
                                placeholder="Institute name"
                                errors={errors}
                                touched={touched}
                                classes="input-sm"
                              />
                              <FormikSelect
                                name="degree"
                                options={degreeDDL || []}
                                value={values?.degree}
                                label=""
                                onChange={(valueOption) => {
                                  setFieldValue("degree", valueOption);
                                }}
                                placeholder="Degree"
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                              />
                              <FormikInput
                                value={values?.fieldOfStudy}
                                onChange={(e) =>
                                  setFieldValue("fieldOfStudy", e.target.value)
                                }
                                name="fieldOfStudy"
                                type="text"
                                className="form-control"
                                placeholder="Field of study"
                                errors={errors}
                                touched={touched}
                                classes="input-sm"
                              />
                              <FormikInput
                                value={values?.cgpa}
                                name="cgpa"
                                type="text"
                                className="form-control"
                                errors={errors}
                                touched={touched}
                                onChange={(e) => {
                                  setFieldValue("cgpa", e.target.value);
                                }}
                                placeholder="Result/CGPA/Division"
                                classes="input-sm"
                              />
                              <FormikInput
                                value={values?.outOf}
                                name="outOf"
                                type="number"
                                className="form-control"
                                errors={errors}
                                touched={touched}
                                onChange={(e) => {
                                  setFieldValue("outOf", e.target.value);
                                }}
                                placeholder="Scale(Out of)"
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
                              />
                              <div className="input-main position-group-select my-2">
                                <label className="lebel-bold mr-2">
                                  Upload Files
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
                                        "EmployeeEducation",
                                        9,
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

                              {1 && (
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
                                      setFieldValue("instituteName", "");
                                      setFieldValue("degree", "");
                                      setFieldValue("fieldOfStudy", "");
                                      setFieldValue("cgpa", "");
                                      setFieldValue("outOf", "");
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
                                      !values.instituteName ||
                                      !values.degree ||
                                      !values.fieldOfStudy ||
                                      !values.cgpa ||
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
                        {rowDto?.empEmployeeEducation?.length > 0 &&
                          !singleData && (
                            <>
                              {rowDto?.empEmployeeEducation?.map(
                                (item, index) => {
                                  return (
                                    <div className="view" key={index}>
                                      <div className="row row-exp-details">
                                        <div className="col-lg-1">
                                          <Avatar className="overviewAvatar">
                                            <School
                                              sx={{
                                                color: gray900,
                                                fontSize: "18px",
                                              }}
                                            />
                                          </Avatar>
                                        </div>
                                        <div className="col-lg-10 exp-info">
                                          <h4>{item?.strInstituteName}</h4>
                                          <div className="m-0 row-exp-time">
                                            <div className="exp-date">
                                              {item?.strEducationDegree},
                                              {item?.strEducationFieldOfStudy}
                                              <small className="ml-2">
                                                {item?.strCgpa}/{item?.strOutOf}
                                              </small>
                                            </div>
                                          </div>
                                          <small>
                                            {dateFormatter(item?.dteStartDate)}-
                                            {dateFormatter(item?.dteEndDate)}{" "}
                                            {item?.isForeign && "(Foreign)"}
                                          </small>
                                          {item?.intCertificateFileUrlId >
                                            0 && (
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
                                        {1 && (
                                          <div className="col-lg-1">
                                            <ActionMenu
                                              color={gray900}
                                              fontSize={"18px"}
                                              options={[
                                                !rowDto
                                                  ?.employeeProfileLandingView
                                                  ?.isMarkCompleted && {
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
                                                      isForeign:
                                                        item?.isForeign,
                                                      instituteName:
                                                        item?.strInstituteName,
                                                      degree: {
                                                        value:
                                                          item?.intEducationDegreeId,
                                                        label:
                                                          item?.strEducationDegree,
                                                      },
                                                      fieldOfStudy:
                                                        item?.strEducationFieldOfStudy,
                                                      cgpa: item?.strCgpa,
                                                      outOf: item?.strOutOf,
                                                      fromDate:
                                                        item?.dteStartDate,
                                                      toDate: item?.dteEndDate,
                                                      intEmployeeEducationId:
                                                        item?.intEmployeeEducationId,
                                                    });
                                                    setImageFile({
                                                      globalFileUrlId:
                                                        item?.intCertificateFileUrlId,
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
                                                      item?.intEmployeeEducationId,
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
                                  );
                                }
                              )}
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

export default Education;
