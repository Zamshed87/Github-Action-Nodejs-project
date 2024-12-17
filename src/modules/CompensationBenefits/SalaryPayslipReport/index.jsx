import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { APIUrl } from "../../../App";
import ProfileImg from "../../../assets/images/profile.jpg";
import {
  getPeopleDeskAllDDL,
  getSearchEmployeeList,
} from "../../../common/api";
import DefaultInput from "../../../common/DefaultInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600, gray700 } from "../../../utility/customColor";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { getPDFAction } from "../../../utility/downloadFile";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { customStyles } from "../../../utility/selectCustomStyle";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";

const initialValues = {
  date: moment().format("YYYY-MM"),
  employee: "",
  inMonth: new Date().getMonth() + 1,
  intYear: new Date().getFullYear(),
  adviceName: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  adviceName: Yup.object()
    .shape({
      value: Yup.string().required("Salary Code is required"),
      label: Yup.string().required("Salary Code is required"),
    })
    .typeError("Salary Code is required"),
});

const SalaryPayslipReport = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { orgId, wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { setFieldValue, setValues, values, errors, touched, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      validationSchema,
      initialValues,
      onSubmit: (values) => {
        getData();
        setIsLandingShow(true);
      },
    });

  const [
    employeeInfo,
    getEmployeeInfo,
    loadingOnEmpInfoFetching,
    setEmployeeInfo,
  ] = useAxiosGet();

  const [viewPaySlipData, getViewPaySlipData, loadingViewPaySlipData] =
    useAxiosGet();

  const [salaryHeaderData, getSalaryHeader, loadingSalaryHeader] =
    useAxiosGet();

  const [payrollPeiodDDL, setPayrollPeiodDDL] = useState([]);
  const [isLandingDataShow, setIsLandingShow] = useState(false);

  const getData = () => {
    getEmployeeInfo(
      `/Employee/EmployeeProfileView?employeeId=${values?.employee?.value}`
    );
    getViewPaySlipData(
      `/Payroll/SalarySelectQueryAll?partName=SalaryPaySlipByEmployeeId&intMonthId=${values?.inMonth}&intBusinessUnitId=${buId}&intYearId=${values?.intYear}&IntEmployeeId=${values?.employee?.value}&intSalaryGenerateRequestId=${values?.adviceName?.value}&intWorkplaceGroupId=${wgId}`
    );
    getSalaryHeader(
      `/Payroll/SalarySelectQueryAll?partName=SalaryGenerateHeaderByEmployeeId&intMonthId=${values?.inMonth}&intBusinessUnitId=${buId}&intYearId=${values?.intYear}&IntEmployeeId=${values?.employee?.value}&intSalaryGenerateRequestId=${values?.adviceName?.value}&intWorkplaceGroupId=${wgId}`
    );
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let employeeFeature = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30272) {
      employeeFeature = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Salary PaySlip";
  }, [dispatch]);

  const numTotal = (arr, property, intPayrollElementTypeId) => {
    return arr
      .filter(
        (item) => item?.intPayrollElementTypeId === intPayrollElementTypeId
      )
      .reduce((sum, item) => sum + item[property], 0);
  };

  return (
    <>
      {(loading ||
        loadingOnEmpInfoFetching ||
        loadingViewPaySlipData ||
        loadingSalaryHeader) && <Loading />}
      <form onSubmit={handleSubmit}>
        {employeeFeature?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center my-1">
                <h2>Salary Pay Slip Report</h2>
                {viewPaySlipData && (
                  <Tooltip title="Print" arrow>
                    <button
                      className="btn-save ml-2"
                      type="button"
                      onClick={() => {
                        getPDFAction(
                          `/PdfAndExcelReport/EmployeePaySlipReport?partName=SalaryGenerateHeaderByPayrollMonthNEmployeeId&intEmployeeId=${values?.employee?.value}&intMonthId=${values?.inMonth}&intSalaryGenerateRequestId=${values?.adviceName?.value}&intYearId=${values?.intYear}`,
                          setLoading
                        );
                      }}
                      disabled={viewPaySlipData?.length <= 0}
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
                )}
              </div>
            </div>
            <div className="table-card-body">
              <div className="card-style with-form-card pb-0">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Month</label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.date}
                        name="date"
                        type="month"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("adviceName", "");
                          setFieldValue("date", e.target.value);
                          setFieldValue(
                            "inMonth",
                            +e.target.value.split("").slice(-2).join("")
                          );
                          setFieldValue(
                            "intYear",
                            +e.target.value.split("").slice(0, 4).join("")
                          );
                          if (e.target.value && values?.employee?.value) {
                            getPeopleDeskAllDDL(
                              `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriodByEmployeeId&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${
                                values?.employee?.value
                              }&IntMonth=${+e.target.value
                                .split("")
                                .slice(-2)
                                .join("")}&IntYear=${+e.target.value
                                .split("")
                                .slice(0, 4)
                                .join("")}`,
                              "SalaryGenerateRequestId",
                              "SalaryCode",
                              setPayrollPeiodDDL
                            );
                          }
                          setIsLandingShow(false);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Select Employee</label>
                      {/*   <FormikSelect
                        menuPosition="fixed"
                        name="employee"
                        options={employeeDDL || []}
                        value={values?.employee}
                        onChange={(valueOption) => {
                          setFieldValue("adviceName", "");
                          setFieldValue("employee", valueOption);
                          setEmployeeInfo("");
                          if (
                            values?.inMonth &&
                            values?.intYear &&
                            valueOption?.value
                          ) {
                            getPeopleDeskAllDDL(
                              `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriodByEmployeeId&WorkplaceGroupId=${wgId}&intId=${valueOption?.value}&IntMonth=${values?.inMonth}&IntYear=${values?.intYear}`,
                              "SalaryGenerateRequestId",
                              "SalaryCode",
                              setPayrollPeiodDDL
                            );
                          }
                          setIsLandingShow(false);
                        }}
                        styles={customStyles}
                        errors={errors}
                        placeholder=""
                        touched={touched}
                      /> */}
                      <AsyncFormikSelect
                        selectedValue={values?.employee}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("adviceName", "");
                          setFieldValue("employee", valueOption);
                          setEmployeeInfo("");
                          if (
                            values?.inMonth &&
                            values?.intYear &&
                            valueOption?.value
                          ) {
                            getPeopleDeskAllDDL(
                              `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriodByEmployeeId&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&intId=${valueOption?.value}&IntMonth=${values?.inMonth}&IntYear=${values?.intYear}`,
                              "SalaryGenerateRequestId",
                              "SalaryCode",
                              setPayrollPeiodDDL
                            );
                          }
                          setIsLandingShow(false);
                        }}
                        placeholder="Search (min 3 letter)"
                        loadOptions={(v) =>
                          getSearchEmployeeList(buId, wgId, v)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Salary Code</label>
                      <FormikSelect
                        name="adviceName"
                        options={payrollPeiodDDL || []}
                        value={values?.adviceName}
                        onChange={(valueOption) => {
                          setIsLandingShow(false);
                          setValues((prev) => ({
                            ...prev,
                            adviceName: valueOption,
                          }));
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <button
                      disabled={
                        !values?.date ||
                        !values?.employee ||
                        !values?.adviceName
                      }
                      style={{ marginTop: "21px" }}
                      className="btn btn-green"
                      type="submit"
                    >
                      View
                    </button>
                  </div>
                </div>
                {isLandingDataShow && (
                  <>
                    {values?.employee &&
                      employeeInfo?.employeeProfileLandingView && (
                        <div className="d-flex align-items-center mt-2 pb-2">
                          <div>
                            {employeeInfo?.employeeProfileLandingView
                              ?.intEmployeeImageUrlId > 0 ? (
                              <img
                                src={`${APIUrl}/Document/DownloadFile?id=${employeeInfo?.employeeProfileLandingView?.intEmployeeImageUrlId}`}
                                alt="Profile Pic"
                                style={{ maxHeight: "78px", minWidth: "78px" }}
                              />
                            ) : (
                              <img
                                src={ProfileImg}
                                alt="Profile Pic"
                                width="78px"
                                height="78px"
                                style={{ height: "inherit" }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="content-about-info-card ml-3">
                              <div className="d-flex justify-content-between">
                                <h4
                                  className="name-about-info"
                                  style={{ marginBottom: "5px" }}
                                >
                                  {
                                    employeeInfo?.employeeProfileLandingView
                                      ?.strEmployeeName
                                  }
                                  <span
                                    style={{
                                      fontWeight: "400",
                                      color: gray700,
                                    }}
                                  >
                                    [
                                    {
                                      employeeInfo?.employeeProfileLandingView
                                        ?.strCardNumber
                                    }
                                    ]
                                  </span>
                                </h4>
                              </div>
                              <div className="single-info">
                                <p
                                  className="text-single-info"
                                  style={{ fontWeight: "500", color: gray700 }}
                                >
                                  <small
                                    style={{
                                      fontSize: "12px",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    Department -
                                  </small>
                                  {
                                    employeeInfo?.employeeProfileLandingView
                                      ?.strDepartment
                                  }
                                </p>
                              </div>
                              <div className="single-info">
                                <p
                                  className="text-single-info"
                                  style={{ fontWeight: "500", color: gray700 }}
                                >
                                  <small
                                    style={{
                                      fontSize: "12px",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    Designation -
                                  </small>
                                  {
                                    employeeInfo?.employeeProfileLandingView
                                      ?.strDesignation
                                  }
                                </p>
                              </div>
                              <div className="single-info">
                                <p
                                  className="text-single-info"
                                  style={{ fontWeight: "500", color: gray700 }}
                                >
                                  <small
                                    style={{
                                      fontSize: "12px",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    Employment Type -
                                  </small>
                                  {
                                    employeeInfo?.employeeProfileLandingView
                                      ?.strEmploymentType
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
              {isLandingDataShow && (
                <>
                  {viewPaySlipData?.length ? (
                    <div className="table-card-styled tableOne mt-3">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>
                              <p className="pl-1" style={thStyles}>
                                Income Head
                              </p>
                            </th>
                            <th style={{ width: "300px" }} colSpan="3">
                              <p className="text-center" style={thStyles}>
                                Amount in BDT
                              </p>
                            </th>
                          </tr>
                          <tr>
                            <th>
                              <p style={thStyles} className="pl-1">
                                A. Benefits:
                              </p>
                            </th>
                            <th style={{ textAlign: "right" }}>
                              <p style={thStyles}>Current</p>
                            </th>
                            <th style={{ textAlign: "right" }}>
                              <p style={thStyles}>Arrear</p>
                            </th>
                            <th style={{ textAlign: "right" }}>
                              <p style={thStyles}>Total</p>
                            </th>
                          </tr>

                          {viewPaySlipData
                            .filter(
                              (item) => item?.intPayrollElementTypeId === 1
                            )
                            .map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <p>{item?.strPayrollElement}</p>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  <p>{numberWithCommas(item?.numAmount)}</p>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  <p>{numberWithCommas(item?.numArrear)}</p>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  <p>{numberWithCommas(item?.numTotal)}</p>
                                </td>
                              </tr>
                            ))}
                          <tr>
                            <td>
                              <p>Overtime</p>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <p>
                                {salaryHeaderData[0]?.numOverTimeAmount || 0}
                              </p>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <p>0</p>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <p>
                                {salaryHeaderData[0]?.numOverTimeAmount || 0}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <th>
                              <p style={thStyles} className="pl-1">
                                Total benefits
                              </p>
                            </th>
                            <th style={{ textAlign: "right" }}>
                              <p style={thStyles}>
                                {numberWithCommas(
                                  numTotal(viewPaySlipData, "numAmount", 1) +
                                    salaryHeaderData[0]?.numOverTimeAmount || 0
                                )}
                              </p>
                            </th>
                            <th style={{ textAlign: "right" }}>
                              <p style={thStyles}>
                                {numberWithCommas(
                                  numTotal(viewPaySlipData, "numArrear", 1)
                                )}
                              </p>
                            </th>
                            <th style={{ textAlign: "right" }}>
                              <p style={thStyles}>
                                {numberWithCommas(
                                  numTotal(viewPaySlipData, "numTotal", 1) +
                                    salaryHeaderData[0]?.numOverTimeAmount || 0
                                )}
                              </p>
                            </th>
                          </tr>

                          <tr>
                            <th colSpan="4">
                              <p style={thStyles} className="pl-1">
                                B. Deductions:
                              </p>
                            </th>
                          </tr>

                          {viewPaySlipData
                            .filter(
                              (item) => item?.intPayrollElementTypeId === 0
                            )
                            .map((item, index) => (
                              <tr key={index}>
                                <td style={{ textAlign: "left" }}>
                                  <p>{item?.strPayrollElement}</p>
                                </td>
                                <td colSpan="3" style={{ textAlign: "right" }}>
                                  <p>{numberWithCommas(item?.numAmount)}</p>
                                </td>
                              </tr>
                            ))}
                          <tr>
                            <td style={{ textAlign: "left" }}>
                              <p>Tax</p>
                            </td>
                            <td style={{ textAlign: "right" }} colSpan="3">
                              <p>{salaryHeaderData[0]?.numTaxAmount || 0}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "lef" }}>
                              <p>Loan</p>
                            </td>
                            <td style={{ textAlign: "right" }} colSpan="3">
                              <p>{salaryHeaderData[0]?.numLoanAmount || 0}</p>
                            </td>
                          </tr>
                          <tr>
                            {orgId !== 4 ? (
                              <>
                                <td style={{ textAlign: "left" }}>
                                  <p>Provident Fund</p>
                                </td>
                                <td style={{ textAlign: "right" }} colSpan="3">
                                  <p>{salaryHeaderData[0]?.numPFAmount || 0}</p>
                                </td>
                              </>
                            ) : null}
                          </tr>
                          <tr>
                            {orgId === 4 ? (
                              <>
                                <td style={{ textAlign: "left" }}>
                                  <p>Late Joining Deduction</p>
                                </td>
                                <td style={{ textAlign: "right" }} colSpan="3">
                                  <p>
                                    {Math.round(
                                      salaryHeaderData[0]?.intLateJoining *
                                        salaryHeaderData[0]?.numPerDaySalary
                                    ) || 0}
                                  </p>
                                </td>
                              </>
                            ) : null}
                          </tr>
                          {/* <tr>
                            <td style={{ textAlign: "left" }}>
                              <p>Others</p>
                            </td>
                            <td style={{ textAlign: "right" }} colSpan="3">
                              <p>
                                {salaryHeaderData[0]?.numOthersDeduction || 0}
                              </p>
                            </td>
                          </tr> */}
                          <tr>
                            <th>
                              <p style={thStyles} className="pl-1">
                                Total deductions
                              </p>
                            </th>
                            <th colSpan="3" style={{ textAlign: "right" }}>
                              <p style={thStyles}>
                                {numberWithCommas(
                                  numTotal(viewPaySlipData, "numAmount", 0) +
                                    (salaryHeaderData[0]?.numTaxAmount || 0) +
                                    (salaryHeaderData[0]?.numLoanAmount || 0) +
                                    (salaryHeaderData[0]?.numPFAmount || 0) +
                                    (Math.round(
                                      +salaryHeaderData[0]?.intLateJoining *
                                        +salaryHeaderData[0]?.numPerDaySalary
                                    ) || 0)
                                )}
                              </p>
                            </th>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "left" }}>
                              <p>Bank Pay Amount</p>
                            </td>
                            <td style={{ textAlign: "right" }} colSpan="3">
                              <p>
                                {salaryHeaderData[0]?.numBankPayAmount || 0}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ textAlign: "left" }}>
                              <p>Cash Pay Amount</p>
                            </td>
                            <td style={{ textAlign: "right" }} colSpan="3">
                              <p>
                                {salaryHeaderData[0]?.numCashPayAmount || 0}
                              </p>
                            </td>
                          </tr>

                          <tr>
                            <td style={{ textAlign: "left" }}>
                              <p>Digita Pay Amount</p>
                            </td>
                            <td style={{ textAlign: "right" }} colSpan="3">
                              <p>
                                {salaryHeaderData[0]?.numDigitalPayAmount || 0}
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <th>
                              <p style={thStyles} className="pl-1">
                                Net Take Home (A-B)
                              </p>
                            </th>
                            <th colSpan="3" style={{ textAlign: "right" }}>
                              <p style={thStyles}>
                                {salaryHeaderData[0]?.numNetPayableSalary}
                                {/* {numberWithCommas(
                                  (numTotal(viewPaySlipData, "numTotal", 1) +
                                    salaryHeaderData[0]?.numOverTimeAmount ||
                                    0) -
                                    (numTotal(viewPaySlipData, "numAmount", 0) +
                                      (salaryHeaderData[0]?.numTaxAmount || 0) +
                                      (salaryHeaderData[0]?.numLoanAmount ||
                                        0) +
                                      (salaryHeaderData[0]?.numPFAmount || 0))
                                )} */}
                              </p>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <NoResult />
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
};

export default SalaryPayslipReport;

const thStyles = {
  fontWeight: 700,
  fontSize: "12px !important",
  lineHeight: "18px !important",
  color: `${gray600} !important`,
};
