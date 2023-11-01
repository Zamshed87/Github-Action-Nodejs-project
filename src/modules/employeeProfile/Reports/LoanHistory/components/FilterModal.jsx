import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../../common/DatePickerBorderless";
import FormikInput from "../../../../../common/FormikInput";
import { getFilterDDL, getPeopleDeskAllDDL } from "../../../../../common/api";

const FilterModal = ({ propsObj }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setFieldValue,
    values,
    errors,
    touched,
    masterFilterHandler,
  } = propsObj;

  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [loanTypeDDL, setLoanTypeDDL] = useState([]);
  const [allDDL, setAllDDL] = useState([]);

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getFilterDDL(buId, "", "", "", "", "", setAllDDL);
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=LoanType&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}`,
      orgId,
      buId,
      setLoanTypeDDL,
      "LoanTypeId",
      "LoanType"
    );
  }, [orgId, buId, wgId]);

  useEffect(() => {
    if (allDDL) {
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

      // Employee DDL
      const modifyEmployeeDDL = allDDL?.employeeList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setEmployeeDDL(modifyEmployeeDDL);
    }
  }, [allDDL]);

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
            <button onClick={(e) => handleClose()} className="btn btn-cross">
              <Clear sx={{ fontSize: "18px" }} />
            </button>
          </div>
          <hr />
          <div className="master-filter-body loan-history-filter">
            <div className="row">
              <div className="col-md-6">
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Application From Date</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <DatePickerBorderLess
                      label=""
                      value={values?.fromDate}
                      name="fromDate"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
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
                      options={departmentDDL || []}
                      value={values?.department}
                      onChange={(valueOption) => {
                        getFilterDDL(
                          buId,
                          "",
                          valueOption?.value || "",
                          "",
                          "",
                          "",
                          setAllDDL
                        );
                        setFieldValue("designation", "");
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
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Employee</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <BorderlessSelect
                      classes="input-sm"
                      name="employee"
                      options={employeeDDL || []}
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
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Minimum Amount</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <FormikInput
                      classes="input-sm"
                      value={values?.minimumAmount}
                      name="minimumAmount"
                      type="number"
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          setFieldValue("minimumAmount", e.target.value);
                        } else {
                          return;
                        }
                      }}
                      className="form-control"
                      placeholder=""
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
                        { value: 1, label: "Approved" },
                        { value: 2, label: "Pending" },
                        { value: 3, label: "Rejected" },
                      ]}
                      value={values?.applicationStatus}
                      onChange={(valueOption) => {
                        setFieldValue("applicationStatus", valueOption);
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
                    <h3>Application To Date</h3>
                  </div>
                  <div className="col-md-7">
                    <DatePickerBorderLess
                      label=""
                      value={values?.toDate}
                      name="toDate"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
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
                      options={designationDDL || []}
                      value={values?.designation}
                      onChange={(valueOption) => {
                        getFilterDDL(
                          buId,
                          "",
                          values?.department?.value || "",
                          valueOption?.value || "",
                          "",
                          "",
                          setAllDDL
                        );
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
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Maximum Amount</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <FormikInput
                      classes="input-sm"
                      value={values?.maximumAmount}
                      name="maximumAmount"
                      type="number"
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          setFieldValue("maximumAmount", e.target.value);
                        } else {
                          return;
                        }
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-md-5">
                    <h3>Installment Status</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <BorderlessSelect
                      classes="input-sm"
                      name="installmentStatus"
                      options={[
                        { value: 1, label: "Completed" },
                        { value: 2, label: "Running" },
                        { value: 3, label: "Not Started" },
                        { value: 4, label: "Hold" },
                      ]}
                      value={values?.installmentStatus}
                      onChange={(valueOption) => {
                        setFieldValue("installmentStatus", valueOption);
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
                    <h3>Loan Type</h3>
                  </div>
                  <div className="col-md-7 ml-0">
                    <BorderlessSelect
                      classes="input-sm"
                      name="loanType"
                      options={loanTypeDDL || []}
                      value={values?.loanType}
                      onChange={(valueOption) => {
                        setFieldValue("loanType", valueOption);
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
                  setFieldValue("department", "");
                  setFieldValue("designation", "");
                  setFieldValue("employee", "");
                  setFieldValue("fromDate", "");
                  setFieldValue("toDate", "");
                  setFieldValue("minimumAmount", "");
                  setFieldValue("maximumAmount", "");
                  setFieldValue("applicationStatus", "");
                  setFieldValue("installmentStatus", "");
                  setFieldValue("loanType", "");
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

export default FilterModal;
