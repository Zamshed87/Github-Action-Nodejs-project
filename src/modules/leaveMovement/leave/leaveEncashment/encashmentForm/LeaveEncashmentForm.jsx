/* eslint-disable react-hooks/exhaustive-deps */
import FormikInput from "common/FormikInput";
import FormikSelect from "common/FormikSelect";
import Loading from "common/loading/Loading";
import { toast } from "react-toastify";
import { getDateOfYear } from "utility/dateFormatter";
import { customStyles } from "utility/selectCustomStyle";

const lastDate = getDateOfYear("last");
const firstDate = getDateOfYear("first");

function LeaveEncashmentForm({ propsObj }) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    isEdit,
    setIsEdit,
    setSingleData,
    resetForm,
    initData,
    loading,
    carry,
    carryHour,
    leaveTypeDDL,
  } = propsObj;

  return (
    <>
      {loading && <Loading />}
      <div className="card-style">
        <div className="row">
          <div className="col-lg-6">
            <div className="input-field-main">
              <label>Effective Date</label>
              <FormikInput
                classes="input-sm"
                value={values?.applicationDate}
                placeholder="applicationDate"
                name="applicationDate"
                type="date"
                className="form-control"
                max={lastDate}
                min={firstDate}
                onChange={(e) => {
                  setFieldValue("toDate", "");
                  setFieldValue("applicationDate", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-field-main">
              <label>Leave Type</label>
              <FormikSelect
                isClearable={false}
                menuPosition="fixed"
                name="leaveType"
                options={leaveTypeDDL || []}
                value={values?.leaveType}
                onChange={(valueOption) => {
                  setFieldValue("leaveType", valueOption);
                }}
                styles={customStyles}
                placeholder=""
              />
            </div>
          </div>

          <div className="col-lg-6 d-none">
            <div className="input-field-main">
              <label>Encashment Day</label>
              <FormikInput
                classes="input-sm"
                value={values?.days}
                placeholder=""
                name="days"
                // min={values?.applicationDate ? values?.applicationDate : firstDate}
                type="number"
                className="form-control"
                onChange={(e) => {
                  setFieldValue("days", e.target.value);
                  if (e.target.value >= 0) {
                    const inputValue = parseFloat(e.target.value);
                    setFieldValue("hour", inputValue * 8);
                    const halfCarry = carry / 2.0;
                    if (inputValue > halfCarry) {
                      setFieldValue("hour", "");

                      return toast.warn(
                        "Days cannot be more than half of the carry value",
                        {
                          toastId: "toastId",
                        }
                      );
                    } else if (inputValue === halfCarry) {
                      setFieldValue("days", e.target.value);
                    } else {
                      setFieldValue("days", e.target.value);
                    }
                  } else {
                    setFieldValue("days", "");
                  }
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-field-main">
              <label>Main Balance</label>
              <FormikInput
                classes="input-sm"
                value={values?.mainBalance}
                placeholder=""
                name="mainBalance"
                type="number"
                className="form-control"
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    setFieldValue("mainBalance", +e.target.value);
                  } else {
                    setFieldValue("mainBalance", "");
                    return toast.warn('Main Balance cannot be negative', {toastId: 'toastId'});
                  }
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="input-field-main">
              <label>Carry Balance</label>
              <FormikInput
                classes="input-sm"
                value={values?.carryBalance}
                placeholder=""
                name="carryBalance"
                type="number"
                className="form-control"
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    setFieldValue("carryBalance", +e.target.value);
                  } else {
                    setFieldValue("carryBalance", "");
                    return toast.warn('Carrty Balance cannot be negative', {toastId: 'toastId'});

                  }
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        </div>
        <div className="d-flex">
          <button
            className="btn btn-green btn-green-disable mt-3"
            type="submit"
          >
            {isEdit ? "Update" : "Apply"}
          </button>
          {isEdit && (
            <button
              onClick={(e) => {
                setIsEdit(false);
                resetForm(initData);
                setSingleData("");
              }}
              className="btn btn-green mt-3 ml-2"
              type="button"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default LeaveEncashmentForm;
