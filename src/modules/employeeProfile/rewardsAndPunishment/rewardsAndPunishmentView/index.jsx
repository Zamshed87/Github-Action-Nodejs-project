/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import HistoryIcon from "@mui/icons-material/History";
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";

const initData = {};

function RewardsAndPunishmentView() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const [loading, setLoading] = useState(false);

  const saveHandler = (values) => {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
            {loading && <Loading />}
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="table-card">
                <div className="table-card-heading ">
                  <div>
                    <Tooltip title="Print">
                      <button
                        className="btn-save"
                        type="button"
                        style={{
                          border: "transparent",
                          width: "40px",
                          height: "40px",
                          background: "#f2f2f7",
                          borderRadius: "100px",
                        }}
                        onClick={() => {
                          /* getPDFAction(
                                    `/emp/PdfAndExcelReport/LoanReportAll?BusinessUnitId=${buId}&DepartmentId=${
                                      values?.department?.value || 0
                                    }&DesignationId=${
                                      values?.designation?.value || 0
                                    }&EmployeeId=${
                                      values?.employee?.value || 0
                                    }&LoanTypeId=${
                                      values?.loanType?.value || 0
                                    }&FromDate=${
                                      values?.fromDate || ""
                                    }&ToDate=${
                                      values?.toDate || ""
                                    }&MinimumAmount=${
                                      values?.minimumAmount || 0
                                    }&MaximumAmount=${
                                      values?.maximumAmount || 0
                                    }&ApplicationStatus=${
                                      values?.applicationStatus?.label || ""
                                    }&InstallmentStatus=${
                                      values?.installmentStatus?.label || ""
                                    }`,
                                    setLoading
                                  ); */
                        }}
                      >
                        <PrintIcon sx={{ color: "#637381" }} />
                      </button>
                    </Tooltip>
                  </div>
                  <div className="table-card-head-right">
                    <p onClick="" style={{ width: "100px" }}>
                      <input
                        onChange={(e) => {}}
                        type=""
                        id="history"
                        /* ref={inputFile} */
                        style={{ display: "none" }}
                      />
                      <div
                        className="d-flex align-items-center"
                        style={{ fontSize: "12px" }}
                      >
                        <HistoryIcon
                          sx={{
                            marginRight: "5px",
                            fontSize: "18px",
                            color: "#34A853",
                          }}
                        />
                        <p style={{ color: "#34A853", fontSize: "14px" }}>
                          History
                        </p>
                      </div>
                    </p>
                  </div>
                </div>
                <div className="table-card-body">
                  <div className=" ">
                    <div className="row mt-5">
                      <div className="col-md-12">
                        <h2
                          style={{
                            color: "rgba(0, 0, 0, 0.6)",
                            fontSize: "21px",
                          }}
                        >
                          Uttara Group Of Industries
                        </h2>
                        <p
                          style={{
                            color: "rgba(0, 0, 0, 0.6)",
                            fontSize: "16px",
                            margin: "10px 0",
                          }}
                        >
                          Bir Uttam Sarak, Uttara House 1536/7, Dhaka-1205,
                          Bangladesh.
                        </p>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-4">
                        <div className="row">
                          <div className="col-md-4">
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              Name -{" "}
                            </p>
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              Designation -{" "}
                            </p>
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              Department -{" "}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p>Layla Anjuman</p>
                            <p className="text-nowrap">
                              Deputy General Manager
                            </p>
                            <p>Development</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="row">
                          <div className="col-md-5">
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              Disciplinary Date -{" "}
                            </p>
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              Type -{" "}
                            </p>
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              Action -{" "}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p>12/30/2021</p>
                            <p>Bad Behaviour</p>
                            <p>Suspended</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="row">
                          <div className="col-md-5">
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              Start Date -{" "}
                            </p>
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              End Date -{" "}
                            </p>
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.4)",
                                fontSize: "16px",
                              }}
                            >
                              Status -{" "}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p>12/31/2021</p>
                            <p>01/03/2022</p>
                            <p style={{ color: "red" }}>Running</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div className="col-md-12">
                        <div
                          className="description"
                          style={{
                            padding: "20px",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            marginRight: "15px",
                          }}
                        >
                          <h5
                            style={{
                              color: "rgba(0, 0, 0, 0.7)",
                              fontSize: "16px",
                            }}
                          >
                            Description
                          </h5>
                          <hr />
                          <p
                            style={{
                              fontSize: "16px",
                              lineHeight: "24px",
                              letterSpacing: "0.148571px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            Dear Layla Anjuman,
                            <br /> I am writing to tell you that requested to
                            attend a disciplinary meeting 29/12/2021 at am/pm
                            which is to be held in <br />
                            Dhaka. At the meeting the question of disciplinary
                            action against you, in according with the Company
                            Disciplinary <br /> Procedure, will be considered
                            with regard to,
                          </p>
                          <p
                            style={{
                              margin: "15px 0",
                              fontSize: "16px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            MD Shawkat Hossain,{" "}
                          </p>
                          <p
                            style={{
                              fontSize: "16px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            endorse the following documents.
                          </p>
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
}

export default RewardsAndPunishmentView;
