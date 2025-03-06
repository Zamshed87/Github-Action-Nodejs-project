import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDL, PeopleDeskSaasDDL } from "../../../../common/api";
import BorderlessSelect from "../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../utility/BorderlessStyle";

const PopOverFilter = ({
  propsObj,
  masterFilterHandler,
  setIsFilter,
  isFilter,
  setPdfData,
}) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    customStyleObj,
    setFieldValue,
    values,
    errors,
    touched,
    initData,
    resetForm,
  } = propsObj;
  const { buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [workPlaceDDL, setWorkplaceDDL] = useState(null);
  const [calendarDDL, setCalendarDDL] = useState(null);
  const [rosterDDL, setrosterDDL] = useState(null);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(null);
  const [departmentDDL, setDepartmentDDL] = useState(null);
  const [designationDDL, setDesignationDDL] = useState(null);
  const [allDDL, setAllDDL] = useState([]);

  useEffect(() => {
    PeopleDeskSaasDDL(
      "Workplace",
      wgId,
      buId,
      setWorkplaceDDL,
      "WorkplaceId",
      "WorkplaceName"
    );
    PeopleDeskSaasDDL(
      "GeneralCalender",
      wgId,
      buId,
      setCalendarDDL,
      "CalenderId",
      "CalenderName"
    );
    PeopleDeskSaasDDL(
      "RosterGroup",
      wgId,
      buId,
      setrosterDDL,
      "RosterGroupId",
      "RosterGroupName"
    );
    getFilterDDL(buId, "", "", "", "", "", setAllDDL);
  }, [wgId, buId]);

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
    }
  }, [allDDL]);

  return (
    <>
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
        <div className="master-filter-modal-container master-filter-all-job-modal-container">
          <div className="master-filter-header">
            <h3>Advanced Filter</h3>
            <button
              type="button"
              onClick={(e) => handleClose()}
              className="btn btn-cross"
            >
              <Clear sx={{ fontSize: "18px" }} />
            </button>
          </div>

          <hr />
          <div className="master-filter-body">
            {/* Workplace */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Workplace</h3>
              </div>
              <div className="col-md-9">
                <BorderlessSelect
                  placeholder=" "
                  classes="input-sm"
                  styles={borderlessSelectStyle}
                  name="workplace"
                  options={workPlaceDDL || []}
                  value={values?.workplace}
                  onChange={(valueOption) => {
                    setFieldValue("workplace", valueOption);
                    setIsFilter({
                      ...isFilter,
                      workplace: valueOption?.value,
                    });
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={false}
                />
              </div>
            </div>

            {/* Workplace Group */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Workplace Group</h3>
              </div>
              <div className="col-md-9">
                <BorderlessSelect
                  placeholder=" "
                  classes="input-sm"
                  styles={borderlessSelectStyle}
                  name="workplaceGroup"
                  options={workplaceGroupDDL || []}
                  value={values?.workplaceGroup}
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
                    setFieldValue("workplaceGroup", valueOption);
                    setIsFilter({
                      ...isFilter,
                      designation: "",
                      department: "",
                      workplaceGroup: valueOption?.value,
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
                  placeholder=" "
                  classes="input-sm"
                  styles={borderlessSelectStyle}
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
                    setFieldValue("department", valueOption);
                    setIsFilter({
                      ...isFilter,
                      workplaceGroup: values?.workplaceGroup?.value,
                      department: valueOption?.value,
                      designation: "",
                    });
                  }}
                  errors={errors}
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
                  placeholder=" "
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
                    setFieldValue("designation", valueOption);
                    setIsFilter({
                      ...isFilter,
                      workplaceGroup: values?.workplaceGroup?.value,
                      department: values?.department?.value,
                      designation: valueOption?.value,
                    });
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={false}
                />
              </div>
            </div>

            {/* Roster Group Name */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Roster Group Name</h3>
              </div>
              <div className="col-md-9">
                <BorderlessSelect
                  placeholder=" "
                  classes="input-sm"
                  styles={borderlessSelectStyle}
                  name="rosterGroupName"
                  options={rosterDDL}
                  value={values?.rosterGroupName}
                  onChange={(valueOption) => {
                    setFieldValue("rosterGroupName", valueOption);
                    setIsFilter({
                      ...isFilter,
                      rosterGroupName: valueOption?.value,
                    });
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={false}
                />
              </div>
            </div>

            {/* Calendar Type */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Calendar Name</h3>
              </div>
              <div className="col-md-9">
                <BorderlessSelect
                  placeholder=" "
                  classes="input-sm"
                  styles={borderlessSelectStyle}
                  name="calendarType"
                  options={calendarDDL || []}
                  value={values?.calendarType}
                  isDisabled={!values?.rosterGroupName}
                  onChange={(valueOption) => {
                    setFieldValue("calendarType", valueOption);
                    setIsFilter({
                      ...isFilter,
                      calendarType: valueOption?.value,
                    });
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>

            {/* date */}
            <div className="align-items-center row">
              <div className="col-md-3">
                <h3>Date</h3>
              </div>
              <div className="col-md-9">
                <DatePickerBorderLess
                  label=""
                  value={values?.date}
                  name="date"
                  onChange={(e) => setFieldValue("date", e.target.value)}
                  errors={errors}
                  touched={touched}
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
                onClick={(e) => {
                  handleClose();
                  resetForm(initData);
                  setIsFilter({
                    rosterGroupName: "",
                    calendarType: "",
                    workplace: "",
                    workplaceGroup: "",
                    department: "",
                    designation: "",
                    date: "",
                  });
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
                  setPdfData(values);
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
