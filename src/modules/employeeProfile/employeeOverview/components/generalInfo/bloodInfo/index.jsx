import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  DeleteOutline,
  InvertColors,
  ModeEditOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ActionMenu from "../../../../../../common/ActionMenu";
import FormikSelect from "../../../../../../common/FormikSelect";
import { getPeopleDeskAllDDL } from "../../../../../../common/api";
import Loading from "../../../../../../common/loading/Loading";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { customStyles } from "../../../../../../utility/selectCustomStyle";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import "../../../employeeOverview.css";
import { todayDate } from "./../../../../../../utility/todayDate";
import { updateEmployeeProfile } from "./helper";

const initData = {
  bloodGroup: "",
};

const validationSchema = Yup.object().shape({
  bloodGroup: Yup.object()
    .shape({
      label: Yup.string().required("Blood Group is required"),
      value: Yup.string().required("Blood Group is required"),
    })
    .typeError("Blood Group is required"),
});

function BloodGroup({ empId, buId: businessUnit, wgId: workplaceGroup }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [bloodGroupDDL, setBloodGroupDDL] = useState([]);
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState({});
  const [singleData, setSingleData] = useState("");

  const { buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BloodGroupName&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}`,
      "intBloodGroupId",
      "strBloodGroup",
      setBloodGroupDDL
    );
    getEmployeeProfileViewData(
      empId,
      setRowDto,
      setLoading,
      businessUnit,
      workplaceGroup
    );
  }, [buId, wgId, empId, businessUnit, workplaceGroup]);

  const saveHandler = (values) => {
    if (singleData) {
      const payload = {
        partType: "BloodGroup",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
        value: values?.bloodGroup?.label || singleData?.label,
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
        fileUrlId: 0,
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
        partType: "BloodGroup",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
        value: values?.bloodGroup?.label || singleData?.label,
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
        fileUrlId: 0,
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

  const deleteHandler = () => {
    const payload = {
      partType: "BloodGroup",
      employeeId:
        rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
      autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
      value: "",
      insertByEmpId: employeeId,
      isActive: false,
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
      fileUrlId: 0,
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
          bloodGroup: singleData?.value
            ? {
              value: singleData?.value,
              label: singleData?.label,
            }
            : "",
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
                      <h5>Blood Group</h5>
                      <div style={{ marginBottom: "40px", cursor: "pointer" }}>
                        <FormikSelect
                          name="bloodGroup"
                          options={bloodGroupDDL || []}
                          value={values?.bloodGroup}
                          label=""
                          onChange={(valueOption) => {
                            setFieldValue("bloodGroup", valueOption);
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
                            // variant="text"
                            className="btn btn-cancel"
                            style={{ marginRight: "16px" }}
                            onClick={() => {
                              setStatus("empty");
                              setSingleData("");
                              setIsCreateForm(false);
                              setFieldValue("bloodGroup", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            // variant="text"
                            type="submit"
                            className="btn btn-green btn-green-disable"
                            disabled={!values.bloodGroup}
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
                      {rowDto?.employeeProfileLandingView?.strBloodGroup ===
                        "" ? (
                        <>
                          <h5>Blood Group</h5>
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
                              <p>Add your blood group</p>
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
                                    <InvertColors
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
                                        ?.strBloodGroup
                                    }
                                  </h4>
                                  <small>Blood Group</small>
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
                                            value: rowDto
                                              ?.employeeProfileLandingView
                                              ?.strBloodGroup
                                              ? 1
                                              : 2,
                                            label:
                                              rowDto?.employeeProfileLandingView
                                                ?.strBloodGroup,
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

export default BloodGroup;
