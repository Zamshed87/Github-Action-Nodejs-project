import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDL } from "../../../../common/api";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";

const PopOverFilter = ({
  propsObj,
  masterFilterHandler,
  setIsFilter,
  isFilter,
}) => {
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

  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);
  const [allDDL, setAllDDL] = useState([]);

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
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

      // EmploymentType DDL
      const modifyEpmployeeTypeDDL = allDDL?.employmentTypeList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setEmploymentTypeDDL(modifyEpmployeeTypeDDL);
    }
  }, [allDDL]);

  return (
    <>
      <Popover
        sx={{
          "& .MuiPaper-root": {
            minWidth: "665px",
            height: "auto",
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
            <button onClick={() => handleClose()} className="btn btn-cross">
              <Clear sx={{ fontSize: "18px" }} />
            </button>
          </div>

          <hr />
          <div className="master-filter-body mt-3">
            {/* month & year */}
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

            {/* workplace group */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Workplace Group</h3>
              </div>
              <div className="col-md-9">
                <BorderlessSelect
                  placeholder="Select Workplace Group"
                  classes="input-sm"
                  styles={borderlessSelectStyle}
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
                    setFieldValue("employmentType", "");
                    setFieldValue("department", "");
                    setFieldValue("designation", "");
                    setFieldValue("workplace", valueOption);
                    setIsFilter({
                      ...isFilter,
                      employmentType: "",
                      designation: "",
                      departmentList: "",
                      workplaceGroup: valueOption?.label,
                    });
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={false}
                />
              </div>
            </div>

            {/* Department */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Department</h3>
              </div>
              <div className="col-md-9">
                <BorderlessSelect
                  placeholder="Select Department"
                  classes="input-sm"
                  styles={borderlessSelectStyle}
                  name="department"
                  options={departmentDDL || []}
                  value={values?.department}
                  onChange={(valueOption) => {
                    getFilterDDL(
                      buId,
                      values?.workplace?.value || "",
                      valueOption?.value || "",
                      "",
                      "",
                      "",
                      setAllDDL
                    );
                    setFieldValue("employmentType", "");
                    setFieldValue("designation", "");
                    setFieldValue("department", valueOption);
                    setIsFilter({
                      ...isFilter,
                      employmentType: "",
                      designation: "",
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

            {/* Designation */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Designation</h3>
              </div>
              <div className="col-md-9">
                <BorderlessSelect
                  placeholder="Select Designation"
                  classes="input-sm"
                  styles={borderlessSelectStyle}
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
                    setFieldValue("employmentType", "");
                    setFieldValue("designation", valueOption);
                    setIsFilter({
                      ...isFilter,
                      employmentType: "",
                      designation: valueOption?.value,
                    });
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={false}
                />
              </div>
            </div>

            {/* Employee Type */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Employment Type</h3>
              </div>
              <div className="col-md-9">
                <BorderlessSelect
                  placeholder="Select Employment Type"
                  classes="input-sm"
                  styles={borderlessSelectStyle}
                  name="employmentType"
                  options={employmentTypeDDL || []}
                  value={values?.employmentType}
                  onChange={(valueOption) => {
                    getFilterDDL(
                      buId,
                      values?.workplaceGroup?.value || "",
                      values?.department?.value || "",
                      values?.designation?.value || "",
                      "",
                      valueOption?.value || "",
                      setAllDDL
                    );
                    setFieldValue("employmentType", valueOption);
                    setIsFilter({
                      ...isFilter,
                      employmentType: valueOption?.value,
                    });
                  }}
                  errors={errors}
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
                onClick={() => {
                  setFieldValue("workplace", "");
                  setFieldValue("department", "");
                  setFieldValue("designation", "");
                  setFieldValue("employeeType", "");
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
                  masterFilterHandler(values);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default PopOverFilter;
