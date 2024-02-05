import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  DeleteOutline,
  LocationOn,
  ModeEditOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ActionMenu from "../../../../../../common/ActionMenu";
import { makeAddress } from "../../../../../../common/api";
import FormikInput from "../../../../../../common/FormikInput";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { customStyles } from "../../../../../../utility/selectCustomStyle";
import { getEmployeeProfileViewDataForAddress } from "../../../../employeeFeature/helper";
import { DDLForAddress } from "../../helper";
import FormikSelect from "./../../../../../../common/FormikSelect";
import { todayDate } from "./../../../../../../utility/todayDate";
import { updateEmployeeProfile } from "./../helper";

const initData = {
  country: "",
  division: "",
  district: "",
  policeStation: "",
  postOffice: "",
  postCode: "",
  address: "",
};

const validationSchema = Yup.object().shape({
  country: Yup.object()
    .shape({
      label: Yup.string().required("Country is required"),
      value: Yup.string().required("Country is required"),
    })
    .typeError("Country is required"),
  division: Yup.object()
    .shape({
      label: Yup.string().required("Division is required"),
      value: Yup.string().required("Division is required"),
    })
    .typeError("Division is required"),
  district: Yup.object()
    .shape({
      label: Yup.string().required("District is required"),
      value: Yup.string().required("District is required"),
    })
    .typeError("District is required"),
  // postOffice: Yup.object()
  //    .shape({
  //       label: Yup.string().required("Post Office is required"),
  //       value: Yup.string().required("Post Office is required"),
  //    })
  //    .typeError("Post Office is required"),
  address: Yup.string().required("Address is required"),
});

function ParmanentAddress({ getData, empId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");

  // DDL
  const [countryDDL, setCountryDDL] = useState([]);
  const [divisionDDL, setDivisionDDL] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);
  const [postOfficeDDL, setPostOfficeDDL] = useState([]);
  const [policeStationDDL, setPoliceStationDDL] = useState([]);

  const { buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    DDLForAddress(
      "Country",
      wgId,
      buId,
      setCountryDDL,
      "CountryId",
      "CountryName"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getEmployeeProfileViewDataForAddress(
      empId,
      buId,
      wgId,
      setRowDto,
      setLoading
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values) => {
    if (singleData) {
      const payload = {
        partType: "Address",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.permanentAddress[0]?.intEmployeeAddressId || 0,
        value: values?.address || singleData?.address,
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
        addressTypeId: 2,
        countryId: values?.country?.value || singleData?.country?.value,
        countryName: values?.country?.label || singleData?.country?.label,
        divisionId: values?.division?.value || singleData?.division?.value,
        divisionName: values?.division?.label || singleData?.division?.label,
        districtId: values?.district?.value || singleData?.district?.value,
        districtName: values?.district?.label || singleData?.district?.label,
        thanaId:
          values?.policeStation?.value || singleData?.policeStation?.value,
        thanaName:
          values?.policeStation?.label || singleData?.policeStation?.label,
        postOfficeId:
          values?.postOffice?.value || singleData?.postOffice?.value,
        postOfficeName:
          values?.postOffice?.label || singleData?.postOffice?.label,
        postCode: values?.postCode || singleData?.postCode,
        addressDetails: values?.address || singleData?.address,
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
        getEmployeeProfileViewDataForAddress(
          empId,
          buId,
          wgId,
          setRowDto,
          setLoading
        );
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
        getData();
      };
      updateEmployeeProfile(payload, setLoading, callback);
    } else {
      const payload = {
        partType: "Address",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.permanentAddress[0]?.intEmployeeAddressId || 0,
        value: values?.address || singleData?.address,
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
        addressTypeId: 2,
        countryId: values?.country?.value || singleData?.country?.value,
        countryName: values?.country?.label || singleData?.country?.label,
        divisionId: values?.division?.value || singleData?.division?.value,
        divisionName: values?.division?.label || singleData?.division?.label,
        districtId: values?.district?.value || singleData?.district?.value,
        districtName: values?.district?.label || singleData?.district?.label,
        thanaId:
          values?.policeStation?.value || singleData?.policeStation?.value,
        thanaName:
          values?.policeStation?.label || singleData?.policeStation?.label,
        postOfficeId:
          values?.postOffice?.value || singleData?.postOffice?.value,
        postOfficeName:
          values?.postOffice?.label || singleData?.postOffice?.label,
        postCode: values?.postCode || singleData?.postCode,
        addressDetails: values?.address || singleData?.address,
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
        getEmployeeProfileViewDataForAddress(
          empId,
          buId,
          wgId,
          setRowDto,
          setLoading
        );
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
        getData();
      };
      updateEmployeeProfile(payload, setLoading, callback);
    }
  };

  const deleteHandler = (values, cb) => {
    const payload = {
      partType: "Address",
      employeeId:
        rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
      autoId: rowDto?.permanentAddress[0]?.intEmployeeAddressId || 0,
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
      addressTypeId: 2,
      countryId: values?.country?.value || singleData?.country?.value,
      countryName: values?.country?.label || singleData?.country?.label,
      divisionId: values?.division?.value || singleData?.division?.value,
      divisionName: values?.division?.label || singleData?.division?.label,
      districtId: values?.district?.value || singleData?.district?.value,
      districtName: values?.district?.label || singleData?.district?.label,
      thanaId: values?.policeStation?.value || singleData?.policeStation?.value,
      thanaName:
        values?.policeStation?.label || singleData?.policeStation?.label,
      postOfficeId: values?.postOffice?.value || singleData?.postOffice?.value,
      postOfficeName:
        values?.postOffice?.label || singleData?.postOffice?.label,
      postCode: values?.postCode || singleData?.postCode,
      addressDetails: values?.address || singleData?.address,
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
      getEmployeeProfileViewDataForAddress(
        empId,
        buId,
        wgId,
        setRowDto,
        setLoading
      );
      setStatus("empty");
      setSingleData("");
      getData();
      cb?.();
    };
    updateEmployeeProfile(payload, setLoading, callback);
  };

  useEffect(() => {
    DDLForAddress(
      "Division",
      wgId,
      buId,
      setDivisionDDL,
      "DivisionID",
      "Division",
      singleData?.country?.value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleData) {
      DDLForAddress(
        "Division",
        wgId,
        buId,
        setDivisionDDL,
        "DivisionID",
        "Division",
        singleData?.country?.value
      );
      DDLForAddress(
        "District",
        wgId,
        buId,
        setDistrictDDL,
        "DistrictId",
        "DistrictName",
        singleData?.division?.value
      );
      DDLForAddress(
        "ThanaDDL",
        wgId,
        buId,
        setPoliceStationDDL,
        "ThanaId",
        "strThanaName",
        singleData?.district?.value
      );
      DDLForAddress(
        "PostOffice",
        wgId,
        buId,
        setPostOfficeDDL,
        "intPostOfficeId",
        "strPostOffice",
        singleData?.policeStation?.value
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          country: singleData?.country?.value
            ? {
                value: singleData?.country?.value,
                label: singleData?.country?.label,
              }
            : {
                value: countryDDL[17]?.CountryId,
                label: countryDDL[17]?.CountryName,
              },
          division: singleData?.division?.value
            ? {
                value: singleData?.division?.value,
                label: singleData?.division?.label,
              }
            : "",
          district: singleData?.district?.value
            ? {
                value: singleData?.district?.value,
                label: singleData?.district?.label,
              }
            : "",
          policeStation: singleData?.policeStation?.value
            ? {
                value: singleData?.policeStation?.value,
                label: singleData?.policeStation?.label,
              }
            : "",
          postOffice: singleData?.postOffice?.value
            ? {
                value: singleData?.postOffice?.value,
                label: singleData?.postOffice?.label,
              }
            : "",
          postCode: singleData ? singleData?.postCode : "",
          address: singleData ? singleData?.address : "",
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
                      <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                        {/* country */}
                        <FormikSelect
                          name="country"
                          options={countryDDL || []}
                          value={values?.country}
                          label=""
                          onChange={(valueOption) => {
                            DDLForAddress(
                              "Division",
                              wgId,
                              buId,
                              setDivisionDDL,
                              "DivisionID",
                              "Division",
                              valueOption?.value
                            );
                            setFieldValue("division", "");
                            setFieldValue("district", "");
                            setFieldValue("policeStation", "");
                            setFieldValue("postOffice", "");
                            setFieldValue("postCode", "");
                            setFieldValue("address", "");
                            setFieldValue("country", valueOption);
                          }}
                          placeholder=" "
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                        {/* division */}
                        <FormikSelect
                          name="division"
                          options={divisionDDL || []}
                          value={values?.division}
                          label=""
                          onChange={(valueOption) => {
                            DDLForAddress(
                              "District",
                              wgId,
                              buId,
                              setDistrictDDL,
                              "DistrictId",
                              "DistrictName",
                              valueOption?.value
                            );

                            setFieldValue("district", "");
                            setFieldValue("policeStation", "");
                            setFieldValue("postOffice", "");
                            setFieldValue("postCode", "");
                            setFieldValue("address", "");
                            setFieldValue("division", valueOption);
                          }}
                          placeholder="Division"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.country}
                          isClearable={false}
                        />
                        {/* district */}
                        <FormikSelect
                          name="district"
                          options={districtDDL || []}
                          value={values?.district}
                          label=""
                          onChange={(valueOption) => {
                            DDLForAddress(
                              "ThanaDDL",
                              wgId,
                              buId,
                              setPoliceStationDDL,
                              "ThanaId",
                              "strThanaName",
                              valueOption?.value
                            );
                            setFieldValue("policeStation", "");
                            setFieldValue("postOffice", "");
                            setFieldValue("postCode", "");
                            setFieldValue("address", "");
                            setFieldValue("district", valueOption);
                          }}
                          placeholder="District"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.division}
                          isClearable={false}
                        />
                        {/* policeStation */}
                        <FormikSelect
                          name="policeStation"
                          options={policeStationDDL || []}
                          value={values?.policeStation}
                          label=""
                          onChange={(valueOption) => {
                            DDLForAddress(
                              "PostOffice",
                              wgId,
                              buId,
                              setPostOfficeDDL,
                              "intPostOfficeId",
                              "strPostOffice",
                              valueOption?.value
                            );
                            setFieldValue("address", "");
                            setFieldValue("postOffice", "");
                            setFieldValue("postCode", "");
                            setFieldValue("policeStation", valueOption);
                          }}
                          placeholder="Police Station/ Upazila"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.district}
                          isClearable={false}
                        />
                        {/* postOffice */}
                        <FormikSelect
                          name="postOffice"
                          options={postOfficeDDL || []}
                          value={values?.postOffice}
                          label=""
                          onChange={(valueOption) => {
                            setFieldValue("postCode", valueOption?.strPostCode);
                            setFieldValue("address", "");
                            setFieldValue("postOffice", valueOption);
                          }}
                          placeholder="Post Office"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.policeStation}
                          isClearable={false}
                        />
                        {/* postCode */}
                        <FormikInput
                          name="postCode"
                          value={values?.postCode}
                          onChange={(e) => {}}
                          errors={errors}
                          touched={touched}
                          placeholder="Post Code"
                          classes="input-sm"
                          disabled
                        />
                        {/* address */}
                        <FormikInput
                          name="address"
                          value={values?.address}
                          onChange={(e) => {
                            setFieldValue("address", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder="Address"
                          classes="input-sm"
                          isDisabled={!values?.district}
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
                              setFieldValue("division", "");
                              setFieldValue("district", "");
                              setFieldValue("policeStation", "");
                              setFieldValue("postOffice", "");
                              setFieldValue("postCode", "");
                              setFieldValue("address", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            variant="text"
                            type="submit"
                            className="btn btn-green btn-green-disable"
                            disabled={
                              !values.country ||
                              !values.division ||
                              !values.district ||
                              !values.address
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
                  {!singleData && (
                    <>
                      {rowDto?.permanentAddress &&
                      !rowDto?.permanentAddress.length ? (
                        <>
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
                              <p>Add your permanent address</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="view">
                            <div className="row">
                              <div className="col-lg-1">
                                <Avatar className="overviewAvatar">
                                  <LocationOn
                                    sx={{
                                      color: gray900,
                                      fontSize: "18px",
                                    }}
                                  />
                                </Avatar>
                              </div>
                              <div className="col-lg-10">
                                <h4>
                                  {rowDto?.permanentAddress?.length > 0 &&
                                    makeAddress([
                                      rowDto?.permanentAddress[0]
                                        ?.strAddressDetails,
                                      rowDto?.permanentAddress[0]
                                        ?.strDistrictOrState,
                                      rowDto?.permanentAddress[0]?.strDivision,
                                      rowDto?.permanentAddress[0]?.strCountry,
                                    ])}
                                </h4>
                                <small>Parmanent Address</small>
                              </div>
                              <div
                                className={`col-lg-1 ${
                                  !rowDto.permanentAddress ? "d-none" : ""
                                }`}
                              >
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
                                          country: {
                                            value:
                                              rowDto?.permanentAddress[0]
                                                ?.intCountryId,
                                            label:
                                              rowDto?.permanentAddress[0]
                                                ?.strCountry,
                                          },
                                          division: {
                                            value:
                                              rowDto?.permanentAddress[0]
                                                ?.intDivisionId,
                                            label:
                                              rowDto?.permanentAddress[0]
                                                ?.strDivision,
                                          },
                                          district: {
                                            value:
                                              rowDto?.permanentAddress[0]
                                                ?.intDistrictOrStateId,
                                            label:
                                              rowDto?.permanentAddress[0]
                                                ?.strDistrictOrState,
                                          },
                                          policeStation: {
                                            value:
                                              rowDto?.permanentAddress[0]
                                                ?.intThanaId,
                                            label:
                                              rowDto?.permanentAddress[0]
                                                ?.strThana,
                                          },
                                          postOffice: {
                                            value:
                                              rowDto?.permanentAddress[0]
                                                ?.intPostOfficeId,
                                            label:
                                              rowDto?.permanentAddress[0]
                                                ?.strPostOffice,
                                          },
                                          postCode:
                                            rowDto?.permanentAddress[0]
                                              ?.strZipOrPostCode,
                                          address:
                                            rowDto?.permanentAddress[0]
                                              ?.strAddressDetails,
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
                                        deleteHandler(values, () =>
                                          resetForm(initData)
                                        );
                                      },
                                    },
                                  ]}
                                />
                              </div>
                            </div>
                          </div>
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

export default ParmanentAddress;
