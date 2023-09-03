/* eslint-disable no-unused-vars */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import PersonIcon from "@mui/icons-material/Person";
// import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../../common/AvatarComponent";
// import Loading from "../../common/loading/Loading";
// import SortingIcon from "../../common/SortingIcon";
import FormikSelect from "../../../common/FormikSelect";
import { customStyles } from "../../../utility/selectCustomStyle";
import strPlanBG from "./strPlanHeaderBG.png";

const GrievanceSelfDetails = () => {
  const [loading, setLoading] = useState(false);
  const [employeeOrder, setEmployeeOrder] = useState("desc");
  const [category, setCategory] = useState("desc");
  const [training, setTraining] = useState("desc");
  const history = useHistory();

  return (
    <>
      <Formik>
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
              {/* {loading && <Loading />} */}

              <div className="all-candidate grievanceDetails">
                <div className="table-card">
                  <div className="table-card-heading">
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="text-center"
                        style={{
                          borderRadius: "50%",
                          backgroundColor: "#F2F2F7",
                          height: "30px",
                          width: "30px",
                        }}
                        onClick={() => history.goBack()}
                      >
                        <ArrowBackIcon
                          sx={{
                            fontSize: "18px",
                            cursor: "pointer",
                            marginTop: "5px",
                          }}
                        />
                      </div>
                      <p className="font-weight-bold ml-3">Grievance Details</p>
                    </div>
                  </div>
                  <hr />
                  <div className="table-card-body">
                    <div className="table-card-styled">
                      <div className="form-card col-md-12 pl-0">
                        <div className="card">
                          <img
                            style={{
                              width: "100%",
                              height: "15px",
                            }}
                            src={strPlanBG}
                            alt="bg"
                          />
                          <div
                            className="card-body pt-5 pb-5
                                "
                          >
                            <div className="card">
                              <div>
                                <div className="color">
                                  <h4>
                                    My Colleague is Harassing Me in the Office
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="des">
                              <h5> Description</h5>
                              <p className="text-justify">
                                Grievance handling is the management of employee
                                dissatisfaction or complaints (e.g. favouritism,
                                workplace harassment, or wage cuts). By
                                establishing formal grievance handling
                                procedures, you provide a safe environment for
                                your employees to raise their concerns.A
                                grievance is a formal complaint that is raised
                                by an employee towards an employer within the
                                workplace. There are many reasons as to why a
                                grievance can be raised, and also many ways to
                                go about dealing with such a scenario. Reasons
                                for filing a grievance in the workplace can be
                                as a result of, but not limited to, a breach of
                                the terms and conditions of an employment
                                contract, raises and promotions, or lack
                                thereof, as well as harassment and employment
                                discrimination.
                              </p>
                            </div>
                            <div className="anonymous pt-4">
                              <div className="row">
                                <div className="col-lg-3 p-0">
                                  <div className="d-flex align-items-center">
                                    <div className="ml-3">
                                      <div className="emp-avatar d-flex align-items-center ">
                                        <div
                                          className="text-center"
                                          style={{
                                            borderRadius: "50%",
                                            backgroundColor: "#F2F2F7",
                                            height: "30px",
                                            width: "30px",
                                          }}
                                        >
                                          <PersonIcon
                                            sx={{
                                              fontSize: "18px",
                                              cursor: "pointer",
                                              marginTop: "5px",
                                            }}
                                          />
                                        </div>
                                        <div className="ml-3">
                                          <h6>Complain by</h6>
                                          <h3>Anonymous</h3>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3  p-0">
                                  <div className="emp-avatar d-flex align-items-center ">
                                    <div>
                                      <div
                                        className="text-center"
                                        style={{
                                          borderRadius: "50%",
                                          backgroundColor: "#F2F2F7",
                                          height: "30px",
                                          width: "30px",
                                        }}
                                      >
                                        <DateRangeRoundedIcon
                                          sx={{
                                            fontSize: "18px",
                                            cursor: "pointer",
                                            marginTop: "5px",
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="ml-3">
                                      <h6>Date</h6>
                                      <h3>May 02, 2022</h3>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3  p-0">
                                  <div className="emp-avatar d-flex align-items-center ">
                                    <AvatarComponent
                                      classess=""
                                      letterCount={1}
                                      label={"Md. Taufiqur"}
                                    />
                                    <div className="ml-3">
                                      <h6>Last update by</h6>
                                      <h3>Md. Taufiqur Rahman</h3>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3">
                                  <h6>Status</h6>
                                  <div className="input-field-main w-50">
                                    <FormikSelect
                                      name="status"
                                      value={values?.Category}
                                      options={[
                                        { value: 1, label: "In Review" },
                                        {
                                          value: 2,
                                          label: "Closed",
                                        },
                                      ]}
                                      placeholder="In Review"
                                      styles={customStyles}
                                      isDisabled={false}
                                      errors={errors}
                                      touched={touched}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5>Attachment</h5>
                              <li className="d-flex align-items-center justify-content-start pt-3">
                                <div
                                  style={{
                                    color: "#009cde",
                                    cursor: "pointer",
                                  }}
                                >
                                  Documentsfiles.pdf
                                  <br />
                                  allimagesfiles.jpeg
                                </div>
                              </li>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default GrievanceSelfDetails;
