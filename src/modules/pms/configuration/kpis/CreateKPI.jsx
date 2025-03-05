import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import PrimaryButton from "../../../../common/PrimaryButton";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../../utility/selectCustomStyle";

import {
  aggregationDDL,
  createNEditKPIs,
  kpiFormatDDL,
  kpiMeasurementDDL,
  kpisCreateColumn,
  updateKPIs,
  validationSchema,
} from "./helper";
import AntScrollTable from "../../../../common/AntScrollTable";

const initialValues = {
  pmType: "",
  objectiveType: "",
  objective: "",
  kpiName: "",
  aggregationType: "",
  kpiMeasurement: "",
  kpiFormat: "",
  chartType: "",
};

const CreateKPI = () => {
  const { orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [rowDto, setRowDto] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [isEdit, setIsEdit] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  // ddls

  const [pmTypeDDL, setPmTypeDDL] = useState([]);
  const [objectiveTypeDDL, setObjectiveTypeDDL] = useState([]);
  const [objectiveDDL, setObjectiveDDL] = useState([]);

  const scrollRef = useRef();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();

  const { toEditData } = params.id ? location?.state : {};

  // formik setup
  const {
    values,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: params.id
      ? {
          pmType: {
            label: toEditData?.strPmtype,
            value: toEditData?.intPmtypeId,
          },
          objectiveType: {
            label: toEditData?.strObjectiveType,
            value: toEditData?.intObjectiveTypeId,
          },
          objective: {
            label: toEditData?.strObjective,
            value: toEditData?.intObjectiveId,
          },
          kpiName: toEditData?.strKpis,
          aggregationType: {
            label: toEditData?.strAggregationType,
            value: toEditData?.strAggregationType,
          },
          kpiMeasurement: {
            label: toEditData?.strMinMax,
            value: toEditData?.strMinMax,
          },
          kpiFormat: {
            label: toEditData?.kpiformat,
            value: toEditData?.kpiformat,
          },
          // chartType: {
          //   label: toEditData?.chartName,
          //   value: toEditData?.chartId,
          // },
        }
      : initialValues,
    validationSchema,
    onSubmit: () => {
      saveHandler();
    },
  });

  const saveHandler = () => {
    if (!params?.id) {
      const found = (
        isEdit
          ? rowDto?.filter((item, itemIndex) => itemIndex !== toEdit)
          : rowDto
      )?.some((item) => {
        return (
          item?.objectiveType?.value === values?.objectiveType?.value &&
          item?.objective?.value === values?.objective?.value &&
          item?.kpiName === values?.kpiName
        );
      });

      if (found) {
        return toast.warn("Can't add duplicate KPIs");
      } else {
        if (isEdit) {
          let modifiedData = rowDto?.map((data, modifiedIndex) =>
            modifiedIndex === toEdit ? values : { ...data }
          );
          setRowDto(modifiedData);
          setIsEdit(false);
        } else {
          setRowDto([...rowDto, values]);
        }
      }
    } else {
      const payload = {
        intKpisId: +params?.id,
        intPmtypeId: toEditData?.intPmtypeId,
        intObjectiveId: toEditData?.intObjectiveId,
        strKpis: values?.kpiName,
        strAggregationType: values?.aggregationType?.value,
        strMinMax: values?.kpiMeasurement?.value,
        kpiformat: values?.kpiFormat?.value,
        intAccountId: orgId,
        intUpdatedBy: employeeId,
        // chartId: values?.chartType?.value,
        // chartName: values?.chartType?.label,
      };
      updateKPIs(payload, setLoading, () => {
        history.push(`/pms/kpiSettings/kpis`);
      });
    }
    resetForm();
  };

  const handleCreateKPI = () => {
    let payload = rowDto?.map((data) => {
      return {
        intPmtypeId: data.pmType.value,
        intObjectiveId: data.objective.value,
        strKpis: data.kpiName,
        strAggregationType: data.aggregationType.value,
        strMinMax: data.kpiMeasurement.value,
        kpiformat: data.kpiFormat.value,
        intAccountId: orgId,
        intCreatedBy: employeeId,
        // chartId: data?.chartType.value,
        // chartName: data?.chartType.label,
      };
    });
    const callback = () => {
      history.push(`/pms/kpiSettings/kpis`);
    };
    payload?.length > 0
      ? createNEditKPIs(payload, setLoading, callback)
      : toast.warning("Please Add KPI");
  };

  useEffect(() => {
    // getPeopleDeskAllDDL(`/PMS/PMTypeDDL`, "value", "label", setPmTypeDDL);
    getPeopleDeskAllDDL(
      `/PMS/ObjectiveTypeDDL?PMTypeId=1`,
      "value",
      "label",
      setObjectiveTypeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card" ref={scrollRef}>
          <div className="table-card-heading heading pt-0">
            <BackButton title={params?.id ? "Update KPI" : "Create KPI"} />
            <div className="table-card-heading ">
              {!params.id && (
                <div className="table-card-head-right">
                  <ul>
                    <li>
                      <PrimaryButton
                        type="button"
                        className="btn btn-green flex-center"
                        label={"Save"}
                        onClick={handleCreateKPI}
                      />
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="table-card-body">
            <div className="card-style mb-2">
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>KPI Name</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=" "
                      value={values?.kpiName}
                      name="kpiName"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("kpiName", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Aggregation Type</label>
                    <FormikSelect
                      name="aggregationType"
                      placeholder=""
                      options={aggregationDDL || []}
                      value={values?.aggregationType}
                      onChange={(valueOption) => {
                        setFieldValue("aggregationType", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>KPI Measurement</label>
                    <FormikSelect
                      name="kpiMeasurement"
                      placeholder=""
                      options={kpiMeasurementDDL || []}
                      value={values?.kpiMeasurement}
                      onChange={(valueOption) => {
                        setFieldValue("kpiMeasurement", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>KPI Format</label>
                    <FormikSelect
                      name="kpiFormat"
                      placeholder=""
                      options={kpiFormatDDL || []}
                      value={values?.kpiFormat}
                      onChange={(valueOption) => {
                        setFieldValue("kpiFormat", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Chart Type</label>
                    <FormikSelect
                      name="chartType"
                      placeholder=""
                      options={[
                        { value: 1, label: "Bar" },
                        { value: 2, label: "Donut" },
                        { value: 3, label: "Line" },
                        { value: 4, label: "Stacked Bar" },
                      ]}
                      value={values?.chartType}
                      onChange={(valueOption) => {
                        setFieldValue("chartType", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div> */}
                {/* <div className="col-md-3">
                  <div className="input-field-main">
                    <label>PM Type</label>
                    <FormikSelect
                      name="pmType"
                      placeholder=""
                      options={pmTypeDDL || []}
                      value={values?.pmType}
                      onChange={(valueOption) => {
                        setObjectiveDDL([]);
                        setFieldValue("pmType", valueOption);
                        setFieldValue("objectiveType", "");
                        setFieldValue("objective", "");
                        getPeopleDeskAllDDL(
                          `/PMS/ObjectiveTypeDDL?PMTypeId=${valueOption?.value}`,
                          "value",
                          "label",
                          setObjectiveTypeDDL
                        );
                        if (valueOption?.value !== 1) {
                          getPeopleDeskAllDDL(
                            `/PMS/ObjectiveDDL?PMTypeId=${valueOption?.value}&ObjectiveTypeId=0`,
                            "value",
                            "label",
                            setObjectiveDDL
                          );
                        }
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={params?.id && true}
                    />
                  </div>
                </div> */}

                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Objective Type</label>
                    <FormikSelect
                      name="objectiveType"
                      placeholder=""
                      options={objectiveTypeDDL || []}
                      value={values?.objectiveType}
                      onChange={(valueOption) => {
                        setFieldValue("objectiveType", valueOption);
                        getPeopleDeskAllDDL(
                          `/PMS/ObjectiveDDL?PMTypeId=${1}&ObjectiveTypeId=${
                            valueOption?.value || 0
                          }`,
                          "value",
                          "label",
                          setObjectiveDDL
                        );
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={params?.id && true}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Objective</label>
                    <FormikSelect
                      name="objective"
                      placeholder=""
                      options={objectiveDDL || []}
                      value={values?.objective}
                      onChange={(valueOption) => {
                        setFieldValue("objective", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={params?.id && true}
                    />
                  </div>
                </div>
                <div className="col-lg-3" style={{ marginTop: "21px" }}>
                  <PrimaryButton
                    type="submit"
                    className="btn btn-green flex-center mr-2"
                    label={isEdit || params.id ? "Save" : "Add"}
                  />
                </div>
              </div>
            </div>
            <div>
              {rowDto?.length > 0 && (
                <div className="table-card-styled employee-table-card tableOne  table-responsive mt-3">
                  <AntScrollTable
                    data={rowDto?.length > 0 ? rowDto : []}
                    columnsData={kpisCreateColumn(
                      page,
                      paginationSize,
                      setToEdit,
                      setIsEdit,
                      scrollRef,
                      setValues,
                      rowDto,
                      setRowDto
                    )}
                    setPage={setPage}
                    setPaginationSize={setPaginationSize}
                    removePagination
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateKPI;
