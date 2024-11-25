/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./style.css";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import html2pdf from "html2pdf.js";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { useEffect } from "react";
import FormikSelect from "../../../../common/FormikSelect";
import { useFormik } from "formik";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
// import { erpBaseUrl } from '../../../../common/ErpBaseUrl';
import { PeopleDeskSaasDDL } from "../../../../common/api";

export default function IDPReport() {
  // 30406
  const { buId, orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [reportData, getReportData, loading, setReportData] = useAxiosGet();
  const [yearData, getYearData, yearLoading] = useAxiosGet();
  const [employeeDDL, setEmployeeDDL] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getYearData(`/pms/CommonDDL/YearDDL?AccountId=${orgId}&BusinessUnitId=4`);
    PeopleDeskSaasDDL(
      "EmployeeBasicInfo",
      orgId,
      buId,
      setEmployeeDDL,
      "EmployeeId",
      "EmployeeName"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: {
        unit: "px",
        hotfixes: ["px_scaling"],
        orientation: "landscape",
      },
    };
    html2pdf().set(opt).from(element).save();
  };

  const { values, setFieldValue, handleSubmit, errors, touched } = useFormik({
    enableReinitialize: true,
    initialValues: {},
    //validationSchema,
    onSubmit: () => {
      // addHandler();
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center my-1">
              <h2>Development Plan</h2>
              <Tooltip title="Print" arrow>
                <button
                  className="btn-save ml-2"
                  type="button"
                  onClick={() => pdfExport("Development Plan Report")}
                  style={{
                    border: "transparent",
                    width: "30px",
                    height: "30px",
                    background: "#f2f2f7",
                    borderRadius: "100px",
                  }}
                >
                  <LocalPrintshopIcon
                    sx={{
                      color: "#637381",
                      fontSize: "16px",
                    }}
                  />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "40px" }}>
            <div className="card-style mb-2">
              <div className="row">
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Employee</label>
                    <FormikSelect
                      name="employee"
                      placeholder=""
                      options={employeeDDL || []}
                      value={values?.employee}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("employee", valueOption);
                          setFieldValue("quater", "");
                          setFieldValue("year", "");
                        } else {
                          setFieldValue("employee", "");
                          setFieldValue("year", "");
                        }
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Year</label>
                    <FormikSelect
                      name="year"
                      placeholder=""
                      options={yearData || []}
                      value={values?.year}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("year", valueOption);
                          setFieldValue("quater", "");
                          setFieldValue("typeRef", "");
                        } else {
                          setFieldValue("year", "");
                          setFieldValue("quater", "");
                        }
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Quater</label>
                    <FormikSelect
                      name="quater"
                      placeholder=""
                      options={[
                        { value: 1, label: "Q1" },
                        { value: 2, label: "Q2" },
                        { value: 3, label: "Q3" },
                        { value: 4, label: "Q4" },
                      ]}
                      value={values?.quater}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          // getRowData(`${erpBaseUrl}/pms/PerformanceMgmt/GetIDPByEmployeeId?EmployeeId=${employeeId}&YearId=${values?.year?.value}&QuarterId=${valueOption?.value}`,
                          // (data) => {

                          // }
                          // )
                          setFieldValue("quater", valueOption);
                        } else {
                          setFieldValue("quater", "");
                        }
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={!values.year}
                    />
                  </div>
                </div>
                <div className="col-lg-1">
                  <button
                    disabled={
                      !values?.employee || !values?.year || !values?.quater
                    }
                    style={{ marginTop: "21px" }}
                    className="btn btn-green"
                    onClick={() => {
                      getReportData(
                        `/pms/PerformanceMgmt/GetIDPReport?employeeId=${
                          values?.employee?.value || 0
                        }&yearId=${values?.year?.value || 0}&quarterId=${
                          values?.quater?.value || 0
                        }`
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div id="pdf-section" class="idp-report-wrapper">
              <div class="heading">
                <div>
                  <h1 style={{ fontSize: "18px", marginBottom: "10px" }}>
                    Development Plan Report
                  </h1>
                  <p>
                    <strong>SBU:</strong> {reportData?.businessUnit}
                  </p>
                  <p>
                    <strong>Section:</strong> {reportData?.section}
                  </p>
                  <p>
                    <strong>Department:</strong> {reportData?.department}
                  </p>
                  <p>
                    <strong>Supervisor:</strong> {reportData?.supervisor}
                  </p>
                </div>
                <div>
                  {/* <img src={User} alt="Employee" class="photo" /> */}
                  <p>
                    <small>{reportData?.employee}</small>
                  </p>
                  <p>
                    <small>{reportData?.designation}</small>
                  </p>
                </div>
              </div>
              <div>
                <table>
                  {reportData?.typeReferenceList?.map((item, index) => (
                    <>
                      <tr class="table-title">
                        <td>{item?.typeReferenceName}</td>
                        <td>TimeFrame</td>
                        <td>Status</td>
                        <td>Progress</td>
                        <td>Comments</td>
                      </tr>
                      {item?.categoryList?.map((categoryData) => (
                        <>
                          <tr class="table-title">
                            <th colSpan={5}>{categoryData?.categoryName}</th>
                          </tr>
                          {categoryData?.activityList?.map((activityData) => (
                            <>
                              <tr>
                                <td>{activityData?.activityName}</td>
                                <td>{activityData?.timeFrame}</td>
                                <td>{activityData?.status}</td>
                                <td
                                  style={{
                                    backgroundColor: `${activityData?.progressColor}`,
                                  }}
                                >
                                  {
                                    //activityData?.progressColor
                                  }
                                </td>
                                <td>{activityData?.comments}</td>
                              </tr>
                            </>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
