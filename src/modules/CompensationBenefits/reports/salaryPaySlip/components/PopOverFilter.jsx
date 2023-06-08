import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getFilterDDLNewAction } from "../../../../../common/api";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import { getSalaryDetailsAction } from "../helper";

// let date = new Date();
// let month=date.getMonth() + 1;
// let year=date.getFullYear();

const PopOverFilter = ({ propsObj, masterFilterHandler }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setFieldValue,
    values,
    errors,
    touched,
    setLoading,
    setAllData,
    setRowDto,
    buId,
    setAnchorEl,
    orgId,
    setIsFilter,
    setMonthValue,
  } = propsObj;

  const [allDDL, setAllDDL] = useState([]);

  useEffect(() => {
    getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
  }, [buId, orgId]);

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
      <div className="master-filter-modal-container master-filter-all-job-modal-container">
        <div className="master-filter-header py-1">
          <h3>Advanced Filter</h3>
          <IconButton onClick={(e) => handleClose()} className="btn btn-cross">
            <Clear sx={{ fontSize: "18px" }} />
          </IconButton>
        </div>

        <hr />
        <div className="master-filter-body">
          <div className="align-items-center row">
            <div className="col-md-3">
              <h3>Month</h3>
            </div>
            <div className="col-md-9">
              <DatePickerBorderLess
                label=""
                value={values?.month}
                name="month"
                type="month"
                onChange={(e) => {
                  setFieldValue("month", e.target.value);
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
                options={allDDL?.workplaceGroupList}
                value={values?.workplaceGroup}
                onChange={(valueOption) => {
                  setFieldValue("department", "");
                  setFieldValue("designation", "");
                  setFieldValue("employee", "");
                  setFieldValue("workplaceGroup", valueOption);
                  getFilterDDLNewAction(
                    buId,
                    valueOption?.value || "",
                    "",
                    "",
                    "",
                    "",
                    setAllDDL
                  );
                }}
                placeholder=""
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
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
                options={allDDL?.departmentList}
                value={values?.department}
                onChange={(valueOption) => {
                  setFieldValue("designation", "");
                  setFieldValue("employee", "");
                  setFieldValue("department", valueOption);
                  getFilterDDLNewAction(
                    buId,
                    values?.workplaceGroup?.value || "",
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
                menuPosition="fixed"
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
                options={allDDL?.designationList}
                value={values?.designation}
                onChange={(valueOption) => {
                  setFieldValue("employee", "");
                  setFieldValue("designation", valueOption);
                  getFilterDDLNewAction(
                    buId,
                    values?.workplaceGroup?.value || "",
                    values?.department?.value || "",
                    valueOption?.value || "",
                    "",
                    "",
                    setAllDDL
                  );
                }}
                placeholder=""
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
                menuPosition="fixed"
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
                options={allDDL?.employeeList}
                value={values?.employee}
                onChange={(valueOption) => {
                  setFieldValue("employee", valueOption);
                }}
                placeholder=""
                styles={borderlessSelectStyle}
                errors={errors}
                touched={touched}
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
              className="btn btn-cancel"
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
              onClick={() => {
                if (!values?.month)
                  return toast.warn("Month is required for filter");
                let splittedMonth = values?.month?.split("-");
                setIsFilter(true);
                setMonthValue(values?.month);
                // resetForm();
                getSalaryDetailsAction(
                  buId,
                  splittedMonth?.[0],
                  splittedMonth?.[1],
                  values?.workplaceGroup?.value || 0,
                  values?.department?.value || 0,
                  values?.designation?.value || 0,
                  values?.employee?.value || 0,
                  setLoading,
                  setRowDto,
                  setAllData,
                  () => setAnchorEl(null)
                );
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default PopOverFilter;
