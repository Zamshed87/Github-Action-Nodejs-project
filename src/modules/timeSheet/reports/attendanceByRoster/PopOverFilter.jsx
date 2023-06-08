import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { PeopleDeskSaasDDL } from "../../../../common/api";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../common/DatePickerBorderless";
import Loading from "../../../../common/loading/Loading";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";
import { getAttendanceByRoster } from "../helper";

let date = new Date();
let monthYear = date.getFullYear() + "-" + (date.getMonth() + 1).toString();
const initData = {
  monthYear: `${monthYear}`,
  workplaceGroup: "",
  employmentType: "",
  departmentList: "",
};
const PopOverFilter = ({ propsObj, setIsFilter, isFilter }) => {
  const { id, open, anchorEl, handleClose, month, year, setRowDto } = propsObj;
  const [loading, setLoading] = useState(false);
  const { wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(null);
  const [departmentDDL, setDepartmentDDL] = useState(null);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState(null);

  useEffect(() => {
    PeopleDeskSaasDDL(
      "WorkplaceGroup",
      wgId,
      buId,
      setWorkplaceGroupDDL,
      "WorkplaceGroupId",
      "WorkplaceGroupName"
    );
    PeopleDeskSaasDDL(
      "EmpDepartment",
      wgId,
      buId,
      setDepartmentDDL,
      "DepartmentId",
      "DepartmentName"
    );
    PeopleDeskSaasDDL(
      "EmploymentType",
      wgId,
      buId,
      setEmploymentTypeDDL,
      "Id",
      "EmploymentType"
    );
  }, [buId, wgId]);
  const saveHandler = async (values) => {
    let department = values?.departmentList[0]?.value;
    let employmentType = values?.employmentType?.value;
    let WorkplaceGroup = values?.workplaceGroup?.value;
    await getAttendanceByRoster(
      Math.abs(month),
      year,
      buId,
      department || 0,
      WorkplaceGroup || 0,
      employmentType || 0,
      "",
      setRowDto,
      setLoading
    );
    await handleClose();
  };
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          width: "650px",
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
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            // resetForm(initData);
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
            {loading && <Loading />}
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="master-filter-modal-container master-filter-all-job-modal-container">
                <div className="master-filter-header">
                  <h3>Advanced Filter</h3>
                  <button
                    onClick={(e) => handleClose()}
                    type="button"
                    className="btn btn-cross"
                  >
                    <Clear sx={{ fontSize: "18px" }} />
                  </button>
                </div>

                <hr />
                <div className="master-filter-body pt-3">
                  <div className="align-items-center row">
                    <div className="col-md-3">
                      <h3>Month & Year</h3>
                    </div>
                    <div className="col-md-9">
                      <DatePickerBorderLess
                        label=""
                        value={values?.monthYear}
                        name="monthYear"
                        type="month"
                        onChange={(e) => {
                          setFieldValue("monthYear", e.target.value);
                          setIsFilter({
                            ...isFilter,
                            monthYear: e.target.value,
                          });
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
                        placeholder=""
                        classes="input-sm"
                        styles={borderlessSelectStyle}
                        name="workplaceGroup"
                        options={workplaceGroupDDL}
                        value={values?.workplaceGroup}
                        onChange={(valueOption) => {
                          setFieldValue("workplaceGroup", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                      />
                    </div>
                  </div>
                  <div className="align-items-center row">
                    <div className="col-md-3">
                      <h3>Employment Type</h3>
                    </div>
                    <div className="col-md-9">
                      <BorderlessSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={borderlessSelectStyle}
                        name="employmentType"
                        options={employmentTypeDDL}
                        value={values?.employmentType}
                        onChange={(valueOption) => {
                          setFieldValue("employmentType", valueOption);
                          setIsFilter({
                            ...isFilter,
                            employmentType: valueOption?.label,
                          });
                        }}
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
                        placeholder=" "
                        classes="input-sm"
                        styles={borderlessSelectStyle}
                        name="departmentList"
                        options={departmentDDL}
                        value={values?.departmentList}
                        onChange={(valueOption) => {
                          setFieldValue("departmentList", valueOption);
                          setIsFilter({
                            ...isFilter,
                            departmentList: valueOption?.label,
                          });
                        }}
                        errors={errors}
                        isMulti
                        touched={touched}
                        isDisabled={false}
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
                    <button type="submit" className="btn btn-green">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </Popover>
  );
};

export default PopOverFilter;
