/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useDispatch } from "react-redux";
import Loading from "../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import ApexBarChart from "./ApexBarChart";
import IDonutChart from "./IDonutChart";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const initData = {
  kpiName: "",
  description: "",
  objective: "",
  kpiFormat: "",
  bscPerspective: "",
  aggregationType: "",
  targetFrequency: "",
  maxMin: "",
};

const PmsDashboard = () => {
  const [loading, setLoading] = useState(false);

  const [_props] = useState({
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function () {},
    cols: { lg: 12, md: 12, sm: 12, xs: 6, xxs: 6 },
    initialLayout: [],
  });

  const [state, setState] = useState({
    currentBreakpoint: "lg",
    compactType: "horizontal",
    mounted: false,
    layouts: { lg: [] },
  });

  function generateDOM() {
    return _.map(state.layouts.lg, function (data, i) {
      return (
        <div
          style={{ border: "1px solid #b6bfb8", borderRadius: "5px" }}
          key={i}
          className={data.static ? "static" : ""}
        >
          <div className="h-100">
            {data?.item?.chartType === "bar" ? (
              <ApexBarChart target={data?.item?.target} ach={data?.item?.ach} />
            ) : (
              data?.item?.chartType === "donut" && (
                <IDonutChart
                  target={data?.item?.target}
                  ach={data?.item?.ach}
                />
              )
            )}
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
        h: 5,
        i: i.toString(),
        item,
      };
    });
  }

  useEffect(() => {
    const initialLayout = generateLayout([
      { chartType: "bar", target: 10, ach: 20 },
      { chartType: "donut", target: 100, ach: 95 },
      { chartType: "bar", target: 52, ach: 30 },
      { chartType: "donut", target: 200, ach: 210 },
      { chartType: "donut", target: 120, ach: 60 },
      { chartType: "bar", target: 50, ach: 20 },
      { chartType: "donut", target: 10, ach: 20 },
      { chartType: "bar", target: 55, ach: 55 },
      { chartType: "donut", target: 10, ach: 12 },
      { chartType: "bar", target: 100, ach: 120 },
      { chartType: "bar", target: 10, ach: 20 },
      { chartType: "donut", target: 56, ach: 44 },
      { chartType: "bar", target: 78, ach: 63 },
      { chartType: "bar", target: 24, ach: 23 },
      { chartType: "donut", target: 10, ach: 20 },
      { chartType: "donut", target: 85, ach: 45 },
    ]);
    setState({
      ...state,
      layouts: { lg: initialLayout },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // saveHandler(values, () => {
        //   resetForm(initData);
        // });
      }}
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
            {loading && <Loading />}
            <div className="strPlan">
              <div className="col-md-12">
                <div className="table-card">
                  <div className="table-card-heading heading pt-0"></div>
                  <div className="table-card-body">
                    <ResponsiveReactGridLayout
                      {..._props}
                      layouts={state.layouts}
                    >
                      {generateDOM()}
                    </ResponsiveReactGridLayout>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default PmsDashboard;
