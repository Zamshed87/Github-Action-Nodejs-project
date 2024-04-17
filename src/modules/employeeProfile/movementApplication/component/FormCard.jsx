import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { PeopleDeskSaasDDL } from "../../../../common/api";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";

const FormCard = ({ propsObj }) => {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    isEdit,
    setIsEdit,
    resetForm,
    initData,
    setSingleData,
    employee,
  } = propsObj;
  const { buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [movementTypeDDL, setMovementTypeDDL] = useState([]);

  useEffect(() => {
    // MovementType DDL
    PeopleDeskSaasDDL(
      "MovementType",
      wgId,
      buId,
      setMovementTypeDDL,
      "MovementTypeId",
      "MovementType",
      employee?.EmployeeId ? employee?.EmployeeId : employeeId
    );
  }, [employee?.EmployeeId, buId, wgId, employeeId]);

  return (
    <>
      <div className="card-style">
        <div className="row m-0">
          <div className="col pl-0">
            <div className="input-field-main">
              <label>Movement Type</label>
              <FormikSelect
                name="movementType"
                options={movementTypeDDL || []}
                value={values?.movementType}
                //   label="Country"
                onChange={(valueOption) => {
                  setFieldValue("movementType", valueOption);
                }}
                placeholder=" "
                styles={customStyles}
                errors={errors}
                touched={touched}
                isDisabled={false}
              />
            </div>
          </div>
          <div className="col pl-0">
            <div className="input-field-main">
              <label>From Date</label>
              <FormikInput
                classes="input-sm"
                value={values?.fromDate}
                placeholder=""
                name="fromDate"
                type="date"
                className="form-control"
                onChange={(e) => {
                  setFieldValue("fromDate", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="col pl-0">
            <div className="input-field-main">
              <label>To Date</label>
              <FormikInput
                classes="input-sm"
                value={values?.toDate}
                placeholder="Month"
                name="toDate"
                min={values?.fromDate}
                type="date"
                className="form-control"
                onChange={(e) => {
                  setFieldValue("toDate", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="col pl-0">
            <div className="input-field-main">
              <label>Start Time</label>
              <FormikInput
                classes="input-sm"
                value={values?.startTime}
                placeholder="Month"
                name="startTime"
                type="time"
                className="form-control"
                onChange={(e) => {
                  setFieldValue("startTime", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="col pl-0">
            <div className="input-field-main">
              <label>End Time</label>
              <FormikInput
                classes="input-sm"
                value={values?.endTime}
                placeholder="Month"
                name="endTime"
                type="time"
                className="form-control"
                onChange={(e) => {
                  setFieldValue("endTime", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        </div>
        <div className="row m-lg-1 m-0">
          <div className="col-lg-5 pl-0">
            <div className="input-field-main">
              <FormikInput
                classes="input-sm"
                value={values?.location}
                name="location"
                type="text"
                className="form-control"
                inputClasses="form-borderless"
                placeholder="Location"
                errors={errors}
                touched={touched}
                onChange={(e) => {
                  setFieldValue("location", e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-lg-7 pl-0">
            <div className="input-field-main">
              <FormikInput
                classes="input-sm"
                value={values?.reason}
                name="reason"
                type="text"
                className="form-control"
                inputClasses="form-borderless"
                placeholder="Reason"
                errors={errors}
                touched={touched}
                onChange={(e) => {
                  setFieldValue("reason", e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col-lg-2 align-content-end pl-0">
            <div className="d-flex">
              <button className="btn btn-green btn-green-disable" type="submit">
                {isEdit ? "Update" : "Apply"}
              </button>
              {isEdit && (
                <button
                  onClick={() => {
                    setIsEdit(false);
                    resetForm(initData);
                    setSingleData("");
                  }}
                  className="btn btn-green ml-2"
                  type="button"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormCard;
