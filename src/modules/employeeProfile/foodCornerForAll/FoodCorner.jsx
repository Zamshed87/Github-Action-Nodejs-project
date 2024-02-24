/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { PeopleDeskSaasDDL } from "../../../common/api";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { todayDate } from "../../../utility/todayDate";
import Loading from "./../../../common/loading/Loading";
import ConsumeMeal from "./components/ConsumeMeal";
import FormCard from "./components/FormCard";
import MenuList from "./components/MenuList";
import ScheduleMeal from "./components/ScheduleMeal";
import {
  createCafeteriaEntry,
  editMenuList,
  getCafeteriaMenuListReport,
  getPendingAndConsumeMealReport,
} from "./helper";
import "./style.css";

const initData = {
  search: "",
  radioType: "private",
  employee: "",
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
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [scheduleMeal, setScheduleMeal] = useState([]);
  const [consumeMeal, setConsumeMeal] = useState([]);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [menuList, setMenuList] = useState([]);
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
      cb
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
      wgId,
      buId,
      setEmployeeDDL,
      "EmployeeId",
      "EmployeeName"
    );
  }, [wgId, buId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 144) {
      permission = item;
    }
  });

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
                    <div className="table-card-heading mt-3">
                      <div className="row">
                        <div className="col-lg-7">
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
                        <div className="col-lg-5">
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
                        </div>
                      </div>
                    </div>
                    <div className="table-card-body">
                      <div className="row">
                        <div className="col-lg-4">
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
                            values={values}
                          />
                        </div>
                        <div className="col-lg-3">
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
