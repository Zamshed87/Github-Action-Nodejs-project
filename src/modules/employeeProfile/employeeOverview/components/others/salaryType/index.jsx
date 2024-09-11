// import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  //   DeleteOutline,
  ModeEditOutlined,
  //   SupervisorAccount,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikSelect from "../../../../../../common/FormikSelect";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { customStyles } from "../../../../../../utility/selectCustomStyle";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import "../../../employeeOverview.css";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { updateEmployeeProfile } from "../../helper";
const initData = {
  salaryType: "",
};

const validationSchema = Yup.object().shape({
  salaryType: Yup.object()
    .shape({
      label: Yup.string().required("Salary Type is required"),
      value: Yup.string().required("Salary Type is required"),
    })
    .typeError("Salary Type is required"),
});

function SalaryType({ empId, buId: businessUnit, wgId: workplaceGroup }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState({});
  const [singleData, setSingleData] = useState("");

  const { employeeId, intAccountId, isOfficeAdmin } = useSelector(
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

  const saveHandler = (values) => {
    if (singleData) {
      const payload = {
        partType: "SalaryType",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
        value: values?.salaryType?.label || singleData?.label,
        insertByEmpId: employeeId,
        isActive: true,
        label: values?.salaryType?.value,
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
        partType: "SalaryType",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
        value: values?.salaryType?.label || singleData?.label,
        insertByEmpId: employeeId,
        isActive: true,
        label: values?.salaryType?.value,
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

  //   const deleteHandler = (values) => {
  //     const payload = {
  //       partType: "MaritalStatus",
  //       employeeId:
  //         rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
  //       autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
  //       value: "",
  //       insertByEmpId: employeeId,
  //       isActive: true,
  //       bankId: 0,
  //       bankName: "",
  //       branchName: "",
  //       routingNo: "",
  //       specialContactTypeId: 0,
  //       specialContactTypeName: "",
  //       trainingName: "",
  //       swiftCode: "",
  //       accountName: "",
  //       accountNo: "",
  //       paymentGateway: "",
  //       digitalBankingName: "",
  //       digitalBankingNo: "",
  //       addressTypeId: 0,
  //       countryId: 0,
  //       countryName: "",
  //       divisionId: 0,
  //       divisionName: "",
  //       districtId: 0,
  //       districtName: "",
  //       postOfficeId: 0,
  //       postOfficeName: "",
  //       addressDetails: "",
  //       companyName: "",
  //       jobTitle: "",
  //       location: "",
  //       fromDate: todayDate(),
  //       toDate: todayDate(),
  //       fileUrlId: 0,
  //       organizationName: rowDto?.employeeProfileLandingView?.strWorkplaceName,
  //       description: "",
  //       isForeign: true,
  //       instituteName: "",
  //       degree: "",
  //       degreeId: 0,
  //       fieldOfStudy: "",
  //       cgpa: "",
  //       outOf: "",
  //       startDate: todayDate(),
  //       endDate: todayDate(),
  //       expirationDate: todayDate(),
  //       name: "",
  //       relationId: 0,
  //       relationName: "",
  //       phone: "",
  //       email: "",
  //       nid: "",
  //       dateOfBirth: todayDate(),
  //       remarks: "",
  //     };
  //     const callback = () => {
  //       getEmployeeProfileViewData(
  //         empId,
  //         setRowDto,
  //         setLoading,
  //         businessUnit,
  //         workplaceGroup
  //       );
  //       setStatus("empty");
  //       setSingleData("");
  //     };
  //     updateEmployeeProfile(payload, setLoading, callback);
  //   };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          salaryType: rowDto?.value
            ? {
                value: singleData?.value,
                label: singleData?.label,
              }
            : {
                value: rowDto?.employeeProfileLandingView?.intSalaryTypeId,
                label: rowDto?.employeeProfileLandingView?.strSalaryTypeName,
              },
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
          //   resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          //   isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}

              {isCreateForm ? (
                <>
                  {/* addEdit form */}
                  {status === "input" && (
                    <>
                      <h5>Salary Type</h5>
                      <div style={{ marginBottom: "25px", cursor: "pointer" }}>
                        <FormikSelect
                          name="salaryType"
                          options={[
                            { value: 1, label: "Daily" },
                            { value: 2, label: "Hourly" },
                          ]}
                          value={values?.salaryType}
                          label=""
                          onChange={(valueOption) => {
                            setFieldValue("salaryType", valueOption);
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
                              setFieldValue("salaryType", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            className="btn btn-green btn-green-disable"
                            type="submit"
                            disabled={!values.salaryType}
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
                      {rowDto?.employeeProfileLandingView?.strSalaryTypeName ===
                      "" ? (
                        <>
                          <h5>Salary Type</h5>
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
                              <p>Add your salary type</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="view">
                            <div className="row">
                              <div
                                className="col-lg-1"
                                style={{ marginLeft: "2px", marginTop: "7px" }}
                              >
                                {/* <Avatar className="overviewAvatar">
                                  <HourglassEmptyIcon
                                    sx={{
                                      color: gray900,
                                      fontSize: "18px",
                                    }}
                                  />
                                </Avatar> */}
                                <HourglassTopIcon />
                              </div>
                              <div
                                className="col-lg-10"
                                style={{ marginLeft: "-2rem" }}
                              >
                                <h4>
                                  {
                                    rowDto?.employeeProfileLandingView
                                      ?.strSalaryTypeName
                                  }
                                </h4>
                                <small>Salary Type</small>
                              </div>
                              <div
                                className="col-lg-1"
                                style={{
                                  paddingLeft: "3.8rem",
                                  marginTop: "7px",
                                }}
                              >
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
                                              setSingleData({
                                                value:
                                                  rowDto?.employeeProfileLandingView?.strSalaryTypeName?.toUpperCase() ===
                                                  "Daily".toUpperCase()
                                                    ? 1
                                                    : 2,
                                                label:
                                                  rowDto
                                                    ?.employeeProfileLandingView
                                                    ?.strSalaryTypeName,
                                              });
                                              setStatus("input");
                                              setIsCreateForm(true);
                                            },
                                          },
                                          // Uncomment and adjust this if you want to include the "Delete" option conditionally
                                          // {
                                          //   value: 2,
                                          //   label: "Delete",
                                          //   icon: (
                                          //     <DeleteOutline
                                          //       sx={{
                                          //         marginRight: "10px",
                                          //         fontSize: "16px",
                                          //       }}
                                          //     />
                                          //   ),
                                          //   onClick: () => {
                                          //     deleteHandler(values);
                                          //   },
                                          // },
                                        ]
                                      : []),
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

export default SalaryType;
