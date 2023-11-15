import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getPeopleDeskAllDDL,
  getSearchEmployeeList,
  getSearchEmployeeListForEmp,
} from "../../../../common/api";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import FormikToggle from "../../../../common/FormikToggle";
import Loading from "../../../../common/loading/Loading";
import { updateUerAndEmpNameAction } from "../../../../commonRedux/auth/actions";
import {
  blackColor40,
  failColor,
  gray900,
  greenColor,
  success800,
} from "../../../../utility/customColor";
import useDebounce from "../../../../utility/customHooks/useDebounce";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import {
  createEditEmpAction,
  getPeopleDeskWithoutAllDDL,
  userExistValidation,
} from "../helper";
import {
  getCreateDDLs,
  getEditDDLs,
  initData,
  submitHandler,
  validationSchema,
} from "./helper";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import { PForm, PInput } from "Components/PForm";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  isEdit,
  singleData,
  pages,
}) {
  const dispatch = useDispatch();
  const debounce = useDebounce();

  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const { orgId, buId, employeeId, intUrlId, wgId, intAccountId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states
  const [religionDDL, setReligionDDL] = useState([]);
  const [genderDDL, setGenderDDL] = useState([]);
  const [empTypeDDL, setEmpTypeDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [empStatusDDL, setEmpStatusDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [hrPositionDDL, setHrPositionDDL] = useState([]);
  const [generateEmployeeCode, setGenerateEmployeeCode] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [userTypeDDL, setUserTypeDDL] = useState([]);
  const [isUserCheckMsg, setIsUserCheckMsg] = useState("");
  const [workplaceGroupName, setWorkplaceGroupName] = useState("");

  // const [wingDDL, setWingDDL] = useState([]);
  // const [soleDepoDDL, setSoleDepoDDL] = useState([]);
  // const [regionDDL, setRegionDDL] = useState([]);
  // const [areaDDL, setAreaDDL] = useState([]);
  // const [territoryDDL, setTerritoryDDL] = useState([]);

  // calender assigne
  const [calenderDDL, setCalenderDDL] = useState([]);
  const [calenderRoasterDDL, setCalenderRoasterDDL] = useState([]);
  const [startingCalenderDDL, setStartingCalenderDDL] = useState([]);

  const getDDL = (value) => {
    let ddlType = value === 1 ? "Calender" : "RosterGroup";
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=${ddlType}&BusinessUnitId=${buId}&WorkplaceGroupId=0`,
      value === 1 ? "CalenderId" : "RosterGroupId",
      value === 1 ? "CalenderName" : "RosterGroupName",
      value === 1 ? setCalenderDDL : setCalenderRoasterDDL
    );
  };

  const [empName, setEmpName] = useState("");
  const [empType, setEmpType] = useState("");

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=UserType&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}`,
      "intUserTypeId",
      "strUserType",
      setUserTypeDDL
    );
  }, [wgId, buId]);

  // for create
  useEffect(() => {
    getCreateDDLs({
      getPeopleDeskAllDDL,
      setReligionDDL,
      setGenderDDL,
      setEmpTypeDDL,
      setDepartmentDDL,
      getPeopleDeskWithoutAllDDL,
      employeeId,
      setWorkplaceGroupDDL,
      orgId,
      wgId,
      buId,
      setDesignationDDL,
      setEmpStatusDDL,
      setHrPositionDDL,
    });
  }, [orgId, buId, wgId, employeeId]);

  // for edit
  useEffect(() => {
    if (singleData?.empId) {
      getEditDDLs({
        singleData,
        getPeopleDeskWithoutAllDDL,
        orgId,
        buId,
        employeeId,
        setWorkplaceDDL,
        // setWingDDL,
        // setSoleDepoDDL,
        // setRegionDDL,
        // setAreaDDL,
        // setTerritoryDDL,
      });
    }
  }, [orgId, buId, singleData, employeeId]);

  useEffect(() => {
    if (workplaceGroupName?.value) {
      getPeopleDeskAllDDL(
        `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AutoEmployeeCode&BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupName?.value}&intId=0`,
        "EmployeeCode",
        "EmployeeCode",
        setGenerateEmployeeCode
      );
    }
  }, [workplaceGroupName?.value, buId]);

  const { values, setFieldValue, handleSubmit, resetForm, errors, touched } =
    useFormik({
      enableReinitialize: true,
      initialValues: isEdit
        ? {
            ...singleData,
            isCreate: false,
          }
        : {
            ...initData,
            fullName: empName || "",
            employeeType: empType || "",
            employeeCode: generateEmployeeCode[0]?.value || "",
            workplaceGroup: workplaceGroupName?.value ? workplaceGroupName : "",
            isCreate: true,
          },

      validationSchema: validationSchema(supervisor),
      onSubmit: () =>
        submitHandler({
          values,
          getData,
          resetForm,
          pages,
          setIsAddEditForm,
          employeeId,
          dispatch,
          updateUerAndEmpNameAction,
          isUserCheckMsg,
          createEditEmpAction,
          isEdit,
          orgId,
          buId,
          intUrlId,
          setLoading,
        }),
    });

  return (
    <form onSubmit={handleSubmit} className="add-new-employee-form">
      {loading && <Loading />}
      <div className="row content-input-field">
        <div className="col-12">
          <h6 className="title-item-name">Employee Information</h6>
        </div>
        {/* Checking New Fileds */}

        <div className="col-6">
          <div className="input-field-main">
            {/* <DefaultInput
              classes="input-sm"
              value={values?.fullName}
              onChange={(val) => {
                setFieldValue("fullName", val.target.value);
                setEmpName(val.target.value);
              }}
              name="fullName"
              type="text"
              className="form-control"
              errors={errors}
              touched={touched}
            /> */}
            <PForm>
              <PInput name="date" type="date" label="Pick A Date" />
              <PInput name="number" label="Number"/>
              <PInput
                name="search"
                type="search"
                label="search"
                placeholder="search"
              />
              <PInput
                name="checkbox"
                type="checkbox"
                label="checkbox"
                checked={true}
              />
            </PForm>
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Name</label>
            <DefaultInput
              classes="input-sm"
              value={values?.fullName}
              onChange={(val) => {
                setFieldValue("fullName", val.target.value);
                setEmpName(val.target.value);
              }}
              name="fullName"
              type="text"
              className="form-control"
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="input-field-main">
            <label>Name</label>
            <DefaultInput
              classes="input-sm"
              value={values?.fullName}
              onChange={(val) => {
                setFieldValue("fullName", val.target.value);
                setEmpName(val.target.value);
              }}
              name="fullName"
              type="text"
              className="form-control"
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="input-field-main">
            <label>Name</label>
            <DefaultInput
              classes="input-sm"
              value={values?.fullName}
              onChange={(val) => {
                setFieldValue("fullName", val.target.value);
                setEmpName(val.target.value);
              }}
              name="fullName"
              type="text"
              className="form-control"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Employment Type</label>
            <FormikSelect
              menuPosition="fixed"
              name="employeeType"
              options={empTypeDDL || []}
              value={values?.employeeType}
              onChange={(valueOption) => {
                setFieldValue("employeeType", valueOption);
                setEmpType(valueOption);
              }}
              styles={customStyles}
              errors={errors}
              placeholder=""
              touched={touched}
              isClearable={false}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Workplace Group</label>
            <FormikSelect
              menuPosition="fixed"
              name="workplaceGroup"
              options={workplaceGroupDDL || []}
              value={values?.workplaceGroup}
              onChange={(valueOption) => {
                setFieldValue("workplace", "");
                setWorkplaceGroupName(valueOption);
                setFieldValue("workplaceGroup", valueOption);

                getPeopleDeskWithoutAllDDL(
                  `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption?.value}&intId=${employeeId}`,
                  "intWorkplaceId",
                  "strWorkplace",
                  setWorkplaceDDL
                );
                // getPeopleDeskWithoutAllDDL(
                //   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption?.value}&ParentTerritoryId=0`,
                //   "WingId",
                //   "WingName",
                //   setWingDDL
                // );
                // if (!valueOption?.value) {
                //   setFieldValue("soleDepo", "");
                //   setFieldValue("region", "");
                //   setFieldValue("area", "");
                //   setFieldValue("territory", "");
                //   setFieldValue("wing", "");
                // }
              }}
              styles={customStyles}
              placeholder=" "
              errors={errors}
              touched={touched}
              isClearable={false}
              isDisabled={isEdit && true}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Workplace</label>
            <FormikSelect
              menuPosition="fixed"
              name="workplace"
              options={workplaceDDL || []}
              value={values?.workplace}
              onChange={(valueOption) => {
                setFieldValue("workplace", valueOption);
              }}
              styles={customStyles}
              placeholder=""
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Employee Id</label>
            <DefaultInput
              classes="input-sm"
              value={values?.employeeCode}
              onChange={(val) => {
                setFieldValue("employeeCode", val.target.value);
              }}
              name="employeeCode"
              type="text"
              className="form-control"
              errors={errors}
              touched={touched}
              // disabled={generateEmployeeCode[0]?.value !== ""}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Religion</label>
            <FormikSelect
              menuPosition="fixed"
              name="religion"
              options={religionDDL || []}
              value={values?.religion}
              onChange={(valueOption) => {
                setFieldValue("religion", valueOption);
              }}
              styles={customStyles}
              placeholder=""
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Gender</label>
            <FormikSelect
              menuPosition="fixed"
              name="gender"
              options={genderDDL || []}
              value={values?.gender}
              onChange={(valueOption) => {
                setFieldValue("gender", valueOption);
              }}
              styles={customStyles}
              placeholder=""
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Date of Birth</label>
            <DefaultInput
              classes="input-sm"
              value={values?.dateofBirth}
              max={todayDate()}
              onChange={(val) => {
                setFieldValue("dateofBirth", val.target.value);
              }}
              name="dateofBirth"
              type="date"
              className="form-control"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Joining Date</label>
            <DefaultInput
              classes="input-sm"
              value={values?.joiningDate}
              onChange={(val) => {
                setFieldValue("generateDate", val.target.value);
                setFieldValue("joiningDate", val.target.value);
              }}
              name="joiningDate"
              type="date"
              className="form-control"
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        {/* ----------------------------- */}
        {values?.employeeType.label === "Probationary" && (
          <>
            <div className="col-6">
              <div className="input-field-main">
                <label>Probation Start Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.joiningDate}
                  onChange={(val) => {
                    setFieldValue("generateDate", val.target.value);
                    setFieldValue("joiningDate", val.target.value);
                  }}
                  name="joiningDate"
                  type="date"
                  disabled={true}
                  className="form-control"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </>
        )}
        {values?.employeeType.label === "Probationary" && (
          <>
            <div className="col-6">
              <div className="input-field-main">
                <label>Probation Close Date</label>

                <DefaultInput
                  classes="input-sm"
                  value={values?.dteProbationaryCloseDate}
                  onChange={(val) => {
                    setFieldValue("dteProbationaryCloseDate", val.target.value);
                  }}
                  name="dteProbationaryCloseDate"
                  type="date"
                  className="form-control"
                  errors={errors}
                  disabled={!values?.joiningDate}
                  touched={touched}
                  min={values?.joiningDate}
                />

                {/* <FormikInput
                  classes="input-sm"
                  value={values?.dteProbationaryCloseDate}
                  onChange={(val) => {
                    setFieldValue("dteProbationaryCloseDate", val.target.value);
                  }}
                  name="dteProbationaryCloseDate"
                  type="date"
                  className="form-control"
                  errors={errors}
                  touched={touched}
                  disabled={!values?.joiningDate}
                  min={values?.joiningDate}
                /> */}
              </div>
            </div>
          </>
        )}
        {values?.employeeType.label === "Intern" && (
          <>
            <div className="col-6">
              <div className="input-field-main">
                <label>Intern Start</label>

                <DefaultInput
                  classes="input-sm"
                  value={values?.joiningDate}
                  onChange={(val) => {
                    setFieldValue("generateDate", val.target.value);
                    setFieldValue("joiningDate", val.target.value);
                  }}
                  name="joiningDate"
                  type="date"
                  disabled={true}
                  className="form-control"
                  errors={errors}
                  touched={touched}
                />

                {/* <FormikInput
                  classes="input-sm"
                  value={values?.joiningDate}
                  // onChange={(val) => {
                  //   setFieldValue("generateDate", val.target.value);
                  //   setFieldValue("joiningDate", val.target.value);
                  // }}
                  name="joiningDate"
                  type="date"
                  className="form-control"
                  disabled={true}
                  errors={errors}
                  touched={touched}
                /> */}
              </div>
            </div>
          </>
        )}

        {values?.employeeType.label === "Intern" && (
          <>
            <div className="col-6">
              <div className="input-field-main">
                <label>Intern Close</label>

                <DefaultInput
                  classes="input-sm"
                  value={values?.dteProbationaryCloseDate}
                  onChange={(val) => {
                    setFieldValue("dteInternCloseDate", val.target.value);
                  }}
                  name="dteInternCloseDate"
                  type="date"
                  className="form-control"
                  errors={errors}
                  disabled={!values?.joiningDate}
                  touched={touched}
                  min={values?.joiningDate}
                />

                {/* <FormikInput
                  classes="input-sm"
                  value={values?.dteInternCloseDate}
                  onChange={(val) => {
                    setFieldValue("dteInternCloseDate", val.target.value);
                  }}
                  name="dteInternCloseDate"
                  type="date"
                  className="form-control"
                  errors={errors}
                  touched={touched}
                  disabled={!values?.joiningDate}
                  min={values?.joiningDate}
                /> */}
              </div>
            </div>
          </>
        )}
        {/* -------------------- */}

        {/* {values?.employeeType?.ParentId === 1 && (
          <>
            <div className="col-6">
              <div className="input-field-main">
                <label>Probation Closing</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.dteProbationaryCloseDate}
                  onChange={(val) => {
                    setFieldValue("dteProbationaryCloseDate", val.target.value);
                  }}
                  name="dteProbationaryCloseDate"
                  type="date"
                  className="form-control"
                  errors={errors}
                  touched={touched}
                  disabled={!values?.joiningDate}
                  min={values?.joiningDate}
                />
              </div>
            </div>
          </>
        )}
        {(values?.employeeType?.isManual === 1 ||
          values?.employeeType?.isManual === true) &&
          values?.employeeType?.ParentId === 3 && (
            <>
              <div className="col-6">
                <div className="input-field-main">
                  <label>Intern Duration</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.dteInternCloseDate}
                    onChange={(val) => {
                      setFieldValue("dteInternCloseDate", val.target.value);
                    }}
                    name="dteInternCloseDate"
                    type="month"
                    className="form-control"
                    errors={errors}
                    touched={touched}
                    disabled={!values?.joiningDate}
                    min={values?.joiningDate}
                  />
                </div>
              </div>
            </>
          )} */}
        {values?.employeeType.label ===
          ("Contractual" || "contractual" || "contract" || "Contract") && (
          <>
            <div className="col-6">
              <div className="input-field-main">
                <label>Contract From Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.contractualFromDate}
                  onChange={(val) => {
                    setFieldValue("contractualFromDate", val.target.value);
                  }}
                  name="contractualFromDate"
                  type="date"
                  className="form-control"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-field-main">
                <label>Contract To Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.contractualToDate}
                  onChange={(val) => {
                    setFieldValue("contractualToDate", val.target.value);
                  }}
                  name="contractualToDate"
                  type="date"
                  className="form-control"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </>
        )}
        {values?.employeeType.label === ("Permanent" || "permanent") && (
          <>
            <div className="col-6">
              <div className="input-field-main">
                <label>Confirmation Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.dteConfirmationDate}
                  onChange={(val) => {
                    setFieldValue("dteConfirmationDate", val.target.value);
                  }}
                  name="dteConfirmationDate"
                  type="date"
                  className="form-control"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </>
        )}
        <div className="col-6">
          <div className="input-field-main">
            <label>Department</label>
            <FormikSelect
              menuPosition="fixed"
              name="department"
              options={departmentDDL || []}
              value={values?.department}
              onChange={(valueOption) => {
                setFieldValue("department", valueOption);
              }}
              styles={customStyles}
              placeholder=""
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Designation</label>
            <FormikSelect
              menuPosition="fixed"
              name="designation"
              options={designationDDL || []}
              value={values?.designation}
              onChange={(valueOption) => {
                setFieldValue("designation", valueOption);
              }}
              styles={customStyles}
              placeholder=""
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        <div className="col-6 d-none">
          <div className="input-field-main">
            <label>HR Position</label>
            <FormikSelect
              menuPosition="fixed"
              name="hrPosition"
              options={hrPositionDDL || []}
              value={values?.hrPosition}
              onChange={(valueOption) => {
                setFieldValue("hrPosition", valueOption);
              }}
              styles={customStyles}
              placeholder=""
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
        {isEdit && (
          <div className="col-6">
            <div className="input-field-main">
              <label>Employee Status</label>
              <FormikSelect
                name="employeeStatus"
                menuPosition="fixed"
                options={empStatusDDL || []}
                value={values?.employeeStatus}
                onChange={(valueOption) => {
                  setFieldValue("employeeStatus", valueOption);
                }}
                styles={customStyles}
                placeholder=""
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        )}
        <div className="col-6">
          <div className="input-field-main">
            <label>Supervisor</label>
            <AsyncFormikSelect
              selectedValue={values?.supervisor}
              isSearchIcon={true}
              handleChange={(valueOption) => {
                setFieldValue("dottedSupervisor", valueOption);
                setFieldValue("supervisor", valueOption);
              }}
              placeholder="Search (min 3 letter)"
              loadOptions={(v) => getSearchEmployeeListForEmp(buId, wgId,intAccountId, employeeId, v)}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>Dotted Supervisor</label>
            <AsyncFormikSelect
              selectedValue={values?.dottedSupervisor}
              isSearchIcon={true}
              handleChange={(valueOption) => {
                setFieldValue("dottedSupervisor", valueOption);
              }}
              placeholder="Search (min 3 letter)"
              loadOptions={(v) => getSearchEmployeeListForEmp(buId, wgId,intAccountId, employeeId, v)}
            />
          </div>
        </div>
        <div className="col-6">
          <div className="input-field-main">
            <label>{orgId === 10015 ? "Team Leader" : "Line Manager"}</label>
            <AsyncFormikSelect
              selectedValue={values?.lineManager}
              isSearchIcon={true}
              handleChange={(valueOption) => {
                setFieldValue("lineManager", valueOption);
              }}
              placeholder="Search (min 3 letter)"
              loadOptions={(v) => getSearchEmployeeListForEmp(buId, wgId,intAccountId, employeeId, v)}
            />
          </div>
        </div>

        {/* marketing setup */}
        {/* {values?.workplaceGroup?.label === "Marketing" && (
          <>
            <div className="col-6">
              <div className="input-field-main">
                <label>Wing</label>
                <FormikSelect
                  menuPosition="fixed"
                  name="wing"
                  options={wingDDL || []}
                  value={values?.wing}
                  onChange={(valueOption) => {
                    getPeopleDeskWithoutAllDDL(
                      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&ParentTerritoryId=${valueOption?.value}`,
                      "SoleDepoId",
                      "SoleDepoName",
                      setSoleDepoDDL
                    );
                    setFieldValue("soleDepo", "");
                    setFieldValue("region", "");
                    setFieldValue("area", "");
                    setFieldValue("territory", "");
                    setFieldValue("wing", valueOption);
                  }}
                  styles={customStyles}
                  placeholder=""
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-field-main">
                <label>Sole Depo</label>
                <FormikSelect
                  menuPosition="fixed"
                  name="soleDepo"
                  options={soleDepoDDL || []}
                  value={values?.soleDepo}
                  onChange={(valueOption) => {
                    getPeopleDeskWithoutAllDDL(
                      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&ParentTerritoryId=${valueOption?.value}`,
                      "RegionId",
                      "RegionName",
                      setRegionDDL
                    );
                    setFieldValue("region", "");
                    setFieldValue("area", "");
                    setFieldValue("territory", "");
                    setFieldValue("soleDepo", valueOption);
                  }}
                  styles={customStyles}
                  placeholder=""
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-field-main">
                <label>Region</label>
                <FormikSelect
                  menuPosition="fixed"
                  name="region"
                  options={regionDDL || []}
                  value={values?.region}
                  onChange={(valueOption) => {
                    getPeopleDeskWithoutAllDDL(
                      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&ParentTerritoryId=${valueOption?.value}`,
                      "AreaId",
                      "AreaName",
                      setAreaDDL
                    );
                    setFieldValue("area", "");
                    setFieldValue("territory", "");
                    setFieldValue("region", valueOption);
                  }}
                  styles={customStyles}
                  placeholder=""
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-field-main">
                <label>Area</label>
                <FormikSelect
                  menuPosition="fixed"
                  name="area"
                  options={areaDDL || []}
                  value={values?.area}
                  onChange={(valueOption) => {
                    getPeopleDeskWithoutAllDDL(
                      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=TerritoryDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${values?.workplaceGroup?.value}&ParentTerritoryId=${valueOption?.value}`,
                      "TerritoryId",
                      "TerritoryName",
                      setTerritoryDDL
                    );
                    setFieldValue("territory", "");
                    setFieldValue("area", valueOption);
                  }}
                  styles={customStyles}
                  placeholder=""
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="input-field-main">
                <label>Territory</label>
                <FormikSelect
                  menuPosition="fixed"
                  name="territory"
                  options={territoryDDL || []}
                  value={values?.territory}
                  onChange={(valueOption) => {
                    setFieldValue("territory", valueOption);
                  }}
                  styles={customStyles}
                  placeholder=""
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
          </>
        )} */}

        {/* calender assigne */}
        {!isEdit && (
          <>
            <div className="col-6">
              <label>Generate Date</label>
              <DefaultInput
                classes="input-sm"
                type="date"
                value={values?.generateDate}
                name="generateDate"
                onChange={(e) => {
                  // setFieldValue("generateDate", values?.joiningDate);
                }}
                errors={errors}
                touched={touched}
                disabled
              />
            </div>
            <div className="col-6">
              <label>Calendar Type</label>
              <FormikSelect
                menuPosition="fixed"
                name="calenderType"
                options={[
                  {
                    value: 1,
                    label: "Calendar",
                  },
                  { value: 2, label: "Roster" },
                ]}
                value={values?.calenderType}
                onChange={(valueOption) => {
                  getDDL(valueOption?.value);
                  setFieldValue("calender", "");
                  setFieldValue("startingCalender", "");
                  setFieldValue("nextChangeDate", "");
                  setFieldValue("calenderType", valueOption);
                }}
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
                isDisabled={false}
              />
            </div>
            <div className="col-6">
              <label>
                {values?.calenderType?.value === 2
                  ? `Roster Name`
                  : `Calendar Name`}
              </label>
              <FormikSelect
                menuPosition="fixed"
                name="calender"
                options={
                  values?.calenderType?.value === 2
                    ? calenderRoasterDDL
                    : calenderDDL
                }
                value={values?.calender}
                onChange={(valueOption) => {
                  setFieldValue("calender", valueOption);
                  if (values?.calenderType?.value === 2) {
                    getPeopleDeskAllDDL(
                      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=CalenderByRosterGroup&intId=${valueOption?.value}&WorkplaceGroupId=${values?.workplaceGroup?.value}`,
                      "CalenderId",
                      "CalenderName",
                      setStartingCalenderDDL
                    );
                  }
                }}
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
                isDisabled={!values?.calenderType}
              />
            </div>
            {values?.calenderType?.value === 2 && (
              <>
                <div className="col-6">
                  <label>Starting Calendar</label>
                  <FormikSelect
                    menuPosition="fixed"
                    name="startingCalender"
                    options={startingCalenderDDL || []}
                    value={values?.startingCalender}
                    onChange={(valueOption) => {
                      setFieldValue("startingCalender", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-6">
                  <label>Next Calendar Change</label>
                  <DefaultInput
                    classes="input-sm"
                    type="date"
                    label=""
                    value={values?.nextChangeDate}
                    name="nextChangeDate"
                    onChange={(e) => {
                      setFieldValue("nextChangeDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* salary hold */}
        <div className="col-3">
          <label> </label>
          <div className="d-flex align-items-center small-checkbox">
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label="Salary Hold"
              checked={values?.isSalaryHold}
              onChange={(e) => {
                setFieldValue("isSalaryHold", e.target.checked);
              }}
              labelFontSize="12px"
            />
          </div>
        </div>

        {/* take-home pay */}
        <div className="col-3 d-none">
          <label> </label>
          <div className="d-flex align-items-center small-checkbox">
            <FormikCheckBox
              styleObj={{
                color: gray900,
                checkedColor: greenColor,
              }}
              label="Take-Home Pay"
              checked={values?.isTakeHomePay}
              onChange={(e) => {
                setFieldValue("isTakeHomePay", e.target.checked);
              }}
              labelFontSize="12px"
            />
          </div>
        </div>

        {/* user */}
        {!isEdit && (
          <div className="col-3">
            <label> </label>
            <div className="d-flex align-items-center small-checkbox">
              <FormikCheckBox
                styleObj={{
                  color: gray900,
                  checkedColor: greenColor,
                }}
                label="Create User"
                checked={values?.isUsersection}
                onChange={(e) => {
                  setFieldValue("isUsersection", e.target.checked);
                }}
                labelFontSize="12px"
              />
            </div>
          </div>
        )}

        {/* isCreate check */}
        {!isEdit && (
          <div className="col-3 d-none">
            <label> </label>
            <div className="d-flex align-items-center small-checkbox">
              <FormikCheckBox
                styleObj={{
                  color: gray900,
                  checkedColor: greenColor,
                }}
                label="is Create"
                checked={values?.isCreate}
                onChange={(e) => {
                  if (isEdit) {
                    setFieldValue("isCreate", false);
                  } else {
                    setFieldValue("isCreate", true);
                  }
                }}
                labelFontSize="12px"
              />
            </div>
          </div>
        )}

        {/* user create section */}
        <div className="col-12"></div>
        {values?.isUsersection && (
          <div className={isEdit ? `col-12 d-none` : `col-12`}>
            <div className="row">
              <div className="col-12">
                <h6 className="title-item-name">User Information</h6>
              </div>
              <div className="col-6">
                <label>Login User ID</label>
                <DefaultInput
                  isParentFormContainerClass={"employee-form-container"}
                  classes="input-sm"
                  value={values?.loginUserId}
                  name="loginUserId"
                  type="text"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => {
                    // remove empty space
                    if (e.target.value.includes(" ")) {
                      e.target.value = e.target.value.replace(/\s/g, "");

                      setFieldValue("loginUserId", e.target.value);
                    } else {
                      setFieldValue("loginUserId", e.target.value);
                    }

                    const payload = {
                      strLoginId: e.target.value,
                      intUrlId: intUrlId,
                      intAccountId: orgId,
                    };
                    debounce(() => {
                      userExistValidation(payload, setIsUserCheckMsg);
                    }, 500);
                  }}
                  // disabled={true}
                  errors={errors}
                  touched={touched}
                  style={{ margin: "0px!important" }}
                  disabled={values?.isCreateUser}
                />
                {values?.loginUserId && (
                  <div>
                    <span
                      style={{
                        fontSize: "10px",
                        color:
                          isUserCheckMsg?.statusCode !== 200
                            ? failColor
                            : success800,
                      }}
                    >
                      {isUserCheckMsg?.statusCode === 200
                        ? isUserCheckMsg?.message
                        : "User has not available" ||
                          isUserCheckMsg?.message ||
                          isUserCheckMsg?.Message}
                    </span>
                  </div>
                )}
              </div>
              <div className="col-6">
                <div className="input-field-password-main">
                  <label>Password</label>
                  <div className="input-password">
                    <DefaultInput
                      classes="input-sm"
                      value={values?.password}
                      name="password"
                      type={isShowPassword ? "text" : "password"}
                      className="form-control"
                      placeholder=""
                      onChange={(e) => {
                        if (e.target.value.includes(" ")) {
                          e.target.value = e.target.value.replace(/\s/g, "");
                          setFieldValue("password", e.target.value);
                        }
                        setFieldValue("password", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={values?.isCreateUser}
                    />
                    {values?.password && (
                      <button
                        type="button"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        className="btn-showPassword"
                      >
                        {isShowPassword ? (
                          <VisibilityOutlined sx={{ color: gray900 }} />
                        ) : (
                          <VisibilityOffOutlined sx={{ color: gray900 }} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <label>Office Email</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.email}
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => {
                    setFieldValue("email", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                  disabled={values?.isCreateUser}
                />
              </div>
              <div className="col-6">
                <label>Contact No.</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.phone}
                  name="phone"
                  type="text"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => {
                    setFieldValue("phone", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                  disabled={values?.isCreateUser}
                />
              </div>
              <div className="col-6">
                <label>User Type</label>
                <FormikSelect
                  name="userType"
                  menuPosition="fixed"
                  options={userTypeDDL || []}
                  value={values?.userType}
                  onChange={(valueOption) => {
                    setFieldValue("userType", valueOption);
                  }}
                  placeholder=" "
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                  isDisabled={values?.isCreateUser}
                />
              </div>

              {isEdit && (
                <>
                  <div className="col-6">
                    <div className="input-main position-group-select mt-2">
                      <h6 className="title-item-name">User Activation</h6>
                    </div>
                    <FormikToggle
                      name="isActive"
                      color={values?.isActive ? greenColor : blackColor40}
                      checked={values?.isActive}
                      onChange={(e) => {
                        setFieldValue("isActive", e.target.checked);
                      }}
                      disabled={values?.isCreateUser}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className=" emp-create buttons-form-main row">
        <button
          type="button"
          className="btn btn-cancel mr-3"
          onClick={() => setIsAddEditForm(false)}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-green">
          submit
        </button>
      </div>
    </form>
  );
}
