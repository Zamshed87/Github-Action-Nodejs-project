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
import { gray500, gray600, success500 } from "../../../utility/customColor";
import { monthYearFormatter } from "../../../utility/dateFormatter";
import { downloadFile, getPDFAction } from "../../../utility/downloadFile";
import {
  convert_number_to_word,
  withDecimal,
} from "../../../utility/numberToWord";
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
  getBankAdviceBonusRequestLanding,
  getBankAdviceRequestLanding,
} from "./helper";
import { paginationSize } from "../../../common/peopleDeskTable";
import PeopleDeskTable from "../../componentModule/peopledeskTable";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { generateTopSheetAction } from "./excel/excelTopSheet";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { todayDate } from "utility/todayDate";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { useApiRequest } from "Hooks";

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
  const [tenMsdata, setTenMsdata] = useState("");

  const [bonusNameDDL, getBonusNameDDLAPI, , setBonusNameDDL] = useAxiosPost(
    []
  );
  const [bonusCodeDDL, getBonusCODEDDLAPI, , setBonusCodeDDL] = useAxiosGet([]);

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
  const tenMsBankAdvice = useApiRequest([]);
  // Functions
  const tenMsBALanding = (partName, values) => {
    if (!values?.adviceName?.value) {
      return toast.warning("Please select Salary Code");
    }
    tenMsBankAdvice?.action({
      method: "get",
      urlKey: "BankAdviceReport10MS",
      params: {
        strPartName: partName,
        IntAccountId: orgId,
        IntBusinessUnitId: buId,
        IntWorkplaceGroupId: values?.workplaceGroup?.value,
        IntWorkplaceId: values?.workplace?.value,
        IntMonthId: values?.monthId,
        IntYearId: values?.yearId,
        IntBankId: values?.bank?.value,
        IntSalaryGenerateRequestId: values?.adviceName?.value,
      },
      onSuccess: (res) => {
        setTenMsdata(res);
      },
    });
  };
  const { setFieldValue, values, errors, touched, setValues, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      validationSchema: bankAdviceValidationSchema,
      initialValues: bankAdviceInitialValues,
      onSubmit: () => {
        if (orgId === 4 && values?.bankAdviceFor?.value === 1) {
          tenMsBALanding("htmlView", values);
        } else {
          saveHandler(values);
        }
      },
    });

  // on form submit
  const saveHandler = (values) => {
    if (values?.bankAdviceFor?.value === 2) {
      if (!values?.bonusCode?.length > 0)
        return toast.warning("Please select Bonus Code");
      getBankAdviceBonusRequestLanding(
        orgId,
        buId,
        wgId,
        pages,
        values,
        setPages,
        setRowDto,
        setLoading
      );
    } else if (values?.bankAdviceFor?.value === 1) {
      if (!values?.adviceName?.value)
        return toast.warning("Please select Salary Code");
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
    }
  };

  const excelGenerate = (values, cb) => {
    if (values?.bankAdviceFor?.value === 2) {
      if (!values?.bonusCode?.length > 0)
        return toast.warning("Please select Bonus Code");
      getBankAdviceBonusRequestLanding(
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
    } else if (values?.bankAdviceFor?.value === 1) {
      if (!values?.adviceName?.value)
        return toast.warning("Please select Salary Code");
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
        cb,
        setTotal
      );
    }
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
    if (values?.bankAdviceFor?.value === 2) {
      if (!values?.bonusCode?.length > 0)
        return toast.warning("Please select Bonus Code");
      getBankAdviceBonusRequestLanding(
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
    } else if (values?.bankAdviceFor?.value === 1) {
      if (!values?.adviceName?.value)
        return toast.warning("Please select Salary Code");
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
    }
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages(() => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });

    if (values?.bankAdviceFor?.value === 2) {
      if (!values?.bonusCode?.length > 0)
        return toast.warning("Please select Bonus Code");
      getBankAdviceBonusRequestLanding(
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
    } else if (values?.bankAdviceFor?.value === 1) {
      if (!values?.adviceName?.value)
        return toast.warning("Please select Salary Code");
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
    }
  };
  const getBonusNameList = () => {
    getBonusNameDDLAPI(
      `/Employee/BonusAllLanding`,
      {
        strPartName: "BonusNameList",
        intBonusHeaderId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intBonusId: 0,
        intPayrollGroupId: 0,
        intWorkplaceGroupId: 0,
        intReligionId: 0,
        dteEffectedDate: todayDate(),
        intCreatedBy: employeeId,
      },
      (res) => {
        console.log(res);
        const response = res
          ?.filter((b) => b?.label)
          ?.map((item) => ({
            ...item,
            value: item?.intBonusId,
            label: item?.strBonusName,
          }));
        setBonusNameDDL(response);
      }
    );
  };
  const getBonusCODEListHandler = (values) => {
    const month = `${values?.yearId}-${values?.monthId}-01`;
    getBonusCODEDDLAPI(
      `/Employee/BonusGenerateQueryAll?StrPartName=GetBonusCodebyBonusId&IntAccountId=${orgId}&IntBusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&IntBonusId=${values?.bonusName?.value}&DteEffectedDate=${month}`,
      (res) => {
        console.log(res);
        const response = res
          ?.filter((b) => b?.strBonusGenerateCode)
          ?.map((item) => ({
            ...item,
            value: item?.intBonusHeaderId,
            label: item?.strBonusGenerateCode,
          }));
        setBonusCodeDDL(response);
      }
    );
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      // `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${buId}&intId=${employeeId}`,
      `PeopleDeskDdl/WorkplaceGroupIdAll?accountId=${orgId}&businessUnitId=${buId}`,
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
      {(loading || tenMsBankAdvice?.loading) && <Loading />}
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
                        if (
                          values?.workplaceGroup?.value &&
                          values?.bankAdviceFor?.value === 1
                        ) {
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
                        setFieldValue("adviceName", "");
                        setFieldValue("bonusName", "");
                        setFieldValue("bonusCode", []);
                        // if (valueOption?.value) {
                        //   getPeopleDeskAllDDL(
                        //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=salarycodebyWorkplaceGroup&WorkplaceGroupId=${valueOption?.value}&BusinessUnitId=${buId}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
                        //     "value",
                        //     "label",
                        //     setPayrollPeriodDDL
                        //   );
                        // }
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
                    <label>Bank Advice For</label>
                    <FormikSelect
                      name="bankAdviceFor"
                      options={[
                        {
                          value: 1,
                          label: "Salary",
                        },
                        {
                          value: 2,
                          label: "Bonus",
                        },
                      ]}
                      value={values?.bankAdviceFor}
                      onChange={(valueOption) => {
                        setWorkplaceDDL([]);
                        setRowDto([]);
                        setFieldValue("bankAdviceFor", valueOption);
                        setFieldValue("adviceName", "");
                        setFieldValue("bonusName", "");
                        setFieldValue("bonusCode", []);
                        setFieldValue("workplace", "");
                        setFieldValue("bank", "");
                        setFieldValue("account", "");
                        setBankDDL([]);
                        setBankAccountDDL([]);
                        setWorkplaceDDL([]);
                        if (valueOption?.value === 2) {
                          getBonusNameList(values);
                        }
                        if (
                          values?.workplaceGroup?.value &&
                          valueOption?.value === 1
                        ) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=salarycodebyWorkplaceGroup&WorkplaceGroupId=${values?.workplaceGroup?.value}&BusinessUnitId=${buId}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
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
                {values?.bankAdviceFor?.value === 1 ? (
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
                ) : (
                  <></>
                )}
                {values?.bankAdviceFor?.value === 2 ? (
                  <>
                    <div className="col-lg-3">
                      <div className="input-field-main">
                        <label>Bonus Name</label>
                        <FormikSelect
                          name="bonusName"
                          options={bonusNameDDL || []}
                          value={values?.bonusName}
                          onChange={(valueOption) => {
                            setFieldValue("bonusName", valueOption);
                            if (
                              valueOption?.value &&
                              values?.workplaceGroup?.value
                            ) {
                              getBonusCODEListHandler({
                                ...values,
                                bonusName: valueOption,
                              });
                            }
                          }}
                          placeholder=""
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-field-main">
                        <label>Bonus Code</label>
                        <FormikSelect
                          name="bonusCode"
                          isClearable={false}
                          options={bonusCodeDDL || []}
                          value={values?.bonusCode}
                          onChange={(valueOption) => {
                            setWorkplaceDDL([]);
                            setFieldValue("bonusCode", valueOption);
                            if (valueOption?.length > 0) {
                              const concatBonusCode = valueOption
                                ?.map((item) => item?.value)
                                .join(",");
                              const api = `/Employee/BonusGenerateQueryAll?StrPartName=GetWorkplaceListbyBonusHeaderId&searchText=${concatBonusCode}`;
                              getPeopleDeskAllDDL(
                                api,
                                "intWorkPlaceId",
                                "strWorkplace",
                                setWorkplaceDDL
                              );
                            }
                          }}
                          styles={{
                            ...customStyles,
                            control: (provided) => ({
                              ...provided,
                              minHeight: "auto",
                              height:
                                values?.bonusCode?.length > 1 ? "auto" : "auto",
                              borderRadius: "4px",
                              boxShadow: `${success500}!important`,
                              ":hover": {
                                borderColor: `${gray600}!important`,
                              },
                              ":focus": {
                                borderColor: `${gray600}!important`,
                              },
                            }),
                            valueContainer: (provided) => ({
                              ...provided,
                              height:
                                values?.bonusCode?.length > 1 ? "auto" : "auto",
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
                          isMulti
                          placeholder="Bonus Code"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Workplace</label>
                    <FormikSelect
                      name="workplace"
                      options={[...workplaceDDL] || []}
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        setBankDDL([]);
                        if (valueOption?.value) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BankListofBankAdvicebyWorkplaceId&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&intWorkplaceId=${valueOption?.value}`,
                            "value",
                            "label",
                            setBankDDL
                          );
                          getWorkplaceDetails(valueOption?.value, setBuDetails);
                        }
                        setFieldValue("workplace", valueOption);
                        setFieldValue("bank", "");
                        setFieldValue("account", "");
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
                    <label>Bank Name</label>
                    <FormikSelect
                      name="bank"
                      options={[...bankDDL] || []}
                      value={values?.bank}
                      onChange={(valueOption) => {
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
                        setFieldValue("account", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div
                  className={
                    values?.bankAdviceFor?.value === 2
                      ? `mt-4 col-lg-3`
                      : `mt-3 col-lg-3`
                  }
                >
                  <button
                    className="btn btn-green btn-green-disable"
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>

            {orgId === 4 && values?.bankAdviceFor?.value === 1 ? (
              <div>
                {tenMsdata && (
                  <ul className="d-flex flex-wrap  align-items-center justify-content-end">
                    <li className="pr-2">
                      <Tooltip title="Download as Excel">
                        <button
                          className="btn-save"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            const url = `/PdfAndExcelReport/BankAdviceReport10MS?strPartName=excelView&IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${values?.workplaceGroup?.value}&IntWorkplaceId=${values?.workplace?.value}&IntMonthId=${values?.monthId}&IntYearId=${values?.yearId}&IntBankId=${values?.bank?.value}&IntSalaryGenerateRequestId=${values?.adviceName?.value}`;
                            downloadFile(
                              url,
                              `Bank Advice For 10 MS- ${todayDate()}`,
                              "xlsx",
                              setLoading
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
                          <DownloadIcon
                            sx={{
                              color: "#101828",
                              fontSize: "16px",
                            }}
                          />
                        </button>
                      </Tooltip>
                    </li>
                    <li>
                      <Tooltip title="Print as PDF">
                        <button
                          className="btn-save"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `/PdfAndExcelReport/BankAdviceReport10MS?strPartName=pdfView&IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${values?.workplaceGroup?.value}&IntWorkplaceId=${values?.workplace?.value}&IntMonthId=${values?.monthId}&IntYearId=${values?.yearId}&IntBankId=${values?.bank?.value}&IntSalaryGenerateRequestId=${values?.adviceName?.value}`;

                            getPDFAction(url, setLoading);
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
                    </li>
                  </ul>
                )}
              </div>
            ) : (
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
                          <Tooltip title="Export Top Sheet" arrow>
                            <IconButton
                              style={{ color: "#101828" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (rowDto?.length <= 0) {
                                  return toast.warning("Data is empty !!!!", {
                                    toastId: 1,
                                  });
                                }

                                excelGenerate(values, (res) => {
                                  const total = Number(
                                    res
                                      ?.reduce(
                                        (acc, item) =>
                                          acc + item?.numNetPayable,
                                        0
                                      )
                                      .toFixed(2)
                                  );

                                  generateTopSheetAction(
                                    monthYearFormatter(values?.monthYear),
                                    "",
                                    "",
                                    excelColumnFunc(0),
                                    excelDataFunc(0),
                                    strBusinessUnit,
                                    4,
                                    res,
                                    values,
                                    total,
                                    // withDecimal(total),
                                    convert_number_to_word(total),
                                    businessUnitDDL[0]?.BusinessUnitAddress
                                  );
                                });
                              }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </li>
                        <li className="pr-2">
                          <Tooltip title="Export Details CSV" arrow>
                            <IconButton
                              style={{ color: "#101828" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (rowDto?.length <= 0) {
                                  return toast.warning("Data is empty !!!!", {
                                    toastId: 1,
                                  });
                                }

                                excelGenerate(values, (res) => {
                                  const total = Number(
                                    res
                                      ?.reduce(
                                        (acc, item) =>
                                          acc + item?.numNetPayable,
                                        0
                                      )
                                      .toFixed(2)
                                  );

                                  generateExcelAction(
                                    monthYearFormatter(values?.monthYear),
                                    "",
                                    "",
                                    excelColumnFunc(0),
                                    excelDataFunc(0),
                                    strBusinessUnit,
                                    values,
                                    res,
                                    values?.account?.AccountNo,
                                    total,
                                    // withDecimal(total),
                                    convert_number_to_word(total),
                                    businessUnitDDL[0]?.BusinessUnitAddress
                                  );
                                });
                              }}
                            >
                              <DownloadIcon />
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
                            if (values?.bankAdviceFor?.value === 2) {
                              if (!values?.bonusCode?.length > 0)
                                return toast.warning(
                                  "Please select Bonus Code"
                                );
                              getBankAdviceBonusRequestLanding(
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
                            } else if (values?.bankAdviceFor?.value === 1) {
                              if (!values?.adviceName?.value)
                                return toast.warning(
                                  "Please select Salary Code"
                                );
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
                            }
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
                            if (values?.bankAdviceFor?.value === 2) {
                              if (!values?.bonusCode?.length > 0)
                                return toast.warning(
                                  "Please select Bonus Code"
                                );
                              getBankAdviceBonusRequestLanding(
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
                            } else if (values?.bankAdviceFor?.value === 1) {
                              if (!values?.adviceName?.value)
                                return toast.warning(
                                  "Please select Salary Code"
                                );
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
                            }
                          }, 500);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            )}

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
            ) : orgId === 4 && values?.bankAdviceFor?.value === 1 ? (
              <div style={{ overflow: "scroll" }} className="mt-3 w-100">
                <div
                  dangerouslySetInnerHTML={{
                    __html: tenMsdata,
                  }}
                />
              </div>
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
