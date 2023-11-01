/* eslint-disable no-unused-vars */
import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDL, getPeopleDeskAllDDL } from "../../../../../common/api";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import { yearDDLAction } from "../../../../../utility/yearDDL";

const initData = {
  search: "",
  workplace: "",
  department: "",
  designation: "",
  employee: "",
  year: "",
};

const FilterModal = ({ propsObj, masterFilterHandler, getData }) => {
  const { id, open, anchorEl, handleClose, setIsFilter } = propsObj;

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const saveHandler = (values) => {};

  const [movementTypeDDL, setMovementTypeDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [allDDL, setAllDDL] = useState([]);

  useEffect(() => {
    // MovementType DDL
    getPeopleDeskAllDDL(
      "MovementType",
      orgId,
      buId,
      setMovementTypeDDL,
      "MovementTypeId",
      "MovementType"
    );
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
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setIsFilter(false);
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
                  <div className="master-filter-header">
                    <h3>Advanced Filter</h3>
                    <button
                      onClick={(e) => {
                        getData();
                        handleClose();
                        resetForm(initData);
                        setIsFilter(false);
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
                        {/* <div className="row align-items-center">
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
                        </div> */}
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Year</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="year"
                              options={yearDDLAction(5, 10) || []}
                              value={values?.year}
                              onChange={(valueOption) => {
                                setFieldValue("year", valueOption);
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
                                  values?.workplaceGroup?.value || "",
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
                    </div>
                  </div>
                  <div className="master-filter-bottom">
                    <div></div>
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-green btn-green-less"
                        onClick={(e) => {
                          getData();
                          handleClose();
                          resetForm(initData);
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
                        onClick={(e) => {
                          masterFilterHandler(values);
                          handleClose();
                          resetForm(initData);
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
