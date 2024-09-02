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
import FormikCheckBox from "../../../../../../common/FormikCheckbox";
import FormikInput from "../../../../../../common/FormikInput";
import FormikSelect from "../../../../../../common/FormikSelect";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, greenColor, success500 } from "../../../../../../utility/customColor";
import { customStyles } from "../../../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../../../utility/todayDate";
import { DDLForAddress, updateEmployeeProfile } from "../../helper";

const initData = {
  country: "",
  division: "",
  district: "",
  policeStation: "",
  postOffice: "",
  postCode: "",
  address: "",
  isParmanent: false,
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

function OtherAddress({ getData, rowDto, empId }) {
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
  }, [wgId, buId]);

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
        autoId: rowDto?.otherAddress[0]?.intEmployeeAddressId || 0,
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
        addressTypeId: 3,
        countryId: values?.country?.value || singleData?.country?.value,
        countryName: values?.country?.label || singleData?.country?.label,
        divisionId: values?.division?.value || singleData?.division?.value,
        divisionName: values?.division?.label || singleData?.division?.label,
        districtId: values?.district?.value || singleData?.district?.value,
        districtName: values?.district?.label || singleData?.district?.label,
        postOfficeId:
          values?.postOffice?.value || singleData?.postOffice?.value,
        postOfficeName:
          values?.postOffice?.label || singleData?.postOffice?.label,
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
        autoId: rowDto?.otherAddress[0]?.intEmployeeAddressId || 0,
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
        addressTypeId: 3,
        countryId: values?.country?.value || singleData?.country?.value,
        countryName: values?.country?.label || singleData?.country?.label,
        divisionId: values?.division?.value || singleData?.division?.value,
        divisionName: values?.division?.label || singleData?.division?.label,
        districtId: values?.district?.value || singleData?.district?.value,
        districtName: values?.district?.label || singleData?.district?.label,
        postOfficeId:
          values?.postOffice?.value || singleData?.postOffice?.value,
        postOfficeName:
          values?.postOffice?.label || singleData?.postOffice?.label,
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
      partType: "AddressDelete",
      employeeId:
        rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
      autoId: rowDto?.otherAddress[0]?.intEmployeeAddressId || 0,
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
      addressTypeId: 3,
      countryId: values?.country?.value || singleData?.country?.value,
      countryName: values?.country?.label || singleData?.country?.label,
      divisionId: values?.division?.value || singleData?.division?.value,
      divisionName: values?.division?.label || singleData?.division?.label,
      districtId: values?.district?.value || singleData?.district?.value,
      districtName: values?.district?.label || singleData?.district?.label,
      postOfficeId: values?.postOffice?.value || singleData?.postOffice?.value,
      postOfficeName:
        values?.postOffice?.label || singleData?.postOffice?.label,
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
      getData();
      setStatus("empty");
      setSingleData("");
      cb?.()
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
                      <div style={{ marginBottom: "25px" }}>
                        <div className="d-flex align-items-center justify-content-between check">
                          <div>
                            <small>Other Address</small>
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
                          onChange={(e) => { }}
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
                      {rowDto?.otherAddress && !rowDto?.otherAddress.length ? (
                        <>
                          <div
                            className="d-flex align-items-center"
                            style={{ marginBottom: "25px", cursor: "pointer" }}
                            onClick={() => {
                              setStatus("input");
                              setIsCreateForm(true);
                            }}
                          >
                            <div className="item" style={{ position: "relative", top: "-3px" }}>
                              <ControlPoint
                                sx={{ color: success500, fontSize: "16px" }}
                              />
                            </div>
                            <div className="item">
                              <p>Add your other address</p>
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
                                  {rowDto?.otherAddress?.length > 0 &&
                                    makeAddress([
                                      rowDto?.otherAddress[0]
                                        ?.strAddressDetails,
                                      rowDto?.otherAddress[0]
                                        ?.strDistrictOrState,
                                      rowDto?.otherAddress[0]?.strDivision,
                                      rowDto?.otherAddress[0]?.strCountry,
                                    ])}
                                </h4>
                                <small>Other Address</small>
                              </div>
                              <div className={`col-lg-1 ${!rowDto.otherAddress? "d-none" : ""}`}>
                                <ActionMenu
                                  color={gray900}
                                  fontSize={"18px"}
                                  options={[
                                    !rowDto?.employeeProfileLandingView
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
                                        setSingleData({
                                          country: {
                                            value:
                                              rowDto?.otherAddress[0]
                                                ?.intCountryId,
                                            label:
                                              rowDto?.otherAddress[0]
                                                ?.strCountry,
                                          },
                                          division: {
                                            value:
                                              rowDto?.otherAddress[0]
                                                ?.intDivisionId,
                                            label:
                                              rowDto?.otherAddress[0]
                                                ?.strDivision,
                                          },
                                          district: {
                                            value:
                                              rowDto?.otherAddress[0]
                                                ?.intDistrictOrStateId,
                                            label:
                                              rowDto?.otherAddress[0]
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
                                              rowDto?.otherAddress[0]
                                                ?.intPostOfficeId,
                                            label:
                                              rowDto?.otherAddress[0]
                                                ?.strPostOffice,
                                          },
                                          postCode:
                                            rowDto?.permanentAddress[0]
                                              ?.strZipOrPostCode,
                                          address:
                                            rowDto?.otherAddress[0]
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
                                        deleteHandler(values, () => {
                                          resetForm(initData);
                                        });
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

export default OtherAddress;
