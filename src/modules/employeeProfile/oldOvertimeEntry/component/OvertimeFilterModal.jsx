import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDLNewAction } from "../../../../common/api";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";

const OvertimeFilterModal = ({ propsObj }) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { getFilterValues, setFieldValue, values, errors, touched } = propsObj;

  // eslint-disable-next-line no-unused-vars
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [allDDL, setAllDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
    /* getPeopleDeskAllDDL(
      "EmpDepartment",
      orgId,
      buId,
      setDepartmentDDL,
      "DepartmentId",
      "DepartmentName"
    ); */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  return (
    <>
      <div className="row">
        <div className="col-md-6 ">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Workplace Group</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="workplaceGroup"
                options={allDDL?.workplaceGroupList}
                value={values?.workplaceGroup}
                onChange={(valueOption) => {
                  getFilterDDLNewAction(
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
                  getFilterValues("department", "");
                  getFilterValues("designation", "");
                  getFilterValues("employee", "");
                  setFieldValue("workplaceGroup", valueOption);
                  getFilterValues("workplaceGroup", valueOption);
                }}
                placeholder=""
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isClearable={false}
                setClear={(name) => {
                  setFieldValue("department", "");
                  setFieldValue("designation", "");
                  setFieldValue("employee", "");
                  getFilterValues("department", "");
                  getFilterValues("designation", "");
                  getFilterValues("employee", "");
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
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
                options={allDDL?.designationList}
                value={values?.designation}
                onChange={(valueOption) => {
                  setFieldValue("employee", "");
                  setFieldValue("designation", valueOption);
                  getFilterValues("designation", valueOption);
                  getFilterValues("employee", "");
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
                isClearable={false}
                setClear={(name) => {
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
                menuPosition="fixed"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3> Date</h3>
            </div>
            <div className="col-md-7 ml-0">
              <DatePickerBorderLess
                label=""
                value={values?.date}
                name="date"
                onChange={(e) => {
                  setFieldValue("date", e.target.value);
                  getFilterValues("date", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 ">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Department</h3>
            </div>
            <div className="col-md-7 ml-0">
              <BorderlessSelect
                classes="input-sm"
                name="department"
                options={allDDL?.departmentList}
                value={values?.department}
                onChange={(valueOption) => {
                  setFieldValue("designation", "");
                  setFieldValue("employee", "");
                  setFieldValue("department", valueOption);
                  getFilterValues("designation", "");
                  getFilterValues("employee", "");
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
                isClearable={false}
                setClear={(name) => {
                  setFieldValue("designation", "");
                  getFilterValues("designation", "");
                  setFieldValue("employee", "");
                  getFilterValues("employee", "");
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
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
                isClearable={false}
                setClear={(name) => {
                  setFieldValue(name, "");
                  getFilterValues(name, "");
                }}
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
                name="applicationStatus"
                options={[
                  { value: 1, label: "Pending" },
                  { value: 2, label: "Approved" },
                  { value: 3, label: "Rejected" },
                ]}
                menuPosition="fixed"
                value={values?.applicationStatus}
                onChange={(valueOption) => {
                  setFieldValue("applicationStatus", valueOption);
                  getFilterValues("applicationStatus", valueOption);
                }}
                placeholder=" "
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                isClearable={false}
                setClear={(name) => {
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

export default OvertimeFilterModal;
