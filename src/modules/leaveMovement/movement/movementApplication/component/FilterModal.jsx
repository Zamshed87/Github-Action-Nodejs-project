/* eslint-disable no-unused-vars */
import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getFilterDDL, PeopleDeskSaasDDL } from "../../../../../common/api";
import BorderlessSelect from "../../../../../common/BorderlessSelect";
import DatePickerBorderLess from "../../../../../common/DatePickerBorderless";
import { borderlessSelectStyle } from "../../../../../utility/BorderlessStyle";

const initData = {
  search: "",
  movementType: "",
  applicationDate: "",
  status: "",
  fromDate: "",
  toDate: "",
  supervisor: "",
  employee: "",
};

const FilterModal = ({ propsObj, children }) => {
  const { buId, orgId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const saveHandler = (values) => { };

  const [employeeDDL, setEmployeeDDL] = useState(false);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState(false);
  const [designationDDL, setDesignationDDL] = useState(false);
  const [supervisorDDL, setSupervisorDDL] = useState(false);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState(false);
  const [allDDL, setAllDDL] = useState([]);
  const [movementTypeDDL, setMovementTypeDDL] = useState([]);
  const [empId, setEmployeeId] = useState("");
  const {
    id,
    open,
    anchorEl,
    handleClose,
    setEmployee,
    setIsFilter,
    masterFilterHandler,
  } = propsObj;

  useEffect(() => {
    // MovementType DDL
    PeopleDeskSaasDDL(
      "MovementType",
      wgId,
      buId,
      setMovementTypeDDL,
      "MovementTypeId",
      "MovementType",
      empId ? empId : employeeId
    );
    getFilterDDL(buId, "", "", "", "", "", setAllDDL);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

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
                  <div className="master-filter-header py-1">
                    <h3>Advanced Filter</h3>
                    <IconButton
                      onClick={(e) => handleClose()}
                      className="btn btn-cross"
                    >
                      <Clear sx={{ fontSize: "18px" }} />
                    </IconButton>
                  </div>
                  <hr />
                  {/* <MasterFilterTabs propsObj={propsObj} /> */}
                  <div className="master-filter-body ">
                    <div className="row">
                      <div className="col-md-6 ">
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Movement Type</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="movementType"
                              options={movementTypeDDL || []}
                              value={values?.movementType}
                              onChange={(valueOption) => {
                                setFieldValue("movementType", valueOption);
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
                            <h3>From Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <DatePickerBorderLess
                              label=""
                              value={values?.fromDate}
                              name="fromDate"
                              onChange={(e) => {
                                setFieldValue("fromDate", e.target.value);
                                setFieldValue("toDate", "");
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>

                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Status</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <BorderlessSelect
                              classes="input-sm"
                              name="status"
                              options={[
                                { value: 1, label: "Approved" },
                                { value: 2, label: "Pending" },
                                { value: 3, label: "Rejected" },
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
                      </div>
                      <div className="col-md-6 ">
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>Application Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <DatePickerBorderLess
                              label=""
                              value={values?.applicationDate}
                              name="applicationDate"
                              onChange={(e) => {
                                setFieldValue(
                                  "applicationDate",
                                  e.target.value
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-md-5">
                            <h3>To Date</h3>
                          </div>
                          <div className="col-md-7 ml-0">
                            <DatePickerBorderLess
                              label=""
                              value={values?.toDate}
                              name="toDate"
                              onChange={(e) => {
                                setFieldValue("toDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                              minDate={values?.fromDate}
                              isDisabled={values?.fromDate ? false : true}
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
                        className="btn btn-cancel"
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
                        type="button"
                        className="btn btn-green btn-green-disabled"
                        onClick={(e) => {
                          setEmployee(values?.employee);
                          handleClose();
                          setIsFilter(true);
                          masterFilterHandler(values);
                          resetForm(initData);
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
  );
};

export default FilterModal;
