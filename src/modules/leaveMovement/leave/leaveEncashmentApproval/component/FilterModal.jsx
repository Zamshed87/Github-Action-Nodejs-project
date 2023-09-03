/* eslint-disable no-unused-vars */
import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";

const initData = {
  search: "",
  year: "",
  department: "",
  supervisor: "",
  workplaceGroup: "",
  designation: "",
  employee: "",
  employmentType: "",
};

const FilterModal = ({ propsObj, children }) => {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );
  const saveHandler = (values) => {};

  const { id, open, anchorEl, handleClose } = propsObj;

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
                  <div className="master-filter-header">
                    <h3>Advanced Filter</h3>
                    <button
                      onClick={(e) => handleClose()}
                      className="btn btn-cross"
                    >
                      <Clear sx={{ fontSize: "18px" }} />
                    </button>
                  </div>
                  <hr />
                  {/* <MasterFilterTabs propsObj={propsObj} /> */}
                  <div className="master-filter-body application-filter">
                    <div className="row">
                      <div className="col-md-6 ">
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Workplace Group</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="workplaceGroup"
                              options={[
                                { value: 1, label: "Option-1" },
                                { value: 2, label: "Option-2" },
                                { value: 3, label: "Option-3" },
                              ]}
                              value={values?.workplaceGroup}
                              onChange={(valueOption) => {
                                setFieldValue("workplaceGroup", valueOption);
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
                            <h3>{supervisor || "Supervisor"}</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="supervisor"
                              options={[
                                { value: 1, label: "Option-1" },
                                { value: 2, label: "Option-2" },
                                { value: 3, label: "Option-3" },
                              ]}
                              value={values?.supervisor}
                              onChange={(valueOption) => {
                                setFieldValue("supervisor", valueOption);
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
                            <h3>Employment Type</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="employmentType"
                              options={[
                                { value: 1, label: "Option-1" },
                                { value: 2, label: "Option-2" },
                                { value: 3, label: "Option-3" },
                              ]}
                              value={values?.employmentType}
                              onChange={(valueOption) => {
                                setFieldValue("employmentType", valueOption);
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
                              options={[
                                { value: 1, label: "Option-1" },
                                { value: 2, label: "Option-2" },
                                { value: 3, label: "Option-3" },
                              ]}
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
                            <h3>Designation</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="designation"
                              options={[
                                { value: 1, label: "Option-1" },
                                { value: 2, label: "Option-2" },
                                { value: 3, label: "Option-3" },
                              ]}
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
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Employee</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="employee"
                              options={[
                                { value: 1, label: "Option-1" },
                                { value: 2, label: "Option-2" },
                                { value: 3, label: "Option-3" },
                              ]}
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
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Status</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="status"
                              options={[
                                { value: 1, label: "Pending" },
                                { value: 2, label: "Approved" },
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
                        onClick={() => {}}
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
