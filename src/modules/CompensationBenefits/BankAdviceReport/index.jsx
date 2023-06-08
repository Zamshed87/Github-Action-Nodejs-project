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
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../common/api";
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
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { customStyles } from "../../../utility/selectCustomStyle";
import { generateExcelAction } from "./excel/excelConvert";
import {
  salaryAdviceExcelColumn,
  salaryAdviceExcelData,
} from "./excel/excelStyle";
import { getBankAdviceRequestLanding } from "./helper";

const initialValues = {
  businessUnit: "",
  workplaceGroup: "",
  workplace: "",
  description: "",
  monthYear: "" /* moment().format("YYYY-MM") */,
  payrollGroup: "",
  adviceName: "",
  adviceTo: "",
  bankAccountNo: "",
  monthId: "" /* new Date().getMonth() + 1 */,
  yearId: "" /* new Date().getFullYear() */,
  search: "",
};

const validationSchema = Yup.object().shape({
  // businessUnit: Yup.object()
  //   .shape({
  //     value: Yup.string().required("Business Unit is required"),
  //     label: Yup.string().required("Business Unit is required"),
  //   })
  //   .typeError("Business Unit is required"),
  // workplaceGroup: Yup.object().shape({
  //   value: Yup.string().required("Workplace Group is required"),
  //   label: Yup.string().required("Workplace Group is required"),
  // }).typeError("Workplace Group is required"),
  // workplace: Yup.object().shape({
  //   value: Yup.string().required("Workplace is required"),
  //   label: Yup.string().required("Workplace is required"),
  // }).typeError("Workplace is required"),
  // payrollGroup: Yup.object().shape({
  //   value: Yup.string().required("Payroll Group is required"),
  //   label: Yup.string().required("Payroll Group is required"),
  // }).typeError("Payroll Group is required"),
  adviceName: Yup.object()
    .shape({
      value: Yup.string().required("Salary Code is required"),
      label: Yup.string().required("Salary Code is required"),
    })
    .typeError("Salary Code is required"),
  adviceTo: Yup.object()
    .shape({
      value: Yup.string().required("Advice To is required"),
      label: Yup.string().required("Advice To is required"),
    })
    .typeError("Advice To is required"),
  bankAccountNo: Yup.object()
    .shape({
      value: Yup.string().required("Bank Account No is required"),
      label: Yup.string().required("Bank Account No is required"),
    })
    .typeError("Bank Account No is required"),
  monthYear: Yup.date().required("Payroll month is required"),
});

const BankAdviceReport = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // const [buDetails, setBuDetails] = useState({});
  const [allData, setAllData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalInWords, setTotalInWords] = useState("");

  // DDl section
  // const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  // const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  // const [workplaceDDL, setWorkplaceDDL] = useState([]);
  // const [payrollGroupDDL, setPayrollGroupDDL] = useState([]);
  const [bankAccountDDL, setBankAccountDDL] = useState([]);
  const [payrollPeiodDDL, setPayrollPeiodDDL] = useState([]);

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
      validationSchema,
      initialValues,
      onSubmit: () => saveHandler(),
    });

  // on form submit
  const saveHandler = () => {
    getBankAdviceRequestLanding(
      orgId,
      buId,
      values,
      setRowDto,
      setAllData,
      setLoading
    );
  };
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
      "strWorkplaceGroup"
      // setWorkplaceGroupDDL
    );
    // getPeopleDeskAllDDL(
    //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
    //   "intBusinessUnitId",
    //   "strBusinessUnit",
    //   setBusinessUnitDDL
    // );
    // getPeopleDeskAllDDL(
    //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollGroup&AccountId=${orgId}&BusinessUnitId=${buId}`,
    //   "PayrollGroupId",
    //   "PayrollGroupName",
    //   setPayrollGroupDDL
    // );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=CompanyAccountNo&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`,
      "BankAccountId",
      "BankAccountNo",
      setBankAccountDDL
    );
  }, [orgId, buId, employeeId, wgId]);

  // filter data
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.Reason?.toLowerCase()) ||
          regex.test(item?.strAccountName?.toLowerCase()) ||
          regex.test(item?.BankAccountNumber?.toLowerCase()) ||
          regex.test(item?.strAccountNo?.toLowerCase()) ||
          regex.test(item?.intEmployeeId?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  //set to module
  useEffect(
    () => dispatch(setFirstLevelNameAction("Compensation & Benefits")),
    [dispatch]
  );

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
                {/* <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Business Unit</label>
                    <FormikSelect
                      name="businessUnit"
                      options={businessUnitDDL || []}
                      value={values?.businessUnit}
                      onChange={(valueOption) => {
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&AccountId=${orgId}&BusinessUnitId=${valueOption?.value}&intId=${employeeId}`,
                          "intWorkplaceGroupId",
                          "strWorkplaceGroup"
                          // setWorkplaceGroupDDL
                        );
                        getBuDetails(
                          valueOption?.intBusinessUnitId,
                          setBuDetails,
                          setLoading
                        );
                        setValues((prev) => ({
                          ...prev,
                          businessUnit: valueOption,
                          workplaceGroup: "",
                          workplace: "",
                          payrollGroup: "",
                          adviceName: "",
                        }));
                        setRowDto([]);
                        // if (
                        //   valueOption?.value &&
                        //   values?.workplaceGroup?.value &&
                        //   values?.workplace?.value &&
                        //   values?.payrollGroup?.value &&
                        //   values?.monthId &&
                        //   values?.yearId
                        // ) {
                        //   getPeopleDeskAllDDL(
                        //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriod&AccountId=${orgId}&BusinessUnitId=${valueOption?.value}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
                        //     "SalaryGenerateRequestId",
                        //     "SalaryCode",
                        //     setPayrollPeiodDDL
                        //   );
                        // }
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
                    <label>Workplace Group</label>
                    <FormikSelect
                      name="workplaceGroup"
                      options={
                        [...workplaceGroupDDL] || []
                      }
                      value={values?.workplaceGroup}
                      onChange={(valueOption) => {;
                        setValues((prev) => ({
                          ...prev,
                          workplaceGroup: valueOption,
                          workplace: "",
                          payrollGroup: "",
                          adviceName: "",
                        }));
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                          "intWorkplaceId",
                          "strWorkplace",
                          setWorkplaceDDL
                        );
                        // if (
                        //   values?.businessUnit?.value &&
                        //   valueOption?.value &&
                        //   values?.workplace?.value &&
                        //   values?.payrollGroup?.value &&
                        //   values?.monthId &&
                        //   values?.yearId
                        // ) {
                        //   getPeopleDeskAllDDL(
                        //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriod&AccountId=${orgId}&BusinessUnitId=${values?.businessUnit?.value}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
                        //     "SalaryGenerateRequestId",
                        //     "SalaryCode",
                        //     setPayrollPeiodDDL
                        //   );
                        // }
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
                    <label>Workplace</label>
                    <FormikSelect
                      name="workplace"
                      options={
                        [...workplaceDDL] || []
                      }
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          workplace: valueOption,
                          payrollGroup: "",
                          adviceName: "",
                        }));
                        // if (
                        //   values?.businessUnit?.value &&
                        //   values?.workplaceGroup?.value &&
                        //   valueOption?.value &&
                        //   values?.payrollGroup?.value &&
                        //   values?.monthId &&
                        //   values?.yearId
                        // ) {
                        //   getPeopleDeskAllDDL(
                        //     `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriod&AccountId=${orgId}&BusinessUnitId=${values?.businessUnit?.value}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
                        //     "SalaryGenerateRequestId",
                        //     "SalaryCode",
                        //     setPayrollPeiodDDL
                        //   );
                        // }
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
                    <label>Payroll Group</label>
                    <FormikSelect
                      name="payrollGroup"
                      options={
                        [...payrollGroupDDL] || []
                      }
                      value={values?.payrollGroup}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
                          payrollGroup: valueOption,
                          adviceName: "",
                        }));
                        if (
                          values?.businessUnit?.value &&
                          values?.workplaceGroup?.value &&
                          values?.workplace?.value &&
                          valueOption?.value &&
                          values?.monthId &&
                          values?.yearId
                        ) {
                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriod&AccountId=${orgId}&BusinessUnitId=${values?.businessUnit?.value}&IntMonth=${values?.monthId}&IntYear=${values?.yearId}`,
                            "SalaryGenerateRequestId",
                            "SalaryCode",
                            setPayrollPeiodDDL
                          );
                        }
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
                        getPeopleDeskAllDDL(
                          `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriod&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&IntMonth=${+e.target.value
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
                        setRowDto([]);
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
                      name="adviceName"
                      options={payrollPeiodDDL || []}
                      value={values?.adviceName}
                      onChange={(valueOption) => {
                        setValues((prev) => ({
                          ...prev,
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
                </div>
                <div className="col-lg-3">
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
                </div>
                <div className="col-md-6">
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
              {rowDto?.length > 0 && (
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
              )}
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
                              const excelLanding = () => {
                                generateExcelAction(
                                  monthYearFormatter(values?.monthYear),
                                  "",
                                  "",
                                  excelColumnFunc(0),
                                  excelDataFunc(0),
                                  strBusinessUnit,
                                  values?.adviceTo?.type,
                                  rowDto,
                                  values?.bankAccountNo,
                                  total,
                                  totalInWords,
                                  businessUnitDDL[0]?.BusinessUnitAddress
                                );
                              };
                              excelLanding();
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
                                  `/PdfAndExcelReport/BankAdviceReportForIBBL?SalaryGenerateRequestId=${values?.adviceName?.value}&MonthId=${values?.monthId}&YearId=${values?.yearId}&IntAccountId=${orgId}&IntBusinessUnitId=${buId}`,
                                  setLoading
                                );
                              } else {
                                getPDFAction(
                                  `/PdfAndExcelReport/BankAdviceReportForBEFTN?SalaryGenerateRequestId=${values?.adviceName?.value}&MonthId=${values?.monthId}&YearId=${values?.yearId}&IntAccountId=${orgId}&IntBusinessUnitId=${buId}`,
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
                          setRowDto(allData);
                          setFieldValue("search", "");
                        }}
                      />
                    </li>
                  )}
                  {rowDto?.length > 0 && (
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
                          filterData(e.target.value);
                          setFieldValue("search", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {rowDto?.length ? (
              <div className="table-card-styled tableOne">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>
                        <div>SL</div>
                      </th>
                      <th>
                        <div>Reason</div>
                      </th>
                      <th>
                        <div>Sender Acc Number</div>
                      </th>
                      <th>
                        <div>Receiving Bank Routing</div>
                      </th>
                      <th>
                        <div>Bank Acc No</div>
                      </th>
                      <th>
                        <div>Bank </div>
                      </th>
                      <th>
                        <div>Acc Type</div>
                      </th>
                      <th>
                        <div className="text-right">Amount</div>
                      </th>
                      <th>
                        <div className="text-center">Receiver ID</div>
                      </th>
                      <th>
                        <div>Receiver Name</div>
                      </th>
                      <th>
                        <div>Advice Type</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto.map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: "30px" }}>
                          <div className="tableBody-title">{index + 1}</div>
                        </td>
                        <td>
                          <div className="tableBody-title">{item?.Reason}</div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.BankAccountNumber}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.strRoutingNumber}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.strAccountNo}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.strFinancialInstitution}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">{item?.AccType}</div>
                        </td>
                        <td>
                          <div className="tableBody-title text-right">
                            {numberWithCommas(item?.numNetPayable)}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title text-center">
                            {item?.strEmployeeCode}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.strAccountName}
                          </div>
                        </td>
                        <td>
                          <div className="tableBody-title">
                            {item?.AdviceType}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
