import DownloadIcon from "@mui/icons-material/Download";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BackButton from "common/BackButton";
// import FormikRadio from "common/FormikRadio";
import PrimaryButton from "common/PrimaryButton";
import Loading from "common/loading/Loading";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { gray600, success500 } from "utility/customColor";
import { downloadFile, getPDFAction } from "utility/downloadFile";
import { getRowTotal } from "utility/getRowTotal";
import { getMonthName } from "utility/monthUtility";
import { numberWithCommas } from "utility/numberWithCommas";
// import { getSalaryDetailsReportRDLC } from "../reports/salaryDetailsReport/helper";
// import { generateExcelAction } from "../reports/salaryReport/excel/allSalaryExcel";
// import {
//   allSalaryExcelColumn,
//   allSalaryExcelData,
// } from "../reports/salaryReport/utility/excelColum";
// import HeaderInfoBar from "./components/HeaderInfoBar";
import {
  getSalaryGenerateRequestById,
  salaryGenerateApproveReject,
} from "./helper";
import { getBuDetails } from "common/api";
import { customStyles } from "utility/selectCustomStyle";
import FormikSelect from "common/FormikSelect";
import useAxiosGet from "utility/customHooks/useAxiosGet";
// import { todayDate } from "utility/todayDate";
import { Avatar, DataTable } from "Components";
import {
  allSalaryExcelColumn,
  allSalaryExcelData,
} from "modules/CompensationBenefits/reports/salaryReport/utility/excelColum";
// import { generateExcelAction } from "modules/CompensationBenefits/reports/salaryReport/excel/allSalaryExcel";
import { getSalaryDetailsReportRDLC } from "modules/CompensationBenefits/reports/salaryDetailsReport/helper";
import { dateFormatter } from "utility/dateFormatter";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import moment from "moment";
import { getTableDataMonthlyAttendance } from "modules/timeSheet/reports/joineeAttendanceReport/helper";
import HeaderInfoBar from "./HeaderInfoBar";

const initData = {
  search: "",
  salaryType: "",
  summary: "1",
  hrPosition: [],
  walletType: "",
};

const validationSchema = Yup.object({});

const AdvanceSalaryGenerateView = () => {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();

  // redux
  const { buName, isOfficeAdmin, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // state
  const [loading, setLoading] = useState(false);
  const [loadingForSum, setLoadingForSum] = useState(false);
  // const [rowDto, setRowDto] = useState([]);
  const [rowDto, getDetails, load, setRowDto] = useAxiosGet();
  // eslint-disable-next-line no-unused-vars

  const [buDetails, setBuDetails] = useState({});
  const [hrPositionDDL, getWorkplaceNhrPosition, , setHrPositionDDL] =
    useAxiosGet([]);

  const { values, setFieldValue, handleSubmit, setValues } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    validationSchema: validationSchema,
    onSubmit: () => {
      // saveHandler();
    },
  });

  const getData = () => {
    // getSalaryGenerateRequestById(
    //   intAccountId,
    //   intBusinessUnitId,
    //   intMonth,
    //   intYear,
    //   intSalaryGenerateRequestId,
    //   setRowDto,
    //   setAllData,
    //   setLoadingForSum,
    //   wgId
    // );
    getDetails(
      `/AdvanceSalary/AdvanceSalary/${state?.advanceSalaryCode}?yearId=${state?.yearId}&monthId=${state?.monthId}&fromDate=${state?.fromDate}&toDate=${state?.todate}&advancesalaryId=${state?.advanceSalaryId}`
    );
  };

  useEffect(() => {
    if (state?.advanceSalaryCode) {
      getData();
    }
    getBuDetails(buId, setBuDetails, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // excel column set up

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

  // const totalEmpLOnSalarySheet = useMemo(() => {
  //   return rowDto.reduce((accumulator, currentValue) => {
  //     if (currentValue["SalaryGenerateHeaderId"] !== null) {
  //       return accumulator + 1;
  //     }
  //     return accumulator;
  //   }, 0);
  // }, [rowDto]);

  const [detailsData, setDetailsData] = useState("");
  const [detailsReportLoading, setDetailsReportLoading] = useState(false);

  const columns = [
    {
      title: "SL",
      render: (_) => _?.sl,
      width: "25px",
    },
    {
      title: "Workplace",
      dataIndex: "workplaceName",
      width: "125px",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
    },
    {
      title: "Employee Code",
      dataIndex: "employeeCode",
    },
    {
      title: "Employee Type",
      dataIndex: "employeeTypeName",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
    },
    {
      title: "HR Position",
      dataIndex: "hrPositionName",
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      render: (text) => (text ? dateFormatter(text) : "-"), // Format date
    },
    {
      title: "To Date",
      dataIndex: "todate",
      render: (text) => (text ? dateFormatter(text) : "-"), // Format date
    },
    {
      title: "Advance Amount",
      dataIndex: "amount",
    },
  ];
  const excelCol = {
    sl: "SL",
    workplaceName: "Workplace",
    employeeName: "Employee Name",
    employeeCode: "Employee Code",
    employeeTypeName: "Employee Type",
    departmentName: "Department",
    designationName: "Designation",
    hrPositionName: "HR Position",
    fromDate: "From Date",
    todate: "To Date",
    amount: "Advance Amount",
  };
  return (
    <form onSubmit={handleSubmit}>
      {(loadingForSum || detailsReportLoading) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <BackButton title={"Advance Salary Generate View"} />
        </div>
        <div className="table-card-body" style={{ overflow: "hidden" }}>
          <div className="table-card-styled">
            <HeaderInfoBar data={state} setLoading={setLoading} />

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
                    Total employee {rowDto?.length}
                  </p>
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
                          const excelLanding = async () => {
                            setLoading(true);
                            if (rowDto?.length <= 0) {
                              return toast.warn("No Data Found");
                            }
                            const newData = rowDto.map((item, index) => {
                              return {
                                ...item,
                                sl: index + 1,
                                fromDate: dateFormatter(item?.fromDate),
                                todate: dateFormatter(item?.todate),
                              };
                            });
                            createCommonExcelFile({
                              titleWithDate: `Advance Salary Details Report - ${dateFormatter(
                                moment(state?.fromDate).format("YYYY-MM-DD")
                              )} to ${dateFormatter(
                                moment(state?.toDate).format("YYYY-MM-DD")
                              )}`,
                              fromDate: "",
                              toDate: "",
                              buAddress: buDetails?.strAddress,
                              businessUnit: values?.workplaceGroup?.value
                                ? buDetails?.strWorkplace
                                : buName,
                              tableHeader: excelCol,
                              getTableData: () =>
                                getTableDataMonthlyAttendance(
                                  newData,
                                  Object.keys(excelCol)
                                ),

                              // eslint-disable-next-line @typescript-eslint/no-empty-function
                              getSubTableData: () => {},
                              subHeaderInfoArr: [],
                              subHeaderColumn: [],
                              tableFooter: [],
                              extraInfo: {},
                              tableHeadFontSize: 10,
                              widthList: {
                                C: 30,
                                B: 30,
                                D: 30,
                                E: 25,
                                F: 20,
                                G: 25,
                                H: 15,
                                I: 15,
                                J: 20,
                                K: 20,
                              },
                              commonCellRange: "A1:J1",
                              CellAlignment: "left",
                            });
                            setLoading(false);
                          };
                          excelLanding();

                          // const valueArrayHRPosition = (
                          //   values?.hrPosition || []
                          // )?.map((obj) => obj.value);
                          // const url = `/PdfAndExcelReport/GetSalaryLandingData_Matador_Excel?intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}&intMonthId=${
                          //   !state?.data
                          //     ? state?.intMonth
                          //     : state?.data?.intMonth
                          // }&intYearId=${
                          //   !state?.data ? state?.intYear : state?.data?.intYear
                          // }&strSalaryCode=${
                          //   !state?.data
                          //     ? state?.strSalaryCode
                          //     : state?.data?.strSalaryCode
                          // }&strHrPositionList=${
                          //   valueArrayHRPosition || 0
                          // }&intPaymentMethod=${values?.walletType?.value || 0}`;

                          // downloadFile(
                          //   url,
                          //   "Salary Details Report",
                          //   "xlsx",
                          //   setLoading
                          // );
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
                  {rowDto?.length > 0 && (
                    <Tooltip title="Print as PDF" arrow>
                      <button
                        className="btn-save"
                        type="button"
                        onClick={() => {
                          if (rowDto?.length <= 0) {
                            return toast.warn("No Data Found");
                          } else {
                            const url = `/PdfAndExcelReport/AdvanceSalaryReport?advanceSalaryCode=${
                              state?.advanceSalaryCode
                            }&fromDate=${moment(state?.fromDate).format(
                              "YYYY-MM-DD"
                            )}&toDate=${moment(state?.todate).format(
                              "YYYY-MM-DD"
                            )}`;

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
            {rowDto?.length > 0 && (
              <>
                {load && <Loading />}
                <DataTable
                  bordered
                  data={rowDto?.length > 0 ? rowDto : []}
                  header={columns}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
export default AdvanceSalaryGenerateView;
