import { PrintOutlined } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";
import BackButton from "../../../../common/BackButton";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getEmployeeProfileViewData } from "../../employeeFeature/helper";
import { gray500, gray900 } from "./../../../../utility/customColor";
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

const initData = {
  isShowBank: "",
  isShowPersonal: "",
  isShowContact: "",
  isShowIdentification: "",
  isShowEducation: "",
  isShowExp: "",
  isShowFamily: "",
  isShowOthers: "",
};

const validationSchema = Yup.object({});
const saveHandler = (values) => {};

function GoForPrint() {
  const dispatch = useDispatch();

  const [empInfo, setEmpInfo] = useState({});
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const history = useHistory();
  const location = useLocation();

  const { empId } = useParams();

  const { wgId, buId } = location?.state;

  useEffect(() => {
    if (empId) {
      getEmployeeProfileViewData(empId, setEmpInfo, setLoading, buId, wgId);
    }
  }, [empId, buId, wgId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="about-info-main">
                <div className="container-about-info">
                  <div className="card-about-info-main">
                    <div className="card-about-info-main-header">
                      <BackButton title={"Employee Details"} />
                      <div>
                        <Button
                          onClick={(e) =>
                            history.push({
                              pathname:
                                "/profile/employee/go-for-print/print-preview",
                              state: {
                                empInfo: empInfo,
                                values,
                              },
                            })
                          }
                          variant="outlined"
                          sx={{
                            borderColor: gray500,
                            color: gray500,
                            fontSize: "14px",
                            fontWeight: "600",
                            lineHeight: "20px",
                            "&:hover": {
                              borderColor: gray500,
                            },
                          }}
                          startIcon={
                            <PrintOutlined
                              sx={{ color: gray900 }}
                              className="emp-print-icon"
                            />
                          }
                        >
                          Print Preview
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="card-about-info-main about-info-card">
                    <About empInfo={empInfo?.employeeProfileLandingView} />
                    <JobDetails empInfo={empInfo?.employeeProfileLandingView} />
                    <AdministrativeInfo
                      empInfo={empInfo?.employeeProfileLandingView}
                    />
                    <BankDetails
                      empInfo={empInfo?.empEmployeeBankDetail}
                      objProps={{
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isShowCheckBox: true,
                      }}
                    />
                    <Personal
                      empInfo={empInfo?.employeeProfileLandingView}
                      objProps={{
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isShowCheckBox: true,
                      }}
                    />
                    <Contact
                      empContact={empInfo?.employeeProfileLandingView}
                      empAddress={empInfo?.empEmployeeAddress}
                      objProps={{
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isShowCheckBox: true,
                      }}
                    />
                    <Identification
                      empInfo={empInfo}
                      objProps={{
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isShowCheckBox: true,
                      }}
                    />
                    <Experience
                      empWork={empInfo?.empJobExperience}
                      empTraining={empInfo?.empEmployeeTraining}
                      objProps={{
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isShowCheckBox: true,
                      }}
                    />
                    <Education
                      empEducation={empInfo?.empEmployeeEducation}
                      objProps={{
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isShowCheckBox: true,
                      }}
                    />
                    <Family
                      empFamily={empInfo?.empEmployeeRelativesContact}
                      objProps={{
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isShowCheckBox: true,
                      }}
                    />
                    <Others
                      empSocial={empInfo?.empSocialMedia}
                      empBiograpgyAndHobbies={empInfo?.empEmployeePhotoIdentity}
                      objProps={{
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isShowCheckBox: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default GoForPrint;
