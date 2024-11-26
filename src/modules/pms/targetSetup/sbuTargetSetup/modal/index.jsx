import React from "react";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Form, Formik } from "formik";
import Loading from "../../../../../common/loading/Loading";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import DefaultInput from "../../../../../common/DefaultInput";
import { onChangeTargetFrequency } from "./helper";
import styles from "./sbuTargetModal.module.css";
import { gray500 } from "../../../../../utility/customColor";
import { todayDate } from "../../../../../utility/todayDate";

const initData = {
  weightage: "",
  benchmark: "",
  targetFrequency: "",
  url: "",
  targetForAll: "",
};

const SbuTargetEntryModal = ({
  currentItem,
  setIsShowModal,
  previousLandingValues,
  getLandingData,
}) => {
  const formikRef = React.useRef(null);
  const [, getPreviousData, previousDataLoader] = useAxiosGet();
  const [, saveIndividualtarget, saveIndividualtargetLoader] = useAxiosPost();
  const [targetList, setTargetList] = useState([]);
  const { intEmployeeId, buId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values, cb) => {
    if (!values?.weightage) {
      return toast.warn("Please select weightage");
    }
    if (!values?.benchmark) {
      return toast.warn("Please enter benchmark");
    }
    if (!values?.targetFrequency) {
      return toast.warn("Please select target frequency");
    }
    const payload = [];
    targetList?.forEach((item) => {
      payload.push({
        saveTargetOrAchievement: "Target",
        intTargetId: item?.intTargetId || 0,
        intAccountId: intAccountId,
        intBusinessUnitId: previousLandingValues?.sbu?.value,
        intKpisId: currentItem?.kpiId,
        intEmployeeId: 0,
        numTarget: +item?.numTarget,
        numWeightage: values?.weightage?.value,
        strTargetFrequency: values?.targetFrequency?.label,
        intFrequencyValue: item?.id,
        strFrequencyValue: item?.strFrequencyValue,
        numBenchmark: +values?.benchmark,
        intYearId: previousLandingValues?.year?.value,
        strUrl: values?.url || "",
        strDataSource: "",
        isActive: true,
        intChartId: 0,
        isShownDashboard: true,
        intCreatedBy: intEmployeeId,
        dteCreatedAt: todayDate(),
        numAchivement: 0,
        intKpiforId: 3, // 3 for sbu
        departmentId: previousLandingValues?.department?.value,
      });
    });
    saveIndividualtarget(`/PMS/SaveTargetVsAchievement`, payload, cb, true);
  };

  const weightage = () => {
    let arr = [];
    for (let i = 5; i <= 25; i++) {
      arr.push({
        label: i,
        value: i,
      });
    }
    return arr;
  };

  const targetFrequency = [
    {
      label: "Monthly",
      value: "Monthly",
    },
    {
      label: "Quarterly",
      value: "Quarterly",
    },
    {
      label: "Yearly",
      value: "Yearly",
    },
  ];

  const getData = () => {
    if (currentItem && currentItem?.isTargetAssigned && formikRef.current) {
      getPreviousData(
        `/PMS/GetTargetVsAchievementById?BusinessUnit=${buId}&YearId=14&KpiForId=2&KpiForReffId=${previousLandingValues?.department?.value}&objectiveId=${currentItem?.intStrategicParticularsID}&kpiId=${currentItem?.kpiId}&accountId=${intAccountId}`,
        (data) => {
          formikRef.current.setValues({
            ...initData,
            weightage: currentItem?.numWeight
              ? {
                  label: currentItem?.numWeight,
                  value: currentItem?.numWeight,
                }
              : "",
            benchmark: currentItem?.benchmark || "",
            targetFrequency: currentItem?.strFrequency
              ? {
                  label: currentItem?.strFrequency,
                  value: currentItem?.intFrequency,
                }
              : "",
            url: currentItem?.strURL || "",
          });
          setTargetList(data);
        }
      );
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setTargetList([]);
          getLandingData();
          setIsShowModal(false);
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
        isValid,
        setValues,
      }) => (
        <>
          <Form onSubmit={handleSubmit}>
            {(previousDataLoader || saveIndividualtargetLoader) && <Loading />}
            <div>
              <div
                className="modalBody"
                style={{ padding: "0px 16px", height: "500px" }}
              >
                <div className="row">
                  <div className="col-6 mb-2">
                    <div className="card-style pb-2">
                      <h1 className="mb-2">Department Information</h1>
                      <p className="mb-2">
                        <strong>Department Name: </strong>{" "}
                        {previousLandingValues?.department?.label}{" "}
                        <strong>Year: </strong>{" "}
                        {previousLandingValues?.year?.label}
                      </p>
                    </div>
                  </div>
                  <div className="col-6 mb-2 ">
                    <div className="card-style pb-2">
                      <h1 className="mb-2">KPI Information</h1>
                      <p className="mb-2">
                        {currentItem?.strDataSource} <strong>Objective:</strong>{" "}
                        {currentItem?.objective} <strong>KPI:</strong>{" "}
                        {currentItem?.label}
                      </p>
                    </div>
                  </div>
                  <div className="col-4">
                    <label>Weightage</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="weightage"
                      options={weightage() || []}
                      value={values?.weightage}
                      onChange={(valueOption) => {
                        setFieldValue("weightage", valueOption);
                        setFieldValue("benchmark", "");
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-4">
                    <label>Benchmark</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.benchmark}
                      name="benchmark"
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        if (+e.target.value > values?.weightage?.value) {
                          toast.warn(
                            "Benchmark can't be greater than weightage"
                          );
                        } else {
                          setFieldValue("benchmark", e.target.value);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-4">
                    <label>Target Frequency</label>
                    <FormikSelect
                      classes="input-sm form-control"
                      name="targetFrequency"
                      options={targetFrequency || []}
                      value={values?.targetFrequency}
                      onChange={(valueOption) => {
                        setFieldValue("targetFrequency", valueOption);
                        setFieldValue("targetForAll", "");
                        onChangeTargetFrequency({
                          valueOption,
                          values,
                          setTargetList,
                          year: previousLandingValues?.year?.label,
                        });
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={currentItem?.isTargetAssigned}
                    />
                  </div>
                  <div className="col-4">
                    <label>URL (Source Link)</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.url}
                      name="url"
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("url", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-4">
                    <label>Set Target For All</label>
                    <DefaultInput
                      classes="input-sm"
                      value={values?.targetForAll}
                      name="targetForAll"
                      type="number"
                      className="form-control"
                      onChange={(e) => {
                        const modifiedTargetList = targetList?.map((item) => {
                          return { ...item, numTarget: e.target.value };
                        });
                        setTargetList(modifiedTargetList);
                        setFieldValue("targetForAll", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-12">
                    {targetList?.length > 0 ? (
                      <div className="table-card-styled employee-table-card tableOne">
                        <table className="table">
                          {" "}
                          <thead>
                            <tr>
                              <th className="pl-2">KPI Name</th>
                              <th className="text-center">
                                {values?.targetFrequency?.value === "Monthly"
                                  ? "Months"
                                  : values?.targetFrequency?.value ===
                                    "Quarterly"
                                  ? "Quarters"
                                  : "Year"}
                              </th>
                              <th style={{ width: "300px" }}>Set The Target</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              className={styles.targetSetupTableRowOnHoverStyle}
                            >
                              <td
                                className="px-3 position-relative"
                                rowSpan={
                                  values?.targetFrequency?.label === "Monthly"
                                    ? 12
                                    : values?.targetFrequency?.label ===
                                      "Quarterly"
                                    ? 4
                                    : 1
                                }
                              >
                                <p
                                  style={{
                                    color: gray500,
                                    position: "absolute",
                                    top: "8px",
                                    marginLeft: "8px",
                                  }}
                                >
                                  {" "}
                                  {currentItem?.label}
                                </p>
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  borderLeft: `1px solid rgba(0, 0, 0, 0.12)`,
                                }}
                              >
                                {targetList?.[0]?.strFrequencyValue}
                              </td>
                              <td>
                                <DefaultInput
                                  classes="input-sm"
                                  value={targetList[0]?.numTarget || ""}
                                  type="number"
                                  className="form-control"
                                  onChange={(e) => {
                                    const modifiedTargetList = targetList?.map(
                                      (item, index) =>
                                        index === 0
                                          ? {
                                              ...item,
                                              numTarget: e.target.value,
                                            }
                                          : item
                                    );
                                    setTargetList(modifiedTargetList);
                                  }}
                                />
                              </td>
                            </tr>
                            {targetList?.map((item, index) =>
                              index === 0 ? (
                                <></>
                              ) : (
                                <tr
                                  className={
                                    styles.targetSetupTableRowOnHoverStyle
                                  }
                                >
                                  <td className="text-center">
                                    {item?.strFrequencyValue}
                                  </td>
                                  <td>
                                    <DefaultInput
                                      classes="input-sm"
                                      value={targetList[index]?.numTarget || ""}
                                      type="number"
                                      className="form-control"
                                      onChange={(e) => {
                                        const modifiedTargetList =
                                          targetList?.map(
                                            (nestedItem, nestedIndex) =>
                                              index === nestedIndex
                                                ? {
                                                    ...nestedItem,
                                                    numTarget: e.target.value,
                                                  }
                                                : nestedItem
                                          );
                                        setTargetList(modifiedTargetList);
                                      }}
                                    />
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer form-modal-footer">
                <button
                  type="button"
                  className="btn btn-cancel"
                  style={{
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    setTargetList([]);
                    setIsShowModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-green btn-green-disable"
                  style={{ width: "auto" }}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default SbuTargetEntryModal;
