import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AvatarComponent from "../../../common/AvatarComponent";
import BackButton from "../../../common/BackButton";
import FormikRadio from "../../../common/FormikRadio";
import PrimaryButton from "../../../common/PrimaryButton";
import ScrollableTable from "../../../common/ScrollableTable";
import Loading from "../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { greenColor } from "../../../utility/customColor";
import { downloadFile, getPDFAction } from "../../../utility/downloadFile";
import { getRowTotal } from "../../../utility/getRowTotal";
import { getMonthName } from "../../../utility/monthUtility";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { getSalaryDetailsReportRDLC } from "../reports/salaryDetailsReport/helper";
import { generateExcelAction } from "../reports/salaryReport/excel/allSalaryExcel";
import {
  allSalaryExcelColumn,
  allSalaryExcelData,
} from "../reports/salaryReport/utility/excelColum";
import HeaderInfoBar from "./components/HeaderInfoBar";
import {
  getSalaryGenerateRequestById,
  salaryGenerateApproveReject,
} from "./helper";
import { getBuDetails } from "common/api";

const initData = {
  search: "",
  salaryType: "",
  summary: "1",
};

const validationSchema = Yup.object({});

const SalaryGenerateView = () => {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();

  // redux
  const { employeeId, isOfficeAdmin, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [allData, setAllData] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalAllowance, setTotalAllowance] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalNetPay, setTotalNetPay] = useState(0);
  const [totalBankPay, setTotalBankPay] = useState(0);
  const [totalDBPay, setTotalDBPay] = useState(0);
  const [totalCashPay, setTotalCashPay] = useState(0);
  const [buDetails, setBuDetails] = useState({});

  // const [tableAllowanceHead, setTableAllowanceHead] = useState([]);
  // const [tableDeductionHead, setTableDeductionHead] = useState([]);
  // const [tableColumn, setTableColumn] = useState([]);

  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [totalAttendence, setTotalAttendence] = useState(0);
  // const [resDetailsReport, setDetailsReport] = useState([]);

  const month = getMonthName(state?.intMonth);
  const year = state?.intYear;
  const monthYear = `${month}, ${year}`;

  const { values, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    validationSchema: validationSchema,
    onSubmit: () => {
      // saveHandler();
    },
  });

  useEffect(() => {
    if (rowDto.length > 0) {
      setTotalSalary(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.GrossSalary || 0, 0)
            .toFixed(2)
        )
      );
      setTotalAllowance(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.TotalAllowance || 0, 0)
            .toFixed(2)
        )
      );
      setTotalDeduction(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.TotalDeduction || 0, 0)
            .toFixed(2)
        )
      );
      setTotalNetPay(
        Number(
          rowDto?.reduce((acc, item) => acc + item?.NetPay || 0, 0).toFixed(2)
        )
      );
      setTotalBankPay(
        Number(
          rowDto?.reduce((acc, item) => acc + item?.BankPay || 0, 0).toFixed(2)
        )
      );
      setTotalDBPay(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.DegitalBankPay || 0, 0)
            .toFixed(2)
        )
      );
      setTotalCashPay(
        Number(
          rowDto?.reduce((acc, item) => acc + item?.CashPay || 0, 0).toFixed(2)
        )
      );
      setTotalWorkingDays(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.TotalWorkingDays || 0, 0)
            .toFixed(2)
        )
      );
      setTotalAttendence(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.PayableDays || 0, 0)
            .toFixed(2)
        )
      );
    }
  }, [rowDto]);

  const {
    intAccountId,
    intBusinessUnitId,
    intMonth,
    intYear,
    intSalaryGenerateRequestId,
  } = !state?.data ? state : state?.data;

  // let saveHandler = () => {};

  const getData = () => {
    getSalaryGenerateRequestById(
      intAccountId,
      intBusinessUnitId,
      intMonth,
      intYear,
      intSalaryGenerateRequestId,
      setRowDto,
      setAllData,
      setLoading,
      wgId
    );
  };

  useEffect(() => {
    getData();
    getBuDetails(buId, setBuDetails, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveNRejectHandler = (text) => {
    const payload = [
      {
        applicationId: intSalaryGenerateRequestId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];
    const callback = () => {
      history.push("/approval/salaryGenerateApproval");
    };
    salaryGenerateApproveReject(payload, callback);
  };

  // excel column set up
  const excelColumnFunc = (processId) => {
    switch (processId) {
      default:
        return allSalaryExcelColumn;
    }
  };

  // excel data set up
  const excelDataFunc = (processId) => {
    switch (processId) {
      default:
        return allSalaryExcelData(rowDto);
    }
  };

  const getDetailsReport = (partName) => {
    /*   getSalaryReport(
        "DynamicSalaryColumnList",
        orgId,
        buId,
        wgId,
        !state?.data ? state?.intMonth : state?.data?.intMonth, // values?.monthId,
        !state?.data ? state?.intYear : state?.data?.intYear, // values?.yearId,
        !state?.data ? state?.strSalaryCode : state?.data?.strSalaryCode, // values?.yearId,
        +id,
        0,
        employeeId,
        setDetailsReport,
        setAllData,
        setTableColumn,
        setLoading,
        setTableAllowanceHead,
        setTableDeductionHead
      ); */
    if (!detailsData?.length > 0) {
      const parameter = {
        partName: partName,
        intMonthId: !state?.data ? state?.intMonth : state?.data?.intMonth,
        intYearId: !state?.data ? state?.intYear : state?.data?.intYear,
        strSalaryCode: !state?.data
          ? state?.strSalaryCode
          : state?.data?.strSalaryCode,
        intAccountId: orgId,
        setLoading: setDetailsReportLoading,
        buId,
        setterData: setDetailsData,
        wgId,
        url: `/PdfAndExcelReport/GetSalaryLandingData_Matador?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
          !state?.data ? state?.intMonth : state?.data?.intMonth
        }&intYearId=${
          !state?.data ? state?.intYear : state?.data?.intYear
        }&strSalaryCode=${
          !state?.data ? state?.strSalaryCode : state?.data?.strSalaryCode
        }`,
      };
      getSalaryDetailsReportRDLC(parameter);
    }
  };

  const totalEmpLOnSalarySheet = useMemo(() => {
    return rowDto.reduce((accumulator, currentValue) => {
      if (currentValue["SalaryGenerateHeaderId"] !== null) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);
  }, [rowDto]);

  const [detailsData, setDetailsData] = useState("");
  const [detailsReportLoading, setDetailsReportLoading] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      {(loading || detailsReportLoading) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <BackButton title={"Salary Generate View"} />
          {!!state?.isApproval && (
            <div className="table-card-head-right d-flex justify-content-center align-items-center">
              <PrimaryButton
                type="button"
                className="btn btn-green btn-green-less border mr-2"
                label={"Declined"}
                onClick={() => {
                  approveNRejectHandler("Reject");
                }}
              />
              <PrimaryButton
                type="button"
                className="btn btn-green"
                label={"Approve"}
                onClick={() => {
                  approveNRejectHandler("isApproved");
                }}
              />
            </div>
          )}
        </div>
        <div className="table-card-body" style={{ overflow: "hidden" }}>
          <div className="table-card-styled">
            <HeaderInfoBar
              data={!state?.data ? state : state?.data}
              setLoading={setLoading}
            />
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ minWidth: "300px" }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#344054",
                    }}
                  >
                    Employee List
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#667085",
                    }}
                  >
                    Total employee {totalEmpLOnSalarySheet}
                  </p>
                </div>
                <div>
                  <div className="row ml-1" style={{ minWidth: "300px" }}>
                    <div className="col-md-3">
                      <div className="input-field-main">
                        <FormikRadio
                          styleobj={{
                            iconWidth: "15px",
                            icoHeight: "15px",
                            padding: "0px 8px 0px 10px",
                            checkedColor: greenColor,
                          }}
                          name="summary"
                          label="Summary"
                          value={"1"}
                          onChange={(e) => {
                            setFieldValue("summary", e.target.value);
                          }}
                          checked={values?.summary === "1"}
                        />
                      </div>
                    </div>
                    {/* {(state?.ApprovalStatus !== "Send for Approval") && ( */}
                    <div className="col-md-3 ml-4">
                      <div className="input-field-main">
                        <FormikRadio
                          styleobj={{
                            iconWidth: "15px",
                            icoHeight: "15px",
                            padding: "0px 8px 0px 10px",
                          }}
                          name="summary"
                          label="Details"
                          value={"2"}
                          onChange={(e) => {
                            setFieldValue("summary", e.target.value);
                            getDetailsReport("GetSalaryLandingData");
                          }}
                          checked={values?.summary === "2"}
                        />
                      </div>
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>

              <div>
                <ul className="d-flex flex-wrap align-items-center justify-content-center">
                  <li className="pr-2">
                    <Tooltip title="Download the salary report as Excel" arrow>
                      <button
                        className="btn-save"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (values?.summary === "1") {
                            if (!rowDto?.length > 0) {
                              return toast.warn("No Data Found");
                            }
                            generateExcelAction(
                              "Salary Generate",
                              "",
                              "",
                              excelColumnFunc(0),
                              excelDataFunc(0),
                              buDetails?.strBusinessUnit,
                              0,
                              rowDto,
                              buDetails?.strBusinessUnitAddress,
                              totalSalary,
                              totalAllowance,
                              totalDeduction,
                              totalNetPay,
                              totalBankPay,
                              totalDBPay,
                              totalCashPay,
                              monthYear,
                              totalWorkingDays,
                              totalAttendence
                            );
                          } else {
                            if (detailsData?.length <= 0) {
                              return toast.warn("No Data Found");
                            }
                            /*    createSalaryDetailsReportExcelHandeler({
                              monthYear: moment(values?.monthYear).format(
                                "MMMM-YYYY"
                              ),
                              buAddress: buDetails?.strBusinessUnitAddress,
                              businessUnit: !state?.data
                                ? state?.strBusinessUnit
                                : state?.data?.strBusinessUnit,
                              data: resDetailsReport,
                              tableColumn,
                              tableAllowanceHead,
                              tableDeductionHead,
                            }); */
                            const url = `/PdfAndExcelReport/GetSalaryLandingData_Matador_Excel?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
                              !state?.data ? state?.intMonth : state?.data?.intMonth
                            }&intYearId=${
                              !state?.data ? state?.intYear : state?.data?.intYear
                            }&strSalaryCode=${
                              !state?.data ? state?.strSalaryCode : state?.data?.strSalaryCode
                            }`
                            downloadFile(
                              url,
                              "Salary Details Report",
                              "xlsx",
                              setLoading
                            );
                          }
                        }}
                        // disabled={resDetailsReport?.length <= 0}
                        style={{
                          border: "transparent",
                          width: "30px",
                          height: "30px",
                          background: "#f2f2f7",
                          borderRadius: "100px",
                        }}
                      >
                        <DownloadIcon
                          sx={{
                            color: "#101828",
                            fontSize: "16px",
                          }}
                        />
                      </button>
                    </Tooltip>
                  </li>
                  {values?.summary === "2" && (
                    <Tooltip title="Print as PDF" arrow>
                      <button
                        className="btn-save"
                        type="button"
                        onClick={() => {
                          /*      getPDFAction(
                            `/PdfAndExcelReport/SalaryDetailsReport?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
                              !state?.data
                                ? state?.intMonth
                                : state?.data?.intMonth
                            }&intYearId=${
                              !state?.data
                                ? state?.intYear
                                : state?.data?.intYear
                            }&strSalaryCode=${
                              !state?.data
                                ? state?.strSalaryCode
                                : state?.data?.strSalaryCode
                            }&isDownload=false`,
                            setLoading
                          ); */

                          if (detailsData?.length <= 0) {
                            return toast.warn("No Data Found");
                          } else {
                            const url = `/PdfAndExcelReport/GetSalaryLandingData_Matador_PDF?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
                              !state?.data ? state?.intMonth : state?.data?.intMonth
                            }&intYearId=${
                              !state?.data ? state?.intYear : state?.data?.intYear
                            }&strSalaryCode=${
                              !state?.data ? state?.strSalaryCode : state?.data?.strSalaryCode
                            }`
                          
                            getPDFAction(
                              url,
                              setLoading
                            );
                          }
                        }}
                        // disabled={resDetailsReport?.length <= 0}
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
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div>
            {values?.summary === "1" && (
              <ScrollableTable
                classes="salary-process-table"
                secondClasses="table-card-styled tableOne scroll-table-height"
                customClass="salary-summary-custom"
              >
                <thead>
                  <tr>
                    <th rowSpan="2" style={{ minWidth: "200px" }}>
                      SL
                    </th>
                    <th colSpan={3} className="text-center">
                      Employee Information
                    </th>
                    <th style={{ textAlign: "right" }} className="mr-2">
                      Gross Salary
                    </th>
                    <th style={{ textAlign: "right" }} className=" mr-2">
                      Total Allowance
                    </th>
                    <th style={{ textAlign: "right" }} className="mr-2">
                      Total Deduction
                    </th>
                    <th
                      style={{ textAlign: "right" }}
                      className="th-inner-table mr-2"
                    >
                      Net Pay
                    </th>
                    <th style={{ textAlign: "right" }} className=" mr-2">
                      Bank Pay
                    </th>
                    <th style={{ textAlign: "right" }} className="mr-2">
                      Digital Bank Pay
                    </th>
                    <th style={{ textAlign: "right" }} className="mr-2">
                      Cash Pay
                    </th>
                    <th colSpan={2} className="text-center">
                      Attendance
                    </th>
                    <th rowSpan="2">Workplace</th>
                    <th rowSpan="2">Workplace Group</th>
                    <th rowSpan="2">Payroll Group</th>
                  </tr>
                  <tr>
                    <th className="text-center" style={{ minWidth: "122px" }}>
                      Employee ID
                    </th>
                    <th className="text-center">Employee Name</th>
                    <th className="text-center">Designation</th>
                    <th className="text-right">
                      {numberWithCommas(
                        getRowTotal(rowDto, "GrossSalary").toFixed(2)
                      )}
                    </th>
                    <th className="text-right">
                      {" "}
                      {numberWithCommas(
                        getRowTotal(rowDto, "TotalAllowance").toFixed(2)
                      )}
                    </th>
                    <th className="text-right">
                      {" "}
                      {numberWithCommas(
                        getRowTotal(rowDto, "TotalDeduction").toFixed(2)
                      )}
                    </th>
                    <th className="text-right">
                      {" "}
                      {numberWithCommas(
                        getRowTotal(rowDto, "NetPay").toFixed(2)
                      )}
                    </th>
                    <th className="text-right">
                      {numberWithCommas(
                        getRowTotal(rowDto, "BankPay").toFixed(2)
                      )}
                    </th>
                    <th className="text-right">
                      {" "}
                      {numberWithCommas(
                        getRowTotal(rowDto, "DegitalBankPay").toFixed(2)
                      )}
                    </th>
                    <th className="text-right">
                      {" "}
                      {numberWithCommas(
                        getRowTotal(rowDto, "CashPay").toFixed(2)
                      )}
                    </th>
                    <th className="text-center">Total Working Days</th>
                    <th className="text-center">Total Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index} colSpan={!item?.DeptName?.trim() ? 16 : 1}>
                      {/* <td>{item?.SL}</td> */}
                      <td>
                        {item?.DeptName?.trim() ? (
                          <b>Depertment: {item?.DeptName}</b>
                        ) : (
                          <>{item?.SL}</>
                        )}
                      </td>
                      {!item?.DeptName?.trim() && (
                        <>
                          <td>{item?.EmployeeCode}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="emp-avatar">
                                <AvatarComponent
                                  classess=""
                                  letterCount={1}
                                  label={item?.EmployeeName}
                                />
                              </div>
                              <div className="ml-2">
                                <span className="tableBody-title">
                                  {item?.EmployeeName}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{item?.DesignationName}</td>
                          <td style={{ textAlign: "right" }}>
                            {numberWithCommas(item?.GrossSalary) || "-"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {numberWithCommas(item?.TotalAllowance) || "-"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {numberWithCommas(item?.TotalDeduction) || "-"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {numberWithCommas(item?.NetPay) || "-"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {numberWithCommas(item?.BankPay) || "-"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {numberWithCommas(item?.DegitalBankPay) || "-"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {numberWithCommas(item?.CashPay) || "-"}
                          </td>
                          <td>{item?.TotalWorkingDays}</td>
                          <td>{item?.PayableDays}</td>
                          <td>{item?.WorkplaceName}</td>
                          <td>{item?.WorkplaceGroupName}</td>
                          <td>{item?.PayrollGroupName}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </ScrollableTable>
            )}
            {values?.summary === "2" && (
              <>
                {/* <SalaryDetailsReportTable
                  rowDto={resDetailsReport}
                  tableColumn={tableColumn}
                  tableAllowanceHead={tableAllowanceHead}
                  tableDeductionHead={tableDeductionHead}
                /> */}
                <div className="sme-scrollable-table">
                  <div
                    className="scroll-table scroll-table-height"
                    dangerouslySetInnerHTML={{ __html: detailsData }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
export default SalaryGenerateView;
