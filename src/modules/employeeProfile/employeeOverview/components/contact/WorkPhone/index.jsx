import { Avatar } from "@material-ui/core";
import {
  Call,
  ControlPoint,
  DeleteOutline,
  ModeEditOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikInput from "../../../../../../common/FormikInput";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import "../../../employeeOverview.css";
import { todayDate } from "./../../../../../../utility/todayDate";
import { updateEmployeeProfile } from "../../helper";

const initData = {
  workPhone: "",
};

const validationSchema = Yup.object().shape({
  workPhone: Yup.string().required("Work Phone is required"),
  // .matches(/^(?:\+?88)?01[15-9]\d{8}/, "Work Phone Number is invalid"),
});

function WorkPhone({ empId, buId, wgId }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");

  const { employeeId, intAccountId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getEmployeeProfileViewData(empId, setRowDto, setLoading, buId, wgId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values) => {
    if (singleData) {
      const payload = {
        partType: "OfficialPhone",
        employeeId: empId,
        autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
        value: values?.workPhone || singleData,
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
        getEmployeeProfileViewData(empId, setRowDto, setLoading, buId, wgId);
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    } else {
      const payload = {
        partType: "OfficialPhone",
        employeeId: empId,
        autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
        value: values?.workPhone || singleData,
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
        getEmployeeProfileViewData(empId, setRowDto, setLoading, buId, wgId);
        setStatus("empty");
        setSingleData("");
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    }
  };

  const deleteHandler = (setFieldsValue) => {
    const payload = {
      partType: "OfficialPhone",
      employeeId: empId,
      autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
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
      getEmployeeProfileViewData(empId, setRowDto, setLoading, buId, wgId);
      setStatus("empty");
      setSingleData("");
      setFieldsValue("workPhone", "");
    };
    updateEmployeeProfile(payload, setLoading, callback);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          workPhone: singleData ? singleData : "",
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {isCreateForm ? (
                <>
                  {/* addEdit form */}
                  {status === "input" && (
                    <>
                      <h5>Work Phone</h5>
                      <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                        <FormikInput
                          name="workPhone"
                          value={values?.workPhone}
                          onChange={(e) => {
                            setFieldValue("workPhone", e.target.value);
                          }}
                          placeholder=" "
                          errors={errors}
                          touched={touched}
                          classes="input-sm"
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
                              setFieldValue("workPhone", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="btn btn-green btn-green-disable"
                            disabled={!values.workPhone}
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
                  {rowDto?.employeeProfileLandingView && !singleData && (
                    <>
                      {rowDto?.employeeProfileLandingView?.strOfficeMobile ===
                        "" ||
                      rowDto?.employeeProfileLandingView?.strOfficeMobile ===
                        null ? (
                        <>
                          <h5>Work Phone</h5>
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
                              <p>Add your work phone</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="view">
                            <div className="row">
                              <div className="col-lg-1">
                                <Avatar className="overviewAvatar">
                                  <Call
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
                                    rowDto?.employeeProfileLandingView
                                      ?.strOfficeMobile
                                  }
                                </h4>
                                <small>Work Phone</small>
                              </div>
                              <div className="col-lg-1">
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
                                                setSingleData(
                                                  rowDto
                                                    ?.employeeProfileLandingView
                                                    ?.strOfficeMobile
                                                );
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
                                                deleteHandler(setFieldValue);
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
                                              setSingleData(
                                                rowDto
                                                  ?.employeeProfileLandingView
                                                  ?.strOfficeMobile
                                              );
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
                                              deleteHandler(setFieldValue);
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

export default WorkPhone;
