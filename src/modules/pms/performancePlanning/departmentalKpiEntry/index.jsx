import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { useFormik } from "formik";
import { useEffect } from "react";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
import {
  setFirstLevelNameAction,
  setSBUBalancedScoreData,
} from "../../../../commonRedux/reduxForLocalStorage/actions";
import { useState } from "react";
import ViewModal from "../../../../common/ViewModal";
import Loading from "../../../../common/loading/Loading";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { fiscalMonthDDLForKpi } from "../../../../utility/fiscalMonthDDLForKpi";
import PrimaryButton from "../../../../common/PrimaryButton";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import { toast } from "react-toastify";
import PmsCentralTable from "../../../../common/pmsTable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import DepartmentalKpiEntryModal from "./departmentalKpiEntryModal";

const initData = {
  department: "",
  year: "",
  fromMonth: "",
  toMonth: "",
};

const DepartmentalKpiEntry = () => {
  // 30486
  const dispatch = useDispatch();
  const [pmTypeDDL, getPMTypeDDL] = useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [tableData, getTableData, tableDataLoader, setTableData] =
    useAxiosGet();
  const [departmentDDL, setDepartmentDDL] = useState([]);

  const {
    profileData: {
      orgId,
      buId,
      intAccountId,
      strDesignation,
      employeeId,
      strDisplayName,
    },
  } = useSelector((store) => store?.auth, shallowEqual);

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );

    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.year = theYearData;
      setFieldValue("year", theYearData);
    });
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (values) => {
    getTableData(
      `/PMS/GetKpiChartReport?PartName=TargetedKPI&BusinessUnit=${buId}&YearId=${
        values?.year?.value
      }&KpiForId=2&KpiForReffId=${
        values?.department?.value
      }&accountId=${intAccountId}&from=${values?.fromMonth?.value || 1}&to=${
        values?.toMonth?.value || 12
      }&pmTypeId=${values?.pmType?.value}`
    );
  };

  const [currentItem, setCurrentItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);

  const extractAndMergeData = (data) => {
    return (
      data?.infoList?.flatMap((item) => {
        return item.dynamicList.filter((entry) => entry.parentName !== "Total");
      }) || []
    );
  };
  useEffect(() => {
    getPMTypeDDL("/PMS/PMTypeDDL");
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <>
        {(fiscalYearDDLloader || tableDataLoader) && <Loading />}
        <div className="table-card">
          <div className="table-card-heading" style={{ marginBottom: "12px" }}>
            <div>
              <h2 style={{ color: "#344054" }}>Departmental KPI Entry</h2>
            </div>
          </div>
          <div className="card-style pb-0 mb-2">
            <div className="row">
              <div className="col-lg-3">
                <label>PM Type</label>
                <FormikSelect
                  classes="input-sm form-control"
                  name="pmType"
                  options={pmTypeDDL?.filter((i) => i?.value !== 2) || []}
                  value={values?.pmType}
                  onChange={(valueOption) => {
                    setFieldValue("pmType", valueOption);
                  }}
                  styles={customStyles}
                />
              </div>
              <div className="col-lg-3">
                <label>Department</label>
                <FormikSelect
                  classes="input-sm form-control"
                  name="department"
                  placeholder="Select Department"
                  options={departmentDDL || []}
                  value={values?.department}
                  onChange={(valueOption) => {
                    setFieldValue("department", valueOption);
                    setTableData([]);
                  }}
                  styles={customStyles}
                />
              </div>
              <div className="col-lg-2">
                <label>Year</label>
                <FormikSelect
                  classes="input-sm form-control"
                  name="year"
                  placeholder="Select Year"
                  options={fiscalYearDDL || []}
                  value={values?.year}
                  onChange={(valueOption) => {
                    setFieldValue("year", valueOption);
                    setTableData([]);
                  }}
                  styles={customStyles}
                />
              </div>
              <div className="col-lg-2">
                <label>From Month</label>
                <FormikSelect
                  classes="input-sm form-control"
                  name="fromMonth"
                  placeholder="Select Month"
                  options={fiscalMonthDDLForKpi || []}
                  value={values?.fromMonth}
                  onChange={(valueOption) => {
                    setFieldValue("fromMonth", valueOption);
                    setTableData([]);
                  }}
                  styles={customStyles}
                />
              </div>
              <div className="col-lg-2">
                <label>To Month</label>
                <FormikSelect
                  classes="input-sm form-control"
                  name="toMonth"
                  placeholder="Select Month"
                  options={fiscalMonthDDLForKpi || []}
                  value={values?.toMonth}
                  onChange={(valueOption) => {
                    setFieldValue("toMonth", valueOption);
                    setTableData([]);
                  }}
                  styles={customStyles}
                />
              </div>
              <div className="col-lg-2 d-flex">
                <button
                  type="button"
                  className="btn btn-green mr-2"
                  style={{ marginTop: "10px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    getData(values);
                  }}
                  disabled={
                    !values?.department || !values?.year || !values?.pmType
                  }
                >
                  View
                </button>
                <PrimaryButton
                  style={{ marginTop: "10px" }}
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Presentation"}
                  icon={
                    <PresentToAllIcon
                      sx={{ marginRight: "11px", fontSize: "16px" }}
                    />
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!tableData?.infoList?.length)
                      return toast.warn("No data found for presentation");
                    dispatch(
                      setSBUBalancedScoreData({
                        newData: extractAndMergeData(tableData),
                        report: tableData,
                        currentItem: {
                          tableData,
                          index: 0,
                        },
                        heading: "INDIVIDUAL BALANCED SCORECARD",
                        year: values?.year?.label,
                      })
                    );
                    window.open(
                      `${process.env.PUBLIC_URL}/kpi/presentation`,
                      "_blank"
                    );
                  }}
                />
              </div>
              <div className="col-lg-2"></div>
            </div>
          </div>
          <div className="achievement resKpi">
            <PmsCentralTable
              header={[
                { name: "BSC" },
                { name: "Objective" },
                { name: "KPI" },
                { name: "SRF" },
                { name: "Weight" },
                { name: "Benchmark" },
                { name: "Target" },
                { name: "Ach." },
                { name: "Progress" },
                { name: "Score" },
              ]}
            >
              {tableData?.infoList?.map((itm, indx) => (
                <>
                  {itm.dynamicList.map((item, index) => (
                    <tr
                      key={item?.kpiId}
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {index === 0 && (
                        <td
                          className={`bsc bsc${indx}`}
                          rowSpan={itm.dynamicList.length}
                        >
                          <div>{itm?.bsc}</div>
                        </td>
                      )}
                      {item?.isParent && (
                        <td className="obj" rowSpan={item?.numberOfChild}>
                          {" "}
                          {item?.parentName}{" "}
                        </td>
                      )}
                      <td
                        style={{
                          width: "250px",
                        }}
                      >
                        {" "}
                        {item?.label}{" "}
                      </td>
                      <td> {item?.strFrequency} </td>
                      <td className="text-center">
                        {" "}
                        {item?.numWeight === 0 ? "" : item?.numWeight}{" "}
                      </td>
                      <td className="text-center">
                        {" "}
                        {item?.benchmark === 0 ? "" : item?.benchmark}{" "}
                      </td>
                      <td className="text-center">
                        {" "}
                        {item?.numTarget === 0 ? "" : item?.numTarget}{" "}
                      </td>
                      {item?.parentName !== "Total" ? (
                        <td className="text-center">
                          <span>
                            <OverlayTrigger
                              overlay={
                                <Tooltip
                                  id="tooltip-disabled"
                                  style={{
                                    fontSize: "11px",
                                  }}
                                >
                                  Achievement Entry
                                </Tooltip>
                              }
                            >
                              <span
                                style={{
                                  cursor: "pointer",
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                                onClick={() => {
                                  setCurrentItem({ ...item });
                                  setIsShowModal(true);
                                }}
                              >
                                {item?.numAchivement}
                              </span>
                            </OverlayTrigger>
                          </span>
                        </td>
                      ) : (
                        <td></td>
                      )}
                      {item?.parentName !== "Total" ? (
                        <td
                          style={{
                            minWidth: "90px",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          <span>{item?.progress} % </span>
                          {item?.arrowText === "up" ? (
                            <ArrowCircleUpIcon
                              style={{
                                color: "green",
                                fontSize: "20px",
                              }}
                            />
                          ) : item?.arrowText === "down" ? (
                            <ArrowCircleDownIcon
                              style={{
                                color: "red",
                                fontSize: "20px",
                              }}
                            />
                          ) : null}
                        </td>
                      ) : (
                        <td></td>
                      )}
                      <td className="text-center"> {item?.score}</td>
                    </tr>
                  ))}
                </>
              ))}
            </PmsCentralTable>
          </div>
        </div>
      </>
      {/* add modal here */}
      <ViewModal
        size="xl"
        title="Departmental KPI Entry"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <DepartmentalKpiEntryModal
          currentItem={currentItem}
          setIsShowModal={setIsShowModal}
          profileData={{
            orgId,
            buId,
            intAccountId,
            strDesignation,
            employeeId,
            strDisplayName,
          }}
          previousLandingvalues={values}
          getData={getData}
        />
      </ViewModal>
    </>
  );
};

export default DepartmentalKpiEntry;
