import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDLNewAction } from "../../../../../common/api";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";

const initData = {
  department: "",
  designation: "",
  supervisor: "",
  employmentType: "",
  employee: "",
};

const FilterModal = ({ propsObj, masterFilterHandler, getData }) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const { id, open, anchorEl, setAnchorEl } = propsObj;

  const [allDDL, setAllDDL] = useState(null);
  useEffect(() => {
    getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
  }, [orgId, buId]);

  const saveHandler = (values) => {};

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
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="master-filter-modal-container">
                  <div className="master-filter-header">
                    <h3>Advanced Filter</h3>
                    <button
                      onClick={() => {
                        setAnchorEl(null);
                        getData();
                      }}
                      className="btn btn-cross"
                    >
                      <Clear sx={{ fontSize: "18px" }} />
                    </button>
                  </div>
                  <hr />
                  {/* <MasterFilterTabs propsObj={propsObj} /> */}
                  <div className="master-filter-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>Department</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              classes="input-sm"
                              name="department"
                              options={allDDL?.departmentList}
                              value={values?.department}
                              onChange={(valueOption) => {
                                setFieldValue("department", valueOption);
                                getFilterDDLNewAction(
                                  buId,
                                  "",
                                  valueOption?.value || "",
                                  "",
                                  "",
                                  "",
                                  setAllDDL
                                );
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
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>Designation</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              classes="input-sm"
                              name="designation"
                              options={allDDL?.designationList}
                              value={values?.designation}
                              onChange={(valueOption) => {
                                setFieldValue("designation", valueOption);
                                getFilterDDLNewAction(
                                  buId,
                                  "",
                                  values?.department?.value || "",
                                  valueOption?.value || "",
                                  "",
                                  "",
                                  setAllDDL
                                );
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
                    </div>
                    <div className=" row">
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>{supervisor || "Supervisor"}</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              styles={borderlessSelectStyle}
                              name="supervisor"
                              options={allDDL?.supervisorList}
                              value={values?.supervisor}
                              placeholder=" "
                              onChange={(valueOption) => {
                                setFieldValue("supervisor", valueOption);
                                getFilterDDLNewAction(
                                  buId,
                                  "",
                                  values?.department?.value || "",
                                  values?.designation?.value || "",
                                  valueOption?.value || "",
                                  "",
                                  setAllDDL
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
                              classes="input-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>Employee Type </h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              styles={borderlessSelectStyle}
                              name="employmentType"
                              options={allDDL?.employmentTypeList}
                              value={values?.employmentType}
                              placeholder=""
                              onChange={(valueOption) => {
                                setFieldValue("employmentType", valueOption);
                                getFilterDDLNewAction(
                                  buId,
                                  "",
                                  values?.department?.value || "",
                                  values?.designation?.value || "",
                                  values?.supervisor?.value || "",
                                  valueOption?.value || "",
                                  setAllDDL
                                );
                              }}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
                              classes="input-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" row">
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>Employee </h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              placeholder=" "
                              styles={borderlessSelectStyle}
                              name="employee"
                              options={allDDL?.employeeList}
                              value={values?.employee}
                              onChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
                              classes="input-sm"
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
                          setAnchorEl(null);
                          resetForm(initData);
                          getData();
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
                          setAnchorEl(null);
                          handleSubmit();
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
