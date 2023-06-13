import DownloadIcon from "@mui/icons-material/Download";
import { IconButton, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import AvatarComponent from "../../../common/AvatarComponent";
import BackButton from "../../../common/BackButton";
import Loading from "../../../common/loading/Loading";
import PrimaryButton from "../../../common/PrimaryButton";
import ScrollableTable from "../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../utility/dateFormatter";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import HeaderInfoBar from "./components/HeaderInfoBar";
import {
  bonusGenerateApproveReject,
  createBonusGenExcelHandeler,
  getBonusGenerateLanding,
  getBuDetails,
} from "./helper";
import { toast } from "react-toastify";
import { getPDFAction } from "../../../utility/downloadFile";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

const initData = {
  search: "",
  salaryType: "",
};

const validationSchema = Yup.object({});

const BonusGenerateView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // const [allData, setAllData] = useState([]);
  const [buDetails, setBuDetails] = useState({});
  // const [totalSalary, setTotalSalary] = useState(0);
  // const [totalBasic, setTotalBasic] = useState(0);
  // const [totalBonus, setTotalBonus] = useState(0);

  const { handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    validationSchema: validationSchema,
    onSubmit: () => {
      saveHandler();
    },
  });

  const { intBonusHeaderId } = !state?.data ? state : state?.data;

  let saveHandler = () => {};

  const { orgId, buId, employeeId, isOfficeAdmin } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // useEffect(() => {
  //   if (rowDto.length > 0) {
  //     setTotalSalary(
  //       Number(
  //         rowDto?.reduce((acc, item) => acc + item?.numSalary, 0).toFixed(2)
  //       )
  //     );
  //     setTotalBasic(
  //       Number(
  //         rowDto?.reduce((acc, item) => acc + item?.numBasic, 0).toFixed(2)
  //       )
  //     );
  //     setTotalBonus(
  //       Number(
  //         rowDto
  //           ?.reduce((acc, item) => acc + item?.numBonusAmount, 0)
  //           .toFixed(2)
  //       )
  //     );
  //   }
  // }, [rowDto]);

  useEffect(() => {
    if (state?.intBonusHeaderId) {
      getBonusGenerateLanding(
        {
          strPartName: state?.isArrearBonus
            ? "ArrearBonusGenerateViewById"
            : "BonusGenerateViewById",
          intBonusHeaderId: state?.intBonusHeaderId,
          // intAccountId: state?.intAccountId,
          intBusinessUnitId: state?.intBusinessUnitId,
          intBonusId: state?.intBonusId,
          intPayrollGroupId: state?.intPayrollGroupId,
          intWorkplaceGroupId: state?.intWorkplaceGroupId,
          intReligionId: state?.intReligionId,
          dteEffectedDate: state?.dteEffectedDateTime,
          intCreatedBy: employeeId,
        },
        setRowDto,
        "",
        setLoading
      );
    } else {
      getBonusGenerateLanding(
        {
          strPartName: state?.data?.isArrearBonus
            ? "ArrearBonusGenerateViewById"
            : "BonusGenerateViewById",
          intBonusHeaderId: state?.data?.intBonusHeaderId,
          // intAccountId: state?.data?.intAccountId,
          intBusinessUnitId: state?.data?.intBusinessUnitId,
          intBonusId: state?.data?.intBonusId,
          intPayrollGroupId: state?.data?.intPayrollGroupId,
          intWorkplaceGroupId: state?.data?.intWorkplaceGroupId,
          intReligionId: state?.data?.intReligionId,
          dteEffectedDate: state?.data?.dteEffectedDateTime,
          intCreatedBy: employeeId,
        },
        setRowDto,
        "",
        setLoading
      );
    }
  }, [orgId, buId, employeeId, state]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);
  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
  }, [buId]);

  // filter data
  // const filterData = (keywords) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.filter(
  //       (item) =>
  //         regex.test(item?.strBusinessUnit?.toLowerCase()) ||
  //         regex.test(item?.strBonusName?.toLowerCase())
  //     );
  //     setRowDto(newDta);
  //   } catch {
  //     setRowDto([]);
  //   }
  // };

  const approveNRejectHandler = (text) => {
    let payload = [
      {
        applicationId: intBonusHeaderId,
        approverEmployeeId: employeeId,
        isReject: text === "Reject" ? true : false,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
      },
    ];
    const callback = () => {
      history.push("/approval/bonusGenerateApproval");
    };
    bonusGenerateApproveReject(payload, callback);
  };

  // excel column set up
  // const excelColumnFunc = (processId) => {
  //   switch (processId) {
  //     default:
  //       return allBonusExcelColumn;
  //   }
  // };

  // // excel data set up
  // const excelDataFunc = (processId) => {
  //   switch (processId) {
  //     default:
  //       return allBonusExcelData(rowDto);
  //   }
  // };

  const [lastRow, setLastRow] = useState({});
  const [landingData, setLandingData] = useState([]);
  useEffect(() => {
    setLastRow(rowDto[rowDto?.length - 1]);
    let temp = [];
    let prev = { ...rowDto?.[0] };
    temp.push(prev);
    for (let i = 1; i < rowDto?.length - 1; i++) {
      if (rowDto?.[i].DeptName?.length > 0) {
        temp[i - 1] = { ...rowDto[i - 1], DeptName: "Sub-Total:" };
        prev = { ...rowDto?.[i] };
        temp.push(rowDto?.[i]);
      } else {
        temp.push(rowDto?.[i]);
      }
    }
    temp[rowDto?.length - 2] = {
      ...rowDto?.[rowDto?.length - 2],
      DeptName: "Sub-Total:",
    };
    setLandingData(temp);
  }, [rowDto]);

  const empCount = useMemo(() => {
    const len = landingData?.filter((item) => item?.SL);
    return len?.length;
  }, [landingData]);

  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <BackButton title={"Bonus Generate View"} />
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
                  Total employee {empCount || 0}
                </p>
              </div>
              <div>
                <ul className="d-flex flex-wrap align-items-center justify-content-center">
                  {/*  <li
                    className="pr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      const excelLanding = () => {
                        generateBonusAction(
                          "Bonus Generate",
                          "",
                          "",
                          excelColumnFunc(0),
                          excelDataFunc(0),
                          buDetails?.strBusinessUnit,
                          0,
                          rowDto,
                          totalSalary,
                          totalBasic,
                          totalBonus,
                          buDetails?.strBusinessUnitAddress,
                          dateFormatter(state?.dteEffectedDateTime)
                        );
                      };
                      excelLanding();
                    }}
                  >
                    <Tooltip title="Export CSV" arrow>
                      <IconButton
                        style={{ color: "#101828", cursor: "pointer" }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </li> */}
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!landingData?.length > 0) {
                        return toast.warn("No Data Found");
                      }
                      createBonusGenExcelHandeler({
                        monthYear: dateFormatter(state?.dteEffectedDateTime),
                        buAddress: buDetails?.strBusinessUnitAddress,
                        businessUnit: buDetails?.strBusinessUnit,
                        data: landingData,
                        lastRow: lastRow,
                        effectiveDate: state?.dteEffectedDateTime,
                        headeTitle: `Bonus Sheet of ${state?.strWorkplaceGroup} (${state?.strBonusName})`,
                      });
                    }}
                  >
                    <Tooltip title="Export CSV" arrow>
                      <IconButton
                        style={{ color: "#101828", cursor: "pointer" }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!landingData?.length > 0) {
                        return toast.warn("No Data Found");
                      }
                      getPDFAction(
                        `/PdfAndExcelReport/EmpBonusReportPdf?PartType=BonusGenerateViewById&intAccountId=${orgId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${state?.intWorkplaceGroupId}&BonusHeaderId=${intBonusHeaderId}&BonusId=${state?.intBonusId}`,
                        setLoading
                      );
                    }}
                  >
                    <Tooltip title="Print" arrow>
                      <IconButton
                        style={{ color: "#101828", cursor: "pointer" }}
                      >
                        <LocalPrintshopIcon />
                      </IconButton>
                    </Tooltip>
                  </li>

                  {/*   <li>
                      <ResetButton
                        classes="btn-filter-reset"
                        title="Reset"
                        icon={<SettingsBackupRestoreOutlined />}
                        onClick={() => {
                          setRowDto(allData);
                          setFieldValue("search", "");
                        }}
                      />
                    </li> */}
                  {/*  <li>
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
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <ScrollableTable
              classes="salary-process-table"
              secondClasses="table-card-styled tableOne scroll-table-height"
              customClass="bonus-generate-custom"
            >
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th
                    rowSpan="2"
                    style={{ minWidth: "200px", textAlign: "center" }}
                  >
                    SL
                  </th>
                  <th
                    rowSpan="2"
                    style={{ textAlign: "center", minWidth: "130px" }}
                  >
                    Employee ID
                  </th>
                  <th rowSpan="2">Employee Name</th>
                  <th rowSpan="2">Designation</th>
                  <th rowSpan="2">Date of Joining</th>
                  <th rowSpan="2">Job Duration</th>
                  <th
                    style={{ textAlign: "center" }}
                    className="th-inner-table"
                  >
                    <span className="mr-2">Gross Salary</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(lastRow?.numSalary)}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th
                    style={{ textAlign: "center" }}
                    className="th-inner-table"
                  >
                    <span className="mr-2">Basic Salary</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(lastRow?.numBasic)}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th
                    style={{ textAlign: "center" }}
                    className="th-inner-table"
                  >
                    <span className="mr-2">Bonus Amount</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(lastRow?.numBonusAmount)}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th rowSpan="2">Bonus Percentage</th>
                  <th rowSpan="2">Workplace</th>
                  <th rowSpan="2">Workplace Group</th>
                </tr>
              </thead>
              <tbody>
                {landingData?.map((item, index) => (
                  <tr key={index}>
                    <td
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {item?.DeptName?.trim() ? (
                        item?.DeptName === "Sub-Total:" ? (
                          <b>Sub-Total:</b>
                        ) : (
                          <b>Depertment: {item?.DeptName}</b>
                        )
                      ) : (
                        item?.SL
                      )}
                    </td>
                    <td
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {!item?.DeptName?.trim() ? (
                        <div className="text-center">
                          {" "}
                          {item?.strEmployeeCode}
                        </div>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {!item?.DeptName ? (
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
                              {item?.strEmployeeName}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </td>
                    <td
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {!item?.DeptName?.trim()
                        ? item?.strDesignationName
                        : null}
                    </td>
                    <td
                      style={{ textAlign: "center" }}
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {!item?.DeptName?.trim()
                        ? dateFormatter(item?.dteJoiningDate)
                        : null}
                    </td>
                    <td
                      style={{ textAlign: "center" }}
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {!item?.DeptName?.trim() ? item?.strServiceLength : ""}
                    </td>
                    <td
                      style={{ textAlign: "right" }}
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {/* {!item?.DeptName?.trim()
                            ? numberWithCommas(item?.numSalary)
                            : null} */}
                      {item?.DeptName ? (
                        item?.DeptName === "Sub-Total:" ? (
                          <b>{numberWithCommas(item?.numSalary) || 0}</b>
                        ) : (
                          <></>
                        )
                      ) : (
                        numberWithCommas(item?.numSalary) || 0
                      )}
                    </td>
                    <td
                      style={{ textAlign: "right" }}
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {item?.DeptName ? (
                        item?.DeptName === "Sub-Total:" ? (
                          <b>{numberWithCommas(item?.numBasic) || 0}</b>
                        ) : (
                          <></>
                        )
                      ) : (
                        numberWithCommas(item?.numBasic) || 0
                      )}
                    </td>
                    <td
                      style={{ textAlign: "right" }}
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {item?.DeptName ? (
                        item?.DeptName === "Sub-Total:" ? (
                          <b>{numberWithCommas(item?.numBonusAmount) || 0}</b>
                        ) : (
                          <></>
                        )
                      ) : (
                        numberWithCommas(item?.numBonusAmount) || 0
                      )}
                    </td>
                    <td
                      style={{ textAlign: "center" }}
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {!item?.DeptName?.trim()
                        ? item?.numBonusPercentage + " %"
                        : ""}
                    </td>
                    <td
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {!item?.DeptName?.trim()
                        ? numberWithCommas(item?.strWorkPlaceName)
                        : null}
                    </td>
                    <td
                      className={
                        item?.DeptName === "Sub-Total:" ? "rowClass" : ""
                      }
                    >
                      {!item?.DeptName?.trim()
                        ? numberWithCommas(item?.strWorkPlaceGroupName)
                        : null}
                    </td>
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
export default BonusGenerateView;

/* 
<thead>
                <tr>
                  <th
                    rowSpan="2"
                    style={{ width: "30px", textAlign: "center" }}
                  >
                    SL
                  </th>
                  <th rowSpan="2">Employee Name</th>
                  <th rowSpan="2">Designation</th>
                  <th rowSpan="2">Employment Type</th>
                  <th rowSpan="2">Service Length</th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Salary</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(getRowTotal(rowDto, "numSalary"))}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Basic</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(getRowTotal(rowDto, "numBasic"))}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th style={{ textAlign: "right" }} className="th-inner-table">
                    <span className="mr-2">Bonus Amount</span>
                    <table className="table table-bordered table-hover m-0 th-table">
                      <thead>
                        <tr>
                          <th className="green" style={{ textAlign: "right" }}>
                            {numberWithCommas(
                              getRowTotal(rowDto, "numBonusAmount")
                            )}
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                  <th rowSpan="2">Joining Date</th>
                  <th rowSpan="2">Workplace</th>
                  <th rowSpan="2">Workplace Group</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="text-center">{index + 1}</div>
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
                    <td>{item?.strDesignationName}</td>
                    <td>{item?.strEmploymentTypeName}</td>
                    <td>{item?.strServiceLength}</td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.numSalary) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.numBasic) || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {numberWithCommas(item?.numBonusAmount) || "-"}
                    </td>
                    <td>{dateFormatter(item?.dteJoiningDate)}</td>
                    <td>{item?.strWorkPlaceName}</td>
                    <td>{item?.strWorkPlaceGroupName}</td>
                  </tr>
                ))}
              </tbody>


*/
