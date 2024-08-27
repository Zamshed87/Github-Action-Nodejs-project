import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDLNewAction } from "../../../../common/api";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";

const FilterModal = ({ propsObj }) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { getFilterValues, setFieldValue, values, errors, touched } = propsObj;

  const [allDDL, setAllDDL] = useState([]);
  useEffect(() => {
    getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  return (
    <>
      <div className="row">
        <div className="col-md-6 mt-3">
          <div className="row align-items-center ">
            <div className="col-md-3">
              <h3>Employee</h3>
            </div>
            <div className="col-md-9 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="employee"
                options={allDDL?.employeeList}
                value={values?.employee}
                onChange={(valueOption) => {
                  setFieldValue("employee", valueOption);
                  getFilterValues("employee", valueOption);
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                isClearable={false}
                setClear={(name) => {
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-3">
              <h3>Designation</h3>
            </div>
            <div className="col-md-9 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="designation"
                options={allDDL?.designationList}
                value={values?.designation}
                onChange={(valueOption) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue("designation", valueOption);
                  getFilterValues("designation", valueOption);
                  if (valueOption?.value && values?.department?.value) {
                    getFilterDDLNewAction(
                      buId,
                      "",
                      values?.department?.value,
                      valueOption?.value,
                      "",
                      "",
                      setAllDDL
                    );
                  }
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                isClearable={false}
                setClear={(name) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-3">
              <h3>Workplace</h3>
            </div>
            <div className="col-md-9 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="workplace"
                options={allDDL?.designationList}
                value={values?.workplace}
                onChange={(valueOption) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue("workplace", valueOption);
                  getFilterValues("workplace", valueOption);
                  if (valueOption?.value && values?.workplace?.value) {
                    getFilterDDLNewAction(
                      buId,
                      "",
                      values?.workplace?.value,
                      valueOption?.value,
                      "",
                      "",
                      setAllDDL
                    );
                  }
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                isClearable={false}
                setClear={(name) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 mt-3">
          <div className="row align-items-center">
            <div className="col-md-3">
              <h3>Department</h3>
            </div>
            <div className="col-md-9 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="department"
                options={allDDL?.departmentList}
                value={values?.department}
                onChange={(valueOption) => {
                  setFieldValue("designation", "");
                  getFilterValues("designation", "");
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue("department", valueOption);
                  getFilterValues("department", valueOption);
                  if (valueOption?.value) {
                    getFilterDDLNewAction(
                      buId,
                      "",
                      valueOption?.value,
                      "",
                      "",
                      "",
                      setAllDDL
                    );
                  }
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                isClearable={false}
                setClear={(name) => {
                  setFieldValue("designation", "");
                  getFilterValues("designation", "");
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-3">
              <h3>Business Unit</h3>
            </div>
            <div className="col-md-9 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="businessUnit"
                options={allDDL?.designationList}
                value={values?.businessUnit}
                onChange={(valueOption) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue("businessUnit", valueOption);
                  getFilterValues("businessUnit", valueOption);
                  if (valueOption?.value && values?.businessUnit?.value) {
                    getFilterDDLNewAction(
                      buId,
                      "",
                      values?.businessUnit?.value,
                      valueOption?.value,
                      "",
                      "",
                      setAllDDL
                    );
                  }
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                isClearable={false}
                setClear={(name) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
              />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-3">
              <h3>Workplace Group</h3>
            </div>
            <div className="col-md-9 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="workplaceGroup"
                options={allDDL?.designationList}
                value={values?.workplaceGroup}
                onChange={(valueOption) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue("workplaceGroup", valueOption);
                  getFilterValues("workplaceGroup", valueOption);
                  if (valueOption?.value && values?.workplaceGroup?.value) {
                    getFilterDDLNewAction(
                      buId,
                      "",
                      values?.workplaceGroup?.value,
                      valueOption?.value,
                      "",
                      "",
                      setAllDDL
                    );
                  }
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isDisabled={false}
                isClearable={false}
                setClear={(name) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
