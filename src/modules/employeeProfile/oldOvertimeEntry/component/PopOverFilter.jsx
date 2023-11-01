import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { shallowEqual, useSelector } from "react-redux";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";

const PopOverFilter = ({ propsObj }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setFieldValue,
    values,
    errors,
    touched,
  } = propsObj;

  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  // const [dateOpen, setDateOpen] = React.useState(false);

  // const eventHandler = (values, cb) => {};
  // const dataRanges = [{ label: "" }];
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          minWidth: "1100px",
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
      <div className="master-filter-modal-container master-filter-all-job-modal-container">
        <div className="master-filter-header">
          <p>Advanced Filter</p>
          <button onClick={(e) => handleClose()} className="btn btn-cross">
            <Clear sx={{ fontSize: "18px" }} />
          </button>
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
                    placeholder="Select Workplace Group"
                    styles={borderlessSelectStyle}
                    name="workplaceGroup"
                    options={[
                      { value: 1, label: "Akij" },
                      { value: 2, label: "iBOS" },
                    ]}
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
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
                  <p>Department</p>
                </div>
                <div className="col-md-8">
                  <BorderlessSelect
                    placeholder="Select Department"
                    styles={borderlessSelectStyle}
                    name="department"
                    options={[
                      { value: 1, label: "HR & Admin" },
                      { value: 2, label: "Software Engineer" },
                    ]}
                    value={values?.department}
                    onChange={(valueOption) => {
                      setFieldValue("department", valueOption);
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
                  <p>Designation</p>
                </div>
                <div className="col-md-8">
                  <BorderlessSelect
                    placeholder="Select Designation"
                    styles={borderlessSelectStyle}
                    name="designation"
                    options={[
                      { value: 1, label: "HR & Admin" },
                      { value: 2, label: "Software Engineer" },
                    ]}
                    value={values?.designation}
                    onChange={(valueOption) => {
                      setFieldValue("designation", valueOption);
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
                  <p>{supervisor || "Supervisor"}</p>
                </div>
                <div className="col-md-8">
                  <BorderlessSelect
                    placeholder={`Select ${supervisor || "Supervisor"}`}
                    styles={borderlessSelectStyle}
                    name="supervisor"
                    options={[
                      { value: 1, label: "Md . Mridul Hasan" },
                      { value: 2, label: "Md Al-amin" },
                    ]}
                    value={values?.supervisor}
                    onChange={(valueOption) => {
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
          </div>
          <div className=" row">
            <div className="col-md-6">
              <div className="align-items-center row">
                <div className="col-md-4">
                  <p>Employee </p>
                </div>
                <div className="col-md-8">
                  <BorderlessSelect
                    placeholder="Select Employee"
                    styles={borderlessSelectStyle}
                    name="employee"
                    options={[
                      { value: 1, label: "Md . Mridul Hasan" },
                      { value: 2, label: "Md Al-amin" },
                    ]}
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
              onClick={(e) => handleClose()}
              style={{
                marginRight: "10px",
              }}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-green" onClick={() => {}}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default PopOverFilter;
