import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDLNewAction } from "../../../../common/api";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";
import { gray900 } from "../../../../utility/customColor";

const initData = {
  search: "",
  department: "",
  designation: "",
  employee: "",
  status: "",
  joiningDate: "",
  confirmationDate: "",
};
const PopOverFilter = ({ propsObj, masterFilterHandler }) => {
  const { openId, openModal, viewModal, handleClose, setIsFilter } = propsObj;
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [allDDL, setAllDDL] = useState([]);
  useEffect(() => {
    getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
  }, [orgId, buId]);

  const saveHandler = (values, cb) => {
    handleClose();
    setIsFilter(true);
    masterFilterHandler(values);
  };

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
            <Popover
              sx={{
                "& .MuiPaper-root": {
                  width: "750px",
                  minHeight: "auto",
                  borderRadius: "4px",
                },
              }}
              id={openId}
              open={openModal}
              anchorEl={viewModal}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Form onSubmit={handleSubmit}>
                <div className="master-filter-modal-container">
                  <div className="master-filter-header py-1">
                    <h3>Advanced Filter</h3>
                    <IconButton
                      onClick={(e) => handleClose()}
                      className="btn btn-cross"
                      type="button"
                    >
                      <Clear sx={{ fontSize: "18px", color: gray900 }} />
                    </IconButton>
                  </div>

                  <hr />
                  <div className="master-filter-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Employee</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="employee"
                              options={allDDL?.employeeList}
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
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Department</h3>
                          </div>
                          <div className="col-md-7 ml-0">
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
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Joining Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <DatePickerBorderLess
                              label=""
                              value={values?.joiningDate}
                              name="joiningDate"
                              onChange={(e) => {
                                setFieldValue("joiningDate", e.target.value);
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
                            <h3>Designation</h3>
                          </div>
                          <div className="col-md-7 ml-0">
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
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Status</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="status"
                              options={[
                                { value: 0, label: "All" },
                                { value: 1, label: "Confirmed" },
                                { value: 2, label: "Not Confirmed" },
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
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Confirmation Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <DatePickerBorderLess
                              label=""
                              value={values?.confirmationDate}
                              name="confirmationDate"
                              onChange={(e) => {
                                setFieldValue(
                                  "confirmationDate",
                                  e.target.value
                                );
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
                        className="btn btn-cancel"
                        onClick={(e) => handleClose()}
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        Cancel
                      </button>
                      <button className="btn btn-green" type="submit">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </Popover>
          </>
        )}
      </Formik>
    </>
  );
};

export default PopOverFilter;
