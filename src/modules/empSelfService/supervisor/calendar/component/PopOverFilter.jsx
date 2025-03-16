import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDL } from "../../../../../common/api";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";

const PopOverFilter = ({ propsObj, masterFilterHandler }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setFieldValue,
    values,
    errors,
    touched,
    // getData,
    setIsFilter,
    resetForm,
    initData,
  } = propsObj;

  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [supervisorDDL, setSupervisorDDL] = useState(false);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [allDDL, setAllDDL] = useState([]);

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
              resetForm(initData);
            }}
            className="btn btn-cross"
          >
            <Clear sx={{ fontSize: "18px" }} />
          </IconButton>
        </div>

        <hr />
        <div className="master-filter-body">
          <div className=" row">
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
                      setFieldValue("supervisor", "");
                      setFieldValue("employmentType", "");
                      setFieldValue("employee", "");
                      setFieldValue("workplace", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
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
                        values?.workplace?.value || "",
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
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" row">
            <div className="col-md-6">
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
                        values?.workplace?.value || "",
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
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
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
                        values?.workplace?.value || "",
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
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" row">
            <div className="col-md-6">
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
                        values?.workplace?.value || "",
                        values?.department?.value || "",
                        values?.designation?.value || "",
                        values?.supervisor?.value || "",
                        valueOption?.value || "",
                        setAllDDL
                      );
                      setFieldValue("employee", "");
                      setFieldValue("employmentType", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
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
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="row align-items-center">
                <div className="col-md-5">
                  <h3>Assign Status</h3>
                </div>
                <div className="col-md-7 ml-0">
                  <BorderlessSelect
                    classes="input-sm"
                    name="assignStatus"
                    options={[
                      { value: "all", label: "All" },
                      { value: "yes", label: "Assigned" },
                      { value: "no", label: "Not Assigned" },
                    ]}
                    value={values?.assignStatus}
                    onChange={(valueOption) => {
                      setFieldValue("assignStatus", valueOption);
                    }}
                    placeholder=""
                    styles={borderlessSelectStyle}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
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
              className="btn btn-cancel"
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
              className="btn btn-green btn-green-disable"
              onClick={() => {
                handleClose();
                masterFilterHandler(values);
                setIsFilter(true);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default PopOverFilter;
