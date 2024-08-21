import { Download } from "@mui/icons-material";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import NoResult from "../../../../common/NoResult";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/newSelectCustomStyle";
import { getMonthName } from "./../../../../utility/monthIdToMonthName";
import { getSalaryDetailsReportRDLC } from "./helper";
import { downloadFile, getPDFAction } from "../../../../utility/downloadFile";

const initData = {
  search: "",
  businessUnit: "",
  payrollPolicy: "",
  monthYear: moment().format("YYYY-MM"),
  monthId: new Date().getMonth() + 1,
  yearId: new Date().getFullYear(),
};

export default function SalaryDetailsReport() {
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId, buName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Salary Requisition Report";
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 82) {
      permission = item;
    }
  });

  // state define
  const [loading, setLoading] = useState(false);
  // DDl section
  const [payrollPolicyDDL, setPayrollPolicyDDL] = useState([]);

  // useFormik hooks
  const {
    values,
    errors,
    touched,
    handleSubmit,
    setValues,
    setFieldValue,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values) => saveHandler(values),
  });

  const [requisitionData, setRequisitionData] = useState("");
  const [requisitionReportLoading, setRequisitionReportLoading] =
    useState(false);
  // on form submit
  const saveHandler = (values) => {
    getSalaryDetailsReportRDLC({
      setLoading: setRequisitionReportLoading,
      setterData: setRequisitionData,
      url: `/PdfAndExcelReport/GetSalaryRequisitionReport_Matador?strPartName=htmlView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&strSalaryCode=${values?.payrollPolicy?.value}`,
    });
  };

  useEffect(() => {
    if (values?.monthId || values?.yearId) {
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriod&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
        "SalaryCode",
        "SalaryCode",
        setPayrollPolicyDDL
      );
    }
  }, [wgId, buId, employeeId, values.monthId, values?.yearId, wId]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        {(loading || requisitionReportLoading) && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <h2>Salary Requisition Report</h2>
            </div>
            <div className="table-card-body">
              <div
                className="card-style"
                style={{ margin: "14px 0px 12px 0px" }}
              >
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Payroll Month</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.monthYear}
                        name="monthYear"
                        type="month"
                        onChange={(e) => {
                          if (buId || values?.monthId || values?.yearId) {
                            getPeopleDeskAllDDL(
                              `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriod&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&IntMonth=${+e.target.value
                                .split("")
                                .slice(-2)
                                .join("")}&IntYear=${+e.target.value
                                .split("")
                                .slice(0, 4)
                                .join("")}`,
                              "SalaryCode",
                              "SalaryCode",
                              setPayrollPolicyDDL
                            );
                          }
                          setValues((prev) => ({
                            ...prev,
                            yearId: +e.target.value
                              .split("")
                              .slice(0, 4)
                              .join(""),
                            monthId: +e.target.value
                              .split("")
                              .slice(-2)
                              .join(""),
                            monthYear: e.target.value,
                          }));
                          setRequisitionData("");
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Salary Code</label>
                      <FormikSelect
                        name="payrollPolicy"
                        options={[...payrollPolicyDDL] || []}
                        value={values?.payrollPolicy}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            payrollPolicy: valueOption,
                          }));
                          setRequisitionData("");
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.monthId || !values?.yearId}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="d-flex align-items-center">
                      <button
                        style={{
                          padding: "0px 10px",
                        }}
                        className="btn btn-green btn-green-disable mt-4"
                        type="submit"
                        disabled={!values?.payrollPolicy}
                      >
                        View
                      </button>
                      {requisitionData?.length > 0 && (
                        <button
                          style={{
                            marginTop: "23px",
                            padding: "0px 10px",
                          }}
                          className="btn btn-green btn-green-disable mt-4 ml-2"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRequisitionData("");
                            setFieldValue("search", "");
                            resetForm(initData);
                          }}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-card-body" style={{ overflow: "hidden" }}>
              <div
                className="table-card-heading"
                style={{ marginBottom: "12px" }}
              >
                <div className="d-flex align-center-center">
                  {requisitionData?.length > 0 && (
                    <div>
                      <h2>Business Unit: {buName || "N/A"}</h2>
                      <div className="single-info">
                        <p style={{ fontWeight: "400", color: gray500 }}>
                          Salary report of{" "}
                          {`${getMonthName(values?.monthId)},${values?.yearId}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {requisitionData?.length > 0 && (
                  <ul className="d-flex flex-wrap align-items-center justify-content-center">
                    <li style={{ cursor: "pointer" }} className="pr-2">
                      <Tooltip title="Export CSV" arrow>
                        <button
                          className="btn-save"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            if (requisitionData?.length <= 0) {
                              return toast.warn("No Data Found");
                            }
                            const url = `/PdfAndExcelReport/GetSalaryRequisitionReport_Matador?strPartName=excelView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&strSalaryCode=${values?.payrollPolicy?.value}`;
                            downloadFile(
                              url,
                              "Salary Details Report",
                              "xlsx",
                              setLoading
                            );
                          }}
                          // disabled={requisitionData?.length <= 0}
                          style={{
                            border: "transparent",
                            width: "30px",
                            height: "30px",
                            background: "#f2f2f7",
                            borderRadius: "100px",
                          }}
                        >
                          <Download
                            sx={{
                              color: "#101828",
                              fontSize: "16px",
                            }}
                          />
                        </button>
                      </Tooltip>
                    </li>
                    <Tooltip title="Print" arrow>
                      <button
                        className="btn-save"
                        type="button"
                        onClick={() => {
                          if (requisitionData?.length <= 0) {
                            return toast.warn("No Data Found");
                          } else {
                            const url = `/PdfAndExcelReport/GetSalaryRequisitionReport_Matador?strPartName=pdfView&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&strSalaryCode=${values?.payrollPolicy?.value}`;

                            getPDFAction(url, setLoading);
                          }
                        }}
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
                            color: "#101828",
                            fontSize: "16px",
                          }}
                        />
                      </button>
                    </Tooltip>
                  </ul>
                )}
              </div>
            </div>
            <div className="table-card-body">
              {requisitionData?.length > 0 ? (
                <div className="sme-scrollable-table">
                  <div
                    className="scroll-table scroll-table-height"
                    dangerouslySetInnerHTML={{ __html: requisitionData }}
                  ></div>
                </div>
              ) : (
                <NoResult title="No Result Found" para="" />
              )}
            </div>
          </div>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
