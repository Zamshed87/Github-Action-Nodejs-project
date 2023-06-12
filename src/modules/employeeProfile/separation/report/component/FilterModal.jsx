/* eslint-disable no-unused-vars */
import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  getFilterDDLNewAction,
  PeopleDeskSaasDDL,
} from "../../../../../common/api";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import { getEmployeeSeparationLanding } from "../../helper";

const FilterModal = ({ propsObj, children }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setRowDto,
    setIsFilter,
    initData,
    values,
    resetForm,
    errors,
    touched,
    setFieldValue,
  } = propsObj;

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [allDDL, setAllDDL] = useState([]);
  const [separationTypeDDL, setSeparationTypeDDL] = useState([]);
  useEffect(() => {
    getFilterDDLNewAction(buId, "", "", "", "", "", setAllDDL);
    PeopleDeskSaasDDL(
      "SeparationType",
      wgId,
      buId,
      setSeparationTypeDDL,
      "SeparationTypeId",
      "SeparationType"
    );
  }, [wgId, buId]);

  return (
    <>
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
              onClick={(e) => {
                handleClose();
                resetForm(initData);
              }}
              className="btn btn-cross"
            >
              <Clear sx={{ fontSize: "18px" }} />
            </button>
          </div>
          <hr />
          {/* <MasterFilterTabs propsObj={propsObj} /> */}
          <div className="master-filter-body">
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Approval Status</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <BorderlessSelect
                      classes="input-sm"
                      name="appStatus"
                      options={[
                        { value: 1, label: "Approve" },
                        { value: 2, label: "Reject" },
                      ]}
                      value={values?.appStatus}
                      onChange={(valueOption) => {
                        setFieldValue("appStatus", valueOption);
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
                        setFieldValue("designation", "");
                        setFieldValue("employee", "");
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
              </div>
              <div className="col-md-6">
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Separation Type</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <BorderlessSelect
                      classes="input-sm"
                      name="separationType"
                      options={separationTypeDDL || []}
                      value={values?.separationType}
                      onChange={(valueOption) => {
                        setFieldValue("separationType", valueOption);
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
                      options={allDDL?.designationList}
                      value={values?.designation}
                      onChange={(valueOption) => {
                        setFieldValue("employee", "");
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
                onClick={(e) => {
                  handleClose();
                  getEmployeeSeparationLanding({
                    status: values?.appStatus?.label,
                    depId: values?.department?.value,
                    desId: values?.designation?.value,
                    supId: null,
                    emTypId: null,
                    empId: values?.employee?.value,
                    workId: wgId,
                    buId,
                    setter: setRowDto,
                    setLoading,
                    separationTypeId: values?.separationType?.value,
                    setAllData: null,
                    tableName: "EmployeeSeparationListForReport",
                  });
                  setIsFilter(true);
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

export default FilterModal;
