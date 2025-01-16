import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AsyncFormikSelect from "../../../../../common/AsyncFormikSelect";
// import DefaultInput from "../../../../../common/DefaultInput";
import FormikSelect from "../../../../../common/FormikSelect";
import PrimaryButton from "../../../../../common/PrimaryButton";
import { customStyles } from "../../../../../utility/selectCustomStyle";
// import { getPeopleDeskAllDDL } from "../../../../announcement/helper";
import EmployeeShortDetails from "./EmployeeShortDetails";
import { getKPIsCreateMappingData } from "./helper";
import { getPeopleDeskAllDDL } from "../../../../../common/api";
import { shallowEqual, useSelector } from "react-redux";

const CreateNEditForm = ({ propsObj }) => {
  const {
    component,
    values,
    setFieldValue,
    errors,
    touched,
    orgId,
    buId,
    setRowDto,
    setLoading,
    setTotalDto,
    params,
    setSecondTableData,
  } = propsObj;

  const location = useLocation();
  const { wId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // ddls
  const [departmentDDL, setDepartmentDDL] = useState([]);
  // const [designationDDL, setDesignationDDL] = useState([]);
  const [pmTypeDDL, setPmTypeDDL] = useState([]);
  const [objectiveTypeDDL, setObjectiveTypeDDL] = useState([]);
  const [objectiveDDL, setObjectiveDDL] = useState([]);
  const [kpiNameDDL, setKpiNameDDL] = useState([]);
  const [employeeBasicId, setEmployeeBasicId] = useState(undefined);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${orgId}&BusinessUnitId=${buId}&workplaceGroupId=${wgId}&intWorkplaceId=${wId}&intId=0`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
    // getPeopleDeskAllDDL(
    //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation&AccountId=${orgId}&BusinessUnitId=${buId}&intId=0`,
    //   "DesignationId",
    //   "DesignationName",
    //   setDesignationDDL
    // );
    getPeopleDeskAllDDL(
      `/PMS/PMTypeDDL?EmployeeId=${location?.state?.employeeId}`,
      "value",
      "label",
      setPmTypeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state?.employeeId]);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/PMS/EmployeeInfoDDLSearch?AccountId=${orgId}&BusinessUnitId=${buId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const getData = (dept, emp, designation, type) => {
    getKPIsCreateMappingData(
      component === "dept" ? 1 : component === "employee" ? 3 : type,
      buId,
      orgId,
      dept,
      emp,
      designation,
      setRowDto,
      setLoading,
      setTotalDto,
      setSecondTableData
    );
  };

  useEffect(() => {
    params?.id === "1" && getData(location?.state?.deptId, 0, 0, 1);
    params?.id === "2" &&
      getData(location?.state?.deptId, 0, location?.state?.designationId, 2);
    params?.id === "3" &&
      getData(
        location?.state?.deptId,
        location?.state?.employeeId,
        location?.state?.designationId,
        3
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  return (
    <>
      <div className="card-style mb-2">
        <div className="row">
          <div className="col-md-3">
            <div className="input-field-main">
              <label>Employee</label>
              <AsyncFormikSelect
                selectedValue={values?.employee}
                isSearchIcon={true}
                handleChange={(valueOption) => {
                  setFieldValue("employee", valueOption);
                  setEmployeeBasicId(
                    valueOption ? valueOption?.value : undefined
                  );
                  if (valueOption) {
                    getData(
                      valueOption?.departmentId,
                      valueOption?.value,
                      valueOption?.designationId
                    );
                  }
                }}
                loadOptions={loadUserList}
                isDisabled={
                  (component === "dept" ||
                    component === "designation" ||
                    params?.id) &&
                  true
                }
              />
            </div>
          </div>
          {component === "employee" && (
            <div className="col-md-9 mt-3">
              {values?.employee && employeeBasicId && (
                <EmployeeShortDetails
                  DesignationName={values?.employee?.employeeInfoDesignation}
                  DepartmentName={values?.employee?.employeeInfoDepartment}
                />
              )}
            </div>
          )}
          {component !== "employee" && (
            <div className="col-md-3">
              <div className="input-field-main">
                <label>Department</label>
                <FormikSelect
                  name="department"
                  placeholder=""
                  options={departmentDDL || []}
                  value={values?.department}
                  onChange={(valueOption) => {
                    setFieldValue("department", valueOption);
                    component === "dept" && getData(valueOption?.value, 0, 0);
                    component === "designation" &&
                      getData(
                        valueOption?.value,
                        0,
                        values?.designation?.value || 0
                      );
                  }}
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          )}
          {/* {component !== "employee" && (
            <div className="col-md-3">
              <div className="input-field-main">
                <label>Designation</label>
                <FormikSelect
                  name="designation"
                  placeholder=""
                  options={designationDDL || []}
                  value={values?.designation}
                  onChange={(valueOption) => {
                    setFieldValue("designation", valueOption);
                    component === "designation" &&
                      getData(values?.department?.value, 0, valueOption?.value);
                  }}
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                  isDisabled={(component === "dept" || params?.id) && true}
                />
              </div>
            </div>
          )} */}

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
          <div className="col-lg-3" style={{ marginTop: "21px" }}>
            <PrimaryButton
              type="submit"
              className="btn btn-green flex-center mr-2"
              label={"Add"}
              disabled={component === "employee" && !values?.employee}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNEditForm;
