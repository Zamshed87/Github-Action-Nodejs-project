import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { shallowEqual, useSelector } from "react-redux";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { fiscalMonthDDLForKpi } from "../../../../utility/fiscalMonthDDLForKpi";
import { getFiscalYearForNowOnLoad } from "../../../../utility/getFiscalYearOnLoade";
import { customStyles } from "../../../../utility/selectCustomStyle";
import Chart from "./components/Chart";
import "./styles/style.css";
// import ApexSemiDonutChart from "../../../../common/charts/ApexSemiDonutChart";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const initData = {
  fromMonth: "",
  toMonth: "",
};

const IndividualScoreCard = () => {
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [, getKpiData, kpiDataLoader] = useAxiosGet();
  const [pmTypeDDL, getPMTypeDDL] = useAxiosGet();
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const individualScoreCardPermission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30414),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    profileData: { buId, intAccountId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const [_props] = useState({
    className: "layout",
    rowHeight: 40,
    onLayoutChange: function () {},
    cols: { lg: 12, md: 12, sm: 12, xs: 6, xxs: 6 },
    initialLayout: [],
  });

  const [state, setState] = useState({
    currentBreakpoint: "lg",
    compactType: "horizontal",
    layouts: { lg: [] },
  });

  function generateDOM() {
    return _.map(state.layouts.lg, function (data, i) {
      return (
        <div
          style={{
            border: "1px solid #b6bfb8",
            borderRadius: "5px",
          }}
          key={i}
          className={data.static ? "static" : ""}
        >
          <div className="h-100" style={{ backgroundColor: "white" }}>
            <Chart key={i} chart={data?.item} />
          </div>
        </div>
      );
    });
  }

  function generateLayout(arr) {
    return _.map(arr, function (item, i) {
      var y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 3) % 12,
        y: Math.floor(i / 6) * y,
        w: 3,
        h: 6,
        i: i.toString(),
        item,
      };
    });
  }

  const extractAndMergeData = (data) => {
    return (
      data?.infoList?.flatMap((item) => {
        return item.dynamicList.filter((entry) => entry.parentName !== "Total");
      }) || []
    );
  };

  const getData = (yearId, fromMonthId, toMonthId, pmTypeId) => {
    getKpiData(
      `/PMS/GetKpiChartReport?PartName=TargetedKPI&BusinessUnit=${buId}&YearId=${yearId}&KpiForId=1&KpiForReffId=${employeeId}&accountId=${intAccountId}&from=${fromMonthId}&to=${toMonthId}&pmTypeId=${pmTypeId}`,
      (data) => {
        const extractedData = extractAndMergeData(data);
        const initialLayout = generateLayout(
          extractedData.map((item) => {
            return {
              label: item?.kpi,
              chartType: item?.chart_type_label,
              target: item?.numTarget,
              ach: item?.numAchivement,
            };
          })
        );
        setState({
          ...state,
          layouts: { lg: initialLayout },
        });
      }
    );
  };

  useEffect(() => {
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`);
    getPMTypeDDL("/PMS/PMTypeDDL");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
        isValid,
      }) => (
        <>
          <Form onSubmit={handleSubmit}>
            {(kpiDataLoader || fiscalYearDDLloader) && <Loading />}
            <div className="table-card">
              <div
                className="table-card-heading"
                style={{ marginBottom: "12px" }}
              >
                <div>
                  <h2 style={{ color: "#344054" }}>Individual Dashboard</h2>
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
                    <label>From Month</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="fromMonth"
                      placeholder="Select Month"
                      options={fiscalMonthDDLForKpi || []}
                      value={values?.fromMonth}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("fromMonth", valueOption);
                        } else {
                          setFieldValue("fromMonth", "");
                          setState({
                            ...state,
                            layouts: { lg: [] },
                          });
                        }
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
                        if (valueOption) {
                          setFieldValue("toMonth", valueOption);
                        } else {
                          setFieldValue("toMonth", "");
                        }
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
                        const theYear = getFiscalYearForNowOnLoad();
                        const currentYear = fiscalYearDDL.find(
                          (item) => item?.label === theYear
                        );
                        getData(
                          currentYear?.value,
                          values?.fromMonth?.value,
                          values?.toMonth?.value,
                          values?.pmType?.value
                        );
                      }}
                      disabled={
                        !values?.fromMonth ||
                        !values?.toMonth ||
                        !values?.pmType
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-card-body">
              {individualScoreCardPermission?.isView ? (
                <ResponsiveReactGridLayout {..._props} layouts={state.layouts}>
                  {generateDOM()}
                </ResponsiveReactGridLayout>
              ) : (
                <NotPermittedPage />
              )}
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default IndividualScoreCard;
