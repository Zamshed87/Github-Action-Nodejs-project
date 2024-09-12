import { useFormik } from "formik";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getPeopleDeskAllDDL,
  getSearchEmployeeList,
} from "../../../common/api";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600, gray700 } from "../../../utility/customColor";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { getPDFAction } from "../../../utility/downloadFile";
import { customStyles } from "../../../utility/selectCustomStyle";
import ProfileImg from "../../../assets/images/profile.jpg";
import AsyncFormikSelect from "../../../common/AsyncFormikSelect";
const initialValues = {
  year: null,
  employee: null,
};
const SalaryTaxCertificate = () => {
  const { permissionList, profileData } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [fascalYearDDL, setFascalYearDDL] = useState([]);
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=fiscalYearDDL&BusinessUnitId=${profileData?.buId}&WorkplaceGroupId=${profileData?.wgId}`,
      "value",
      "label",
      setFascalYearDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.employeeId, profileData?.wgId]);

  const [
    salaryTaxCertificateInformation,
    getSalaryTaxCertificateInformation,
    loadingOnGetSalaryTax,
    setSalaryTaxCertificateInfo,
  ] = useAxiosGet();

  const dispatch = useDispatch();
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30336) {
      permission = item;
    }
  });

  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
    setFieldError,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => {
      if (!values?.employee || !values?.year) {
        if (!values?.employee) setFieldError("year", "Year is required");
        if (!values?.employee)
          setFieldError("employee", "Employee is required");
        return;
      }

      setLoading(true);
      getSalaryTaxCertificateInformation(
        `/Employee/SalaryTaxCertificate?FiscalYearId=${values?.year?.value}&FiscalYear=${values?.year?.label}&EmployeeId=${values?.employee?.value}&workplaceGroupId=${profileData?.wgId}`,
        (response) => {
          setLoading(false);
          let totalBenefit = 0;
          response?.payrollElementVMs?.forEach((item) => {
            totalBenefit += item?.numAmount;
          });
          const modifiedData = {
            ...response,
            totalBenefit,
          };
          setSalaryTaxCertificateInfo(modifiedData);
        }
      );
    },
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Salary Tax Certificate";
  }, [dispatch]);

  return (
    <>
      {(loading || loadingOnGetSalaryTax) && <Loading />}
      {permission?.isView && (
        <form onSubmit={handleSubmit}>
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center my-2">
                <h2>Salary Tax Certificate Report</h2>
                {salaryTaxCertificateInformation?.payrollElementVMs?.length >
                  0 && (
                  <Tooltip title="Print" arrow>
                    <button
                      className="btn-save ml-2"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        getPDFAction(
                          `/PdfAndExcelReport/SalaryTaxCertificateReportPDF?FiscalYearId=${values?.year?.value}&FiscalYear=${values?.year?.label}&EmployeeId=${values?.employee?.value}`,
                          setLoading
                        );
                      }}
                      disabled={
                        salaryTaxCertificateInformation?.payrollElementVMs
                          ?.length <= 0
                      }
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
                      <label>Year</label>
                      <FormikSelect
                        menuPosition="fixed"
                        name="year"
                        options={fascalYearDDL || []}
                        value={values?.year}
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                          setSalaryTaxCertificateInfo(null);
                        }}
                        styles={customStyles}
                        errors={errors}
                        placeholder="Select Year"
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Select Employee</label>
                      {/* <FormikSelect
                        menuPosition="fixed"
                        name="employee"
                        options={employeeDDL || []}
                        value={values?.employee}
                        onChange={(valueOption) => {
                          setFieldValue("employee", valueOption);
                          setSalaryTaxCertificateInfo(null);
                        }}
                        styles={customStyles}
                        errors={errors}
                        placeholder="Select Employee"
                        touched={touched}
                      /> */}
                      <AsyncFormikSelect
                        selectedValue={values?.employee}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("employee", valueOption);
                          setSalaryTaxCertificateInfo(null);
                        }}
                        placeholder="Search (min 3 letter)"
                        loadOptions={(v) =>
                          getSearchEmployeeList(
                            profileData?.buId,
                            profileData?.wgId,
                            v
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="col-lg-1">
                    <button
                      disabled={!values?.employee || !values?.year}
                      style={{ marginTop: "21px" }}
                      className="btn btn-green"
                      type="button"
                      onClick={handleSubmit}
                    >
                      View
                    </button>
                  </div>
                </div>
                {salaryTaxCertificateInformation?.payrollElementVMs?.length >
                  0 && (
                  <div className="row">
                    <div className="d-flex align-items-center mt-2 pb-2 ml-3">
                      <div>
                        {salaryTaxCertificateInformation?.imageUrl ? (
                          <img
                            //   src={`${APIUrl}/Document/DownloadFile?id=${employeeInfo?.employeeProfileLandingView?.intEmployeeImageUrlId}`}
                            src=""
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
                              {salaryTaxCertificateInformation?.employeeName}
                              <span
                                style={{ fontWeight: "400", color: gray700 }}
                              >
                                [{salaryTaxCertificateInformation?.employeeCode}
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
                                style={{ fontSize: "12px", lineHeight: "1.5" }}
                              >
                                Department -
                              </small>
                              {salaryTaxCertificateInformation?.department}
                            </p>
                          </div>
                          <div className="single-info">
                            <p
                              className="text-single-info"
                              style={{ fontWeight: "500", color: gray700 }}
                            >
                              <small
                                style={{ fontSize: "12px", lineHeight: "1.5" }}
                              >
                                Designation -
                              </small>
                              {salaryTaxCertificateInformation?.designation}
                            </p>
                          </div>
                          <div className="single-info">
                            <p
                              className="text-single-info"
                              style={{ fontWeight: "500", color: gray700 }}
                            >
                              <small
                                style={{ fontSize: "12px", lineHeight: "1.5" }}
                              >
                                Employment Type -
                              </small>
                              {salaryTaxCertificateInformation?.employmentType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {salaryTaxCertificateInformation?.payrollElementVMs?.length >
              0 ? (
                <div className="table-card-styled tableOne mt-3">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th>
                          <p className="" style={thStyles}>
                            Income Head
                          </p>
                        </th>
                        <th colSpan="3" style={{ textAlign: "right" }}>
                          <p style={thStyles}>Amount in BDT</p>
                        </th>
                      </tr>
                      <tr>
                        <th>
                          <p style={thStyles} className="">
                            A. Benefits:
                          </p>
                        </th>
                        <th colSpan="3">
                          <p style={thStyles}></p>
                        </th>
                      </tr>

                      {salaryTaxCertificateInformation?.payrollElementVMs?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>
                              <p>{item?.payrollElement}</p>
                            </td>
                            <td colSpan="3" style={{ textAlign: "right" }}>
                              <p>{item?.numAmount}</p>
                            </td>
                          </tr>
                        )
                      )}
                      <tr>
                        <td>
                          <p>Festival Allowance</p>
                        </td>
                        <td colSpan="3" style={{ textAlign: "right" }}>
                          <p>
                            {salaryTaxCertificateInformation?.festivalAmount}
                          </p>
                        </td>
                      </tr>
                      {/* <tr>
                        <td>
                          <p>Overtime</p>
                        </td>
                        <td colSpan="3" style={{ textAlign: "right" }}>
                          <p>{salaryHeaderData[0]?.numOverTimeAmount || 0}</p>
                        </td>
                      </tr> */}

                      <tr>
                        <th>
                          <p style={thStyles} className="">
                            Total benefits
                          </p>
                        </th>
                        <th style={{ textAlign: "right" }}>
                          <p style={thStyles}>
                            {salaryTaxCertificateInformation?.totalBenefit}
                          </p>
                        </th>
                      </tr>

                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <p>Tax</p>
                        </td>
                        <td style={{ textAlign: "right" }} colSpan="3">
                          <p>{salaryTaxCertificateInformation?.taxAmount}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <NoResult />
              )}
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default SalaryTaxCertificate;
const thStyles = {
  fontWeight: 600,
  fontSize: "12px !important",
  lineHeight: "18px !important",
  color: `${gray600} !important`,
};
