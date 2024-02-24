/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  getPeopleDeskAllLanding,
  getSearchEmployeeList,
} from "../../../../common/api";
import FormikInput from "../../../../common/FormikInput";
import FormikRadio from "../../../../common/FormikRadio";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import PrimaryButton from "../../../../common/PrimaryButton";
import { greenColor } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { getPendingAndConsumeMealReport } from "../helper";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import { shallowEqual, useSelector } from "react-redux";

const FormCard = ({ propsObj }) => {
  const {
    setFieldValue,
    values,
    errors,
    touched,
    placeDDL,
    setEmployeeInfo,
    orgId,
    buId,
    employeeInfo,
    setScheduleMeal,
    setConsumeMeal,
  } = propsObj;
  const [loading, setLoading] = useState(false);

  const { wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <>
      {loading && <Loading />}
      <div className="card-style px-0" style={{ marginTop: "18px" }}>
        <div className="row m-0">
          <div className="col-md-6 input-field-main">
            <label>Employee Name</label>

            <AsyncFormikSelect
              selectedValue={values?.employeeName}
              isSearchIcon={true}
              handleChange={(valueOption) => {
                setFieldValue("employee", valueOption);
                if (!valueOption) {
                  setEmployeeInfo("");
                  setScheduleMeal([]);
                  setConsumeMeal([]);
                }
                if (valueOption?.value) {
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
                }
              }}
              placeholder="Search (min 3 letter)"
              loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
            />
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
              <label htmlFor="">Place</label>
              <FormikSelect
                name="place"
                options={placeDDL || []}
                value={values?.place}
                onChange={(valueOption) => {
                  setFieldValue("place", valueOption);
                  if (!valueOption) {
                    setFieldValue("place", valueOption);
                  }
                  // getPeopleDeskAllLanding(
                  //   "EmployeeBasicById",
                  //   orgId,
                  //   buId,
                  //   valueOption?.value,
                  //   setEmployeeInfo,
                  //   "",
                  //   "",
                  //   ""
                  // );
                  // getPendingAndConsumeMealReport(
                  //   1,
                  //   valueOption?.value,
                  //   setScheduleMeal,
                  //   setLoading,
                  //   ""
                  // );
                  // getPendingAndConsumeMealReport(
                  //   2,
                  //   valueOption?.value,
                  //   setConsumeMeal,
                  //   setLoading,
                  //   ""
                  // );
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
              <label htmlFor="">Number Of Meal</label>
              <FormikInput
                classes="input-sm"
                value={values?.meal}
                name="meal"
                min={0}
                type="number"
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
              {/* <button className="btn button w-100 mt-3" type="submit">
                  Save
                </button> */}
              <PrimaryButton
                type="submit"
                className="btn mt-3 w-100 btn-default flex-center"
                label={"Save"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormCard;
