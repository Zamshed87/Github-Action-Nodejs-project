import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import AvatarComponent from "../../../../common/AvatarComponent";
import { gray700, gray900 } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { APIUrl } from "./../../../../App";

const initData = {
  email: "",
  searchString: "",
};

const AccordionCom = ({ isAccordion, empBasic }) => {
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const validationSchema = Yup.object({});
  const saveHandler = (values) => {};

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          <div
            className={` ${
              isAccordion
                ? "accordion-main active-accordion-main"
                : "accordion-main"
            }`}
          >
            <div className="accordion-item">
              <div className="accordion-heading">
                <div className="d-flex align-items-center">
                  <BusinessCenterIcon
                    sx={{ mr: "12px", fontSize: "16px", color: gray900 }}
                  />
                  <h3
                    style={{
                      color: gray700,
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Job Details
                  </h3>
                </div>
              </div>
              <div className="accordion-body">
                <div className="left">
                  <p>
                    Designation -
                    <small>{empBasic?.strDesignation || "N/A"}</small>
                  </p>
                  <p>
                    Service Length -
                    <small>{empBasic?.strServiceLength || "N/A"}</small>
                  </p>
                  <p>
                    Department -
                    <small>
                      {empBasic?.strDepartment
                        ? empBasic?.strDepartment
                        : "N/A"}
                    </small>
                  </p>
                </div>
                <div className="right">
                  <div className="right-item mr-2">
                    <AvatarComponent
                      classess=""
                      isImage={true}
                      img={`${APIUrl}/Document/DownloadFile?id=${empBasic?.intSupervisorImageUrlId}`}
                      alt=""
                    />
                    <div
                      style={{
                        marginLeft: "8px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <p>{empBasic?.strSupervisorName || "N/A"}</p>
                      <small>
                        {orgId === 10015
                          ? "Reporting Line"
                          : supervisor || "Supervisor"}
                      </small>
                    </div>
                  </div>
                  <div className="right-item">
                    <AvatarComponent
                      isImage={true}
                      img={`${APIUrl}/Document/DownloadFile?id=${empBasic?.intLinemanagerImageUrlId}`}
                      alt=""
                    />
                    <div
                      style={{
                        marginLeft: "8px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <p>{empBasic?.strLinemanager || "N/A"}</p>
                      <small>
                        {orgId === 10015 ? "Team Leader" : "Line Manager"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <div className="accordion-heading">
                <div className="d-flex align-items-center">
                  <MarkunreadMailboxIcon
                    sx={{ mr: "12px", fontSize: "16px", color: gray900 }}
                  />
                  <h3
                    style={{
                      color: gray700,
                      fontSize: "14px",
                      lineHeight: "20px",
                      fontWeight: "600",
                    }}
                  >
                    Administrative Info
                  </h3>
                </div>
              </div>
              <div className="accordion-body">
                <div className="left">
                  <p>
                    Business Unit -
                    <small>
                      {empBasic?.strBusinessUnitName
                        ? empBasic?.strBusinessUnitName
                        : "N/A"}
                    </small>
                  </p>
                  <p>
                    Workplace Group -
                    <small>
                      {empBasic?.strWorkplaceGroupName
                        ? empBasic?.strWorkplaceGroupName
                        : "N/A"}
                    </small>
                  </p>
                  <p>
                    Workplace -
                    <small>
                      {empBasic?.strWorkplaceName
                        ? empBasic?.strWorkplaceName
                        : "N/A"}
                    </small>
                  </p>
                  <p>
                    Payroll Group -
                    <small>
                      {empBasic?.strPayrollGroupName
                        ? empBasic?.strPayrollGroupName
                        : "N/A"}
                    </small>
                  </p>
                  <p>
                    Payscale Grade -
                    <small>
                      {empBasic?.strPayscaleGradeName
                        ? empBasic?.strPayscaleGradeName
                        : "N/A"}
                    </small>
                  </p>
                  <p>
                    Calendar Type -
                    <small>
                      {empBasic?.strCalenderType
                        ? empBasic?.strCalenderType
                        : "N/A"}
                    </small>
                  </p>
                  <p>
                    Calendar Name -
                    <small>
                      {empBasic?.strCalenderName
                        ? empBasic?.strCalenderName
                        : "N/A"}
                    </small>
                  </p>
                  <p>
                    Joining Date -
                    <small>
                      {dateFormatter(empBasic?.dteJoiningDate) || "N/A"}
                    </small>
                  </p>
                  <p>
                    Employment Type -
                    <small>
                      {empBasic?.strEmploymentType
                        ? empBasic?.strEmploymentType
                        : "N/A"}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default AccordionCom;
