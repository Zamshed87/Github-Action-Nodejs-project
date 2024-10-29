/* eslint-disable react-hooks/exhaustive-deps */
import { PrintOutlined } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import BackButton from "../../../../common/BackButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import About from "./components/About";
import AdministrativeInfo from "./components/AdministrativeInfo";
import BankDetails from "./components/BankDetails";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Family from "./components/Family";
import Identification from "./components/Identification";
import JobDetails from "./components/JobDetails";
import Others from "./components/Others";
import Personal from "./components/Personal";
import { todayDate } from "utility/todayDate";

const PrintPreview = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const empInfo = location?.state?.empInfo;
  const values = location?.state?.values;
  const touched = location?.state?.touched;
  const setFieldValue = location?.state?.setFieldValue;
  const errors = location?.state?.errors;

  const history = useHistory();

  useEffect(() => {
    if (!location.state) {
      history.goBack();
    }
  }, [location]);

  const printRef = useRef();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);

  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    pageStyle:
      "@page { } @media print { .card-about-info .content-about-info-card { padding-left: 40px!important; padding-top: 0px!important} .card-about-info .add-image-about-info-card { margin-top: 10px;} }",
    documentTitle: `Employee Details`,
  });

  return (
    <>
      <div className="about-info-main">
        <div className="container-about-info">
          <div className="card-about-info-main">
            <div className="card-about-info-main">
              <div className="card-about-info-main-header">
                <BackButton title={"Employee Details"} />
                <div>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "rgba(0, 0, 0, 0.6)",
                      color: "rgba(0, 0, 0, 0.6)",
                      fontSize: "14px",
                      fontWeight: "bold",
                      letterSpacing: "1.25px",
                      "&:hover": {
                        borderColor: "rgba(0, 0, 0, 0.6)",
                      },
                    }}
                    startIcon={
                      <PrintOutlined
                        sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                        className="emp-print-icon"
                      />
                    }
                    onClick={() => {
                      reactToPrintFn();
                    }}
                  >
                    Print
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-about-info-main about-info-card" ref={printRef}>
            <About empInfo={empInfo?.employeeProfileLandingView} />
            <JobDetails empInfo={empInfo?.employeeProfileLandingView} />
            <AdministrativeInfo empInfo={empInfo?.employeeProfileLandingView} />
            {values?.isShowBank && (
              <BankDetails
                empInfo={empInfo?.empEmployeeBankDetail}
                objProps={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }}
              />
            )}
            {values?.isShowPersonal && (
              <Personal
                empInfo={empInfo?.employeeProfileLandingView}
                objProps={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }}
              />
            )}

            {values?.isShowContact && (
              <Contact
                empContact={empInfo?.employeeProfileLandingView}
                empAddress={empInfo?.empEmployeeAddress}
                objProps={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }}
              />
            )}
            {values?.isShowIdentification && (
              <Identification
                empInfo={empInfo}
                objProps={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }}
              />
            )}
            {values?.isShowExp && (
              <Experience
                empWork={empInfo?.empJobExperience}
                empTraining={empInfo?.empEmployeeTraining}
                objProps={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }}
              />
            )}
            {values?.isShowEducation && (
              <Education
                empEducation={empInfo?.empEmployeeEducation}
                objProps={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }}
              />
            )}

            {values?.isShowFamily && (
              <Family
                empFamily={empInfo?.empEmployeeRelativesContact}
                objProps={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }}
              />
            )}

            {values?.isShowOthers && (
              <Others
                empSocial={empInfo?.empSocialMedia}
                empBiograpgyAndHobbies={empInfo?.empEmployeePhotoIdentity}
                objProps={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintPreview;
