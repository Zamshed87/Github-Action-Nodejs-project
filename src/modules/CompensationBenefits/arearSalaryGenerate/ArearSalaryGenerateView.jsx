import {
  SearchOutlined,
  SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
// import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { IconButton, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import AvatarComponent from "../../../common/AvatarComponent";
import BackButton from "../../../common/BackButton";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import ScrollableTable from "../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import { getRowTotal } from "../../../utility/getRowTotal";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { generateExcelAction } from "../reports/salaryReport/excel/allSalaryExcel";
import {
  allSalaryExcelColumn,
  allSalaryExcelData
} from "../reports/salaryReport/utility/excelColum";
import HeaderInfoBar from "./components/HeaderInfoBar";
import {
  getArearSalaryGenerateRequestById,
  salaryGenerateApproveReject
} from "./helper";
import { getBuDetails } from "common/api";

const initData = {
  search: "",
  salaryType: "",
};

const validationSchema = Yup.object({});

const ArearSalaryGenerateView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [buDetails, setBuDetails] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalAllowance, setTotalAllowance] = useState(0);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalNetPay, setTotalNetPay] = useState(0);
  const [totalBankPay, setTotalBankPay] = useState(0);
  const [totalDBPay, setTotalDBPay] = useState(0);
  const [totalCashPay, setTotalCashPay] = useState(0);
  const { values, errors, touched, setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    validationSchema: validationSchema,
    onSubmit: () => {
      saveHandler();
    },
  });
  useEffect(() => {
    if (rowDto.length > 0) {
      setTotalSalary(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.numGrossSalary, 0)
            .toFixed(2)
        )
      );
      setTotalAllowance(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.numTotalAllowance, 0)
            .toFixed(2)
        )
      );
      setTotalDeduction(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.numTotalDeduction, 0)
            .toFixed(2)
        )
      );
      setTotalNetPay(
        Number(rowDto?.reduce((acc, item) => acc + item?.netPay, 0).toFixed(2))
      );
      setTotalBankPay(
        Number(rowDto?.reduce((acc, item) => acc + item?.bankPay, 0).toFixed(2))
      );
      setTotalDBPay(
        Number(
          rowDto
            ?.reduce((acc, item) => acc + item?.degitalBankPay, 0)
            .toFixed(2)
        )
      );
      setTotalCashPay(
        Number(rowDto?.reduce((acc, item) => acc + item?.cashPay, 0).toFixed(2))
      );
    }
  }, [rowDto]);

  const { intAccountId, intBusinessUnitId, intSalaryGenerateRequestId } =
    !state?.data ? state : state?.data;

  let saveHandler = () => {};

  const getData = () => {
    getArearSalaryGenerateRequestById(
      intAccountId,
      intBusinessUnitId,
      intSalaryGenerateRequestId,
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getData();
    getBuDetails(intBusinessUnitId, setBuDetails, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);

  // filter data
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strPayrollGroupName?.toLowerCase()) ||
          regex.test(item?.strWorkplaceGroupName?.toLowerCase()) ||
          regex.test(item?.strWorkplaceName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const approveNRejectHandler = (text) => {
    let payload = [
      {
        applicationId: intSalaryGenerateRequestId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
        fromDate: state?.data?.dteEffectiveFrom,
        toDate: state?.data?.dteEffectiveTo,
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

  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <BackButton title={"Arrear Salary Generate View"} />
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
                  Total employee {rowDto?.length}
                </p>
              </div>
              <div>
                <ul className="d-flex flex-wrap align-items-center justify-content-center">
                  <li
                    className="pr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      const excelLanding = () => {
                        generateExcelAction(
                          "Arear Salary Generate",
                          "",
                          "",
                          excelColumnFunc(0),
                          excelDataFunc(0),
                          state?.strBusinessUnit,
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
                          dateFormatter(state?.dteSalaryGenerateFrom)
                        );
                      };
                      excelLanding();
                    }}
                  >
                    <Tooltip title="Export CSV" arrow>
                      <IconButton style={{ color: "#101828" }}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </li>
                  {/* <li className="pr-2">
                    <Tooltip title="Print" arrow>
                      <IconButton style={{ color: "#101828" }}>
                        <LocalPrintshopIcon />
                      </IconButton>
                    </Tooltip>
                  </li> */}
                  {values?.search && (
                    <li>
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
                  <li>
                    <DefaultInput
                      classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
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
                </ul>
              </div>
            </div>
          </div>
          <div>
            <ScrollableTable
              classes="salary-process-table"
              secondClasses="table-card-styled tableOne scroll-table-height"
            >
              <thead>
                <tr>
                  <th rowSpan="2" style={{ width: "30px" }}>
                    SL
                  </th>
                  <th rowSpan="2">Employee Name</th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Salary</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(
                              getRowTotal(rowDto, "numGrossSalary").toFixed(2)
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Total Allowance</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(
                              getRowTotal(rowDto, "numTotalAllowance").toFixed(
                                2
                              )
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Total Deduction</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(
                              getRowTotal(rowDto, "numTotalDeduction").toFixed(
                                2
                              )
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Net Pay</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(
                              getRowTotal(rowDto, "netPay").toFixed(2)
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Bank Pay</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(
                              getRowTotal(rowDto, "bankPay").toFixed(2)
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Digital Bank Pay</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(
                              getRowTotal(rowDto, "degitalBankPay").toFixed(2)
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Cash Pay</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(
                              getRowTotal(rowDto, "cashPay").toFixed(2)
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th rowSpan="2">Workplace</th>
                  <th rowSpan="2">Workplace Group</th>
                  <th rowSpan="2">Payroll Group</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div>{index + 1}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="emp-avatar">
                          <AvatarComponent
                            classess=""
                            letterCount={1}
                            label={item?.strEmployeeName}
                          />
                        </div>
                        <div className="ml-2">
                          <span className="tableBody-title">
                            {item?.strEmployeeName}[{item?.intEmployeeId}]
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.numGrossSalary) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.numTotalAllowance) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.numTotalDeduction) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.netPay) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.bankPay) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.degitalBankPay) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.cashPay) || "-"}
                    </td>
                    <td>{item?.strWorkplaceName}</td>
                    <td>{item?.strWorkplaceGroupName}</td>
                    <td>{item?.strPayrollGroupName}</td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
          </div>
        </div>
      </div>
    </form>
  );
};
export default ArearSalaryGenerateView;
