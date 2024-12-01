import React, { useEffect, useState } from "react";
import BackButton from "../../../../common/BackButton";
import FormikSelect from "../../../../common/FormikSelect";
import { gray600, success500 } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import { shallowEqual, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import FormikError from "../../../../common/login/FormikError";
import FormikMuiDatePicker from "../../../../common/FormikMuiDatePicker";
import DefaultInput from "../../../../common/DefaultInput";

function AddEditForm({ propsObj }) {
  const { employeeId, userName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const {
    loadingTask,
    resetForm,
    initData,
    values,
    touched,
    errors,
    setFieldValue,
    isSelfService = false,
  } = propsObj;

  const [empDDL, setEmpDDL] = useState([]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeName",
      setEmpDDL
    );
  }, [employeeId]);

  return (
    <div className="table-card">
      <div className="table-card-heading mb12">
        <div className="d-flex align-items-center">
          <BackButton />
          <h2>Create Task</h2>
        </div>
        <ul className="d-flex flex-wrap">
          <li>
            <button
              type="button"
              className="btn btn-cancel mr-2"
              onClick={() => {
                resetForm(initData);
              }}
            >
              Reset
            </button>
          </li>
          <li>
            <button
              disabled={loadingTask}
              type="submit"
              className="btn btn-green flex-center"
            >
              Save
            </button>
          </li>
        </ul>
      </div>
      <div className="table-card-body">
        <div className="col-md-12 px-0 mt-3">
          <div className="card-style">
            <div className="row">
              <div className="col-md-3">
                <div className="input-field-main">
                  <label>Select Employee</label>
                  <FormikSelect
                    name="empList"
                    classes="input-sm"
                    placeholder=""
                    styles={{
                      ...customStyles,
                      control: (provided, state) => ({
                        ...provided,
                        minHeight: "auto",
                        height: values?.empList?.length > 2 ? "auto" : "30px",
                        borderRadius: "4px",
                        boxShadow: `${success500}!important`,
                        ":hover": {
                          borderColor: `${gray600}!important`,
                        },
                        ":focus": {
                          borderColor: `${gray600}!important`,
                        },
                      }),
                      valueContainer: (provided, state) => ({
                        ...provided,
                        height: values?.empList?.length > 2 ? "auto" : "30px",
                        padding: "0 6px",
                      }),
                      multiValue: (styles) => {
                        return {
                          ...styles,
                          position: "relative",
                          top: "-1px",
                        };
                      },
                      multiValueLabel: (styles) => ({
                        ...styles,
                        padding: "0",
                        position: "relative",
                        top: "-1px",
                      }),
                    }}
                    value={values?.empList}
                    options={empDDL || []}
                    onChange={(valueOption) => {
                      if (isSelfService) {
                        const isSelf = valueOption.find(
                          ({ value }) => value === employeeId
                        );
                        if (isSelf) {
                          setFieldValue("empList", valueOption);
                        } else {
                          setFieldValue("empList", [
                            ...valueOption,
                            { label: userName, value: employeeId },
                          ]);
                        }
                      } else {
                        setFieldValue("empList", valueOption);
                      }
                    }}
                    isMulti
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="col-lg-3">
                <label>Duration From</label>
                <FormikMuiDatePicker
                  type={"date-time"}
                  clearable={true}
                  value={values?.fDate}
                  onChange={(date) => {
                    setFieldValue("fDate", date);
                    setFieldValue("tDate", null);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>Duration To</label>
                <FormikMuiDatePicker
                  type={"date-time"}
                  clearable={true}
                  value={values?.tDate}
                  minDate={values?.fDate}
                  onChange={(date) => {
                    setFieldValue("tDate", date);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-12"></div>

              <div className="col-12">
                <div className="card-save-border"></div>
              </div>
              <div className="col-lg-4">
                <div className="input-field-main">
                  <label>Task Title</label>
                  <DefaultInput
                    classes="input-sm"
                    value={values?.taskTitle}
                    placeholder=""
                    name="taskTitle"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("taskTitle", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="col-12">
                <label style={{ marginBottom: "5px" }}>Task Description</label>
              </div>
              <div className="col-lg-12">
                <div>
                  <ReactQuill
                    value={values?.description}
                    onChange={(value) => setFieldValue("description", value)}
                  />
                </div>
                <div style={{ marginTop: "-2px" }}>
                  <FormikError
                    errors={errors}
                    name="description"
                    touched={touched}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditForm;
