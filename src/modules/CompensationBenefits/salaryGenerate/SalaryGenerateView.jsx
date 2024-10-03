import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BackButton from "../../../common/BackButton";
import FormikRadio from "../../../common/FormikRadio";
import PrimaryButton from "../../../common/PrimaryButton";
import Loading from "../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray600, greenColor, success500 } from "../../../utility/customColor";
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
import { customStyles } from "utility/selectCustomStyle";
import FormikSelect from "common/FormikSelect";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { todayDate } from "utility/todayDate";
import { Avatar, DataTable } from "Components";

const initData = {
  search: "",
  salaryType: "",
  summary: "1",
  hrPosition: [],
  walletType: "",
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
  const [loadingForSum, setLoadingForSum] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [, setAllData] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalAllowance, setTotalAllowance] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalNetPay, setTotalNetPay] = useState(0);
  const [totalBankPay, setTotalBankPay] = useState(0);
  const [totalDBPay, setTotalDBPay] = useState(0);
  const [totalCashPay, setTotalCashPay] = useState(0);
  const [buDetails, setBuDetails] = useState({});
  const [hrPositionDDL, getWorkplaceNhrPosition, , setHrPositionDDL] =
    useAxiosGet([]);
  // const [tableAllowanceHead, setTableAllowanceHead] = useState([]);
  // const [tableDeductionHead, setTableDeductionHead] = useState([]);
  // const [tableColumn, setTableColumn] = useState([]);

  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [totalAttendence, setTotalAttendence] = useState(0);
  // const [resDetailsReport, setDetailsReport] = useState([]);

  const month = getMonthName(state?.intMonth);
  const year = state?.intYear;
  const monthYear = `${month}, ${year}`;

  const { values, setFieldValue, handleSubmit, setValues } = useFormik({
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
      setLoadingForSum,
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
    getWorkplaceNhrPosition(
      `/Payroll/SalarySelectQueryAll?partName=HrPositionListBySalaryCode&intAccountId=${orgId}&strSalaryCode=${
        !state?.data ? state?.strSalaryCode : state?.data?.strSalaryCode
      }&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}`,
      (WorkplaceNhrPosition) => {
        const hrPositions =
          WorkplaceNhrPosition.map((item) => ({
            value: item.intHrPosition,
            label: item.strHrPosition,
          })) || [];
        // const uniqueWorkplaceIds = [
        //   ...new Set(WorkplaceNhrPosition.map((item) => item.intWorkplaceId)),
        // ];
        // const workplaces = uniqueWorkplaceIds.map((id) => {
        //   const correspondingItem = WorkplaceNhrPosition.find(
        //     (item) => item.intWorkplaceId === id
        //   );
        //   return {
        //     value: id,
        //     intWorkplaceId: id,
        //     label: correspondingItem ? correspondingItem.strWorkplaceName : "",
        //   };
        // });
        // setFieldValue("workplace", workplaces);
        // setFieldValue("hrPosition", hrPositions);
        setHrPositionDDL(hrPositions);
      }
    );
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
        }&strHrPositionList=&intPaymentMethod=0`,
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

  const sharedOnCell = (record) => {
    if (record?.DeptName) {
      return { colSpan: 0 };
    }

    return {};
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "SL",
      render: (text, record) =>
        record?.DeptName?.trim() ? (
          <p style={{ fontSize: "13px", fontWeight: 500, padding: "5px 0" }}>
            Department: {record.DeptName}
          </p>
        ) : (
          text
        ),
      onCell: (record) => ({
        colSpan: record?.DeptName?.trim() ? (orgId === 5 ? 10 : 9) : 1,
      }),
      width: 40,
      fixed: "left",
    },
    {
      title: "Employee Information",
      colSpan: 3,
      children: [
        {
          title: "Employee ID",
          dataIndex: "EmployeeCode",
          align: "center",
          render: (text) => text,
          onCell: sharedOnCell,
          fixed: "left",
          width: 120,
        },
        {
          title: "Employee Name",
          dataIndex: "EmployeeName",
          align: "left",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : (
              <div className="d-flex align-items-center">
                <Avatar title={text} />
                <div className="ml-2">
                  <span>{text}</span>
                </div>
              </div>
            ),
          onCell: sharedOnCell,
          fixed: "left",
          width: 180,
        },
        {
          title: "Designation",
          dataIndex: "DesignationName",
          align: "left",
          render: (text) => text,
          onCell: sharedOnCell,
          fixed: "left",
          width: 120,
        },
      ],
    },

    {
      title: "Gross Salary",
      dataIndex: "GrossSalary",
      key: "GrossSalary",
      align: "right",
      onCell: sharedOnCell,
      children: [
        {
          title: () => {
            return numberWithCommas(
              getRowTotal(rowDto, "GrossSalary").toFixed(2)
            );
          },
          dataIndex: "GrossSalary",
          align: "right",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : numberWithCommas(text),
          onCell: sharedOnCell,
        },
      ],
    },
    {
      title: "Total Allowance",
      dataIndex: "TotalAllowance",
      key: "TotalAllowance",
      align: "right",
      onCell: sharedOnCell,
      children: [
        {
          title: () => {
            return numberWithCommas(
              getRowTotal(rowDto, "TotalAllowance").toFixed(2)
            );
          },
          dataIndex: "TotalAllowance",
          align: "right",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : numberWithCommas(text),
          onCell: sharedOnCell,
        },
      ],
    },
    {
      title: "Total Deduction",
      dataIndex: "TotalDeduction",
      key: "TotalDeduction",
      align: "right",
      onCell: sharedOnCell,
      children: [
        {
          title: () => {
            return numberWithCommas(
              getRowTotal(rowDto, "TotalDeduction").toFixed(2)
            );
          },
          dataIndex: "TotalDeduction",
          align: "right",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : numberWithCommas(text),
          onCell: sharedOnCell,
        },
      ],
    },
    {
      title: "PF Amount",
      dataIndex: "PFAmount",
      key: "PFAmount",
      align: "right",
      hidden: orgId === 5 ? false : true,
      onCell: sharedOnCell,
      children: [
        {
          hidden: orgId === 5 ? false : true,
          title: () => {
            return numberWithCommas(getRowTotal(rowDto, "PFAmount").toFixed(2));
          },
          dataIndex: "PFAmount",
          align: "right",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : numberWithCommas(text),
          onCell: sharedOnCell,
        },
      ],
    },
    {
      title: "Net Pay",
      dataIndex: "NetPay",
      key: "NetPay",
      align: "right",
      onCell: sharedOnCell,
      children: [
        {
          title: () => {
            return numberWithCommas(getRowTotal(rowDto, "NetPay").toFixed(2));
          },
          dataIndex: "NetPay",
          align: "right",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : numberWithCommas(text),
          onCell: sharedOnCell,
        },
      ],
    },
    {
      title: "Bank Pay",
      dataIndex: "BankPay",
      key: "BankPay",
      align: "right",
      onCell: sharedOnCell,
      children: [
        {
          title: () => {
            return numberWithCommas(getRowTotal(rowDto, "BankPay").toFixed(2));
          },
          dataIndex: "BankPay",
          align: "right",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : numberWithCommas(text),
          onCell: sharedOnCell,
        },
      ],
    },
    {
      title: "Digital Bank Pay",
      dataIndex: "DegitalBankPay",
      key: "DegitalBankPay",
      align: "right",
      onCell: sharedOnCell,
      children: [
        {
          title: () => {
            return numberWithCommas(
              getRowTotal(rowDto, "DegitalBankPay").toFixed(2)
            );
          },
          dataIndex: "DegitalBankPay",
          align: "right",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : numberWithCommas(text),
          onCell: sharedOnCell,
        },
      ],
    },
    {
      title: "Cash Pay",
      dataIndex: "CashPay",
      key: "CashPay",
      align: "right",
      onCell: sharedOnCell,
      children: [
        {
          title: () => {
            return numberWithCommas(getRowTotal(rowDto, "CashPay").toFixed(2));
          },
          dataIndex: "CashPay",
          align: "right",
          render: (text, record) =>
            record?.DeptName?.trim() ? null : numberWithCommas(text),
          onCell: sharedOnCell,
        },
      ],
    },
    {
      title: "Attendance",
      align: "center",
      onCell: sharedOnCell,
      children: [
        {
          title: "Total Working Days",
          dataIndex: "TotalWorkingDays",
          key: "TotalWorkingDays",
          align: "center",
          onCell: sharedOnCell,
          render: (text, record) => (record?.DeptName?.trim() ? null : text),
          width: 150,
        },
        {
          title: "Total Attendance",
          dataIndex: "PayableDays",
          key: "PayableDays",
          align: "center",
          onCell: sharedOnCell,
          render: (text, record) => (record?.DeptName?.trim() ? null : text),
          width: 150,
        },
      ],
    },

    {
      title: "Workplace",
      dataIndex: "WorkplaceName",
      key: "WorkplaceName",
      align: "center",
      render: (text, record) => (record?.DeptName?.trim() ? null : text),
      onCell: sharedOnCell,
      width: 200,
    },
    {
      title: "Workplace Group",
      dataIndex: "WorkplaceGroupName",
      key: "WorkplaceGroupName",
      align: "center",
      render: (text, record) => (record?.DeptName?.trim() ? null : text),
      onCell: sharedOnCell,
      width: 150,
    },
    {
      title: "Payroll Group",
      dataIndex: "PayrollGroupName",
      key: "PayrollGroupName",
      align: "center",
      render: (text, record) => (record?.DeptName?.trim() ? null : text),
      onCell: sharedOnCell,
      width: 150,
    },
  ].filter((item) => !item.hidden);

  return (
    <form onSubmit={handleSubmit}>
      {(loadingForSum || detailsReportLoading) && <Loading />}
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
            {values?.summary === "2" && (
              <div
                className="card-style"
                style={{ margin: "10px 5px 15px 5px" }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-field-main">
                      <label>HR Position</label>
                      <FormikSelect
                        name="hrPosition"
                        isClearable={false}
                        options={hrPositionDDL || []}
                        value={values?.hrPosition}
                        onChange={(valueOption) => {
                          setFieldValue("hrPosition", valueOption);

                          // const valueArrayHRPosition = valueOption?.map(
                          //   (obj) => obj.value
                          // );

                          // const parameter = {
                          //   setterData: setDetailsData,
                          //   setLoading: setDetailsReportLoading,
                          //   url: `/PdfAndExcelReport/GetSalaryLandingData_Matador?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
                          //     !state?.data
                          //       ? state?.intMonth
                          //       : state?.data?.intMonth
                          //   }&intYearId=${
                          //     !state?.data
                          //       ? state?.intYear
                          //       : state?.data?.intYear
                          //   }&strSalaryCode=${
                          //     !state?.data
                          //       ? state?.strSalaryCode
                          //       : state?.data?.strSalaryCode
                          //   }&strHrPositionList=${
                          //     valueArrayHRPosition || ""
                          //   }&intPaymentMethod=${
                          //     values?.walletType?.value || 0
                          //   }`,
                          // };
                          // getSalaryDetailsReportRDLC(parameter);
                        }}
                        styles={{
                          ...customStyles,
                          control: (provided) => ({
                            ...provided,
                            minHeight: "auto",
                            height:
                              values?.hrPosition?.length > 1 ? "auto" : "auto",
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
                              values?.hrPosition?.length > 1 ? "auto" : "auto",
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
                        // isDisabled={singleData}

                        placeholder="HR Position"
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="input-field-main">
                      <label>Payment Method</label>
                      {/* 
                          (@intBankOrWalletType, 0) = 0 OR 
                          (@intBankOrWalletType = 1 AND sah.numBankPayInAmount > 0) 
                          (@intBankOrWalletType = 2 AND sah.numDigitalPayInAmount > 0))
                          (@intBankOrWalletType = 3 AND sah.numCashPayInAmount > 0)
                      
                      */}
                      <FormikSelect
                        name="walletType"
                        options={
                          [
                            {
                              value: 1,
                              label: "Bank Pay",
                            },
                            {
                              value: 2,
                              label: "Digital Pay",
                            },
                            {
                              value: 3,
                              label: "Cash Pay",
                            },
                          ] || []
                        }
                        value={values?.walletType}
                        onChange={(valueOption) => {
                          setValues((prev) => ({
                            ...prev,
                            walletType: valueOption,
                          }));

                          // const valueArrayHRPosition = (
                          //   values?.hrPosition || []
                          // )?.map((obj) => obj.value);

                          // const parameter = {
                          //   setterData: setDetailsData,
                          //   setLoading: setDetailsReportLoading,
                          //   url: `/PdfAndExcelReport/GetSalaryLandingData_Matador?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
                          //     !state?.data
                          //       ? state?.intMonth
                          //       : state?.data?.intMonth
                          //   }&intYearId=${
                          //     !state?.data
                          //       ? state?.intYear
                          //       : state?.data?.intYear
                          //   }&strSalaryCode=${
                          //     !state?.data
                          //       ? state?.strSalaryCode
                          //       : state?.data?.strSalaryCode
                          //   }&strHrPositionList=${
                          //     valueArrayHRPosition || 0
                          //   }&intPaymentMethod=${valueOption?.value || 0}`,
                          // };
                          // getSalaryDetailsReportRDLC(parameter);
                        }}
                        placeholder=""
                        styles={customStyles}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mt-4">
                    <button
                      className="btn-green"
                      style={{ minWidth: "" }}
                      onClick={() => {
                        const valueArrayHRPosition = values?.hrPosition?.length
                          ? values.hrPosition.map((obj) => obj.value)
                          : "";

                        const parameter = {
                          setterData: setDetailsData,
                          setLoading: setDetailsReportLoading,
                          url: `/PdfAndExcelReport/GetSalaryLandingData_Matador?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
                            !state?.data
                              ? state?.intMonth
                              : state?.data?.intMonth
                          }&intYearId=${
                            !state?.data ? state?.intYear : state?.data?.intYear
                          }&strSalaryCode=${
                            !state?.data
                              ? state?.strSalaryCode
                              : state?.data?.strSalaryCode
                          }&strHrPositionList=${valueArrayHRPosition}&intPaymentMethod=${
                            values?.walletType?.value || 0
                          }`,
                        };
                        getSalaryDetailsReportRDLC(parameter);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                            setFieldValue("hrPosition", []);
                            setFieldValue("walletType", "");
                            setFieldValue("summary", e.target.value);
                          }}
                          checked={values?.summary === "1"}
                        />
                      </div>
                    </div>
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
                  </div>
                </div>
              </div>

              <div>
                <ul className="d-flex flex-wrap align-items-center justify-content-center">
                  <li className="pr-2">
                    <button
                      className="btn-green"
                      style={{ minWidth: "120px" }}
                      onClick={(e) => {
                        const hrList = values?.hrPosition
                          ?.map((item) => item?.value)
                          .join(",");
                        e.stopPropagation();
                        const url = `/PdfAndExcelReport/GetCashPayPayslipMatador?accountId=${orgId}&salaryCode=${
                          !state?.data
                            ? state?.strSalaryCode
                            : state?.data?.strSalaryCode
                        }&businessUnitId=${buId}&hrPositions=${
                          hrList || ""
                        }&intWorkplaceGroupId=${wgId}&intMonthId=${
                          state?.intMonth
                        }&intYearId=${state?.intYear}&intPaymentMethod=${
                          values?.walletType?.value || ""
                        }`;

                        getPDFAction(
                          url,
                          setLoading,
                          `Salary Cash Pay Slip-${todayDate()}`
                        );
                      }}
                    >
                      Cash Pay Slip
                    </button>
                  </li>
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

                            const valueArrayHRPosition = (
                              values?.hrPosition || []
                            )?.map((obj) => obj.value);
                            const url = `/PdfAndExcelReport/GetSalaryLandingData_Matador_Excel?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
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
                            }&strHrPositionList=${
                              valueArrayHRPosition || 0
                            }&intPaymentMethod=${
                              values?.walletType?.value || 0
                            }`;

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
                          if (detailsData?.length <= 0) {
                            return toast.warn("No Data Found");
                          } else {
                            const valueArrayHRPosition = (
                              values?.hrPosition || []
                            )?.map((obj) => obj.value);
                            const url = `/PdfAndExcelReport/GetSalaryLandingData_Matador_PDF?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
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
                            }&strHrPositionList=${
                              valueArrayHRPosition || 0
                            }&intPaymentMethod=${
                              values?.walletType?.value || 0
                            }`;

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
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div>
            {values?.summary === "1" && (
              <>
                {loading && <Loading />}
                <DataTable
                  data={rowDto}
                  header={columns}
                  rowKey={(record) => record.EmployeeCode}
                  pagination={false}
                  scroll={{ x: 2500, y: 500 }}
                  bordered
                />
              </>
            )}
            {values?.summary === "2" && (
              <>
                {loading && <Loading />}
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
