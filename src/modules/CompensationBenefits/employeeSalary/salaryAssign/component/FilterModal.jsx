import React, { useEffect, useState } from 'react';
import { getCombineAllWithSupDDL, getPeopleDeskAllDDL } from '../../../../../common/api';
import BorderlessSelect from './../../../../../common/BorderlessSelect';
import { borderlessSelectStyle } from './../../../../../utility/BorderlessStyle';

const SelfIOUFilterModal = ({ propsObj }) => {

  const { getFilterValues, setFieldValue, values, errors, touched, orgId, buId, employeeId } = propsObj;

  // DDL
  const [allDDL, setAllDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [supervisorDDL, setSupervisorDDL] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState(false);

  // for initial
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${buId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
    getCombineAllWithSupDDL(
      buId,
      0,
      0,
      0,
      0,
      0,
      0,
      setAllDDL
    );
  }, [orgId, buId, employeeId]);

  useEffect(() => {
    if (allDDL) {
      // department
      if (allDDL?.departmentList?.length > 0) {
        const modifyDepartmentDDL = allDDL?.departmentList?.map((item) => {
          return {
            ...item,
            value: item?.id,
            label: item?.name,
          };
        });
        setDepartmentDDL(modifyDepartmentDDL);
      }

      // Designation DDL
      if (allDDL?.designationList?.length > 0) {
        const modifyDesignationDDL = allDDL?.designationList?.map((item) => {
          return {
            ...item,
            value: item?.id,
            label: item?.name,
          };
        });
        setDesignationDDL(modifyDesignationDDL);
      }

      //supervisor ddl
      const modifySupervisorDDL = allDDL?.supervisorList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setSupervisorDDL(modifySupervisorDDL);

      //employee ddl
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
        {/* left */}
        <div className="col-md-6">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Workplace Group</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="workplace"
                options={workplaceGroupDDL}
                value={values?.workplace}
                onChange={(valueOption) => {
                  getCombineAllWithSupDDL(
                    buId,
                    valueOption?.value,
                    0,
                    0,
                    0,
                    0,
                    0,
                    setAllDDL
                  );
                  setFieldValue("department", "");
                  setFieldValue("designation", "");
                  setFieldValue("supervisor", "");
                  setFieldValue("employee", "");

                  setFieldValue("workplace", valueOption);
                  getFilterValues("workplace", valueOption);

                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
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
                options={designationDDL}
                value={values?.designation}
                onChange={(valueOption) => {
                  getCombineAllWithSupDDL(
                    buId,
                    values?.workplace?.value,
                    0,
                    values?.department?.value,
                    valueOption?.value,
                    0,
                    0,
                    setAllDDL
                  );
                  setFieldValue("supervisor", "");
                  setFieldValue("employee", "");

                  setFieldValue("designation", valueOption);
                  getFilterValues("designation", valueOption);

                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={!values?.department}
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
                options={employeeDDL}
                value={values?.employee}
                onChange={(valueOption) => {
                  getCombineAllWithSupDDL(
                    buId,
                    values?.workplace?.value,
                    0,
                    values?.department?.value,
                    values?.designation?.value,
                    values?.supervisor?.value,
                    valueOption?.value,
                    setAllDDL
                  );
                  setFieldValue("employee", valueOption);
                  getFilterValues("employee", valueOption);

                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={!values?.supervisor}
              />
            </div>
          </div>
        </div>
        {/* right */}
        <div className="col-md-6">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Department</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="department"
                options={departmentDDL}
                value={values?.department}
                onChange={(valueOption) => {
                  getCombineAllWithSupDDL(
                    buId,
                    values?.workplace?.value,
                    0,
                    valueOption?.value,
                    0,
                    0,
                    0,
                    setAllDDL
                  );
                  setFieldValue("designation", "");
                  setFieldValue("supervisor", "");
                  setFieldValue("employee", "");

                  setFieldValue("department", valueOption);
                  getFilterValues("department", valueOption);

                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={!values?.workplace}
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Supervisor</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="supervisor"
                options={supervisorDDL}
                value={values?.supervisor}
                onChange={(valueOption) => {
                  getCombineAllWithSupDDL(
                    buId,
                    values?.workplace?.value,
                    0,
                    values?.department?.value,
                    values?.designation?.value,
                    valueOption?.value,
                    0,
                    setAllDDL
                  );
                  setFieldValue("employee", "");

                  setFieldValue("supervisor", valueOption);
                  getFilterValues("supervisor", valueOption);

                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={!values?.designation}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelfIOUFilterModal;
