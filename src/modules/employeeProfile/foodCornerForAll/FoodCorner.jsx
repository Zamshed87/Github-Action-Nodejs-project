/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
import * as Yup from "yup";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
// import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { todayDate } from "../../../utility/todayDate";
import Loading from "./../../../common/loading/Loading";
import ConsumeMeal from "./components/ConsumeMeal";
import FormCard from "./components/FormCard";
// import MenuList from "./components/MenuList";
import ScheduleMeal from "./components/ScheduleMeal";
import {
  createCafeteriaEntry,
  // editMenuList,
  // getCafeteriaMenuListReport,
  getPendingAndConsumeMealReport,
} from "./helper";
import "./style.css";
import { PeopleDeskSaasDDL } from "common/api";
import { getPlaceDDL } from "../foodCorner/helper";

const initData = {
  search: "",
  radioType: "private",
  employee: "",
  place: "",
  date: todayDate(),
  meal: 1,
  type: { value: 2, label: "Irregular" },
  remarks: "",
  mealStatus: "own",
};

const validationSchema = Yup.object().shape({
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  place: Yup.object()
    .shape({
      label: Yup.string().required("place is required"),
      value: Yup.string().required("place is required"),
    })
    .typeError("place is required"),
  date: Yup.date().required("Date is required"),
  meal: Yup.string().required("No of meal is required"),
  type: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
      value: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
});

export default function FoodCornerForAll() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);
  const {
    profileData: { orgId, buId, employeeId, wgId },
    permissionList,
  } = useSelector((state) => state?.auth, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [scheduleMeal, setScheduleMeal] = useState([]);
  const [consumeMeal, setConsumeMeal] = useState([]);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [placeDDL, setPlaceDDL] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState("");
  // const [isEdit, setIsEdit] = useState(false);
  // const [menuList, setMenuList] = useState([]);
  const saveHandler = (values, cb) => {
    const payload = {
      PartId: 1,
      ToDate: values?.date || todayDate(),
      EnrollId: values?.employee?.value,
      TypeId: values?.type?.value || "",
      MealOption: 1,
      MealFor: 1,
      CountMeal: values?.meal || 1,
      isOwnGuest: 0,
      isPayable: 1,
      Narration: values?.remarks || "",
      ActionBy: employeeId,
      MealConsumePlaceId: values?.place?.value || 0,
    };
    createCafeteriaEntry(
      1,
      values?.date,
      values?.employee?.value,
      values?.type?.value,
      1,
      values?.mealStatus === "own" ? 1 : 2,
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
    // (partId, date, enrollId, typeId, mealOption, mealFor, countMeal, ownGuest, payable, narration, userId, payload, setLoading, cb)
  };

  const getLandingData = (values) => {
    getPendingAndConsumeMealReport(
      1,
      values?.employee?.value,
      setScheduleMeal,
      setLoading,
      ""
    );
    getPendingAndConsumeMealReport(
      2,
      values?.employee?.value,
      setConsumeMeal,
      setLoading,
      ""
    );
  };
  useEffect(() => {
    PeopleDeskSaasDDL(
      "EmployeeBasicInfo",
      orgId,
      0,
      setEmployeeDDL,
      "EmployeeId",
      "EmployeeName",
      0
    );
  }, [orgId, buId]);
  // placeDDL
  useEffect(() => {
    getPlaceDDL("mealConsume", orgId, setPlaceDDL, buId, wgId);
  }, [orgId, buId]);

  const permission = useMemo(
    () => permissionList?.find((item) => item?.menuReferenceId === 144),
    []
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setFieldValue }) => {
          saveHandler(values, () => {
            // resetForm(initData);
            getLandingData(values);
            setFieldValue("remarks", "");
            // setFieldValue("place", "");
            setFieldValue("type", { value: 2, label: "Irregular" });
            setFieldValue("meal", 1);
            setFieldValue("date", todayDate());
            setFieldValue("mealStatus", "own");
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
              <div className="food-corner">
                {permission?.isView ? (
                  <div className="table-card">
                    <div className="table-card-heading mt-1">
                      <div className="row">
                        <div className="mx-3">
                          {/* <div className="col-lg-7"> */}
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
                                employeeDDL,
                                placeDDL,
                                setEmployeeInfo,
                                orgId,
                                buId,
                                employeeInfo,
                                setScheduleMeal,
                                setConsumeMeal,
                              }}
                            ></FormCard>
                          </div>
                        </div>
                        {/* <div className="col-lg-5" style={{marginTop:"-3px"}} >
                          <div className="leave-movement-FormCard">
                            <div
                              style={{ marginTop: "-6px" }}
                              className="d-flex justify-content-between align-items-center"
                            >
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
                              {isEdit ? (
                                <div>
                                  <PrimaryButton
                                    type="button"
                                    className="btn btn-default flex-center"
                                    label={"Save"}
                                    onClick={() => {
                                      if (permission?.isCreate) {
                                        editMenuList(
                                          {
                                            updateBy: employeeId,
                                            menuListViewModelObj: menuList?.map(
                                              (item) => ({
                                                id: item?.intDayOffId,
                                                menu: item?.strMenuList,
                                              })
                                            ),
                                          },
                                          () => {
                                            setIsEdit(false);
                                            getCafeteriaMenuListReport(employeeId, setMenuList, setLoading, "");
                                          }
                                        );
                                      } else {
                                        toast.warn("You don't have permission");
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <PrimaryButton
                                    type="button"
                                    className="btn btn-default flex-center"
                                    label={"Edit Menu"}
                                    onClick={() => {
                                      if (permission?.isEdit) {
                                        setIsEdit(true);
                                      } else {
                                        toast.warn("You don't have permission");
                                      }
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            <MenuList
                              objProps={{
                                setLoading,
                                isEdit,
                                setIsEdit,
                                menuList,
                                setMenuList,
                              }}
                            />
                          </div>
                        </div> */}
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
                              marginBottom: "8px",
                            }}
                          >
                            Schedule Meal
                          </h6>
                          <ScheduleMeal
                            getLandingData={getLandingData}
                            scheduleMeal={scheduleMeal}
                            values={values}
                            employeeId={employeeId}
                          />
                        </div>
                        <div className="col-lg-6">
                          <h6
                            style={{
                              color: "rgba(0, 0, 0, 0.6)",
                              fontSize: "14px",
                              lineHeight: "18px",
                              fontWeight: "600",
                              marginBottom: "8px",
                            }}
                          >
                            Consume Meal
                          </h6>
                          <ConsumeMeal consumeMeal={consumeMeal} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
