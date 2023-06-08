/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Clear } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  getFilterDDLNewAction,
  getPeopleDeskAllDDL,
} from "../../../../../common/api";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import { allEmployeeList } from "../helper";

const FilterModal = ({ objProps }) => {
  const {
    resetForm,
    values,
    errors,
    touched,
    setFieldValue,
    setIsFilter,
    setAnchorEl,
    rowDto,
    setRowDto,
    setLoading,
    setAllData,
    allData,
    initData,
  } = objProps;
  const { orgId, buId, workPlaceGroupId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [supervisorDDL, setSupervisorDDL] = useState("");
  const [calendarDDL, setCalendarDDL] = useState([]);
  const [religionDDL, setReligionDDL] = useState([]);
  const [payrollGroupDDL, setPayrollGroupDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [rosterGroupDDL, setRosterGroupDDL] = useState([]);
  const [genderDDL, setGenderDDL] = useState([]);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&BusinessUnitId=${buId}&WorkplaceGroupId=0`,
      "WorkplaceGroupId",
      "WorkplaceGroupName",
      setWorkplaceGroupDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "DepartmentId",
      "DepartmentName",
      setDepartmentDDL
    );
    getFilterDDLNewAction(buId, "", "", "", "", "", setSupervisorDDL);
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Calender&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "CalenderId",
      "CalenderName",
      setCalendarDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Religion&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "ReligionId",
      "ReligionName",
      setReligionDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "PayrollGroupId",
      "PayrollGroupName",
      setPayrollGroupDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDesignation&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "DesignationId",
      "DesignationName",
      setDesignationDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RosterGroup&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "RosterGroupId",
      "RosterGroupName",
      setRosterGroupDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Gender&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "GenderId",
      "GenderName",
      setGenderDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`,
      "Id",
      "EmploymentType",
      setEmploymentTypeDDL
    );
  }, [orgId, buId, wgId]);

  return (
    <>
      <div className="master-filter-modal-container employeeProfile-src-filter-main">
        <div className="master-filter-header employeeProfile-src-filter-header">
          <h3>Advanced Filter</h3>
          <button
            onClick={() => {
              setIsFilter(false);
              setAnchorEl(null);
              // resetForm(initData);
            }}
            className="btn btn-cross"
          >
            <Clear sx={{ fontSize: "18px" }} />
          </button>
        </div>
        <hr />
        <div className="body-employeeProfile-master-filter">
          <div className="row">
            <div className="col-md-6">
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Workplace Group</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="workplaceGroup"
                    options={workplaceGroupDDL || []}
                    value={values?.workplaceGroup}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Department</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="department"
                    options={departmentDDL || []}
                    value={values?.department}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("department", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">{supervisor || "Supervisor"}</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="supervisor"
                    options={supervisorDDL?.supervisorList || []}
                    value={values?.supervisor}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("supervisor", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Calendar</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="calendar"
                    options={calendarDDL || []}
                    value={values?.calendar}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("calendar", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Religion</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="religion"
                    options={religionDDL || []}
                    value={values?.religion}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("religion", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Joining Date</label>
                </div>
                <div className="col-md-7 input-field">
                  <DatePickerBorderLess
                    label=""
                    value={values?.joiningDate}
                    name="joiningDate"
                    onChange={(e) => {
                      setFieldValue("joiningDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">NID Card</label>
                </div>
                <div className="col-md-7 input-field">
                  <div>
                    <BorderlessSelect
                      classes="input-sm"
                      name="isNID"
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Given" },
                        { value: 2, label: "Not Given" },
                      ]}
                      value={values?.isNID}
                      menuPosition="fixed"
                      onChange={(valueOption) => {
                        setFieldValue("isNID", valueOption);
                      }}
                      placeholder=""
                      styles={borderlessSelectStyle}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Payroll Group</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="payrollGroup"
                    options={payrollGroupDDL || []}
                    value={values?.payrollGroup}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("payrollGroup", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Designation</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="designation"
                    options={designationDDL || []}
                    value={values?.designation}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("designation", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Roster Group</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="rosterGroup"
                    options={rosterGroupDDL || []}
                    value={values?.rosterGroup}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("rosterGroup", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Gender</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="gender"
                    options={genderDDL || []}
                    value={values?.gender}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("gender", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Employement Type</label>
                </div>
                <div className="col-md-7 input-field">
                  <BorderlessSelect
                    classes="input-sm"
                    name="employmentType"
                    options={employmentTypeDDL || []}
                    value={values?.employmentType}
                    menuPosition="fixed"
                    onChange={(valueOption) => {
                      setFieldValue("employmentType", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Confirmation Date</label>
                </div>
                <div className="col-md-7 input-field">
                  <DatePickerBorderLess
                    label=""
                    value={values?.confirmDate}
                    name="confirmDate"
                    onChange={(e) => {
                      setFieldValue("confirmDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row row-input-fileds">
                <div className="col-md-5">
                  <label htmlFor="">Birth Certificate</label>
                </div>
                <div className="col-md-7 input-field">
                  <div>
                    <BorderlessSelect
                      classes="input-sm"
                      name="birthCertificate"
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Given" },
                        { value: 2, label: "Not Given" },
                      ]}
                      value={values?.birthCertificate}
                      menuPosition="fixed"
                      onChange={(valueOption) => {
                        setFieldValue("birthCertificate", valueOption);
                      }}
                      placeholder=""
                      styles={borderlessSelectStyle}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="master-filter-bottom footer-employeeProfile-src-filter">
          <div className="master-filter-btn-group">
            <button
              type="button"
              className="btn btn-cancle"
              onClick={(e) => {
                setIsFilter(false);
                setAnchorEl(null);
                // resetForm(initData);
              }}
              style={{
                marginRight: "10px",
              }}
            >
              cancel
            </button>
            <button
              type="button"
              className="btn btn-green"
              onClick={() => {
                allEmployeeList(
                  { orgId, buId },
                  values,
                  setLoading,
                  setRowDto,
                  setAllData,
                  () => {
                    resetForm(initData);
                    setAnchorEl(null);
                  }
                );
                setIsFilter(true);
                // resetForm(initData);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
