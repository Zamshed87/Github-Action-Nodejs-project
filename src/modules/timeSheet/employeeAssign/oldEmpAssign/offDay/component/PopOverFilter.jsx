import React, { useEffect, useState } from "react";
import { IconButton, Popover } from "@mui/material";
import { Form, Formik } from "formik";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import { Clear } from "@mui/icons-material";
import { blueColor, greenColor } from "../../../../../utility/customColor";
import { getFilterDDLNewAction } from "../../../../../common/api";
import { shallowEqual, useSelector } from "react-redux";
import FormikCheckBox from "../../../../../common/FormikCheckbox";

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

const PopOverFilter = ({ propsObj, masterFilterHandler }) => {
  const { id, open, anchorEl, handleClose, setIsFilter } = propsObj;
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const { orgId, buId } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  const saveHandler = (values) => {
    console.log(values);
  };
  const [allDDL, setAllDDL] = useState([]);
  useEffect(() => {
    getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
  }, [orgId, buId]);

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
                  <div className="master-filter-header py-1">
                    <h3>Advanced Filter</h3>
                    <IconButton onClick={(e) => {
                      handleClose();
                      setIsFilter(false);
                    }} className="btn btn-cross">
                      <Clear sx={{ fontSize: '18px' }} />
                    </IconButton>
                  </div>

                  <hr />
                  <div className="master-filter-body">
                    <div className=" row">
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>Workplace Group</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              classes="input-sm"
                              name="workplaceGroup"
                              options={allDDL?.workplaceGroupList}
                              value={values?.workplaceGroup}
                              onChange={(valueOption) => {
                                setFieldValue("department", "");
                                setFieldValue("designation", "");
                                setFieldValue("supervisor", "");
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("workplaceGroup", valueOption);
                                getFilterDDLNewAction(buId, valueOption?.value || "", "", "", "", "", setAllDDL);
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
                            <h3>Department</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              classes="input-sm"
                              name="department"
                              options={allDDL?.departmentList}
                              value={values?.department}
                              onChange={(valueOption) => {
                                setFieldValue("designation", "");
                                setFieldValue("supervisor", "");
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("department", valueOption);
                                getFilterDDLNewAction(buId, values?.workplaceGroup?.value || "", valueOption?.value || "", "", "", "", setAllDDL);
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
                            <h3>Designation</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              classes="input-sm"
                              name="designation"
                              options={allDDL?.designationList}
                              value={values?.designation}
                              onChange={(valueOption) => {
                                setFieldValue("supervisor", "");
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("designation", valueOption);
                                getFilterDDLNewAction(buId, values?.workplaceGroup?.value || "", values?.department?.value || "", valueOption?.value || "", "", "", setAllDDL);
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
                            <h3>{supervisor || "Supervisor"}</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              placeholder=""
                              styles={borderlessSelectStyle}
                              name="supervisor"
                              options={allDDL?.supervisorList}
                              value={values?.supervisor}
                              onChange={(valueOption) => {
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("supervisor", valueOption);
                                getFilterDDLNewAction(
                                  buId,
                                  values?.workplaceGroup?.value || "",
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
                    </div>
                    <div className=" row">
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>Employment Type</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              placeholder=""
                              styles={borderlessSelectStyle}
                              name="employmentType"
                              options={allDDL?.employmentTypeList}
                              value={values?.employmentType}
                              onChange={(valueOption) => {
                                setFieldValue("employee", "");
                                setFieldValue("employmentType", valueOption);
                                getFilterDDLNewAction(
                                  buId,
                                  values?.workplaceGroup?.value || "",
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
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>Employee </h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              placeholder=""
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
                    <div className="row">
                      <div className="col-md-4">
                        <FormikCheckBox
                          name="isAssigned"
                          label="	Not Assigned"
                          checked={values?.isAssigned}
                          color={blueColor}
                          styleObj={{
                            color: greenColor,
                          }}
                          onChange={(e) => {
                            setFieldValue("isAssigned", e.target.checked);
                          }}
                        />
                      </div>
                      <div className="col-md-8"></div>
                    </div>
                  </div>
                  <div className="master-filter-bottom">
                    <div></div>
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={(e) => {
                          setFieldValue("department", "");
                          setFieldValue("designation", "");
                          setFieldValue("supervisor", "");
                          setFieldValue("employmentType", "");
                          setFieldValue("employee", "");
                          setFieldValue("workplaceGroup", "");
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default PopOverFilter;
