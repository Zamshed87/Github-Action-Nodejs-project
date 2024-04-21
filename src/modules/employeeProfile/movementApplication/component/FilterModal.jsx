/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  getFilterDDL,
  getPeopleDeskAllDDL,
  PeopleDeskSaasDDL,
} from "../../../../common/api";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";
import { gray900 } from "../../../../utility/customColor";

const initData = {
  search: "",
  workplaceGroup: "",
  department: "",
  designation: "",
  supervisor: "",
  employmentType: "",
  employee: "",
  movementType: "",
  applicationDate: "",
  status: "",
  fromDate: "",
  toDate: "",
};

const FilterModal = ({ propsObj }) => {
  const { buId, employeeId, orgId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [supervisorDDL, setSupervisorDDL] = useState(false);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState(false);
  const [allDDL, setAllDDL] = useState([]);
  const [movementTypeDDL, setMovementTypeDDL] = useState([]);
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setEmployee,
    setIsFilter,
    masterFilterHandler,
    isOfficeAdmin,
  } = propsObj;

  useEffect(() => {
    getFilterDDL(buId, "", "", "", "", "", setAllDDL);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  useEffect(() => {
    // MovementType DDL
    PeopleDeskSaasDDL(
      "MovementType",
      orgId,
      buId,
      setMovementTypeDDL,
      "MovementTypeId",
      "MovementType",
      employeeId
    );
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
      if (isOfficeAdmin) {
        setEmployeeDDL(modifyEmployeeDDL);
      }
    }
  }, [allDDL]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeName",
      setEmployeeDDL
    );
  }, [employeeId, wgId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
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
                      onClick={() => handleClose()}
                      className="btn btn-cross"
                    >
                      <Clear sx={{ fontSize: "18px", color: gray900 }} />
                    </IconButton>
                  </div>
                  <hr />
                  {/* <MasterFilterTabs propsObj={propsObj} /> */}
                  <div className="master-filter-body ">
                    <div className="row">
                      <div className="col-md-6">
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
                                setFieldValue("toDate", "");
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>

                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Status</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="status"
                              options={[
                                { value: 1, label: "Approved" },
                                { value: 2, label: "Pending" },
                                { value: 3, label: "Rejected" },
                              ]}
                              value={values?.status}
                              onChange={(valueOption) => {
                                setFieldValue("status", valueOption);
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
                              isDisabled={!isOfficeAdmin}
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
                                if (isOfficeAdmin) {
                                  setFieldValue("employee", valueOption);
                                } else {
                                  setFieldValue("employee", {
                                    ...valueOption,
                                    id: valueOption?.value,
                                    name: valueOption?.label,
                                  });
                                }
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
                            <h3>Application Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <DatePickerBorderLess
                              label=""
                              value={values?.applicationDate}
                              name="applicationDate"
                              onChange={(e) => {
                                setFieldValue(
                                  "applicationDate",
                                  e.target.value
                                );
                              }}
                              errors={errors}
                              touched={touched}
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
                              minDate={values?.fromDate}
                              isDisabled={values?.fromDate ? false : true}
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
                        onClick={() => {
                          handleClose();
                          setIsFilter(false);
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
                          setEmployee(values?.employee);
                          handleClose();
                          setIsFilter(true);
                          masterFilterHandler(values);
                          resetForm(initData);
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
