import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";
import {
  getAdvancedFilterAllDDL,
  getAttendanceApprovalLanding
} from "../helper";
// import MasterFilterTabs from './masterFilterTabs';

const initData = {
  search: "",
  movementType: "",
  department: "",
  employee: "",
  movementFromDate: "",
  movementToDate: "",
  workplace: "",
  designation: "",
  appStatus: "",
  status: "",
  supervisor: "",
};

const FilterModal = ({ propsObj, children }) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const saveHandler = (values) => {};
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const [setLoading] = useState(false);
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setAllData,
    setRowDto,
    setIsFilter,
  } = propsObj;

  const [allDDL, setAllDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [supervisorDDL, setSupervisorDDL] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState(false);

  useEffect(() => {
    getAdvancedFilterAllDDL(buId, 0, 0, 0, 0, setAllDDL);
  }, [buId]);

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

      //department ddl
      const modifyDepartmentDDL = allDDL?.departmentList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setDepartmentDDL(modifyDepartmentDDL);

      //designation ddl
      const modifyDesignationDDL = allDDL?.designationList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setDesignationDDL(modifyDesignationDDL);

      //supervisor ddl
      const modifySupervisorDDL = allDDL?.supervisorList?.map((item) => {
        return {
          ...item,
          value: item?.id,
          label: item?.name,
        };
      });
      setSupervisorDDL(modifySupervisorDDL);

      //employee ddl
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
          <Form onSubmit={handleSubmit}>
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
                        <h3>Status</h3>
                      </div>
                      <div className="col-md-7 ml-0">
                        <BorderlessSelect
                          classes="input-sm"
                          name="status"
                          options={[
                            { value: 1, label: "Pending" },
                            { value: 2, label: "Approve" },
                            { value: 3, label: "Reject" },
                          ]}
                          value={values?.status}
                          onChange={(valueOption) => {
                            setFieldValue("status", valueOption);
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
                          options={departmentDDL}
                          value={values?.department}
                          onChange={(valueOption) => {
                            getAdvancedFilterAllDDL(
                              buId,
                              values?.workplace?.value || 0,
                              valueOption?.value || 0,
                              0,
                              0,
                              setAllDDL
                            );
                            setFieldValue("designation", "");
                            setFieldValue("supervisor", "");
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
                        <h3>{supervisor || "Supervisor"}</h3>
                      </div>
                      <div className="col-md-7 ml-0">
                        <BorderlessSelect
                          classes="input-sm"
                          name="supervisor"
                          options={supervisorDDL}
                          value={values?.supervisor}
                          onChange={(valueOption) => {
                            setFieldValue("employee", "");
                            setFieldValue("supervisor", valueOption);
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
                        <h3>Workplace Group </h3>
                      </div>
                      <div className="col-md-7 ml-0">
                        <BorderlessSelect
                          classes="input-sm"
                          name="workplace"
                          options={workplaceGroupDDL}
                          value={values?.workplace}
                          onChange={(valueOption) => {
                            getAdvancedFilterAllDDL(
                              buId,
                              valueOption?.value || 0,
                              0,
                              0,
                              0,
                              setAllDDL
                            );
                            setFieldValue("department", "");
                            setFieldValue("designation", "");
                            setFieldValue("supervisor", "");
                            setFieldValue("employee", "");
                            setFieldValue("workplace", valueOption);
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
                          options={designationDDL}
                          value={values?.designation}
                          onChange={(valueOption) => {
                            setFieldValue("supervisor", "");
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
                        <h3>Employee</h3>
                      </div>
                      <div className="col-md-7 ml-0">
                        <BorderlessSelect
                          classes="input-sm"
                          name="employee"
                          options={employeeDDL}
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
                      setIsFilter(false);
                    }}
                    style={{
                      marginRight: "10px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-green"
                    type="button"
                    onClick={async () => {
                      await getAttendanceApprovalLanding(
                        "ManualAttendanceListForApprove",
                        orgId,
                        buId,
                        values?.employee?.value || 0,
                        setRowDto,
                        setAllData,
                        setLoading,
                        values?.status?.value || 0,
                        values?.employee?.value
                      );
                      handleClose();
                      setIsFilter(true);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Popover>
  );
};

export default FilterModal;
