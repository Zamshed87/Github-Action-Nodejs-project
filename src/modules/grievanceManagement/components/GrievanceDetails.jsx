/* eslint-disable no-unused-vars */
// import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { Form, Formik } from "formik";
import { useState } from "react";
// import Loading from "../../common/loading/Loading";
// import SortingIcon from "../../common/SortingIcon";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar } from "@mui/material";
import { useHistory } from "react-router-dom";
import FormikSelect from "./../../../common/FormikSelect";
import { customStylesSmall } from "./../../../utility/selectCustomStyle";

const fakeData = [
  {
    id: 1,
    name: "IELTS",
    category: "Language",
    trainer: "Md. Taufiqur Rahman",
    fromDate: "11 april, 2022",
    toDate: "11 june, 2022",
    certificate: "certificate.pdf",
  },
  {
    id: 2,
    name: "GRE",
    category: "Language",
    trainer: "Abdur Rahim",
    fromDate: "11 april, 2022",
    toDate: "11 june, 2022",
    certificate: "certificate.pdf",
  },
  {
    id: 3,
    name: "TOFEL",
    category: "Language",
    trainer: "Md. Rahim",
    fromDate: "11 april, 2022",
    toDate: "11 june, 2022",
    certificate: "certificate.pdf",
  },
];

const GrievanceDetails = () => {
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
              <div>
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
                        // onClick={() =>
                        //   history.push("/taskmanagement/taskmgmt/projects")
                        // }
                      >
                        <ArrowBackIcon
                          sx={{
                            fontSize: "18px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <p className="font-weight-bold ml-3">Grievance Details</p>
                    </div>
                    <div>
                      <FormikSelect
                        classes="input-sm"
                        styles={customStylesSmall}
                        name="approved"
                        options={[
                          { value: 1, label: "Approved" },
                          { value: 2, label: "In Review" },
                          { value: 3, label: "Closed" },
                          { value: 4, label: "Rejected" },
                        ]}
                        value={values?.domain}
                        onChange={(valueOption) => {
                          setFieldValue("domain", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="table-card-body">
                    <div className=" tableOne">
                      <>
                        <div
                          style={{
                            backgroundColor: "#F8EFDD",
                            padding: "13px 0px 13px 24px",
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            borderRadius: "4px",
                          }}
                        >
                          <p style={{ fontSize: "12px", lineHeight: "24px" }}>
                            Subject
                          </p>
                          <p
                            style={{
                              fontSize: "18px",
                              lineHeight: "21.09px",
                              fontWeight: "700",
                            }}
                          >
                            Misbehave
                          </p>
                        </div>

                        <div
                          style={{
                            padding: "13px 0px 40px 24px",
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            borderRadius: "4px",
                            marginTop: "8px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "12px",
                              lineHeight: "24px",
                              color: "rgba(0, 0, 0, 0.4)",
                            }}
                          >
                            Description
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              lineHeight: "16.41px",
                              fontWeight: "500",
                            }}
                          >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Eos placeat, deserunt, fugit aliquid
                            necessitatibus quas
                          </p>
                        </div>
                        <div
                          style={{
                            padding: "13px 0px 13px 0px",
                            // border: "1px solid rgba(0, 0, 0, 0.08)",
                            // borderRadius: "4px",
                            display: "flex",
                            marginTop: "15px",
                          }}
                        >
                          <div style={{ width: "20%" }}>
                            <div className="d-flex align-items-center px-1 ">
                              <Avatar
                                sx={{ height: "40px!important", width: "40px" }}
                                alt="Remy Sharp"
                                src="/static/images/avatar/1.jpg"
                              />
                              <div className=" ml-2">
                                <p
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: "16.41px",
                                    fontWeight: "500",
                                  }}
                                >
                                  Shafiq
                                </p>
                                <p
                                  style={{
                                    fontSize: "12px",
                                    lineHeight: "24px",
                                    color: "rgba(0, 0, 0, 0.6)",
                                  }}
                                >
                                  Chief Executive Officer
                                </p>
                              </div>
                            </div>
                          </div>
                          <div style={{ width: "15%" }}>
                            <p
                              style={{
                                fontSize: "12px",
                                lineHeight: "24px",
                                color: "rgba(0, 0, 0, 0.4)",
                              }}
                            >
                              Date
                            </p>
                            <p
                              style={{
                                fontSize: "14px",
                                lineHeight: "16.41px",
                                fontWeight: "500",
                              }}
                            >
                              20 April 2022
                            </p>
                          </div>
                          <div style={{ width: "15%" }}>
                            <p
                              style={{
                                fontSize: "12px",
                                lineHeight: "24px",
                                color: "rgba(0, 0, 0, 0.4)",
                              }}
                            >
                              Status
                            </p>
                            <p
                              style={{
                                fontSize: "14px",
                                lineHeight: "16.41px",
                                fontWeight: "500",
                              }}
                            >
                              Approved
                            </p>
                          </div>
                          <div style={{ width: "15%" }}>
                            <p
                              style={{
                                fontSize: "12px",
                                lineHeight: "24px",
                                color: "rgba(0, 0, 0, 0.4)",
                              }}
                            >
                              Status Last Update By
                            </p>
                            <p
                              style={{
                                fontSize: "14px",
                                lineHeight: "16.41px",
                                fontWeight: "500",
                              }}
                            >
                              Md. Mridul Hasan
                            </p>
                          </div>
                        </div>
                      </>
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

export default GrievanceDetails;
