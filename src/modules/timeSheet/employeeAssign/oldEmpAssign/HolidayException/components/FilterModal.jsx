import React, { useEffect, useState } from "react";
import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDL } from "../../../../../common/api";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { getAssignLanding } from "../helper";
import { gray900, greenColor } from "../../../../../utility/customColor";

const initData = {
  search: "",
  workplaceGroup: "",
  department: "",
  designation: "",
  supervisor: "",
  employmentType: "",
  employee: "",
  isAssigned: false,
};

const FilterModal = ({ propsObj, children }) => {
  const { setHolidayExceptionDto, setIsReset } = propsObj;
  const { orgId ,buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const filterHandler = (values, resetForm, initData) => {
    const callback = () => {
      resetForm(initData);
      handleClose();
    };
    getAssignLanding(
      {
        departmentId: values?.department?.value || 0,
        designationId: values?.designation?.value || 0,
        supervisorId: values?.supervisor?.value || 0,
        employmentTypeId: values?.employmentType?.value || 0,
        employeeId: values?.employee?.value || 0,
        workplaceGroupId: values?.workplaceGroup?.value || 0,
        businessUnitId: buId,
        accountId: orgId,
        isNotAssign: values?.isAssigned,
      },
      setHolidayExceptionDto,
      setLoading,
      callback
    );
  };

  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [supervisorDDL, setSupervisorDDL] = useState(false);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState(false);
  const [allDDL, setAllDDL] = useState([]);
  const { id, open, anchorEl, handleClose } = propsObj;

  useEffect(() => {
    getFilterDDL(buId, "", "", "", "", "", setAllDDL);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

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

      
      const modifySupervisorDDL = allDDL?.supervisorList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setSupervisorDDL(modifySupervisorDDL);

      // EmploymentType DDL
      const modifyEpmployeeTypeDDL = allDDL?.employmentTypeList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setEmploymentTypeDDL(modifyEpmployeeTypeDDL);

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
      <Formik
        // enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <Popover
                sx={{
                  "& .MuiPaper-root": {
                    width: "750px",
                    minHeight: "auto",
                    borderRadius: "4px",
                  },
                }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="master-filter-modal-container">
                  <div className="master-filter-header py-1">
                    <h3>Advanced Filter</h3>
                    <IconButton
                      onClick={(e) => {
                        handleClose();
                        setIsReset(false);
                      }}
                      className="btn btn-cross"
                    >
                      <Clear sx={{ fontSize: '18px' }} />
                    </IconButton>
                  </div>
                  <hr />
                  {/* <MasterFilterTabs propsObj={propsObj} /> */}
                  <div className="master-filter-body">
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
                              options={workplaceGroupDDL || []}
                              value={values?.workplaceGroup}
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
                                setFieldValue("supervisor", "");
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("workplaceGroup", valueOption);
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
                                setFieldValue("supervisor", "");
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("designation", valueOption);
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
                            <h3>Employment Type</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="employmentType"
                              options={employmentTypeDDL || []}
                              value={values?.employmentType}
                              onChange={(valueOption) => {
                                getFilterDDL(
                                  buId,
                                  values?.workplaceGroup?.value || "",
                                  values?.department?.value || "",
                                  values?.designation?.value || "",
                                  values?.supervisor?.value || "",
                                  valueOption?.value || "",
                                  setAllDDL
                                );
                                setFieldValue("employee", "");
                                setFieldValue("employmentType", valueOption);
                              }}
                              placeholder=" "
                              styles={borderlessSelectStyle}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
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
                                setFieldValue("supervisor", "");
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("department", valueOption);
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
                            <h3>{supervisor || "Supervisor"}</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="supervisor"
                              options={supervisorDDL || []}
                              value={values?.supervisor}
                              onChange={(valueOption) => {
                                getFilterDDL(
                                  buId,
                                  values?.workplaceGroup?.value || "",
                                  values?.department?.value || "",
                                  values?.designation?.value || "",
                                  valueOption?.value || "",
                                  "",
                                  setAllDDL
                                );
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("supervisor", valueOption);
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
                              }}
                              placeholder=" "
                              styles={borderlessSelectStyle}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Commenting for Ryhan vai (Backend) */}
                      <div className="col-lg-12 mt-2">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor:greenColor
                          }}
                          name="isAssigned"
                          color={greenColor}
                          label="Not Assigned"
                          checked={values?.isAssigned}
                          onChange={(e) => {
                            setFieldValue("isAssigned", e.target.checked);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="master-filter-bottom">
                    <div></div>
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        
                        onClick={(e) => {
                          handleClose();
                          setIsReset(false);
                        }}
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          filterHandler(values, resetForm, initData);
                          setIsReset(true);
                        }}
                        className="btn btn-green"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </Popover>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default FilterModal;
