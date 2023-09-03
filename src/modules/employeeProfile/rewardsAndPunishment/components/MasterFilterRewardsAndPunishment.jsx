import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";

const initData = {
  search: "",
};


const MasterFilterRewardsAndPunishment = ({propsObj, masterFilterHandler}) => {
   const { id, open, anchorEl, handleClose, setIsFilter, customStyleObj} = propsObj;


  const saveHandler = (values) => {};
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );


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
                     width: customStyleObj?.root?.minWidth || "875px",
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
                <div className="master-filter-modal-container master-filter-all-job-modal-container">
                  <div className="master-filter-header">
                    <h3>Advanced Filter</h3>
                    <button onClick={(e) => handleClose()} className="btn btn-cross">
                      <Clear sx={{ fontSize: '18px' }} />
                    </button>
                  </div>

                  <hr />
                  <div className="master-filter-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="align-items-center row">
                          <div className="col-md-4">
                            <h3>Status</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              classes="input-sm"
                              name="approvalStatus"
                              options={[
                                { value: 1, label: "Approve" },
                                { value: 2, label: "Reject" },
                                { value: 3, label: "Pending" },
                                { value: 4, label: "All" },
                              ]}
                              value={values?.approvalStatus}
                              onChange={(valueOption) => {
                                setFieldValue("approvalStatus", valueOption)
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
                            <h3>Workplace Group</h3>
                          </div>
                          <div className="col-md-8">
                            <BorderlessSelect
                              classes="input-sm"
                              name="workplaceGroup"
                              options=""
                              value={values?.workplaceGroup}
                              onChange={(valueOption) => {
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
                              options={[]}
                              value={values?.department}
                              onChange={(valueOption) => {
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
                              options={[]?.designationList}
                              value={values?.designation}
                              onChange={(valueOption) => {
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
                              options={[]?.supervisorList}
                              value={values?.supervisor}
                              placeholder=" "
                              onChange={(valueOption) => {
                                setFieldValue("employmentType", "");
                                setFieldValue("employee", "");
                                setFieldValue("supervisor", valueOption);
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
                              placeholder=" "
                              styles={borderlessSelectStyle}
                              name="employee"
                              options={[]?.employeeList}
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
                        onClick={(e) => {
                          setFieldValue("department", "");
                          setFieldValue("designation", "");
                          setFieldValue("supervisor", "");
                          setFieldValue("employmentType", "");
                          setFieldValue("employee", "");
                          setFieldValue("workplaceGroup", "");
                          setFieldValue("approvalStatus", "")
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
   )
}

export default MasterFilterRewardsAndPunishment
