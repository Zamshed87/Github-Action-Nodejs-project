import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { todayDate } from "../../../utility/todayDate";
import Loading from "./../../../common/loading/Loading";
import ConsumeMeal from "./components/ConsumeMeal";
import FormCard from "./components/FormCard";
// import MenuList from "./components/MenuList";
import ScheduleMeal from "./components/ScheduleMeal";
import {
  createCafeteriaEntry,
  getPendingAndConsumeMealReport,
  getPlaceDDL,
} from "./helper";
import "./style.css";

const initData = {
  search: "",
  radioType: "private",
  employeeName: "",
  place: "",
  date: todayDate(),
  meal: 1,
  type: { value: 2, label: "Irregular" },
  remarks: "",
  mealStatus: "own",
};

const validationSchema = Yup.object().shape({
  employeeName: Yup.string().required("Employee name is required"),
  date: Yup.date().required("Date is required"),
  meal: Yup.string().required("No of meal is required"),
  type: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
      value: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
  place: Yup.object()
    .shape({
      label: Yup.string().required("place is required"),
      value: Yup.string().required("place is required"),
    })
    .typeError("place is required"),
});

export default function FoodCorner() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const { orgId, buId, employeeId, strDisplayName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [scheduleMeal, setScheduleMeal] = useState([]);
  const [consumeMeal, setConsumeMeal] = useState([]);
  const [placeDDL, setPlaceDDL] = useState([]);
  const saveHandler = (values, cb) => {
    const payload = {
      PartId: 1,
      ToDate: values?.date || todayDate(),
      EnrollId: employeeId,
      TypeId: values?.type?.value || "",
      MealOption: 0,
      MealFor: 1,
      CountMeal: values?.meal || 1,
      isOwnGuest: 0,
      isPayable: 1,
      Narration: values?.remarks || "",
      ActionBy: employeeId,
    };
    createCafeteriaEntry(
      1,
      values?.date,
      employeeId,
      values?.type?.value,
      0,
      1,
      values?.meal,
      0,
      1,
      values?.remarks,
      employeeId,
      payload,
      setLoading,
      cb,
      +values?.place?.value
    );
  };

  const getLandingData = () => {
    getPendingAndConsumeMealReport(
      1,
      employeeId,
      setScheduleMeal,
      setLoading,
      ""
    );
    getPendingAndConsumeMealReport(
      2,
      employeeId,
      setConsumeMeal,
      setLoading,
      ""
    );
  };
  useEffect(() => {
    getLandingData();
  }, [orgId, buId]);
  // placeDDL
  useEffect(() => {
    getPlaceDDL("mealConsume", orgId, setPlaceDDL, buId, wgId);
  }, [orgId]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employeeName: strDisplayName,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            getLandingData();
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card food-corner">
                <div className="table-card-heading mt-2">
                  <div className="row">
                    <div className="mx-3">
                      <div className="leave-movement-FormCard">
                        <h6
                          style={{
                            color: "rgba(0, 0, 0, 0.6)",
                            fontSize: "14px",
                            lineHeight: "18px",
                            fontWeight: "600",
                          }}
                        >
                          Meal Requisition
                        </h6>
                        <FormCard
                          propsObj={{
                            setFieldValue,
                            values,
                            errors,
                            touched,
                            resetForm,
                            initData,
                            loading,
                            placeDDL,
                          }}
                        ></FormCard>
                      </div>
                    </div>
                    {/* <div className="col-lg-5">
                      <div className="leave-movement-FormCard">
                        <div className="d-flex justify-content-between">
                          <h6
                            style={{
                              color: "rgba(0, 0, 0, 0.6)",
                              fontSize: "14px",
                              lineHeight: "18px",
                              fontWeight: "600",
                            }}
                          >
                            Menu List
                          </h6>
                          {/* <PrimaryButton type="button" className="btn btn-default flex-center" label={"Edit Menu"} onClick={(e) => {}} /> */}
                    {/* </div> */}
                    {/* <MenuList setLoading={setLoading} /> */}
                    {/* </div> */}
                    {/* </div> */}
                  </div>
                </div>
                <div className="table-card-body mt-3">
                  <div className="row">
                    <div className="col-lg-6">
                      <h6
                        style={{
                          color: "rgba(0, 0, 0, 0.6)",
                          fontSize: "14px",
                          lineHeight: "18px",
                          fontWeight: "600",
                        }}
                      >
                        Schedule Meal
                      </h6>
                      <ScheduleMeal
                        getLandingData={getLandingData}
                        scheduleMeal={scheduleMeal}
                      />
                    </div>
                    <div className="col-lg-6">
                      <h6
                        style={{
                          color: "rgba(0, 0, 0, 0.6)",
                          fontSize: "14px",
                          lineHeight: "18px",
                          fontWeight: "600",
                        }}
                      >
                        Consume Meal
                      </h6>
                      <ConsumeMeal consumeMeal={consumeMeal} />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
