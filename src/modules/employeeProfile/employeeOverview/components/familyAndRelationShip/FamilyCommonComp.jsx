import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import {
  Assignment,
  AssignmentInd,
  Cake,
  ControlPoint,
  DeleteOutline,
  Email,
  EscalatorWarning,
  LocalPhone,
  ModeEditOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import ActionMenu from "../../../../../common/ActionMenu";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import Loading from "../../../../../common/loading/Loading";
import {
  gray900,
  greenColor,
  success500,
} from "../../../../../utility/customColor";
import { dateFormatterForInput } from "../../../../../utility/dateFormatter";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../../utility/todayDate";
import "../../employeeOverview.css";
import { updateEmployeeProfile } from "../helper";
import { getEmployeeProfileViewData } from "./../../../employeeFeature/helper";

const initData = {
  name: "",
  relationship: "",
  mobileNumber: "",
  email: "",
  nid: "",
  birthCertificate: "",
  dateOfBirth: "",
  remarks: "",
  address: "",
  isEmergencyContact: false,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  relationship: Yup.object()
    .shape({
      label: Yup.string().required("Relationship is required"),
      value: Yup.string().required("Relationship is required"),
    })
    .typeError("Relationship is required"),
  mobileNumber: Yup.string().matches(
    /^(?:\+?88|0088)?01[1-9]\d{8}$/,
    "Mobile Number is invalid"
  ),
});

function FamilyCommonComp({ mainTitle, typeId, typeName, subTitle, empId }) {
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [emergencyContact, setEmergencyContact] = useState("empty");
  const [empSpecialContact, setEmpSpecialContact] = useState({});
  const [singleData, setSingleData] = useState();

  const { employeeId, buId, wgId, intAccountId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    getEmployeeProfileViewData(
      empId,
      setEmpSpecialContact,
      setLoading,
      buId,
      wgId
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const saveHandler = (values, cb, autoId, isDelete = false) => {
    const payload = {
      partType: isDelete ? "SpecialContactDelete" : "SpecialContact",
      employeeId: empId,
      autoId: autoId || 0,
      value: "",
      insertByEmpId: employeeId,
      isActive: isDelete ? true : true,
      name: values?.name,
      relationId: values?.relationship?.value || 0,
      relationName: values?.relationship?.label || "",
      phone: values?.mobileNumber || "",
      email: values?.email,
      nid: values?.nid,
      dateOfBirth: values?.dateOfBirth ? values?.dateOfBirth : null,
      remarks: values?.remarks,
      addressDetails: values?.address,
      isEmergencyContact: values?.isEmergencyContact || false,
      strBirthId: values?.birthCertificate,
      // 1 = emergency
      // 2 = nominee
      // 3 = grantor
      specialContactTypeId: typeId,
      specialContactTypeName: typeName,
    };
    updateEmployeeProfile(payload, setLoading, cb);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(
            values,
            () => {
              resetForm(initData);
              getData();
              setEmergencyContact("empty");
            },
            values?.autoId
          );
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {/* add button */}
              {emergencyContact === "empty" && (
                <>
                  <h5>{mainTitle}</h5>
                  <div
                    className="d-flex align-items-center"
                    style={{ marginBottom: "25px", cursor: "pointer" }}
                    onClick={() => setEmergencyContact("input")}
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
                      <p>{subTitle}</p>
                    </div>
                  </div>
                </>
              )}
              {/* input form */}
              {emergencyContact === "input" && (
                <>
                  <h5>{mainTitle}</h5>
                  <div style={{ marginBottom: "25px" }}>
                    <div>
                      <FormikInput
                        value={values?.name}
                        name="name"
                        onChange={(e) => setFieldValue("name", e.target.value)}
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder="Name"
                        classes="input-sm"
                      />
                    </div>
                    <div>
                      <FormikSelect
                        name="relationship"
                        options={[
                          { value: 1, label: "Father" },
                          { value: 4, label: "Mother" },
                          { value: 7, label: "Spouse" },
                          { value: 2, label: "Sister" },
                          { value: 3, label: "Brother" },
                          { value: 5, label: "Uncle" },
                          { value: 6, label: "Aunty" },
                          { value: 8, label: "Child" },
                          { value: 9, label: "Niece" },
                          { value: 10, label: "Nephew" },
                          { value: 11, label: "Daughter" },
                          { value: 12, label: "Cousin" },
                          { value: 13, label: "Father In-Law" },
                          { value: 14, label: "Mother In-Law" },
                          { value: 15, label: "Brother In-Law" },
                          { value: 16, label: "Other" },
                        ]}
                        value={values?.relationship}
                        label=""
                        onChange={(valueOption) => {
                          setFieldValue("relationship", valueOption);
                        }}
                        placeholder="Relationship"
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div>
                      <FormikInput
                        value={values?.mobileNumber}
                        name="mobileNumber"
                        onChange={(e) =>
                          setFieldValue("mobileNumber", e.target.value)
                        }
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder="Mobile Number"
                        classes="input-sm"
                      />
                    </div>
                    <div>
                      <FormikInput
                        value={values?.email}
                        name="email"
                        onChange={(e) => setFieldValue("email", e.target.value)}
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder="Email"
                        classes="input-sm"
                      />
                    </div>
                    <div>
                      <FormikInput
                        value={values?.nid}
                        name="nid"
                        onChange={(e) => setFieldValue("nid", e.target.value)}
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder="NID"
                        classes="input-sm"
                      />
                    </div>
                    <div>
                      <FormikInput
                        value={values?.birthCertificate}
                        name="birthCertificate"
                        onChange={(e) =>
                          setFieldValue("birthCertificate", e.target.value)
                        }
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder="Birth Certificate Id"
                        classes="input-sm"
                      />
                    </div>
                    <div>
                      <FormikInput
                        // classes="input-sm"
                        label="Date Of Birth"
                        type="date"
                        value={values?.dateOfBirth}
                        name="dateOfBirth"
                        max={todayDate()}
                        onChange={(e) => {
                          setFieldValue("dateOfBirth", e.target.value);
                        }}
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        autoFocus
                        autoFocusForm
                      />
                    </div>
                    <div>
                      <FormikInput
                        value={values?.address}
                        name="address"
                        onChange={(e) =>
                          setFieldValue("address", e.target.value)
                        }
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder="Address"
                        classes="input-sm"
                      />
                    </div>
                    <div>
                      <FormikInput
                        value={values?.remarks}
                        name="remarks"
                        onChange={(e) =>
                          setFieldValue("remarks", e.target.value)
                        }
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder="Remarks"
                        classes="input-sm"
                      />
                    </div>
                    {typeId === 1 && (
                      <div>
                        <FormikCheckBox
                          styleObj={{
                            color: greenColor,
                          }}
                          label="Emergency Contact"
                          checked={values?.isEmergencyContact}
                          onChange={(e) => {
                            setFieldValue(
                              "isEmergencyContact",
                              e.target.checked
                            );
                          }}
                          height="16px"
                        />
                      </div>
                    )}

                    <div
                      className="d-flex align-items-center justify-content-end"
                      style={{ marginTop: typeId === 1 ? "0px" : "24px" }}
                    >
                      <button
                        onClick={() => {
                          setEmergencyContact("empty");
                          resetForm(initData);
                        }}
                        className="btn btn-cancel"
                        style={{ marginRight: "16px" }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn btn-green btn-green-disable"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </>
              )}
              {/* landing */}
              <div className="view">
                {empSpecialContact?.empEmployeeRelativesContact?.map(
                  (item, index) =>
                    item?.intGrantorNomineeTypeId === typeId && (
                      <div key={index}>
                        <div className="row">
                          <div className="col-lg-11">
                            <h2>{mainTitle}</h2>
                          </div>
                        </div>
                        <div className="col-lg-12 text-right">
                          <ActionMenu
                            anchorEl={anchorEl}
                            setAnchorEl={setAnchorEl}
                            color={gray900}
                            fontSize={"18px"}
                            setSingleData={setSingleData}
                            item={item}
                            options={[
                              ...(intAccountId === 5
                                ? !empSpecialContact.isMarkCompleted || isOfficeAdmin
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
                                        onClick: (e) => {
                                          setValues({
                                            ...values,
                                            name: singleData?.strRelativesName || "",
                                            relationship: {
                                              value: singleData?.intRelationShipId,
                                              label: singleData?.strRelationship,
                                            },
                                            mobileNumber: singleData?.strPhone,
                                            email: singleData?.strEmail,
                                            nid: singleData?.strNid,
                                            dateOfBirth: singleData?.dteDateOfBirth
                                              ? dateFormatterForInput(singleData?.dteDateOfBirth)
                                              : null,
                                            remarks: singleData?.strRemarks,
                                            address: singleData?.strAddress,
                                            isEmergencyContact: singleData?.isEmergencyContact,
                                            birthCertificate: singleData?.strBirthId,
                                            autoId: singleData?.intEmployeeRelativesContactId,
                                          });
                                          setEmergencyContact("input");
                                          setAnchorEl(null);
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
                                          saveHandler(
                                            values,
                                            () => {
                                              resetForm(initData);
                                              getData();
                                              setEmergencyContact("empty");
                                            },
                                            item?.intEmployeeRelativesContactId,
                                            true
                                          );
                                          setAnchorEl(null);
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
                                      onClick: (e) => {
                                        setValues({
                                          ...values,
                                          name: singleData?.strRelativesName || "",
                                          relationship: {
                                            value: singleData?.intRelationShipId,
                                            label: singleData?.strRelationship,
                                          },
                                          mobileNumber: singleData?.strPhone,
                                          email: singleData?.strEmail,
                                          nid: singleData?.strNid,
                                          dateOfBirth: singleData?.dteDateOfBirth
                                            ? dateFormatterForInput(singleData?.dteDateOfBirth)
                                            : null,
                                          remarks: singleData?.strRemarks,
                                          address: singleData?.strAddress,
                                          isEmergencyContact: singleData?.isEmergencyContact,
                                          birthCertificate: singleData?.strBirthId,
                                          autoId: singleData?.intEmployeeRelativesContactId,
                                        });
                                        setEmergencyContact("input");
                                        setAnchorEl(null);
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
                                        saveHandler(
                                          values,
                                          () => {
                                            resetForm(initData);
                                            getData();
                                            setEmergencyContact("empty");
                                          },
                                          item?.intEmployeeRelativesContactId,
                                          true
                                        );
                                        setAnchorEl(null);
                                      },
                                    },
                                  ]),
                            ]}
                            
                            
                          />
                        </div>
                        <div className="row mb-3">
                          <div className="col-lg-1">
                            <Avatar className="overviewAvatar">
                              <AssignmentInd
                                sx={{
                                  color: gray900,
                                  fontSize: "18px",
                                }}
                              />
                            </Avatar>
                          </div>
                          <div className="col-lg-11">
                            <h4>{item?.strRelativesName || "N/A"}</h4>
                            <small>Name</small>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-lg-1">
                            <Avatar className="overviewAvatar">
                              <EscalatorWarning
                                sx={{
                                  color: gray900,
                                  fontSize: "18px",
                                }}
                              />
                            </Avatar>
                          </div>
                          <div className="col-lg-11">
                            <h4>{item?.strRelationship || "N/A"}</h4>
                            <small>Relationship</small>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-lg-1">
                            <Avatar className="overviewAvatar">
                              <LocalPhone
                                sx={{
                                  color: gray900,
                                  fontSize: "18px",
                                }}
                              />
                            </Avatar>
                          </div>
                          <div className="col-lg-11">
                            <h4>{item?.strPhone || "N/A"}</h4>
                            <small>Mobile number</small>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-lg-1">
                            <Avatar className="overviewAvatar">
                              <Email
                                sx={{
                                  color: gray900,
                                  fontSize: "18px",
                                }}
                              />
                            </Avatar>
                          </div>
                          <div className="col-lg-11">
                            <h4>{item?.strEmail || "N/A"}</h4>
                            <small>Email</small>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-lg-1">
                            <Avatar className="overviewAvatar">
                              <AssignmentInd
                                sx={{
                                  color: gray900,
                                  fontSize: "18px",
                                }}
                              />
                            </Avatar>
                          </div>
                          <div className="col-lg-11">
                            <h4>{item?.strNid || "N/A"}</h4>
                            <small>NID</small>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-lg-1">
                            <Avatar className="overviewAvatar">
                              <Cake
                                sx={{
                                  color: gray900,
                                  fontSize: "18px",
                                }}
                              />
                            </Avatar>
                          </div>
                          <div className="col-lg-11">
                            <h4>
                              {item?.dteDateOfBirth
                                ? dateFormatterForInput(item?.dteDateOfBirth)
                                : "N/A"}
                            </h4>
                            <small>Date of birth</small>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-lg-1">
                            <Avatar className="overviewAvatar">
                              <Assignment
                                sx={{
                                  color: gray900,
                                  fontSize: "18px",
                                }}
                              />
                            </Avatar>
                          </div>
                          <div className="col-lg-11">
                            <h4>{item?.strRemarks || "N/A"}</h4>
                            <small>Remarks</small>
                          </div>
                        </div>
                        <hr />
                      </div>
                    )
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default FamilyCommonComp;
