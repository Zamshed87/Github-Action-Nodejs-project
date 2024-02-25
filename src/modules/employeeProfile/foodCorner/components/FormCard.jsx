import React from "react";
import { shallowEqual } from "react-redux";
import { useSelector } from "react-redux";
import FormikInput from "../../../../common/FormikInput";
import FormikRadio from "../../../../common/FormikRadio";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import PrimaryButton from "../../../../common/PrimaryButton";
import { greenColor } from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/selectCustomStyle";

const FormCard = ({ propsObj }) => {
  const { values, setFieldValue, errors, touched, loading, placeDDL } =
    propsObj;
  const { strDesignation, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  return (
    <>
      {loading && <Loading />}
      <div className="card-style mt-3" style={{ padding: "3px 0px 10px" }}>
        <div className="card-body p-0">
          <div className="row m-0">
            {/* <div className="col-lg-12">
              <div className="input-feild-maint">
                <label htmlFor="" className="pr-2">Select Type</label>
                <FormikRadio
                  name="radioType"
                  label="Private"
                  value={"private"}
                  color={blueColor}
                  onChange={(e) => {
                    setFieldValue("radioType", e.target.value);
                  }}
                  checked={values?.radioType === "private"}
                />
              </div>
            </div> */}
            <div className="col-lg-6">
              <div className="input-field-main">
                <label htmlFor="">Employee Name</label>
                <FormikInput
                  classes="input-sm"
                  value={values?.employeeName}
                  name="employeeName"
                  type="text"
                  className="form-control"
                  placeholder=""
                  errors={errors}
                  touched={touched}
                  onChange={(e) => {
                    setFieldValue("employeeName", e.target.value);
                  }}
                  disabled={values?.employeeName}
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
              <p>
                <strong>Designation: </strong>
                {strDesignation} <strong>Unit: </strong> {buName}
              </p>
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
            {/* meal is not required instructed from ikbal vai */}
            {/* <div className="col-lg-6">
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
            </div> */}
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
      </div>
    </>
  );
};

export default FormCard;
