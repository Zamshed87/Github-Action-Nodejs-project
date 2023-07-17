import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDL, getPeopleDeskAllDDL } from "../../../../../common/api";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import DatePickerBorderLess from "./../../../../../common/DatePickerBorderless";

export default function FilterModal({ propsObj }) {
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { getFilterValues, setFieldValue, values, errors, touched } = propsObj;

  const [movementTypeDDL, setMovementTypeDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [allDDL, setAllDDL] = useState([]);
  const [empId, setEmployeeId] = useState("");

  useEffect(() => {
    // Movement DDL
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=MovementType&BusinessUnitId=${buId}&intId=${empId ? empId : employeeId}&WorkplaceGroupId=${wgId}`,
      "MovementTypeId",
      "MovementType",
      setMovementTypeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, empId]);

  useEffect(() => {
    getFilterDDL(buId, "", "", "", "", "", setAllDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  useEffect(() => {
    if (allDDL) {
      // workplaceGroupDDL
      const modifyWorkplaceDDL = allDDL?.workplaceGroupList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setWorkplaceGroupDDL(modifyWorkplaceDDL);

      // department
      const modifyDepartmentDDL = allDDL?.departmentList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setDepartmentDDL(modifyDepartmentDDL);

      // Designation DDL
      const modifyDesignationDDL = allDDL?.designationList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setDesignationDDL(modifyDesignationDDL);

      // Employee DDL
      const modifyEmployeeDDL = allDDL?.employeeList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setEmployeeDDL(modifyEmployeeDDL);
    }
  }, [allDDL]);

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Workplace Group</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="workplace"
                options={workplaceGroupDDL || []}
                value={values?.workplace}
                onChange={(valueOption) => {
                  getFilterDDL(
                    buId,
                    valueOption?.value || "",
                    "",
                    "",
                    "",
                    "",
                    setAllDDL
                  );
                  setFieldValue("department", "");
                  setFieldValue("designation", "");
                  setFieldValue("employee", "");
                  setFieldValue("workplace", valueOption);
                  getFilterValues("workplace", valueOption);
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Designation</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="designation"
                options={designationDDL || []}
                value={values?.designation}
                onChange={(valueOption) => {
                  getFilterDDL(
                    buId,
                    values?.workplaceGroup?.value || "",
                    values?.department?.value || "",
                    valueOption?.value || "",
                    "",
                    "",
                    setAllDDL
                  );
                  setFieldValue("employee", "");
                  setFieldValue("designation", valueOption);
                  getFilterValues("designation", valueOption);
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Movement  Type</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="movementType"
                options={movementTypeDDL || []}
                value={values?.movementType}
                onChange={(valueOption) => {
                  setFieldValue("movementType", valueOption);
                  getFilterValues("movementType", valueOption);
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>From Date</h3>
            </div>
            <div className="col-md-7 input-field ml-0">
              <DatePickerBorderLess
                label=""
                value={values?.movementFromDate}
                name="movementFromDate"
                onChange={(e) => {
                  setFieldValue("movementFromDate", e.target.value);
                  getFilterValues("movementFromDate", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Department</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="department"
                options={departmentDDL || []}
                value={values?.department}
                onChange={(valueOption) => {
                  getFilterDDL(
                    buId,
                    values?.workplaceGroup?.value || "",
                    valueOption?.value || "",
                    "",
                    "",
                    "",
                    setAllDDL
                  );
                  setFieldValue("designation", "");
                  setFieldValue("employee", "");
                  setFieldValue("department", valueOption);
                  getFilterValues("department", valueOption);
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Employee</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="employee"
                options={employeeDDL || []}
                value={values?.employee}
                onChange={(valueOption) => {
                  setFieldValue("employee", valueOption);
                  getFilterValues("employee", valueOption);
                  setFieldValue("movementType", "");
                  setEmployeeId(valueOption?.value);
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Application Status</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="appStatus"
                options={[
                  { value: 1, label: "Pending" },
                  { value: 2, label: "Approved" },
                  { value: 3, label: "Rejected" },
                ]}
                value={values?.appStatus}
                onChange={(valueOption) => {
                  setFieldValue("appStatus", valueOption);
                  getFilterValues("appStatus", valueOption);
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
              />
            </div>
          </div>
          <div className="align-items-center row">
            <div className="col-md-5">
              <h3>To Date</h3>
            </div>
            <div className="col-md-7 ml-0 input-field">
              <DatePickerBorderLess
                label=""
                value={values?.movementToDate}
                name="movementToDate"
                onChange={(e) => {
                  setFieldValue("movementToDate", e.target.value);
                  getFilterValues("movementToDate", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
