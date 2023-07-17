import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  DeleteOutline,
  Flag,
  ModeEditOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ActionMenu from "../../../../../../common/ActionMenu";
import { getPeopleDeskAllDDL } from "../../../../../../common/api";
import FormikSelect from "../../../../../../common/FormikSelect";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { customStyles } from "../../../../../../utility/selectCustomStyle";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import "../../../employeeOverview.css";
import { todayDate } from "./../../../../../../utility/todayDate";
import { updateEmployeeProfile } from "./../helper";

const initData = {
  nationality: "",
};

const validationSchema = Yup.object().shape({
  nationality: Yup.object()
    .shape({
      label: Yup.string().required("Nationality is required"),
      value: Yup.string().required("Nationality is required"),
    })
    .typeError("Nationality is required"),
});

function Nationality({ empId, buId: businessUnit, wgId: workplaceGroup }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [nationalityDDL, setNationalityDDL] = useState([]);
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");

  const { employeeId, wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Country&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "CountryId",
      "CountryName",
      setNationalityDDL
    );
  }, [buId, wgId]);

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

  const saveHandler = (values) => {
    if (singleData) {
      const payload = {
        partType: "Nationality",
        employeeId: empId,
        autoId:
          rowDto?.empEmployeePhotoIdentity?.intEmployeePhotoIdentityId || 0,
        value: values?.nationality?.label || singleData?.label,
        insertByEmpId: employeeId,
        isActive: true,
        bankId: 0,
        bankName: "",
        branchName: "",
        routingNo: "",
        specialContactTypeId: 0,
        specialContactTypeName: "",
        trainingName: "",
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
        organizationName: rowDto?.employeeProfileLandingView?.strWorkplaceName,
        description: "",
        isForeign: true,
        instituteName: "",
        degree: "",
        degreeId: 0,
        fieldOfStudy: "",
        cgpa: "",
        outOf: "",
        startDate: todayDate(),
        endDate: todayDate(),
        expirationDate: todayDate(),
        fileUrlId: 0,
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
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    } else {
      const payload = {
        partType: "Nationality",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId:
          rowDto?.empEmployeePhotoIdentity?.intEmployeePhotoIdentityId || 0,
        value: values?.nationality?.label || singleData?.label,
        insertByEmpId: employeeId,
        isActive: true,
        bankId: 0,
        bankName: "",
        branchName: "",
        routingNo: "",
        specialContactTypeId: 0,
        specialContactTypeName: "",
        trainingName: "",
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
        organizationName: rowDto?.employeeProfileLandingView?.strWorkplaceName,
        description: "",
        isForeign: true,
        instituteName: "",
        degree: "",
        degreeId: 0,
        fieldOfStudy: "",
        cgpa: "",
        outOf: "",
        startDate: todayDate(),
        endDate: todayDate(),
        expirationDate: todayDate(),
        fileUrlId: 0,
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
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    }
  };

  const deleteHandler = (values) => {
    const payload = {
      partType: "Nationality",
      employeeId:
        rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
      autoId: rowDto?.empEmployeePhotoIdentity?.intEmployeePhotoIdentityId || 0,
      value: "",
      insertByEmpId: employeeId,
      isActive: true,
      bankId: 0,
      bankName: "",
      branchName: "",
      routingNo: "",
      specialContactTypeId: 0,
      specialContactTypeName: "",
      trainingName: "",
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
      organizationName: rowDto?.employeeProfileLandingView?.strWorkplaceName,
      description: "",
      isForeign: true,
      instituteName: "",
      degree: "",
      degreeId: 0,
      fieldOfStudy: "",
      cgpa: "",
      outOf: "",
      startDate: todayDate(),
      endDate: todayDate(),
      expirationDate: todayDate(),
      fileUrlId: 0,
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
    };
    updateEmployeeProfile(payload, setLoading, callback);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          nationality: singleData?.value
            ? {
              value: singleData?.value,
              label: singleData?.label,
            }
            : {
              value: nationalityDDL[17]?.CountryId,
              label: nationalityDDL[17]?.CountryName,
            },
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {isCreateForm ? (
                <>
                  {/* addEdit form */}
                  {status === "input" && (
                    <>
                      <h5>Nationality</h5>
                      <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                        <FormikSelect
                          name="nationality"
                          options={nationalityDDL || []}
                          value={values?.nationality}
                          label=""
                          onChange={(valueOption) => {
                            setFieldValue("nationality", valueOption);
                          }}
                          placeholder=" "
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
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
                              // setFieldValue("nationality", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            variant="text"
                            type="submit"
                            className="btn btn-green btn-green-disable"
                            disabled={!values.nationality}
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
                  {!singleData && (
                    <>
                      {rowDto?.empEmployeePhotoIdentity === "" ||
                        rowDto?.empEmployeePhotoIdentity === null ||
                        rowDto?.empEmployeePhotoIdentity?.strNationality === "" ||
                        rowDto?.empEmployeePhotoIdentity?.strNationality ===
                        null ? (
                        <>
                          <h5>Nationality</h5>
                          <div
                            className="d-flex align-items-center"
                            style={{ marginBottom: "25px", cursor: "pointer" }}
                            onClick={() => {
                              setStatus("input");
                              setIsCreateForm(true);
                              getEmployeeProfileViewData(
                                empId,
                                setRowDto,
                                setLoading,
                                businessUnit,
                                workplaceGroup
                              );
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
                              <p>Add your Nationality</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <>
                            <div className="view">
                              <div className="row">
                                <div className="col-lg-1">
                                  <Avatar className="overviewAvatar">
                                    <Flag
                                      sx={{
                                        color: gray900,
                                        fontSize: "18px",
                                      }}
                                    />
                                  </Avatar>
                                </div>
                                <div className="col-lg-10">
                                  <h4>
                                    {
                                      rowDto?.empEmployeePhotoIdentity
                                        ?.strNationality
                                    }
                                  </h4>
                                  <small>Nationality</small>
                                </div>
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
                                          setSingleData({
                                            value:
                                              rowDto?.empEmployeePhotoIdentity
                                                ?.strNationality,
                                            label:
                                              rowDto?.empEmployeePhotoIdentity
                                                ?.strNationality,
                                          });
                                          setStatus("input");
                                          setIsCreateForm(true);
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
                                          deleteHandler(values);
                                        },
                                      },
                                    ]}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        </>
                      )}
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

export default Nationality;
