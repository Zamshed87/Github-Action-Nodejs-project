import {
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { IconButton, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPeopleDeskAllDDL, getWorkplaceDetails } from "../../../common/api";
import DefaultInput from "../../../common/DefaultInput";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray500 } from "../../../utility/customColor";
import { monthYearFormatter } from "../../../utility/dateFormatter";
import { getPDFAction } from "../../../utility/downloadFile";
import { withDecimal } from "../../../utility/numberToWord";
import { customStyles } from "../../../utility/selectCustomStyle";
import { generateExcelAction } from "./excel/excelConvert";
import {
  salaryAdviceExcelColumn,
  salaryAdviceExcelData,
} from "./excel/excelStyle";
import {
  bankAdviceColumnData,
  bankAdviceInitialValues,
  bankAdviceValidationSchema,
  getBankAdviceRequestLanding,
} from "./helper";
import { paginationSize } from "../../../common/peopleDeskTable";
import PeopleDeskTable from "../../componentModule/peopledeskTable";
import useDebounce from "../../../utility/customHooks/useDebounce";

const BankAdviceReport = () => {
  const dispatch = useDispatch();
  const debounce = useDebounce();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalInWords, setTotalInWords] = useState("");
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [accountDDL, setAccountDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [buDetails, setBuDetails] = useState(false);

  // DDl section
  const [bankAccountDDL, setBankAccountDDL] = useState([]);
  const [payrollPeriodDDL, setPayrollPeriodDDL] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const { orgId, buId, employeeId, strBusinessUnit, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { businessUnitDDL } = useSelector((state) => state?.auth, shallowEqual);
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 114) {
      permission = item;
    }
  });

  const { setFieldValue, values, errors, touched, setValues, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      validationSchema: bankAdviceValidationSchema,
      initialValues: bankAdviceInitialValues,
      onSubmit: () => saveHandler(),
    });

  // on form submit
  const saveHandler = () => {
    getBankAdviceRequestLanding(
      orgId,
      buId,
      wgId,
      pages,
      values,
      setPages,
      setRowDto,
      setLoading
    );
  };

  const excelGenerate = (cb) => {
    getBankAdviceRequestLanding(
      orgId,
      buId,
      wgId,
      pages,
      values,
      null,
      null,
      setLoading,
      "",
      true,
      cb
    );
  };

  // excel column set up
  const excelColumnFunc = (processId) => {
    switch (processId) {
      default:
        return salaryAdviceExcelColumn;
    }
  };

  // excel data set up
  const excelDataFunc = (processId) => {
    switch (processId) {
      default:
        return salaryAdviceExcelData(rowDto);
    }
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getBankAdviceRequestLanding(
      orgId,
      buId,
      wgId,
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      values,
      setPages,
      setRowDto,
      setLoading,
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getBankAdviceRequestLanding(
      orgId,
      buId,
      wgId,
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      values,
      setPages,
      setRowDto,
      setLoading,
      searchText
    );
  };

  // Side effects
  useEffect(() => {
    if (rowDto.length > 0) {
      setTotal(
        Number(
          rowDto?.reduce((acc, item) => acc + item?.numNetPayable, 0).toFixed(2)
        )
      );
    }
  }, [rowDto]);

  useEffect(() => {
    if (total) {
      setTotalInWords(withDecimal(total));
    }
  }, [total]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${buId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
  }, [orgId, buId, employeeId, wgId]);

  //set to module
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    document.title = "Bank Advice";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mt-2 pt-1">
            <div className="d-flex align-items-center">
              <h2 className="ml-1">Bank Advice Report</h2>
            </div>
            <div className="table-header-right">
              <ul className="d-flex flex-wrap"></ul>
            </div>
          </div>
          <div className="table-card-body" style={{ marginTop: "12px" }}>
            <div className="card-style" style={{ margin: "14px 0px 12px 0px" }}>
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
                        setValues((prev) => ({
                          ...prev,
                          yearId: +e.target.value
                            .split("")
                            .slice(0, 4)
                            .join(""),
                          monthId: +e.target.value.split("").slice(-2).join(""),
                          monthYear: e.target.value,
                          adviceName: "",
                        }));
                        if (values?.workplaceGroup?.value) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=salarycodebyWorkplaceGroup&WorkplaceGroupId=${
                              values?.workplaceGroup?.value
                            }&BusinessUnitId=${buId}&IntMonth=${+e.target.value
                              .split("")
                              .slice(-2)
                              .join("")}&IntYear=${+e.target.value
                              .split("")
                              .slice(0, 4)
                              .join("")}`,
                            "value",
                            "label",
                            setPayrollPeriodDDL
                          );
                        }

                        setRowDto([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Workplace Group</label>
                    <FormikSelect
                      name="workplaceGroup"
                      options={[...workplaceGroupDDL] || []}
                      value={values?.workplaceGroup}
                      onChange={(valueOption) => {
                        setWorkplaceDDL([]);
                        setFieldValue("workplaceGroup", valueOption);
                        setFieldValue("workplace", "");
                        if (valueOption?.value) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=salarycodebyWorkplaceGroup&WorkplaceGroupId=${valueOption?.value}&BusinessUnitId=${buId}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
                            "value",
                            "label",
                            setPayrollPeriodDDL
                          );
                        }
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Salary Code</label>
                    <FormikSelect
                      name="adviceName"
                      options={payrollPeriodDDL || []}
                      value={values?.adviceName}
                      onChange={(valueOption) => {
                        if (valueOption?.value) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplacebySalaryGenerateRequestId&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&intId=${valueOption?.value}`,
                            "value",
                            "label",
                            setWorkplaceDDL
                          );
                        }
                        setValues((prev) => ({
                          ...prev,
                          workplace: "",
                          bank: "",
                          account: "",
                          adviceName: valueOption,
                        }));
                        setRowDto([]);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Workplace</label>
                    <FormikSelect
                      name="workplace"
                      options={[...workplaceDDL] || []}
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        if (valueOption?.value) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BankListofBankAdvicebyWorkplaceId&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&intWorkplaceId=${valueOption?.value}`,
                            "value",
                            "label",
                            setBankDDL
                          );
                        }
                        setFieldValue("workplace", valueOption);
                        setFieldValue("bank", "");
                        setFieldValue("account", "");
                        getWorkplaceDetails(valueOption?.value, setBuDetails);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>

                {/* <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Advice Type</label>
                    <FormikSelect
                      name="adviceTo"
                      options={[
                        { label: "IBBL", value: "IBBL", type: 0 },
                        { label: "IBBL-BFTN", value: "IBBL-BFTN", type: 1 },
                        { label: "BEFTN", value: "BEFTN", type: 2 },
                      ]}
                      value={values?.adviceTo}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          adviceTo: valueOption,
                        }));
                        setRowDto([]);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div> */}
                {/* <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Sender Bank Account No</label>
                    <FormikSelect
                      name="bankAccountNo"
                      options={bankAccountDDL || []}
                      value={values?.bankAccountNo}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          bankAccountNo: valueOption,
                        }));
                        setRowDto([]);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div> */}
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Bank Name</label>
                    <FormikSelect
                      name="bank"
                      options={[...bankDDL] || []}
                      value={values?.bank}
                      onChange={(valueOption) => {
                        setWorkplaceDDL([]);
                        setFieldValue("bank", valueOption);
                        setFieldValue("account", "");
                        if (valueOption?.value) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BankAccountListofBankAdvicebyBankId&WorkplaceGroupId=${values?.workplaceGroup?.value}&BusinessUnitId=${buId}&intWorkplaceId=${values?.workplace?.value}&intId=${valueOption?.value}`,
                            "value",
                            "label",
                            setBankAccountDDL
                          );
                        }
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Account</label>
                    <FormikSelect
                      name="account"
                      options={[...bankAccountDDL] || []}
                      value={values?.account}
                      onChange={(valueOption) => {
                        setWorkplaceDDL([]);
                        setFieldValue("account", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3 mt-3">
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <h2
                  style={{
                    color: gray500,
                    fontSize: "14px",
                    margin: "12px 0px 10px 0px",
                  }}
                >
                  Bank Advice List
                </h2>
              </div>
              <div>
                <ul className="d-flex flex-wrap">
                  {!!rowDto?.length && (
                    <>
                      <li className="pr-2">
                        <Tooltip title="Export CSV" arrow>
                          <IconButton
                            style={{ color: "#101828" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rowDto?.length <= 0) {
                                return toast.warning("Data is empty !!!!", {
                                  toastId: 1,
                                });
                              }

                              if (
                                values?.bank?.label ===
                                "Standard Chartered Bank"
                              ) {
                                excelGenerate((res) => {
                                  generateExcelAction(
                                    monthYearFormatter(values?.monthYear),
                                    "",
                                    "",
                                    excelColumnFunc(0),
                                    excelDataFunc(0),
                                    strBusinessUnit,
                                    4,
                                    res,
                                    values?.account?.AccountNo,
                                    total,
                                    totalInWords,
                                    businessUnitDDL[0]?.BusinessUnitAddress
                                  );
                                });
                              } else if (
                                values?.bank?.label ===
                                  "Dutch Bangla Bank Agent Banking" ||
                                values?.bank?.label === "DUTCH-BANGLA BANK LTD"
                              ) {
                                excelGenerate((res) => {
                                  generateExcelAction(
                                    monthYearFormatter(values?.monthYear),
                                    "",
                                    "",
                                    excelColumnFunc(0),
                                    excelDataFunc(0),
                                    strBusinessUnit,
                                    5,
                                    res,
                                    values?.account?.AccountNo,
                                    total,
                                    totalInWords,
                                    buDetails
                                  );
                                });
                              } else if (
                                values?.bank?.label.includes(
                                  "City Bank Limited"
                                )
                              ) {
                                excelGenerate((res) => {
                                  generateExcelAction(
                                    monthYearFormatter(values?.monthYear),
                                    "",
                                    "",
                                    excelColumnFunc(0),
                                    excelDataFunc(0),
                                    strBusinessUnit,
                                    6,
                                    res,
                                    values?.account?.AccountNo,
                                    total,
                                    totalInWords,
                                    buDetails
                                  );
                                });
                              } else if (
                                values?.bank?.label === "Dhaka Bank Limited "
                              ) {
                                excelGenerate((res) => {
                                  generateExcelAction(
                                    monthYearFormatter(values?.monthYear),
                                    "",
                                    "",
                                    excelColumnFunc(0),
                                    excelDataFunc(0),
                                    strBusinessUnit,
                                    3,
                                    res,
                                    values?.account?.AccountNo,
                                    total,
                                    totalInWords,
                                    buDetails
                                  );
                                });
                              } else {
                                excelGenerate((res) => {
                                  generateExcelAction(
                                    monthYearFormatter(values?.monthYear),
                                    "",
                                    "",
                                    excelColumnFunc(0),
                                    excelDataFunc(0),
                                    strBusinessUnit,
                                    values?.adviceTo?.type,
                                    res,
                                    values?.account?.AccountNo,
                                    total,
                                    totalInWords,
                                    buDetails
                                  );
                                });
                              }
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </li>
                      <li className="pr-2">
                        <Tooltip title="Print" arrow>
                          <IconButton
                            style={{ color: "#101828" }}
                            onClick={() => {
                              if (values?.adviceTo?.type === 0) {
                                getPDFAction(
                                  `/PdfAndExcelReport/BankAdviceReportForIBBL?SalaryGenerateRequestId=${values?.adviceName?.value}&WorkplaceGroupId=${wgId}&MonthId=${values?.monthId}&YearId=${values?.yearId}&IntAccountId=${orgId}&IntBusinessUnitId=${buId}`,
                                  setLoading
                                );
                              } else {
                                getPDFAction(
                                  `/PdfAndExcelReport/BankAdviceReportForBEFTN?SalaryGenerateRequestId=${values?.adviceName?.value}&WorkplaceGroupId=${wgId}&MonthId=${values?.monthId}&YearId=${values?.yearId}&IntAccountId=${orgId}&IntBusinessUnitId=${buId}`,
                                  setLoading
                                );
                              }
                            }}
                          >
                            <LocalPrintshopIcon />
                          </IconButton>
                        </Tooltip>
                      </li>
                    </>
                  )}
                  {values?.search && (
                    <li className="pt-1">
                      <ResetButton
                        classes="btn-filter-reset"
                        title="Reset"
                        icon={<SettingsBackupRestoreOutlined />}
                        onClick={() => {
                          setFieldValue("search", "");
                          getBankAdviceRequestLanding(
                            orgId,
                            buId,
                            wgId,
                            {
                              current: 1,
                              pageSize: pages?.pageSize,
                              total: pages?.total,
                            },
                            values,
                            setPages,
                            setRowDto,
                            setLoading,
                            ""
                          );
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <DefaultInput
                      classes="search-input fixed-width mt-1 tableCardHeaderSeach"
                      inputClasses="search-inner-input"
                      placeholder="Search"
                      value={values?.search}
                      name="search"
                      type="text"
                      trailicon={
                        <SearchOutlined
                          sx={{
                            color: "#323232",
                            fontSize: "18px",
                          }}
                        />
                      }
                      onChange={(e) => {
                        setFieldValue("search", e.target.value);
                        debounce(() => {
                          getBankAdviceRequestLanding(
                            orgId,
                            buId,
                            wgId,
                            {
                              current: 1,
                              pageSize: pages?.pageSize,
                              total: pages?.total,
                            },
                            values,
                            setPages,
                            setRowDto,
                            setLoading,
                            e.target.value
                          );
                        }, 500);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </li>
                </ul>
              </div>
            </div>

            {rowDto?.length ? (
              <PeopleDeskTable
                columnData={bankAdviceColumnData(
                  pages?.current,
                  pages?.pageSize
                )}
                pages={pages}
                rowDto={rowDto}
                setRowDto={setRowDto}
                handleChangePage={(e, newPage) =>
                  handleChangePage(e, newPage, values?.search)
                }
                handleChangeRowsPerPage={(e) =>
                  handleChangeRowsPerPage(e, values?.search)
                }
                uniqueKey="employeeCode"
                isCheckBox={false}
                isScrollAble={false}
              />
            ) : (
              <NoResult />
            )}
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </form>
  );
};

export default BankAdviceReport;
