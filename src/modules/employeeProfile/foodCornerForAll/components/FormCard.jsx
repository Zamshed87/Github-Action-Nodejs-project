/* eslint-disable no-unused-vars */
import { useState } from "react";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import FormikInput from "../../../../common/FormikInput";
import FormikRadio from "../../../../common/FormikRadio";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import { greenColor } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getPendingAndConsumeMealReport } from "../helper";

const FormCard = ({ propsObj }) => {
  const {
    setFieldValue,
    values,
    errors,
    touched,
    resetForm,
    initData,
    employeeDDL,
    setEmployeeInfo,
    orgId,
    buId,
    employeeInfo,
    setScheduleMeal,
    setConsumeMeal,
  } = propsObj;
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loading />}
      <div className="card">
        <div className="card-body">
          <div className="row m-lg-1 m-0">
            <div className="col-lg-6">
              <div className="input-field-main">
                <label htmlFor="">Employee Name</label>
                <FormikSelect
                  name="employee"
                  options={employeeDDL || []}
                  value={values?.employee}
                  onChange={(valueOption) => {
                    setFieldValue("employee", valueOption);
                    if (!valueOption) {
                      setEmployeeInfo("");
                      setScheduleMeal([]);
                      setConsumeMeal([]);
                    }
                    getPeopleDeskAllLanding(
                      "EmployeeBasicById",
                      orgId,
                      buId,
                      valueOption?.value,
                      setEmployeeInfo,
                      "",
                      "",
                      ""
                    );
                    getPendingAndConsumeMealReport(
                      1,
                      valueOption?.value,
                      setScheduleMeal,
                      setLoading,
                      ""
                    );
                    getPendingAndConsumeMealReport(
                      2,
                      valueOption?.value,
                      setConsumeMeal,
                      setLoading,
                      ""
                    );
                  }}
                  placeholder=" "
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                  isDisabled={false}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="input-field-main">
                <label htmlFor="">Date</label>
                <FormikInput
                  classes="input-sm"
                  value={values?.date}
                  placeholder=""
                  name="date"
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("date", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-lg-12">
              {employeeInfo && (
                <p>
                  <strong>Designation: </strong>{" "}
                  {employeeInfo[0]?.DesignationName} <strong>Unit: </strong>{" "}
                  {employeeInfo[0]?.BusinessUnitName}
                </p>
              )}
            </div>
            <div className="col-lg-6">
              <div className="input-field-main">
                <label htmlFor="">Number Of Meal</label>
                <FormikInput
                  classes="input-sm"
                  value={values?.meal}
                  name="meal"
                  type="text"
                  className="form-control"
                  placeholder=""
                  errors={errors}
                  touched={touched}
                  onChange={(e) => {
                    setFieldValue("meal", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="input-field-main">
                <label htmlFor="">Type</label>
                <FormikSelect
                  name="type"
                  options={[
                    { value: 1, label: "Regular" },
                    { value: 2, label: "Irregular" },
                  ]}
                  value={values?.type}
                  //   label="Country"
                  onChange={(valueOption) => {
                    setFieldValue("type", valueOption);
                  }}
                  placeholder=" "
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                  isDisabled={false}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="input-field-main">
                <label htmlFor="">Remarks</label>
                <FormikInput
                  classes="input-sm"
                  value={values?.remarks}
                  name="remarks"
                  type="text"
                  className="form-control"
                  placeholder=""
                  errors={errors}
                  touched={touched}
                  onChange={(e) => {
                    setFieldValue("remarks", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="input-feild-maint mt-3">
                <label htmlFor="" className="pr-2">
                  Meal Status
                </label>
                <FormikRadio
                  name="mealStatus"
                  label="Own"
                  value={"own"}
                  color={greenColor}
                  onChange={(e) => {
                    setFieldValue("mealStatus", e.target.value);
                  }}
                  checked={values?.mealStatus === "own"}
                />
                <FormikRadio
                  name="mealStatus"
                  label="Guest"
                  value={"guest"}
                  color={greenColor}
                  onChange={(e) => {
                    setFieldValue("mealStatus", e.target.value);
                  }}
                  checked={values?.mealStatus === "guest"}
                />
              </div>
            </div>
            <div className="col-lg-6 align-content-end">
              <div className="d-flex justify-content-between">
                <button className="btn button w-100 mt-3" type="submit">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormCard;
