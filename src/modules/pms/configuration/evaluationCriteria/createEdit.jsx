import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import Loading from "../../../../common/loading/Loading";
import BackButton from "../../../../common/BackButton";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import DefaultInput from "../../../../common/DefaultInput";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";

const initData = {};

const validationSchema = Yup.object().shape({});

export default function CreateEdit() {
  const commonDDLItems = [
    { value: "BSC", label: "BSC" },
    { value: "360", label: "360" },
  ];
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const [criteriaList, getCriteriaList, criteriaListLoader, setCriteriaList] =
    useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const params = useParams();

  const saveHandler = (values, cb) => {
    if (
      +criteriaList?.percentageOfKPI + +criteriaList?.percentageOfBAR !==
      100
    ) {
      return toast.warn("Sum of KPI and BAR must be 100");
    }
    if (
      +criteriaList?.percentageOfKPI360 + +criteriaList?.percentageOfBAR360 !==
      100
    ) {
      return toast.warn("Sum of KPI and BAR must be 100");
    }
    const payload = {
      ...criteriaList,
      accountId: profileData?.intAccountId,
      actionBy: profileData?.userId,
      percentageOfBAR: +criteriaList?.percentageOfBAR,
      percentageOfKPI: +criteriaList?.percentageOfKPI,
      percentageOfKPI360: +criteriaList?.percentageOfKPI360,
      percentageOfBAR360: +criteriaList?.percentageOfBAR360,
    };
    saveData(`/PMS/SaveEvaluationCriteria`, payload, null, true);
  };

  const { setFieldValue, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values, () => {
        if (params?.id) {
        } else {
          resetForm(initData);
        }
      });
    },
  });

  useEffect(() => {
    getCriteriaList(
      `/PMS/GetEvaluationCriteria?accountId=${profileData?.intAccountId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {(criteriaListLoader || saveDataLoader) && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading mb12">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>
                {params?.id
                  ? "Edit Evaluation Criteria"
                  : "Create Evaluation Criteria"}
              </h2>
            </div>
            <ul className="d-flex flex-wrap">
              <li>
                <button type="submit" className="btn btn-default flex-center">
                  Save
                </button>
              </li>
            </ul>
          </div>
          <div className="table-card-body">
            <div className="col-md-12 px-0 mt-3">
              <div className="card-style">
                <div className="row">
                  <div className="col-12 mt-2 mb-2">
                    <h2>Configuration</h2>
                  </div>
                  {criteriaList?.positionGroupWiseCriteriaList?.map(
                    (item, index) => (
                      <div className="col-md-6 input-field-main d-flex align-items-center justify-content-between my-1">
                        <label>{item?.positionGroupName}</label>
                        <div
                          className="d-flex align-items-center"
                          style={{ width: "60%" }}
                        >
                          <h6 style={{ width: "5%" }}>:</h6>
                          <FormikSelect
                            styles={{
                              ...customStyles,
                              control: (provided) => ({
                                ...customStyles?.control(provided),
                                width: "100%",
                              }),
                            }}
                            containerStyles={{ width: "95%", marginBottom: 0 }}
                            classes="input-sm"
                            name={item?.evaluationCriteriaOfPMS}
                            options={commonDDLItems}
                            value={{
                              value: item?.evaluationCriteriaOfPMS,
                              label: item?.evaluationCriteriaOfPMS,
                            }}
                            onChange={(valueOption) => {
                              if (valueOption) {
                                const modifiedData = { ...criteriaList };
                                modifiedData[`positionGroupWiseCriteriaList`][
                                  index
                                ]["evaluationCriteriaOfPMS"] =
                                  valueOption?.value;
                                setFieldValue(
                                  `${item?.evaluationCriteriaOfPMS}`,
                                  valueOption?.value
                                );
                              } else {
                                const modifiedData = { ...criteriaList };
                                modifiedData[`positionGroupWiseCriteriaList`][
                                  index
                                ]["evaluationCriteriaOfPMS"] = "";
                                setFieldValue(
                                  `${item?.evaluationCriteriaOfPMS}`,
                                  ""
                                );
                              }
                            }}
                            placeholder=""
                            errors={errors}
                            touched={touched}
                            menuPosition="fixed"
                          />
                        </div>
                      </div>
                    )
                  )}
                  <div className="col-md-6"></div>
                  <div className="col-lg-6 mt-5">
                    <h2>Score and Scale for BSC</h2>
                    <div className="input-field-main d-flex align-items-center justify-content-between my-1">
                      <label>
                        Key Performance Indicator - <strong>KPI</strong>
                      </label>
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "60%" }}
                      >
                        <h6 style={{ width: "5%" }}>:</h6>
                        <DefaultInput
                          styles={{ width: "100%" }}
                          containerStyles={{ width: "95%", marginBottom: 0 }}
                          classes="input-sm"
                          value={criteriaList?.percentageOfKPI}
                          name="bar"
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            const modifiedData = { ...criteriaList };
                            modifiedData[`percentageOfBAR`] = 0;
                            setCriteriaList(modifiedData);
                            if (
                              criteriaList?.percentageOfBAR + +e.target.value >
                              100
                            ) {
                              return toast.warn(
                                "KPI can't be greater than 100"
                              );
                            }
                            modifiedData[`percentageOfKPI`] = e.target.value;
                            setCriteriaList(modifiedData);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="input-field-main d-flex align-items-center justify-content-between my-1">
                      <label>
                        Behaviorally Anchored Rating - <strong>BAR</strong>
                      </label>
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "60%" }}
                      >
                        <h6 style={{ width: "5%" }}>:</h6>
                        <DefaultInput
                          styles={{ width: "100%" }}
                          containerStyles={{ width: "95%", marginBottom: 0 }}
                          classes="input-sm"
                          value={criteriaList?.percentageOfBAR}
                          name="kpi"
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            if (
                              +e.target.value + +criteriaList?.percentageOfKPI >
                              100
                            ) {
                              return toast.warn(
                                "Sum of KPI and BAR can't be greater than 100"
                              );
                            }
                            const modifiedData = { ...criteriaList };
                            modifiedData[`percentageOfBAR`] = e.target.value;
                            setCriteriaList(modifiedData);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-5">
                    <h2>Score and Scale for 360</h2>
                    <div className="input-field-main d-flex align-items-center justify-content-between my-1">
                      <label>
                        Key Performance Indicator - <strong>KPI</strong>
                      </label>
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "60%" }}
                      >
                        <h6 style={{ width: "5%" }}>:</h6>
                        <DefaultInput
                          styles={{ width: "100%" }}
                          containerStyles={{ width: "95%", marginBottom: 0 }}
                          classes="input-sm"
                          value={criteriaList?.percentageOfKPI360}
                          name="bar"
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            const modifiedData = { ...criteriaList };
                            modifiedData[`percentageOfBAR360`] = 0;
                            setCriteriaList(modifiedData);
                            if (
                              criteriaList?.percentageOfBAR360 +
                                +e.target.value >
                              100
                            ) {
                              return toast.warn(
                                "KPI can't be greater than 100"
                              );
                            }
                            modifiedData[`percentageOfKPI360`] = e.target.value;
                            setCriteriaList(modifiedData);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="input-field-main d-flex align-items-center justify-content-between my-1">
                      <label>
                        Behaviorally Anchored Rating - <strong>BAR</strong>
                      </label>
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "60%" }}
                      >
                        <h6 style={{ width: "5%" }}>:</h6>
                        <DefaultInput
                          styles={{ width: "100%" }}
                          containerStyles={{ width: "95%", marginBottom: 0 }}
                          classes="input-sm"
                          value={criteriaList?.percentageOfBAR360}
                          name="kpi"
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            if (
                              +e.target.value +
                                +criteriaList?.percentageOfKPI360 >
                              100
                            ) {
                              return toast.warn(
                                "Sum of KPI and BAR can't be greater than 100"
                              );
                            }
                            const modifiedData = { ...criteriaList };
                            modifiedData[`percentageOfBAR360`] = e.target.value;
                            setCriteriaList(modifiedData);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-2 mb-2 mt-5">
                    <h2>Behavioral Scale</h2>
                  </div>
                  {criteriaList?.scaleList?.map((item, index) => (
                    <div className="col-md-6 input-field-main">
                      <div className="d-flex align-items-center justify-content-between my-1">
                        <label>{item?.scaleName} </label>
                        <div
                          className="d-flex align-items-center"
                          style={{ width: "60%" }}
                        >
                          <h6 style={{ width: "5%" }}>:</h6>
                          <div
                            className="d-flex align-items-center"
                            style={{ width: "60%" }}
                          >
                            <DefaultInput
                              styles={{ width: "100%" }}
                              containerStyles={{
                                width: "95%",
                                marginBottom: 0,
                              }}
                              classes="input-sm"
                              value={`${item?.scaleValue}`}
                              name={`${item?.scaleValue}`}
                              type="number"
                              className="form-control"
                              onChange={(e) => {
                                const modifiedData = { ...criteriaList };
                                modifiedData[`scaleList`][index]["scaleValue"] =
                                  +e.target.value;
                                setFieldValue(
                                  `${item[index]?.scaleValue}`,
                                  +e.target.value
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
