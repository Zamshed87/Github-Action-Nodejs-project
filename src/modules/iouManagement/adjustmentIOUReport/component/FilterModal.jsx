import React, { useState, useEffect } from "react";
import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { shallowEqual, useSelector } from "react-redux";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";
import { getFilterDDL } from "../../../../common/api";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import FormikInput from "../../../../common/FormikInput";

const FilterModal = ({ propsObj, masterFilterHandler }) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const {
    id,
    open,
    anchorEl,
    handleClose,
    setFieldValue,
    values,
    errors,
    touched,
    setIsFilter,
    initData,
    resetForm,
  } = propsObj;

  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState(false);
  const [allDDL, setAllDDL] = useState([]);

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

      // EmploymentType DDL
      const modifyEpmployeeTypeDDL = allDDL?.employmentTypeList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setEmploymentTypeDDL(modifyEpmployeeTypeDDL);
      const allOption = {
        id: 0,
        name: "All",
        value: 0,
        label: "All",
      };
      allDDL?.employeeList?.splice(0, 0, allOption);
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
  // console.log("employeeDDL",employeeDDL);
  return (
    <>
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
          <div className="master-filter-header">
            <h3>Advanced Filter</h3>
            <button
              onClick={(e) => {
                handleClose();
                resetForm(initData);
              }}
              className="btn btn-cross"
            >
              <Clear sx={{ fontSize: "18px" }} />
            </button>
          </div>
          <hr />
          {/* <MasterFilterTabs propsObj={propsObj} /> */}
          <div className="master-filter-body ">
            <div className="row">
              <div className="col-md-6 ">
                {/* workplace group */}
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
                        setFieldValue("employmentType", "");
                        setFieldValue("employee", "");
                        setFieldValue("workplace", valueOption);
                      }}
                      placeholder=" "
                      styles={borderlessSelectStyle}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>
                {/* employee type */}
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
                          "",
                          "",
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
                {/* attendance status */}
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Attendance Status</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <BorderlessSelect
                      classes="input-sm"
                      name="attendenceStatus"
                      options={[
                        {
                          value: 1,
                          label: "Present",
                          code: "present",
                        },
                        {
                          value: 2,
                          label: "Absent",
                          code: "absent",
                        },
                        { value: 3, label: "Late", code: "late" },
                      ]}
                      value={values?.attendenceStatus}
                      onChange={(valueOption) => {
                        setFieldValue("attendenceStatus", valueOption);
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
                    <h3>Att. Month Year</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <FormikInput
                      classes="input-borderless input-sm"
                      placeholder="Month"
                      value={
                        values?.monthYear ||
                        `${new Date().getFullYear()}-${
                          new Date().getMonth() + 1
                        }`
                      }
                      name="monthYear"
                      type="month"
                      onChange={(e) => {
                        setFieldValue(
                          "yearId",
                          +e.target.value.split("").slice(0, 4).join("")
                        );
                        setFieldValue(
                          "monthId",
                          +e.target.value.split("").slice(-2).join("")
                        );
                        setFieldValue("monthYear", e.target.value);
                        setFieldValue("attendenceDate", "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                {/* department */}
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
                {/* employee */}
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
                      placeholder=""
                      styles={borderlessSelectStyle}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>
                {/* attendance date */}
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Attencedance Date</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <FormikInput
                      classes="input-borderless input-sm"
                      value={values?.attendenceDate}
                      name="attendenceDate"
                      type="date"
                      errors={errors}
                      touched={touched}
                      onChange={(e) => {
                        setFieldValue("attendenceDate", e.target.value);
                        setFieldValue("monthYear", "");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="master-filter-bottom">
            <div></div>
            <div className="master-filter-btn-group">
              <button
                type="button"
                className="btn btn-green btn-green-less"
                onClick={(e) => {
                  resetForm(initData);
                  handleClose();
                }}
                style={{
                  marginRight: "10px",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-green"
                onClick={() => {
                  handleClose();
                  masterFilterHandler(values, initData);
                  setIsFilter(true);
                  // resetForm(initData);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default FilterModal;
