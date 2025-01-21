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
import { gray500, gray600, success500 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/newSelectCustomStyle";
import { getMonthName } from "./../../../../utility/monthIdToMonthName";
import { getSalaryDetailsReportRDLC } from "./helper";
import { downloadFile, getPDFAction } from "../../../../utility/downloadFile";
import axios from "axios";
import { isDevServer } from "App";

const initData = {
  search: "",
  businessUnit: "",
  payrollPolicy: "",
  paymentType: "",
  hrPosition: "",
  monthYear: moment().format("YYYY-MM"),
  monthId: new Date().getMonth() + 1,
  yearId: new Date().getFullYear(),
};

export default function SalaryDetailsReport() {
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Salary Details Report";
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
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [allData, setAllData] = useState([]);
  const [tableColumn, setTableColumn] = useState([]);
  const [tableAllowanceHead, setTableAllowanceHead] = useState([]);
  const [tableDeductionHead, setTableDeductionHead] = useState([]);
  // DDl section
  const [payrollPolicyDDL, setPayrollPolicyDDL] = useState([]);
  const [hrPositionDDL, setHrPositionDDL] = useState([]);

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

  const [detailsData, setDetailsData] = useState("");
  const [detailsReportLoading, setDetailsReportLoading] = useState(false);
  // on form submit
  const saveHandler = (values) => {
    const hrPositions =
      values?.hrPosition?.length > 0
        ? `&strHrPositionList=${values?.hrPosition?.map((i) => i.id)}`
        : "";
    const payment =
      values?.paymentType?.value > 0
        ? `&intPaymentMethod=${values?.paymentType?.value}`
        : "";
    getSalaryDetailsReportRDLC({
      setLoading: setDetailsReportLoading,
      setterData: setDetailsData,
      url: `/PdfAndExcelReport/GetSalaryLandingData_Matador?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&strSalaryCode=${values?.payrollPolicy?.value}${hrPositions}${payment}`,
    });
  };
  const getHrPosition = async (values, op) => {
    setLoading && setLoading(true);
    const api = `/Payroll/SalarySelectQueryAll?partName=HrPositionListBySalaryCode&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&strSalaryCode=${op?.value}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}`;

    try {
      const res = await axios.get(api);
      if (res?.data) {
        const data = res?.data?.map((item) => {
          return {
            value: item?.intWorkplaceId,
            label: `${item?.strHrPosition}-${item?.strWorkplaceName}`,
          };
        });
        setHrPositionDDL(data);
      }
      setLoading(false);
    } catch (error) {
      isDevServer && console.log(error);
      setLoading && setLoading(false);
    }
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
  }, [wgId, buId, employeeId, values.monthId, values?.yearId]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        {(loading || detailsReportLoading) && <Loading />}
        {permission?.isView ? (
          <div className="table-card">
            <div className="table-card-heading">
              <h2>Salary Details Report</h2>
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
                          setRowDto([]);
                          setDetailsData("");
                          setAllData([]);
                          setTableColumn([]);
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
                          setFieldValue("payrollPolicy", valueOption);
                          setRowDto([]);
                          setDetailsData("");
                          getHrPosition(values, valueOption);
                          getSalaryDetailsReportRDLC({
                            setLoading: setDetailsReportLoading,
                            setterData: setDetailsData,
                            url: `/PdfAndExcelReport/GetSalaryLandingData_Matador?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&strSalaryCode=${valueOption?.value}`,
                          });
                          setAllData([]);
                          setTableColumn([]);
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.monthId || !values?.yearId}
                      />
                    </div>
                  </div>

                  {values?.payrollPolicy?.value ? (
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Hr Positoin</label>
                        <FormikSelect
                          placeholder=" "
                          classes="input-sm"
                          styles={{
                            ...customStyles,
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "auto",
                              height:
                                values?.hrPosition?.length > 1
                                  ? "auto"
                                  : "30px",
                              borderRadius: "4px",
                              boxShadow: `${success500}!important`,
                              ":hover": {
                                borderColor: `${gray600}!important`,
                              },
                              ":focus": {
                                borderColor: `${gray600}!important`,
                              },
                            }),
                            valueContainer: (provided, state) => ({
                              ...provided,
                              height:
                                values?.department?.length > 1
                                  ? "auto"
                                  : "30px",
                              padding: "0 6px",
                            }),
                            multiValue: (styles) => {
                              return {
                                ...styles,
                                position: "relative",
                                top: "-1px",
                              };
                            },
                            multiValueLabel: (styles) => ({
                              ...styles,
                              padding: "0",
                            }),
                          }}
                          name="hrPosition"
                          options={hrPositionDDL || []}
                          value={values?.hrPosition}
                          onChange={(valueOption) => {
                            setFieldValue("hrPosition", valueOption);
                          }}
                          isMulti
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  ) : null}
                  {values?.payrollPolicy?.value ? (
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Payment Method </label>
                        <FormikSelect
                          name="paymentType"
                          options={[
                            { value: 1, label: "Bank" },
                            { value: 3, label: "Cash" },
                            { value: 2, label: "Digital" },
                          ]}
                          value={values?.paymentType}
                          onChange={(valueOption) => {
                            setValues((prev) => ({
                              ...prev,
                              paymentType: valueOption,
                            }));
                          }}
                          placeholder=""
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  ) : null}

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
                            setRowDto([]);
                            setDetailsData("");
                            setAllData([]);
                            setTableColumn([]);
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
                            // if (!rowDto?.length > 0) {
                            //   return toast.warn("No Data Found");
                            // }
                            // createSalaryDetailsReportExcelHandeler({
                            //   monthYear: moment(values?.monthYear).format(
                            //     "MMMM-YYYY"
                            //   ),
                            //   buAddress:
                            //     businessUnitDDL[0]?.BusinessUnitAddress,
                            //   businessUnit:
                            //     buName || values?.businessUnit?.label,
                            //   data: rowDto,
                            //   tableColumn,
                            //   tableAllowanceHead,
                            //   tableDeductionHead,
                            // });
                            if (detailsData?.length <= 0) {
                              return toast.warn("No Data Found");
                            }
                            const hrPositions =
                              values?.hrPosition?.length > 0
                                ? `&strHrPositionList=${values?.hrPosition?.map(
                                    (i) => i.id
                                  )}`
                                : "";
                            const payment =
                              values?.paymentType?.value > 0
                                ? `&intPaymentMethod=${values?.paymentType?.value}`
                                : "";
                            const url = `/PdfAndExcelReport/GetSalaryLandingData_Matador_Excel?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&strSalaryCode=${values?.payrollPolicy?.value}${hrPositions}${payment}`;
                            downloadFile(
                              url,
                              "Salary Details Report",
                              "xlsx",
                              setLoading
                            );
                          }}
                          // disabled={detailsData?.length <= 0}
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
                          // getPDFAction(
                          //   `/PdfAndExcelReport/SalaryDetailsReport?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&strSalaryCode=${values?.payrollPolicy?.value}`,
                          //   setLoading
                          // );
                          if (detailsData?.length <= 0) {
                            return toast.warn("No Data Found");
                          } else {
                            const hrPositions =
                              values?.hrPosition?.length > 0
                                ? `&strHrPositionList=${values?.hrPosition?.map(
                                    (i) => i.id
                                  )}`
                                : "";
                            const payment =
                              values?.paymentType?.value > 0
                                ? `&intPaymentMethod=${values?.paymentType?.value}`
                                : "";
                            const url = `/PdfAndExcelReport/GetSalaryLandingData_Matador_PDF?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${values?.monthId}&intYearId=${values?.yearId}&strSalaryCode=${values?.payrollPolicy?.value}${hrPositions}${payment}`;

                            getPDFAction(url, setLoading);
                          }
                        }}
                        // disabled={detailsData?.length <= 0}
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
              {/* {rowDto?.length > 0 ? (
                <>
                  <SalaryDetailsReportTable
                    rowDto={rowDto}
                    tableColumn={tableColumn}
                    tableAllowanceHead={tableAllowanceHead}
                    tableDeductionHead={tableDeductionHead}
                  />
                </>
              ) : (
                <>{!loading && <NoResult title="No Result Found" para="" />}</>
              )} */}

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
