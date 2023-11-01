/* eslint-disable no-unused-vars */
import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";

const initData = {
  search: "",
  workplaceGroup: "",
  department: "",
  designation: "",
  date: "",
  applicationStatus: "",
  employee: "",
};

const FilterModal = ({ propsObj, children }) => {
  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const saveHandler = (values) => {};

  const { id, open, anchorEl, handleClose, customStyleObj } = propsObj;

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
                    minWidth: customStyleObj?.root?.minWidth || "875px",
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
                  <div className="master-filter-body ">
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
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 ">
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
                            />
                          </div>
                        </div>
                        <div className="align-items-center row">
                          <div className="col-md-5">
                            <h3>Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <DatePickerBorderLess
                              label=""
                              value={values?.date}
                              name="date"
                              onChange={(e) => {
                                setFieldValue("date", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
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
                              name="applicationStatus"
                              options={[
                                { value: 1, label: "Pending" },
                                { value: 2, label: "Approve" },
                                { value: 3, label: "Reject" },
                              ]}
                              value={values?.applicationStatus}
                              onChange={(valueOption) => {
                                setFieldValue("applicationStatus", valueOption);
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
                          handleClose();
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
