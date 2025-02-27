import { Download } from "@mui/icons-material";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DefaultInput from "../../../../common/DefaultInput";
import NoResult from "../../../../common/NoResult";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../../utility/customColor";
import { getMonthName } from "../../../../utility/monthIdToMonthName";
import { getReconciliationReportRDLC } from "./helper";
import { downloadFile, getPDFAction } from "../../../../utility/downloadFile";

const initData = {
  search: "",
  monthYear: moment().format("YYYY-MM"),
  monthId: new Date().getMonth() + 1,
  yearId: new Date().getFullYear(),
};

export default function SalaryDetailsReport() {
  const dispatch = useDispatch();

  const { orgId, buId, wId, wgId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Reconciliation Report";
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30527) {
      permission = item;
    }
  });

  // state define
  const [loading, setLoading] = useState(false);
  const [detailsData, setDetailsData] = useState("");

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

  const [detailsReportLoading, setDetailsReportLoading] = useState(false);

  const saveHandler = (values) => {
    const payload = {
      salaryMonth: values.monthId || 0,
      salaryYear: values.yearId || 0,
      intAccountId: orgId,
      intbusinessUnitId: buId,
      workplaceGroupId: wgId,
      workplaceId: wId,
      departmentId: values.departmentId || 0,
      format: "html",
    };

    getReconciliationReportRDLC({
      setLoading: setDetailsReportLoading,
      setterData: setDetailsData,
      url: `/PdfAndExcelReport/DownloadSalaryReconciliationReport`,
      payload,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {(loading || detailsReportLoading) && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <h2>Reconciliation Report</h2>
            </div>
            <div className="table-card-body">
              <div
                className="card-style"
                style={{ margin: "14px 0px 12px 0px" }}
              >
                <div className="row">
                  <div className="col-lg-3">
                    <div className="input-field-main">
                      <label>Salary Month</label>
                      <DefaultInput
                        classes="input-sm"
                        placeholder=" "
                        value={values?.monthYear}
                        name="monthYear"
                        type="month"
                        onChange={(e) => {
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
                          setDetailsData("");
                        }}
                        errors={errors}
                        touched={touched}
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
                        disabled={!values?.monthYear}
                      >
                        View
                      </button>
                      {detailsData?.length > 0 && (
                        <button
                          style={{
                            marginTop: "23px",
                            padding: "0px 10px",
                          }}
                          className="btn btn-green btn-green-disable mt-4 ml-2"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailsData("");
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
                  {detailsData?.length > 0 && (
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
                {detailsData?.length > 0 && (
                  <ul className="d-flex flex-wrap align-items-center justify-content-center">
                    <li style={{ cursor: "pointer" }} className="pr-2">
                      <Tooltip title="Export CSV" arrow>
                        <button
                          className="btn-save"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            const payload = {
                              salaryMonth: values.monthId || 0,
                              salaryYear: values.yearId || 0,
                              intAccountId: orgId,
                              intbusinessUnitId: buId,
                              workplaceGroupId: wgId,
                              workplaceId: wId,
                              departmentId: values.departmentId || 0,
                              format: "excel",
                            };

                            const url = `/PdfAndExcelReport/DownloadSalaryReconciliationReport`;
                            downloadFile(
                              url,
                              "Reconciliation Report",
                              "xlsx",
                              setLoading,
                              "POST",
                              payload
                            );
                          }}
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
                          if (detailsData?.length <= 0) {
                            return toast.warn("No Data Found");
                          } else {
                            const payload = {
                              salaryMonth: values.monthId || 0,
                              salaryYear: values.yearId || 0,
                              intAccountId: orgId,
                              intbusinessUnitId: buId,
                              workplaceGroupId: wgId,
                              workplaceId: wId,
                              departmentId: values.departmentId || 0,
                              format: "pdf",
                            };

                            const url = `/PdfAndExcelReport/DownloadSalaryReconciliationReport`;

                            getPDFAction(
                              url,
                              setLoading,
                              "Reconciliation Report",
                              "POST",
                              payload
                            );
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
              {detailsData?.length > 0 ? (
                <div className="sme-scrollable-table">
                  <div
                    className="scroll-table scroll-table-height"
                    dangerouslySetInnerHTML={{ __html: detailsData }}
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
