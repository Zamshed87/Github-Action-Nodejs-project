import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import ViewModal from "../../../../common/ViewModal";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IndividualKpiModal from "./modal/individualKpiModal";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import { getAsyncEmployeeCommonApi, getFiscalYearForNowOnLoad } from "./helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import PmsCentralTable from "../../../../common/pmsTable";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { fiscalMonthDDLForKpi } from "../../../../utility/fiscalMonthDDLForKpi";
import { getAsyncEmployeeApi } from "../../../../common/api";

const initData = {
  employee: "",
  year: "",
};

const IndividualKpiEntry = () => {
  // 30483
  const {
    profileData: { orgId, buId, intAccountId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const [pmTypeDDL, getPMTypeDDL] = useAxiosGet();
  const [tableData, getTableData, tableDataLoader, setTableData] =
    useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();

  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });
  const dispatch = useDispatch();
  const getData = (values) => {
    getTableData(
      `/PMS/GetKpiChartReport?PartName=TargetedKPI&BusinessUnit=${buId}&YearId=${
        values?.year?.value
      }&KpiForId=1&KpiForReffId=${
        values?.employee?.value
      }&accountId=${intAccountId}&from=${values?.fromMonth?.value || 1}&to=${
        values?.toMonth?.value || 12
      }&pmTypeId=${values?.pmType?.value || 1}`
    );
  };

  const [currentItem, setCurrentItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.year = theYearData;
      setFieldValue("year", theYearData);
    });
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPMTypeDDL("/PMS/PMTypeDDL");
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <>
        {(tableDataLoader || fiscalYearDDLloader) && <Loading />}
        <div className="card-style pb-0 mb-2 mt-5">
          <div className="row">
            {/* <div className="col-lg-3">
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
              </div> */}

            <div className="col-lg-3">
              <div className="input-field-main">
                <label>Employee</label>
                <AsyncFormikSelect
                  isClear={true}
                  selectedValue={values?.employee}
                  styles={{
                    control: (provided) => ({
                      ...customStyles?.control(provided),
                      width: "100%",
                    }),
                  }}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    setFieldValue("employee", valueOption);
                    setTableData([]);
                  }}
                  loadOptions={async (value) => {
                    return getAsyncEmployeeApi({
                      orgId,
                      buId: buId,
                      intId: 0,
                      value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-lg-3">
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
            <div className="col-lg-3">
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
            <div className="col-lg-3">
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

            <div className="col-lg-3">
              <button
                type="button"
                className="btn btn-green mr-2 mb-3"
                style={{ marginTop: "22px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  getData(values);
                }}
                disabled={!values?.employee || !values?.year}
              >
                View
              </button>
            </div>
          </div>
        </div>
        {/* user infos */}

        {values?.employee ? (
          <div className="card-style pb-0 mb-2">
            <div className="row">
              <div className="col-lg-12 pt-2 pb-2">
                <h6 className="mb-2">
                  <strong>Name: </strong> {values?.employee?.EmployeeOnlyName}{" "}
                  <strong className="ml-1">Enroll: </strong>{" "}
                  {values?.employee?.EmployeeId}{" "}
                  <strong className="ml-1">Designation: </strong>{" "}
                  {values?.employee?.DesignationName}
                </h6>
              </div>
            </div>
          </div>
        ) : null}

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
                        {/* <i
                            className={`fas fa-arrow-alt-${item?.arrowText}`}
                          ></i> */}
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
      </>
      {/* add modal here */}
      <ViewModal
        size="xl"
        title="Individual KPI Entry"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <IndividualKpiModal
          currentItem={currentItem}
          setIsShowModal={setIsShowModal}
          empInfo={values?.employee}
          previousLandingvalues={values}
          getData={getData}
        />
      </ViewModal>
    </>
  );
};

export default IndividualKpiEntry;

// developers note:
// kpiForId = 1 => Employee
// kpiForId = 2 => Department
// kpiForId = 3 => Sbu
