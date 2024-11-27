import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import html2pdf from "html2pdf.js";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
// import { erpBaseUrl } from "../../../../common/ErpBaseUrl";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { customStyles } from "../../../../utility/selectCustomStyle";
import "./style.css";
import Loading from "../../../../common/loading/Loading";

export default function PerformanceEvaluationReport() {
  // 30405
  const { buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [reportData, getReportData, reportLoading] = useAxiosGet();

  const [yearDDL, getYearDDL] = useAxiosGet();

  useEffect(() => {
    getYearDDL(`/pms/CommonDDL/YearDDL?AccountId=${orgId}&BusinessUnitId=4`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  // useFormik hooks
  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      employee: "",
      quater: "",
      year: "",
    },
    onSubmit: (values) =>
      (() => {
        getReportData(
          `/pms/PerformanceMgmt/GetPerformanceEvaluationReport?businessUnitId=${buId}&employeeId=${values?.employee?.value}&yearId=${values?.year?.value}&quarterId=${values?.quater?.value}`
        );
      })(),
  });

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const quaterDDL = [
    { value: 1, label: "Q1" },
    { value: 2, label: "Q2" },
    { value: 3, label: "Q3" },
    { value: 4, label: "Q4" },
  ];

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfoSearchDDL&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${0}&SearchText=${v}`
      )
      .then((res) => {
        return (
          res?.data?.map((data) => ({
            ...data,
            value: data?.EmployeeId,
            label: data?.EmployeeName,
          })) || []
        );
      })
      .catch((err) => []);
  };

  return (
    <form onSubmit={handleSubmit}>
      {reportLoading && <Loading />}
      <div className="table-card">
        <div className="table-card-heading">
          <div className="d-flex align-items-center my-1">
            <h2>Performance Evaluation Report</h2>
            <Tooltip title="Print" arrow>
              <button
                className="btn-save ml-2"
                type="button"
                onClick={() => pdfExport("Performance Evaluation Report")}
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
        <div className="card-style with-form-card pb-0 mb-3 ">
          <div className="row">
            <div className="col-lg-3">
              <label>Employee</label>
              <AsyncFormikSelect
                selectedValue={values?.employee}
                isSearchIcon={true}
                isClear={true}
                handleChange={(valueOption) => {
                  setFieldValue("employee", valueOption);
                }}
                loadOptions={loadUserList}
              />
            </div>
            <div className="input-field-main col-lg-3">
              <FormikSelect
                classes="input-sm"
                name="year"
                options={yearDDL || []}
                value={values?.year}
                label="Year"
                onChange={(valueOption) => {
                  setFieldValue("year", valueOption);
                }}
                placeholder=""
                errors={errors}
                styles={customStyles}
                touched={touched}
                menuPosition="fixed"
              />
            </div>
            <div className="input-field-main col-lg-3">
              <FormikSelect
                classes="input-sm"
                name="quater"
                options={quaterDDL || []}
                value={values?.quater}
                label="Quarter"
                onChange={(valueOption) => {
                  setFieldValue("quater", valueOption);
                }}
                placeholder=""
                errors={errors}
                styles={customStyles}
                touched={touched}
                menuPosition="fixed"
              />
            </div>

            <div style={{ marginTop: "24px" }} className="col-lg-3">
              <PrimaryButton
                type="submit"
                className="btn btn-green flex-center"
                label={"Show"}
                disabled={!values?.employee || !values?.year || !values?.quater}
              />
            </div>
          </div>
        </div>
        <div className="table-card-body" style={{ marginTop: "40px" }}>
          <div id="pdf-section" class="performance-report-wrapper">
            <div class="heading">
              <div>
                <h1 style={{ fontSize: "18px", marginBottom: "10px" }}>
                  Performance Evaluation Report
                </h1>
                <p>
                  <strong>SBU:</strong> {`${reportData[0]?.strSBUName}`}
                </p>
                <p>
                  <strong>Section:</strong> {`${reportData[0]?.strSectionName}`}
                </p>
                <p>
                  <strong>Department:</strong>{" "}
                  {`${reportData[0]?.strDepartment}`}
                </p>
                <p>
                  <strong>Supervisor:</strong>{" "}
                  {`${reportData[0]?.strSupervisorName}`}
                </p>
              </div>
              <div>
                <img src="" alt="Employee" class="photo" />
                <p>
                  <small>{reportData[0]?.strEmployeeName}</small>
                </p>
                <p>
                  <small>{reportData[0]?.strDesignation}</small>
                </p>
                <p>
                  <strong>SCORE: 10</strong>
                </p>
              </div>
            </div>
            <div>
              <table>
                <tr class="table-title">
                  <td colspan="3">Individual Performance Scorecard</td>
                </tr>
                <tr>
                  <th>Comments</th>
                  <th>Actions</th>
                  <th>Score</th>
                </tr>
                <tr>
                  <td>Comment 1</td>
                  <td>Action 1</td>
                  <td>Score 1</td>
                </tr>
                <tr>
                  <td>Comment 2</td>
                  <td>Action 2</td>
                  <td>Score 2</td>
                </tr>
                <tr>
                  <td>Comment 3</td>
                  <td>Action 3</td>
                  <td>Score 3</td>
                </tr>
              </table>
            </div>
            <div>
              <table>
                <tr class="table-title">
                  <td colspan="3">Competencies</td>
                </tr>
                <tr>
                  <th>Comments</th>
                  <th>Actions</th>
                  <th>Score</th>
                </tr>
                <tr>
                  <td>Comment 1</td>
                  <td>Action 1</td>
                  <td>Score 1</td>
                </tr>
                <tr>
                  <td>Comment 2</td>
                  <td>Action 2</td>
                  <td>Score 2</td>
                </tr>
                <tr>
                  <td>Comment 3</td>
                  <td>Action 3</td>
                  <td>Score 3</td>
                </tr>
              </table>
            </div>
            <div>
              <table>
                <tr class="table-title">
                  <td colspan="3">Behaviors</td>
                </tr>
                <tr>
                  <th>Comments</th>
                  <th>Actions</th>
                  <th>Score</th>
                </tr>
                <tr>
                  <td>Comment 1</td>
                  <td>Action 1</td>
                  <td>Score 1</td>
                </tr>
                <tr>
                  <td>Comment 2</td>
                  <td>Action 2</td>
                  <td>Score 2</td>
                </tr>
                <tr>
                  <td>Comment 3</td>
                  <td>Action 3</td>
                  <td>Score 3</td>
                </tr>
              </table>
            </div>
            <div>
              <table>
                <tr class="table-title">
                  <td colspan="3">Development Plan</td>
                </tr>
                <tr>
                  <th>Comments</th>
                  <th>Actions</th>
                  <th>Progress</th>
                </tr>
                {reportData?.map((item, i) => (
                  <tr key={i}>
                    <td>{item?.strComment}</td>
                    <td>{item?.taskName}</td>
                    <td style={{ backgroundColor: `${item?.strStatus}` }}></td>
                  </tr>
                ))}
              </table>
            </div>
            <div class="footer">
              <div>
                <p>
                  <strong>Employee's signature</strong>
                </p>
                <p class="signature"></p>
                <p>
                  <strong>Date:</strong>
                </p>
              </div>
              <div>
                <p>
                  <strong>Manager's signature</strong>
                </p>
                <p class="signature"></p>
                <p>
                  <strong>Date:</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
