import { AccountBalance, Download, Event, SearchOutlined, SettingsBackupRestoreOutlined, SportsVolleyball, Stars } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from 'react-router-dom';
import * as Yup from "yup";
import AvatarComponent from "../../../common/AvatarComponent";
import BackButton from "../../../common/BackButton";
import DefaultInput from "../../../common/DefaultInput";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import ScrollableTable from "../../../common/ScrollableTable";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getPFInvestmentViewData } from "./helper";
import { IconButton, Tooltip } from '@mui/material';
import { numberWithCommas } from "../../../utility/numberWithCommas";
import CircleButton from "../../../common/CircleButton";
import moneyIcon from "../../../assets/images/moneyIcon.png";
import { dateFormatter } from "../../../utility/dateFormatter";
import { allPFInvestmentExcelColumn, allPFInvestmentExcelData, pfInvestmentHeader, pfInvestmentHeaderData } from "./utility/excelColum";
import { generatePFInvestmentAction } from "./excel/pfInvestmentExcel";
import { getRowTotal } from "../../../utility/getRowTotal";

const initData = {
  search: ""
};

const validationSchema = Yup.object().shape({});

export default function PFInvestmentViewForm() {
  const params = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 204) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
  }, [dispatch]);

  useEffect(() => {
    if (params?.id) {
      getPFInvestmentViewData(+params?.id, setRowDto, setAllData, setLoading);
    }
  }, [params]);

  // filter data
  const filterData = (keywords) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strEmployeeCode?.toLowerCase()) ||
          regex.test(item?.strDepartment?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  // useFormik hooks
  const {
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setRowDto([]);
      setAllData([]);
      resetForm(initData);
    },
  });

  // excel column set up
  const excelPFHeaderColumnFunc = () => {
    return pfInvestmentHeader
  };
  const excelColumnFunc = (processId) => {
    switch (processId) {
      default:
        return allPFInvestmentExcelColumn
    }
  };

  // excel data set up
  const excelPFHeaderDataFunc = () => {
    return pfInvestmentHeaderData([
      {
        strInvestmentReffNo: state?.strInvestmentReffNo || " ",
        strBankName: state?.strBankName || " ",
        dteInvestmentDate: dateFormatter(state?.dteInvestmentDate) || " ",
        numInvestmentAmount: numberWithCommas(state?.numInvestmentAmount) || " ",
        dteMatureDate: dateFormatter(state?.dteMatureDate) || " ",
      }
    ]);
  };
  const excelDataFunc = (processId) => {
    switch (processId) {
      default:
        return allPFInvestmentExcelData(rowDto);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading && <Loading />}
        {permission?.isView ? (
          <>
            <div className="table-card">
              <div
                className="table-card-heading"
                style={{ marginBottom: "12px" }}
              >
                <div className="d-flex align-items-center">
                  <BackButton />
                  <h2>{`PF Investment Details`}</h2>
                </div>
              </div>
              <div className="card-style" style={{ marginBottom: "12px" }}>
                <div className="row">
                  <div className="col-lg-2 d-flex align-items-center">
                    <IconButton
                      style={{
                        color: "black",
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <Stars style={{ width: "25px", height: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>{state?.strInvestmentReffNo || "-"}</h2>
                      <p>Investment Reff. No.</p>
                    </div>
                  </div>
                  <div className="col-lg-2 d-flex align-items-center">
                    <IconButton
                      style={{
                        color: "black",
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <AccountBalance style={{ width: "25px", height: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>{state?.strBankName || "-"}</h2>
                      <p>Bank</p>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <CircleButton
                      icon={<img src={moneyIcon} alt="iBOS" />}
                      title={
                        numberWithCommas(
                          state?.numInvestmentAmount
                        ) || "-"
                      }
                      subTitle="Investment Amount"
                    />
                  </div>
                  <div className="col-lg-2 d-flex align-items-center">
                    <IconButton
                      style={{
                        color: "black",
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <Event style={{ width: "25px", height: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>{dateFormatter(state?.dteMatureDate) || "-"}</h2>
                      <p>Mature Date</p>
                    </div>
                  </div>
                  <div className="col-lg-2 d-flex align-items-center">
                    <IconButton
                      style={{
                        color: "black",
                        backgroundColor: "#EAECF0",
                        padding: "5px",
                      }}
                    >
                      <SportsVolleyball style={{ width: "25px", height: "25px" }} />
                    </IconButton>
                    <div className="ml-3">
                      <h2>{state?.isActive ? "Active" : "Inactive"}</h2>
                      <p>Status</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-card-body" style={{ overflow: "hidden" }}>
                <div className="table-card-styled">
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
                        <li
                          className="pr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            const excelLanding = () => {
                              generatePFInvestmentAction(
                                "PF Investment Details",
                                "",
                                "",
                                excelColumnFunc(0),
                                excelDataFunc(0),
                                "",
                                0,
                                rowDto,
                                excelPFHeaderColumnFunc(),
                                excelPFHeaderDataFunc()
                              );
                            };
                            excelLanding();
                          }}
                        >
                          <Tooltip title="Export CSV" arrow>
                            <IconButton style={{ color: "#101828", cursor: "pointer" }}>
                              <Download />
                            </IconButton>
                          </Tooltip>
                        </li>
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
                {rowDto?.length > 0 ? (
                  <>
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
                            <th rowSpan="2">Designation</th>
                            <th rowSpan="2">Department</th>
                            <th rowSpan="2">Employment Type</th>
                            <th rowSpan="2">Service Length</th>
                            <th
                              style={{ textAlign: "right" }}
                              className="th-inner-table"
                            >
                              <span className="mr-2">PF Employee Contribution</span>
                              <table className="table table-bordered table-hover m-0 th-table">
                                <thead>
                                  <tr>
                                    <th className="green" style={{ textAlign: "right" }}>
                                      {numberWithCommas(
                                        getRowTotal(rowDto, "numEmployeeContribution")
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </th>
                            <th
                              style={{ textAlign: "right" }}
                              className="th-inner-table"
                            >
                              <span className="mr-2">PF Employer Contribution</span>
                              <table className="table table-bordered table-hover m-0 th-table">
                                <thead>
                                  <tr>
                                    <th className="green" style={{ textAlign: "right" }}>
                                      {numberWithCommas(
                                        getRowTotal(rowDto, "numEmployerContribution")
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </th>
                            <th rowSpan="2">Interest Rate %</th>
                            <th
                              style={{ textAlign: "right" }}
                              className="th-inner-table"
                            >
                              <span className="mr-2">Interest Amount Of Employee</span>
                              <table className="table table-bordered table-hover m-0 th-table">
                                <thead>
                                  <tr>
                                    <th className="green" style={{ textAlign: "right" }}>
                                      {numberWithCommas(
                                        getRowTotal(rowDto, "numInterestAmount")
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </th>
                            <th
                              style={{ textAlign: "right" }}
                              className="th-inner-table"
                            >
                              <span className="mr-2">Total Amount Of Employer</span>
                              <table className="table table-bordered table-hover m-0 th-table">
                                <thead>
                                  <tr>
                                    <th className="green" style={{ textAlign: "right" }}>
                                      {numberWithCommas(
                                        getRowTotal(rowDto, "numTotalAmount")
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </th>
                            <th
                              style={{ textAlign: "right" }}
                              className="th-inner-table"
                            >
                              <span className="mr-2">Grand Total</span>
                              <table className="table table-bordered table-hover m-0 th-table">
                                <thead>
                                  <tr>
                                    <th className="green" style={{ textAlign: "right" }}>
                                      {numberWithCommas(
                                        getRowTotal(rowDto, "numGrandTotalAmount")
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </th>
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
                              <td>{item?.strDesignation}</td>
                              <td>{item?.strDepartment}</td>
                              <td>{item?.strEmploymentType}</td>
                              <td>{item?.strServiceLength}</td>
                              <td style={{ textAlign: "right" }}>
                                {numberWithCommas(item?.numEmployeeContribution) || "-"}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {numberWithCommas(item?.numEmployerContribution) || "-"}
                              </td>
                              <td>{item?.numInterestRate}</td>
                              <td style={{ textAlign: "right" }}>
                                {numberWithCommas(item?.numInterestAmount) || "-"}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {numberWithCommas(item?.numTotalAmount) || "-"}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {numberWithCommas(item?.numGrandTotalAmount) || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </ScrollableTable>
                    </div>
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
          </>
        ) : (
          <NotPermittedPage />
        )}
      </form>
    </>
  );
}
