import { Download, SearchOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import BackButton from "../../../../common/BackButton";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray500, gray900 } from "../../../../utility/customColor";
import AllSalaryReport from "./components/allSalaryReport";
import BankSalaryReport from "./components/bankSalaryReport";
import CashSalaryReport from "./components/cashSalaryReport";
import DigitalBankingSalaryReport from "./components/digitalbankingSalaryReport";
import HeaderInfoBar from "./components/HeaderInfoBar";
import { getBuDetails, getSalaryReport } from "./helper";
import { generateExcelAction } from "./reportExl/allSalaryExcel";
import {
  allSalaryExcelColumn,
  allSalaryExcelData,
  bankSalaryExcelColumn,
  bankSalaryExcelData,
  cashSalaryExcelColumn,
  cashSalaryExcelData,
  digitalBankingSalaryExcelColumn,
  digitalBankingSalaryExcelData,
} from "./utility/excelColum";
import { getMonthName } from "../../../../utility/monthUtility";
import { useMemo } from "react";
// import { getPDFAction } from "../../../../utility/downloadFile";

const initData = {
  search: "",
  status: "",
};

export default function SingleSalaryReport() {
  const dispatch = useDispatch();
  const { state } = useLocation();

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 81) {
      permission = item;
    }
  });

  // state define
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalAllowance, setTotalAllowance] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalNetPay, setTotalNetPay] = useState(0);
  const [totalBankPay, setTotalBankPay] = useState(0);
  const [totalDBPay, setTotalDBPay] = useState(0);
  const [totalCashPay, setTotalCashPay] = useState(0);
  const [filterIndex, setFilterIndex] = useState(0);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [totalAttendence, setTotalAttendence] = useState(0);
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

  const tabName = [
    { name: "All", noLeftRadius: false, noRadius: false },
    { name: "Bank", noLeftRadius: false, noRadius: true },
    { name: "Digital Banking", noLeftRadius: false, noRadius: true },
    { name: "Cash", noLeftRadius: true, noRadius: false },
  ];

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state?.intSalaryGenerateRequestId) {
      getSalaryReport(
        // "GeneratedSalaryReportHeaderLanding",
        "GeneratedSalaryReportHeaderLandingGroupByDepartment",
        orgId,
        state?.intBusinessUnitId,
        wgId,
        state?.intMonth,
        state?.intYear,
        "",
        "",
        state?.intSalaryGenerateRequestId,
        0,
        setRowDto,
        setAllData,
        setLoading
      );
    }
    getBuDetails(buId, setBuDetails, setLoading);
  }, [state, orgId, buId, wgId]);

  // search
  const filterData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.intEmployeeId?.toString()?.toLowerCase()) ||
          regex.test(item?.strEmployeeCode?.toLowerCase()) ||
          regex.test(item?.strAccountName?.toLowerCase()) ||
          regex.test(item?.strAccountNo?.toLowerCase()) ||
          regex.test(item?.strFinancialInstitution?.toLowerCase()) ||
          regex.test(item?.strBankBranchName?.toLowerCase()) ||
          regex.test(item?.strRoutingNumber?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  // excel column set up
  const excelColumnFunc = (processId) => {
    switch (processId) {
      case 1:
        return bankSalaryExcelColumn;

      case 2:
        return digitalBankingSalaryExcelColumn;

      case 3:
        return cashSalaryExcelColumn;

      default:
        return allSalaryExcelColumn;
    }
  };

  // excel data set up
  const excelDataFunc = (processId) => {
    switch (processId) {
      case 1:
        return bankSalaryExcelData(rowDto);

      case 2:
        return digitalBankingSalaryExcelData(rowDto);

      case 3:
        return cashSalaryExcelData(rowDto);

      default:
        return allSalaryExcelData(rowDto);
    }
  };

  const saveHandler = (values) => {};

  const totalEmpLOnSalarySheet = useMemo(() => {
    return rowDto.reduce((accumulator, currentValue) => {
      if (currentValue["SalaryGenerateHeaderId"] !== null) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);
  }, [rowDto]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading">
                    <div className="d-flex align-items-center">
                      <BackButton />
                      <h2 className="mr-2">Salary Report</h2>
                    </div>
                  </div>
                  <div
                    className="table-card-body"
                    style={{ overflow: "hidden" }}
                  >
                    <div className="table-card-styled">
                      <HeaderInfoBar state={state} />
                    </div>
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "12px" }}
                    >
                      <div className="d-flex align-center-center">
                        <div style={{ marginRight: "45px" }}>
                          <h2>Employee List</h2>
                          <div className="single-info">
                            {rowDto?.length > 0 && (
                              <p style={{ fontWeight: "400", color: gray500 }}>
                                Total employee {totalEmpLOnSalarySheet}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="custom-button-group">
                          {tabName.map((item, i) => {
                            return (
                              <button
                                key={i}
                                type="button"
                                className={`btn-single-groupe ${
                                  i === filterIndex &&
                                  "btn-single-groupe-active"
                                } ${item?.noRadius && "not-radius"} ${
                                  item?.noLeftRadius && "no-left-radius"
                                }`}
                                onClick={() => {
                                  setFilterIndex(i);
                                  getSalaryReport(
                                    // "GeneratedSalaryReportHeaderLanding",
                                    "GeneratedSalaryReportHeaderLandingGroupByDepartment",
                                    orgId,
                                    state?.intBusinessUnitId,
                                    wgId,
                                    state?.intMonth,
                                    state?.intYear,
                                    "",
                                    "",
                                    state?.intSalaryGenerateRequestId,
                                    i,
                                    setRowDto,
                                    setAllData,
                                    setLoading
                                  );
                                }}
                              >
                                {item?.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <ul className="d-flex flex-wrap">
                        <li style={{ marginRight: "24px", cursor: "pointer" }}>
                          <Tooltip title="Export CSV" arrow>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                const excelLanding = () => {
                                  generateExcelAction(
                                    "Salary Report",
                                    "",
                                    "",
                                    excelColumnFunc(filterIndex),
                                    excelDataFunc(filterIndex),
                                    state?.strBusinessUnit,
                                    filterIndex,
                                    rowDto,
                                    buDetails?.strBusinessUnitAddress,
                                    totalSalary,
                                    totalAllowance,
                                    totalDeduction,
                                    totalNetPay,
                                    totalBankPay,
                                    totalDBPay,
                                    totalCashPay,
                                    `${getMonthName(state?.intMonth)},${
                                      state?.intYear
                                    }`,
                                    totalWorkingDays,
                                    totalAttendence
                                  );
                                };
                                excelLanding();
                              }}
                            >
                              <Download
                                style={{ fontSize: "24px", color: gray900 }}
                              />
                            </div>
                          </Tooltip>
                        </li>
                        {/* <li style={{ marginRight: "24px", cursor: "pointer" }}>
                          <Tooltip title="Print" arrow>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                getPDFAction(
                                  `/PdfAndExcelReport/AllTypeOfSalaryReport?StrPartName=GeneratedSalaryReportHeaderLanding&IntAccountId=${orgId}&IntBusinessUnitId=${state?.intBusinessUnitId}&IntMonthId=${state?.intMonth}&IntYearId=${state?.intYear}&IntSalaryGenerateRequestId=${state?.intSalaryGenerateRequestId}&IntBankOrWalletType=${filterIndex}`,
                                  setLoading
                                );
                              }}
                            >
                              <Print style={{ fontSize: "24px", color: gray900 }} />
                            </div>
                          </Tooltip>
                        </li> */}
                        <li>
                          <FormikInput
                            classes="search-input fixed-width mr-0"
                            inputClasses="search-inner-input"
                            placeholder="Search"
                            value={values?.search}
                            name="search"
                            type="text"
                            trailicon={
                              <SearchOutlined sx={{ color: "#323232" }} />
                            }
                            onChange={(e) => {
                              filterData(e.target.value, allData, setRowDto);
                              setFieldValue("search", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-card-body">
                    {rowDto?.length > 0 ? (
                      <>
                        <AllSalaryReport
                          index={filterIndex}
                          tabIndex={0}
                          rowDto={rowDto}
                        />
                        <BankSalaryReport
                          index={filterIndex}
                          tabIndex={1}
                          rowDto={rowDto}
                        />
                        <DigitalBankingSalaryReport
                          index={filterIndex}
                          tabIndex={2}
                          rowDto={rowDto}
                        />
                        <CashSalaryReport
                          index={filterIndex}
                          tabIndex={3}
                          rowDto={rowDto}
                        />
                      </>
                    ) : (
                      <>
                        {!loading && (
                          <NoResult title="No Result Found" para="" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
