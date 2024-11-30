import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import AntTable from "../../../../common/AntTable";
import BackButton from "../../../../common/BackButton";
// import DefaultInput from "../../../../common/DefaultInput";
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
  // targetFrequency,
  validationSchema,
  // weightage,
} from "./helper";
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
  // weightage: "",
  // targetFrequency: "",
  // benchmark: "",
};
const DeptKpiCreateAndEdit = () => {
  const {
    // permissionList,
    profileData: { buId, orgId, employeeId, strBusinessUnit },
  } = useSelector((store) => store?.auth);

  // const permission = useMemo(
  //   () => permissionList.find((item) => item?.menuReferenceId === 30355),
  //   // eslint-disable-next-line
  //   []
  // );

  const [departmentDDL, setDepartmentDDL] = useState([]);
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

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
    getPeopleDeskAllDDL(`/PMS/PMTypeDDL`, "value", "label", setPmTypeDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (dept, emp, designation, type) => {
    getKPIsCreateMappingData({
      buId,
      orgId,
      deptId: dept,
      setRowDto,
      setLoading,
      setTotalDto,
    });
  };

  useEffect(() => {
    if (location?.state?.departmentId) {
      getData(location?.state?.departmentId, 0, 0, 1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.departmentId]);

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
      department: location?.state?.departmentId
        ? {
            value: location?.state?.departmentId,
            label: location?.state?.departmentName,
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
    return "";
  };
  return (
    <>
      {loading && <Loading />}
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>Create Dept KPI Mapping</h2>
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
                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>Department</label>
                    <FormikSelect
                      name="department"
                      options={departmentDDL || []}
                      value={values?.department}
                      onChange={(valueOption) => {
                        setFieldValue("department", valueOption);
                        getData(valueOption?.value, 0, 0);
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={location?.state?.departmentId}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="input-field-main">
                    <label>PM Type</label>
                    <FormikSelect
                      name="pmType"
                      options={pmTypeDDL || []}
                      value={values?.pmType}
                      onChange={(valueOption) => {
                        setObjectiveDDL([]);
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
                  rowKey={(record) => record?.roleName}
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

export default DeptKpiCreateAndEdit;
