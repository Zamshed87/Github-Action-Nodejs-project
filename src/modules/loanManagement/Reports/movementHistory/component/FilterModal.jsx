import React, { useState, useEffect } from "react";
import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import { getPeopleDeskAllDDL, getFilterDDL } from "../../../../../common/api";
import DatePickerBorderLess from "../../../../../common/DatePickerBorderless";

const initData = {
  search: "",
  workplace: "",
  department: "",
  designation: "",
  employee: "",
  movementType: "",
  dateRange: "",
  appStatus: "",
};

const FilterModal = ({ propsObj, masterFilterHandler, setAllValues }) => {
  const { id, open, anchorEl, handleClose, setIsFilter } = propsObj;
  const { orgId, buId, employeeId, fullname, designationId, designationName} = useSelector((state) => state?.auth?.profileData, shallowEqual);
  const saveHandler = (values) => {};

  const [movementTypeDDL, setMovementTypeDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(null);
  const [departmentDDL, setDepartmentDDL] = useState(null);
  const [designationDDL, setDesignationDDL] = useState(null);
  const [employeeDDL, setEmployeeDDL] = useState(null);
  const [allDDL, setAllDDL] = useState([]);
  useEffect(() => {
    // MovementType DDL
    getPeopleDeskAllDDL("MovementType", orgId, buId, setMovementTypeDDL, "MovementTypeId", "MovementType");
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
      <Formik
        enableReinitialize={true}
        initialValues={{
           ...initData,
           employee: {value: employeeId, label:fullname},
          designation: {value: designationId, label: designationName},
          }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
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
                  <div className="master-filter-header">
                    <h3>Advanced Filter</h3>
                    <button onClick={(e) => handleClose()} className="btn btn-cross">
                      <Clear />
                    </button>
                  </div>
                  <hr />
                  {/* <MasterFilterTabs propsObj={propsObj} /> */}
                  <div className="master-filter-body ">
                    <div className="row p-4">
                      <div className="col-md-6 ">
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
                                getFilterDDL(buId, valueOption?.value || "", "", "", "", "", setAllDDL);
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
                                getFilterDDL(buId, values?.workplaceGroup?.value || "", values?.department?.value || "", valueOption?.value || "", "", "", setAllDDL);
                                setFieldValue("designation", valueOption);
                              }}
                              placeholder=" "
                              styles={borderlessSelectStyle}
                              errors={errors}
                              touched={touched}
                              isDisabled={values?.designation?.value}
                            />
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Movement Type</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="movementType"
                              options={movementTypeDDL || []}
                              value={values?.movementType}
                              onChange={(valueOption) => {
                                setFieldValue("movementType", valueOption);
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
                            <h3>From Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
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
                                getFilterDDL(buId, values?.workplaceGroup?.value || "", valueOption?.value || "", "", "", "", setAllDDL);
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
                              isDisabled={values?.employee?.value}
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
                            <h3>To Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
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
                        onClick={(e) => handleClose()}
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-green"
                        onClick={(e) => {
                          masterFilterHandler(values);
                          handleClose();
                          setAllValues(values);
                          setIsFilter(true);
                        }}
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
