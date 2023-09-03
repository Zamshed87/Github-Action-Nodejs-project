import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { getPeopleDeskAllDDL } from "../../../../../common/api";

const initData = {
  search: "",
  year: "",
  department: "",
  designation: "",
  employee: "",
};

const FilterModal = ({ propsObj, children }) => {
  // eslint-disable-next-line no-unused-vars
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const saveHandler = (values) => { };

  const { id, open, anchorEl, handleClose, setIsFilter} = propsObj;
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [employeeDDL, setEmployeeDDL] = useState([]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      "EmpDepartment",
      orgId,
      buId,
      setDepartmentDDL,
      "DepartmentId",
      "DepartmentName"
    );
    getPeopleDeskAllDDL(
      "EmpDesignation",
      orgId,
      buId,
      setDesignationDDL,
      "DesignationId",
      "DesignationName"
    );
    getPeopleDeskAllDDL(
      "EmployeeBasicInfo",
      orgId,
      buId,
      setEmployeeDDL,
      "EmployeeId",
      "EmployeeName"
    );
  },[orgId, buId])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
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
                        setIsFilter(false);
                      }}
                      className="btn btn-cross"
                    >
                      <Clear sx={{ fontSize: '18px' }} />
                    </IconButton>
                  </div>
                  <hr />
                  {/* <MasterFilterTabs propsObj={propsObj} /> */}
                  <div className="master-filter-body application-filter">
                    <div className="row">
                      <div className="col-md-6 ">
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Year</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="year"
                              options={[
                                { value: 1, label: "2021" },
                                { value: 2, label: "2020" },
                                { value: 3, label: "2019" },
                              ]}
                              value={values?.year}
                              onChange={(valueOption) => {
                                setFieldValue("year", valueOption);
                              }}
                              placeholder=" "
                              styles={borderlessSelectStyle}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
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
                              options={designationDDL || []}
                              value={values?.designation}
                              onChange={(valueOption) => {
                                setFieldValue("designation", valueOption);
                              }}
                              placeholder=" "
                              styles={borderlessSelectStyle}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
                              menuPosition="fixed"
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
                                setFieldValue("department", valueOption);
                              }}
                              placeholder=" "
                              styles={borderlessSelectStyle}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
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
                              menuPosition="fixed"
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
                        className="btn btn-green btn-green-disabled"
                        onClick={() => {
                          handleClose();
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
