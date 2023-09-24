import React from "react";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { AttachmentOutlined, FileUpload } from "@mui/icons-material";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Loading from "../../loading/Loading";
import { useRef } from "react";
import FormikSelect from "../../FormikSelect";
import FormikInput from "../../FormikInput";
import {
  calculateNextDate,
  getDateOfYear,
} from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { attachment_action } from "../../api";

const lastDate = getDateOfYear("last");
const firstDate = getDateOfYear("first");

const LeaveApplicationForm = ({ propsObj }) => {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [startYear, setStartYear] = useState(null);
  const [next3daysForEmp, setNext3daysForEmp] = useState(null);
  let dispatch = useDispatch();

  const {
    values,
    errors,
    touched,
    setFieldValue,
    imageFile,
    setImageFile,
    isEdit,
    setIsEdit,
    setSingleData,
    resetForm,
    initData,
    leaveTypeDDL,
    setLoading,
    loading,
    editPermission = false,
  } = propsObj;

  // image
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  React.useEffect(() => {
    if (values?.fromDate !== values?.toDate) {
      setFieldValue("isHalfDay", "");
    }
    // eslint-disable-next-line
  }, [values?.fromDate, values?.toDate]);
  return (
    <>
      {loading && <Loading />}
      <div className="card-style">
        <div className="row">
          <div className="col-lg-4">
            <label> Leave Type</label>
            <FormikSelect
              name="leaveType"
              options={
                [
                  ...leaveTypeDDL,
                  // {
                  //   label: "Special Leave",
                  //   value: 8,
                  // },
                ] || []
              }
              value={values?.leaveType}
              onChange={(valueOption) => {
                setFieldValue("leaveType", valueOption);
              }}
              placeholder=""
              styles={customStyles}
              errors={errors}
              touched={touched}
              isDisabled={false}
            />
          </div>
          <div className="col-lg-4">
            <div className="input-field-main">
              <label>From Date</label>
              <FormikInput
                classes="input-sm"
                value={values?.fromDate}
                placeholder=""
                name="fromDate"
                type="date"
                className="form-control"
                max={lastDate}
                // min={firstDate}
                onChange={(e) => {
                  setFieldValue("toDate", "");
                  setFieldValue("fromDate", e.target.value);
                  setNext3daysForEmp(calculateNextDate(e?.target?.value, 2));
                  const x = e.target.value.split("-")[0];
                  setStartYear(getDateOfYear("last", x));
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="input-field-main">
              <label>To Date</label>
              <FormikInput
                classes="input-sm"
                value={values?.toDate}
                placeholder=""
                name="toDate"
                type="date"
                min={values?.fromDate ? values?.fromDate : firstDate}
                max={
                  startYear
                    ? !editPermission &&
                      values?.leaveType?.LeaveType === "Casual Leave"
                      ? next3daysForEmp
                      : startYear
                    : lastDate
                }
                className="form-control"
                onChange={(e) => {
                  setFieldValue("toDate", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        </div>
        {values?.fromDate === values?.toDate &&
        values?.leaveType?.label === "Casual Leave" ? (
          <div className="row">
            <div className="col-lg-6">
              <label> Leave Length</label>
              <FormikSelect
                name="isHalfDay"
                options={[
                  { value: 0, label: "Full Day" },
                  { value: 1, label: "Half Day" },
                ]}
                value={values?.isHalfDay}
                onChange={(valueOption) => {
                  setFieldValue("isHalfDay", valueOption);
                }}
                placeholder=""
                styles={customStyles}
                errors={errors}
                touched={touched}
                isDisabled={false}
                isClearable={false}
              />
            </div>
            {values?.isHalfDay.value === 1 ? (
              <div className="col-lg-6">
                <label> Half Day Time</label>
                <FormikSelect
                  name="halfTime"
                  options={[
                    { value: 0, label: "8:30 AM – 12:30 PM" },
                    { value: 1, label: "1:30 PM- 5:30 PM" },
                  ]}
                  value={values?.halfTime}
                  onChange={(valueOption) => {
                    setFieldValue("halfTime", valueOption);
                  }}
                  placeholder=""
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                  isDisabled={false}
                  isClearable={false}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <div className="row">
          <div className="col-lg-4">
            <div className="input-field-main mt-3">
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
          <div className="col-lg-8">
            <div className="input-field-main mt-3">
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
        </div>
        <div
          onClick={onButtonClick}
          className="d-inline-block mt-2 pointer uplaod-para"
        >
          <input
            onChange={(e) => {
              if (e.target.files?.[0]) {
                attachment_action(
                  orgId,
                  "LeaveAndMovement",
                  15,
                  buId,
                  employeeId,
                  e.target.files,
                  setLoading
                )
                  .then((data) => {
                    setImageFile(data?.[0]);
                  })
                  .catch((error) => {
                    setImageFile("");
                  });
              }
            }}
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: "none" }}
          />
          <div style={{ fontSize: "14px" }}>
            <FileUpload sx={{ marginRight: "5px", fontSize: "18px" }} /> Click
            to upload
          </div>
        </div>
        {imageFile?.globalFileUrlId ? (
          <div
            className="d-flex align-items-center"
            onClick={() => {
              dispatch(getDownlloadFileView_Action(imageFile?.globalFileUrlId));
            }}
          >
            <AttachmentOutlined sx={{ marginRight: "5px", color: "#0072E5" }} />
            <div
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#0072E5",
                cursor: "pointer",
              }}
            >
              Attachment
            </div>
          </div>
        ) : (
          ""
        )}

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
                setImageFile("");
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
};

export default LeaveApplicationForm;
