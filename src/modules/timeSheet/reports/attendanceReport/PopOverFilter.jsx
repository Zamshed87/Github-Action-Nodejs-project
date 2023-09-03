import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { Form, Formik } from "formik";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";

const initData = {};

const PopOverFilter = ({ propsObj, masterFilterHandler }) => {
  const { id, open, anchorEl, handleClose } = propsObj;

  const saveHandler = (values) => {};
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          minWidth: "875px",
          height: "500px",
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
                <div className="master-filter-modal-container master-filter-all-job-modal-container">
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
                  <div className="master-filter-body">
                    <div className="align-items-center row">
                      <div className="col-md-3">
                        <h3>Start Date</h3>
                      </div>
                      <div className="col-md-9">
                        <DatePickerBorderLess
                          label=""
                          value={values?.startDate}
                          name="startDate"
                          onChange={(e) => {
                            setFieldValue("startDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="align-items-center row">
                      <div className="col-md-3">
                        <h3>End Date</h3>
                      </div>
                      <div className="col-md-9">
                        <DatePickerBorderLess
                          label=""
                          value={values?.endDate}
                          name="endDate"
                          onChange={(e) => {
                            setFieldValue("endDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="align-items-center row">
                      <div className="col-md-3">
                        <h3>Workplace Group</h3>
                      </div>
                      <div className="col-md-9">
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
                    <div className="align-items-center row">
                      <div className="col-md-3">
                        <h3>Department</h3>
                      </div>
                      <div className="col-md-9">
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
                    <div className="align-items-center row">
                      <div className="col-md-3">
                        <h3>Designation</h3>
                      </div>
                      <div className="col-md-9">
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
                    <div className="align-items-center row">
                      <div className="col-md-3">
                        <h3>Employee</h3>
                      </div>
                      <div className="col-md-9">
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
                      <button className="btn btn-green">Apply</button>
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </>
    </Popover>
  );
};

export default PopOverFilter;
