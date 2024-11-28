import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
import FormikSelect from "../../../../common/FormikSelect";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import Loading from "../../../../common/loading/Loading";
import { customStyles } from "../../../../utility/selectCustomStyle";
// import { getPeopleDeskAllDDL } from "../../../announcement/helper";
import {
  getKPIsCreateMappingData,
  handleCreateKpiMapping,
  kpiMappingColumns,
  saveHandler,
  validationSchema,
} from "./helper";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import AntScrollTable from "../../../../common/AntScrollTable";
import { getPeopleDeskAllDDL } from "../../../../common/api";
export const initialValues = {
  department: "",
  designation: "",
  employee: "",
  pmType: "",
  objectiveType: "",
  objective: "",
  kpiName: "",
  aggregationType: "",
  kpiMeasurement: "",
  kpiFormat: "",
  weightage: "",
  targetFrequency: "",
  benchmark: "",
};
const SbuKpiCreateAndEdit = () => {
  const {
    profileData: { buId, orgId, employeeId, strBusinessUnit },
  } = useSelector((store) => store?.auth);

  // ddls
  // const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [pmTypeDDL, setPmTypeDDL] = useState([]);
  const [objectiveTypeDDL, setObjectiveTypeDDL] = useState([]);
  const [objectiveDDL, setObjectiveDDL] = useState([]);
  const [kpiNameDDL, setKpiNameDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const location = useLocation();
  const [totalDto, setTotalDto] = useState([]);

  const [
    businessUnitDDL,
    getBusinessUnitDDL,
    businessUnitDDLloader,
    setBusinessUnitDDL,
  ] = useAxiosGet();

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

    getPeopleDeskAllDDL(`/PMS/PMTypeDDL`, "value", "label", setPmTypeDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (sbuId) => {
    getKPIsCreateMappingData({
      orgId,
      sbuId,
      setRowDto,
      setLoading,
      setTotalDto,
    });
  };

  useEffect(() => {
    if (location?.state?.sbuId) {
      getData(location?.state?.sbuId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.sbuId]);

  const {
    errors,
    touched,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
    values,
  } = useFormik({
    validationSchema: validationSchema(),
    initialValues: {
      ...initialValues,
      businessUnit: location?.state?.sbuId
        ? {
            value: location?.state?.sbuId,
            label: location?.state?.sbu,
          }
        : "",
    },
    onSubmit: (formValues) => {
      saveHandler(
        params,
        rowDto,
        values,
        setRowDto,
        strBusinessUnit,
        setValues
      );
    },
  });

  const callback = () => {
    return !params?.id ? setRowDto([]) : "";
  };
  return (
    <>
      {(loading || businessUnitDDLloader) && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>Create SBU KPI Mapping</h2>
          </div>
          <ul className="d-flex flex-wrap">
            <li>
              <button
                type="button"
                onClick={() => {
                  handleCreateKpiMapping({
                    typeId: 0,
                    rowDto,
                    orgId,
                    buId,
                    employeeId,
                    setLoading,
                    totalDto,
                    resetForm,
                    cb: callback,
                  });
                }}
                className="btn btn-green w-100"
                disabled={false}
              >
                Save
              </button>
            </li>
          </ul>
        </div>

        <div className="table-card-body">
          <div className="card-style with-form-card pb-2 my-2 ">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>SBU</label>
                    <FormikSelect
                      name="businessUnit"
                      options={businessUnitDDL || []}
                      value={values?.businessUnit}
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption || "");
                        getData(valueOption?.value);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={location?.state?.sbuId}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>PM Type</label>
                    <FormikSelect
                      name="pmType"
                      placeholder=""
                      options={pmTypeDDL || []}
                      value={values?.pmType}
                      onChange={(valueOption) => {
                        setFieldValue("pmType", valueOption);
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

                        setFieldValue("objectiveType", "");
                        setFieldValue("objective", "");
                        setFieldValue("kpiName", "");
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
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
                          `/PMS/ObjectiveDDL?PMTypeId=${values.pmType?.value}&ObjectiveTypeId=${valueOption?.value}`,
                          "value",
                          "label",
                          setObjectiveDDL
                        );
                        setFieldValue("objective", "");
                        setFieldValue("kpiName", "");
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={values?.pmType?.value !== 1 ? true : false}
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
                        getPeopleDeskAllDDL(
                          `/PMS/GetKPIDDL?AccountId=${orgId}&ObjectiveId=${valueOption?.value}`,
                          "value",
                          "label",
                          setKpiNameDDL
                        );
                        setFieldValue("kpiName", "");
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>KPI Name</label>
                    <FormikSelect
                      name="kpiName"
                      placeholder=""
                      options={kpiNameDDL || []}
                      value={values?.kpiName}
                      onChange={(valueOption) => {
                        setFieldValue("kpiName", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Weightage</label>
                    <FormikSelect
                      name="weightage"
                      placeholder=""
                      options={weightage() || []}
                      value={values?.weightage}
                      onChange={(valueOption) => {
                        setFieldValue("weightage", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div> */}
                {/* <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Target Frequency</label>
                    <FormikSelect
                      name="targetFrequency"
                      placeholder=""
                      options={targetFrequency || []}
                      value={values?.targetFrequency}
                      onChange={(valueOption) => {
                        setFieldValue("targetFrequency", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div> */}
                {/* <div className="col-lg-3">
                  <div className="input-field-main">
                    <label>Benchmark</label>
                    <DefaultInput
                      classes="input-sm"
                      placeholder=" "
                      value={values?.benchmark}
                      name="benchmark"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("benchmark", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div> */}
                <div className="col-lg-3" style={{ marginTop: "21px" }}>
                  <PrimaryButton
                    type="submit"
                    className="btn btn-green flex-center mr-2"
                    label={"Add"}
                    disabled={false}
                  />
                </div>
              </div>
            </form>
          </div>
          <div>
            {rowDto?.length > 0 ? (
              <div className="table-card-styled employee-table-card tableOne table-responsive">
                <AntScrollTable
                  data={rowDto}
                  columnsData={kpiMappingColumns(
                    page,
                    paginationSize,
                    rowDto,
                    setRowDto
                  )}
                  setPage={setPage}
                  setPaginationSize={setPaginationSize}
                />
              </div>
            ) : (
              <NoResult />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SbuKpiCreateAndEdit;
