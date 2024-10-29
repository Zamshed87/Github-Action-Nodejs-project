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
import FormikSelect from "../../../../../../common/FormikSelect";
import Loading from "../../../../../../common/loading/Loading";
import { customStyles } from "../../../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../../../utility/todayDate";
import { DDLForAddress, updateEmployeeProfile } from "../../helper";
import FormikCheckBox from "./../../../../../../common/FormikCheckbox";
import {
  gray900,
  greenColor,
  success500,
} from "./../../../../../../utility/customColor";

const initData = {
  country: "",
  division: "",
  district: "",
  policeStation: "",
  postOffice: "",
  postCode: "",
  address: "",
  isParmanent: false,
  addressBn: "",
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
  addressBn: Yup.string().matches(
    /^[\u0980-\u09FF\s]*$/,
    "This field should be in Bangla"
  ),
});

function PresentAddress({ getData, rowDto, empId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);

  const [singleData, setSingleData] = useState("");

  // DDL
  const [countryDDL, setCountryDDL] = useState([]);
  const [divisionDDL, setDivisionDDL] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);
  const [postOfficeDDL, setPostOfficeDDL] = useState([]);
  const [policeStationDDL, setPoliceStationDDL] = useState([]);

  const { buId, employeeId, wgId, intAccountId, isOfficeAdmin } = useSelector(
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
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values) => {
    if (singleData) {
      const payload = {
        partType: "Address",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.presentAddress[0]?.intEmployeeAddressId || 0,
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
        addressTypeId: 1,
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
        addressDetailsBn: values?.addressBn || singleData?.strAddressDetailsBn,
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
        getData();
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    } else {
      const payload = {
        partType: "Address",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.presentAddress[0]?.intEmployeeAddressId || 0,
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
        addressTypeId: 1,
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
        addressDetailsBn: values?.addressBn || singleData?.strAddressDetailsBn,
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
        getData();
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    }
  };

  const deleteHandler = (values, cb) => {
    const payload = {
      partType: "Address",
      employeeId:
        rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
      autoId: rowDto?.presentAddress[0]?.intEmployeeAddressId || 0,
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
      addressTypeId: 1,
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
      addressDetailsBn: values?.addressBn || singleData?.strAddressDetailsBn,
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
      getData();
      setStatus("empty");
      setSingleData("");
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
      18
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
          isParmanent: singleData?.isParmanent || false,
          addressBn: singleData ? singleData?.addressBn : "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {isCreateForm ? (
                <>
                  {/* addEdit form */}
                  {status === "input" && (
                    <>
                      <div style={{ marginBottom: "25px" }}>
                        <div className="d-flex align-items-center justify-content-between check">
                          <div>
                            <small>Present Address</small>
                          </div>
                          <FormikCheckBox
                            styleObj={{
                              color: greenColor,
                            }}
                            label="Same as parmanent"
                            checked={values?.isParmanent}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSingleData({
                                  country: {
                                    value:
                                      rowDto?.permanentAddress[0]?.intCountryId,
                                    label:
                                      rowDto?.permanentAddress[0]?.strCountry,
                                  },
                                  division: {
                                    value:
                                      rowDto?.permanentAddress[0]
                                        ?.intDivisionId,
                                    label:
                                      rowDto?.permanentAddress[0]?.strDivision,
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
                                      rowDto?.permanentAddress[0]?.intThanaId,
                                    label:
                                      rowDto?.permanentAddress[0]?.strThana,
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
                                  addressBn:
                                    rowDto?.permanentAddress[0]
                                      ?.strAddressDetailsBn || "",

                                  isParmanent: e.target.checked,
                                });
                              } else {
                                setSingleData("");
                              }
                              setFieldValue("isParmanent", e.target.checked);
                            }}
                          />
                        </div>
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
                            setFieldValue("addressBn", "");
                            setFieldValue("country", valueOption);
                          }}
                          placeholder="Country"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
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
                            setFieldValue("addressBn", "");
                            setFieldValue("division", valueOption);
                          }}
                          placeholder="Division"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.country}
                        />
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
                            setFieldValue("addressBn", "");
                            setFieldValue("district", valueOption);
                          }}
                          placeholder="District"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.division}
                          isClearable={false}
                        />
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
                            setFieldValue("addressBn", "");
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
                        <FormikSelect
                          name="postOffice"
                          options={postOfficeDDL || []}
                          value={values?.postOffice}
                          label=""
                          onChange={(valueOption) => {
                            setFieldValue("postCode", valueOption?.strPostCode);
                            setFieldValue("address", "");
                            setFieldValue("addressBn", "");
                            setFieldValue("postOffice", valueOption);
                          }}
                          placeholder="Post Office"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.policeStation}
                          isClearable={false}
                        />
                        <FormikInput
                          name="postCode"
                          value={values?.postCode}
                          errors={errors}
                          touched={touched}
                          placeholder="Post Code"
                          classes="input-sm"
                          disabled
                        />
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
                        <FormikInput
                          name="addressBn"
                          value={values?.addressBn}
                          onChange={(e) => {
                            setFieldValue("addressBn", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder="Address (In Bangla)"
                          classes="input-sm"
                          isDisabled={!values?.district}
                        />
                        <div
                          className="d-flex align-items-center justify-content-end"
                          style={{ marginTop: "24px" }}
                        >
                          <button
                            type="button"
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
                              setFieldValue("addressBn", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
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
                      {rowDto?.presentAddress &&
                      !rowDto?.presentAddress.length ? (
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
                              <p>Add your present address</p>
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
                                  {rowDto?.presentAddress?.length > 0 &&
                                    makeAddress([
                                      rowDto?.presentAddress[0]
                                        ?.strAddressDetails,
                                      rowDto?.presentAddress[0]
                                        ?.strDistrictOrState,
                                      rowDto?.presentAddress[0]?.strDivision,
                                      rowDto?.presentAddress[0]?.strCountry,
                                    ])}
                                </h4>
                                {/* <h4>
                                  {
                                    rowDto?.presentAddress[0]
                                      ?.strAddressDetailsBn
                                  }{" "}
                                  (In Bangla)
                                </h4> */}
                                <small>Present Address</small>
                              </div>
                              <div
                                className={`col-lg-1 ${
                                  !rowDto.presentAddress ? "d-none" : ""
                                }`}
                              >
                                <ActionMenu
                                  color={gray900}
                                  fontSize={"18px"}
                                  options={[
                                    ...(intAccountId === 5
                                      ? !rowDto.isMarkCompleted || isOfficeAdmin
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
                                                setSingleData({
                                                  country: {
                                                    value:
                                                      rowDto?.presentAddress[0]
                                                        ?.intCountryId,
                                                    label:
                                                      rowDto?.presentAddress[0]
                                                        ?.strCountry,
                                                  },
                                                  division: {
                                                    value:
                                                      rowDto?.presentAddress[0]
                                                        ?.intDivisionId,
                                                    label:
                                                      rowDto?.presentAddress[0]
                                                        ?.strDivision,
                                                  },
                                                  district: {
                                                    value:
                                                      rowDto?.presentAddress[0]
                                                        ?.intDistrictOrStateId,
                                                    label:
                                                      rowDto?.presentAddress[0]
                                                        ?.strDistrictOrState,
                                                  },
                                                  policeStation: {
                                                    value:
                                                      rowDto
                                                        ?.permanentAddress[0]
                                                        ?.intThanaId,
                                                    label:
                                                      rowDto
                                                        ?.permanentAddress[0]
                                                        ?.strThana,
                                                  },
                                                  postOffice: {
                                                    value:
                                                      rowDto?.presentAddress[0]
                                                        ?.intPostOfficeId,
                                                    label:
                                                      rowDto?.presentAddress[0]
                                                        ?.strPostOffice,
                                                  },
                                                  postCode:
                                                    rowDto?.permanentAddress[0]
                                                      ?.strZipOrPostCode,
                                                  address:
                                                    rowDto?.presentAddress[0]
                                                      ?.strAddressDetails,
                                                  addressBn:
                                                    rowDto?.presentAddress[0]
                                                      ?.strAddressDetailsBn,
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
                                                deleteHandler(values, () => {
                                                  resetForm(initData);
                                                });
                                              },
                                            },
                                          ]
                                        : []
                                      : [
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
                                                    rowDto?.presentAddress[0]
                                                      ?.intCountryId,
                                                  label:
                                                    rowDto?.presentAddress[0]
                                                      ?.strCountry,
                                                },
                                                division: {
                                                  value:
                                                    rowDto?.presentAddress[0]
                                                      ?.intDivisionId,
                                                  label:
                                                    rowDto?.presentAddress[0]
                                                      ?.strDivision,
                                                },
                                                district: {
                                                  value:
                                                    rowDto?.presentAddress[0]
                                                      ?.intDistrictOrStateId,
                                                  label:
                                                    rowDto?.presentAddress[0]
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
                                                    rowDto?.presentAddress[0]
                                                      ?.intPostOfficeId,
                                                  label:
                                                    rowDto?.presentAddress[0]
                                                      ?.strPostOffice,
                                                },
                                                postCode:
                                                  rowDto?.permanentAddress[0]
                                                    ?.strZipOrPostCode,
                                                address:
                                                  rowDto?.presentAddress[0]
                                                    ?.strAddressDetails,
                                                addressBn:
                                                  rowDto?.presentAddress[0]
                                                    ?.strAddressDetailsBn,
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
                                              deleteHandler(values, () => {
                                                resetForm(initData);
                                              });
                                            },
                                          },
                                        ]),
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

export default PresentAddress;
