import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { useFormik } from "formik";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "../../../../common/loading/Loading";
import { customStyles } from "../../../../utility/selectCustomStyle";
import FormikSelect from "../../../../common/FormikSelect";
import ViewModal from "../../../../common/ViewModal";
import PmsCentralTable from "../../../../common/pmsTable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { EditOutlined } from "@mui/icons-material";
import SbuTargetEntryModal from "./modal";

const initData = {
  sbu: "",
  year: "",
  pmType: "",
};

const SbuTargetSetup = () => {
  // 30473
  const [currentItem, setCurrentItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [pmTypeDDL, getPMTypeDDL] = useAxiosGet();
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [tableData, getTableData, tableDataLoader, setTableData] =
    useAxiosGet();
  const [
    businessUnitDDL,
    getBusinessUnitDDL,
    businessUnitDDLloader,
    setBusinessUnitDDL,
  ] = useAxiosGet();
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });

  const {
    profileData: { orgId, buId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  useEffect(() => {
    getBusinessUnitDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&AccountId=${orgId}&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      (data) => {
        const modifiedData = (data || [])
          .filter(
            (item) =>
              item.intBusinessUnitId !== 0 && item.strBusinessUnit !== "ALL"
          )
          .map((item) => ({
            value: item.intBusinessUnitId,
            label: item.strBusinessUnit,
          }));

        setBusinessUnitDDL(modifiedData);
      }
    );

    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`, (data) => {
      const theYear = getFiscalYearForNowOnLoad();
      const theYearData = data.find((item) => item?.label === theYear);
      initData.year = theYearData;
      setFieldValue("year", theYearData);
    });
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const getLandingData = () => {
    getTableData(
      `/PMS/GetKpiChartReport?PartName=MappedKPI&BusinessUnit=${buId}&YearId=${values?.year?.value}&KpiForId=3&KpiForReffId=${values?.sbu?.value}&accountId=${orgId}&from=1&to=12&pmTypeId=${values?.pmType?.value}`
    );
  };

  useEffect(() => {
    getPMTypeDDL("/PMS/PMTypeDDL");
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {(fiscalYearDDLloader || tableDataLoader || businessUnitDDLloader) && (
        <Loading />
      )}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div>
            <h2 style={{ color: "#344054" }}>SBU Target Setup</h2>
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
              <label>Sbu</label>
              <FormikSelect
                classes="input-sm form-control"
                name="sbu"
                placeholder="Select Sbu"
                options={businessUnitDDL || []}
                value={values?.sbu}
                onChange={(valueOption) => {
                  setFieldValue("sbu", valueOption);
                  setTableData([]);
                }}
                styles={customStyles}
              />
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
              <button
                type="button"
                className="btn btn-green mr-2"
                style={{ marginTop: "22px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  getLandingData();
                }}
                disabled={!values?.sbu || !values?.year || !values?.pmType}
              >
                View
              </button>
            </div>
          </div>
        </div>
        {/* table */}
        <div className="table-card-body">
          <PmsCentralTable
            header={[
              { name: "BSC" },
              { name: "Objective" },
              { name: "KPI" },
              { name: "SRF" },
              { name: "Agg. Type" },
              { name: "Weight" },
              { name: "Benchmark" },
              { name: "Target" },
              { name: "Action" },
            ]}
          >
            {tableData?.infoList?.map((itm, indx) => (
              <>
                {itm.dynamicList.map((item, index) => (
                  <tr key={item?.kpiId}>
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
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.label}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.strFrequency}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.strAggregationType || ""}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.numWeight === 0 ? "" : item?.numWeight}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.benchmark === 0 ? "" : item?.benchmark}{" "}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          item?.isTargetAssigned || item?.parentName === "Total"
                            ? "white"
                            : "#e6e6e6",
                      }}
                    >
                      {" "}
                      {item?.numTarget === 0 ? "" : item?.numTarget}{" "}
                    </td>
                    {item?.parentName !== "Total" && (
                      <td className="text-center">
                        <OverlayTrigger
                          overlay={
                            <Tooltip
                              id="tooltip-disabled"
                              style={{
                                fontSize: "11px",
                              }}
                            >
                              Edit
                            </Tooltip>
                          }
                        >
                          <EditOutlined
                            style={{
                              cursor: "pointer",
                              fontSize: "15px",
                            }}
                            onClick={() => {
                              setCurrentItem({
                                ...item,
                              });
                              setIsShowModal(true);
                            }}
                          />
                        </OverlayTrigger>
                      </td>
                    )}
                  </tr>
                ))}
              </>
            ))}
          </PmsCentralTable>
        </div>
      </div>
      <ViewModal
        size="xl"
        title="Departmental KPI Target Entry"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isShowModal}
        onHide={() => {
          setIsShowModal(false);
        }}
      >
        <SbuTargetEntryModal
          currentItem={currentItem}
          setIsShowModal={setIsShowModal}
          previousLandingValues={values}
          getLandingData={getLandingData}
        />
      </ViewModal>
    </>
  );
};

export default SbuTargetSetup;
