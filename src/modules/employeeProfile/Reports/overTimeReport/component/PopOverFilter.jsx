/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDLNewAction } from "../../../../../common/api";
import DatePickerBorderLess from "../../../../../common/DatePickerBorderless";

const PopOverFilter = ({ propsObj }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setFieldValue,
    values,
    errors,
    touched,
    customStyleObj,
    masterFilterHandler,
  } = propsObj;

  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [allDDL, setAllDDL] = useState([]);

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
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
    <Popover
      sx={{
        "& .MuiPaper-root": {
          width: customStyleObj?.root?.minWidth || "750px",
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
          <button onClick={() => handleClose()} className="btn btn-cross">
            <Clear sx={{ fontSize: "18px" }} />
          </button>
        </div>
        <hr />
        <div className="master-filter-body">
          <div className="row">
            {/* <div className="col-md-6">
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
						</div> */}
            {/* <div className="col-md-6">
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
                        "",
                        valueOption?.value || "",
                        "",
                        "",
                        "",
                        setAllDDL
                      );
                      setFieldValue("designation", "");
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
            </div> */}
            {/* <div className="col-md-6">
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
                        "",
                        values?.department?.value || "",
                        valueOption?.value || "",
                        "",
                        "",
                        setAllDDL
                      );
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
            </div> */}
            {/* <div className="col-md-6">
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
            </div> */}
            <div className="col-md-6 pt-2">
              <div className="align-items-center row">
                <div className="col-md-4">
                  <h3>From Date</h3>
                </div>
                <div className="col-md-8">
                  <DatePickerBorderLess
                    label=""
                    value={values?.fromDate}
                    name="fromDate"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 pt-2">
              <div className="align-items-center row">
                <div className="col-md-4">
                  <h3>To Date</h3>
                </div>
                <div className="col-md-8">
                  <DatePickerBorderLess
                    label=""
                    value={values?.toDate}
                    name="toDate"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
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
              onClick={() => {
                setFieldValue("workplace", "");
                setFieldValue("department", "");
                setFieldValue("designation", "");
                setFieldValue("employee", "");
                setFieldValue("fromDate", "");
                setFieldValue("toDate", "");
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
                masterFilterHandler(values);
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
