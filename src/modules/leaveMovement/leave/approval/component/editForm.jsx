import { useState } from "react";
import { useFormik } from "formik";
import { shallowEqual, useSelector } from "react-redux";

import * as Yup from "yup";
import { dateFormatterForInput, getDateOfYear } from "../../../../../utility/dateFormatter";
import useAxiosPost from "../../../../../utility/customHooks/useAxiosPost";
import Loading from "../../../../../common/loading/Loading";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import DefaultInput from "../../../../../common/DefaultInput";


export const validationSchemaForApprovedLeaveApplication = Yup.object().shape({
  fromDate: Yup.string().required("From Date is required"),
  toDate: Yup.string().required("To Date is required"),
  leaveType: Yup.object()
    .shape({
      label: Yup.string().required("Leave type is required"),
      value: Yup.string().required("Leave type is required"),
    })
    .typeError("Leave type is required"),
});

const lastDate = getDateOfYear("last");
const firstDate = getDateOfYear("first");
const LeaveApprovalEditForm = ({ objProps }) => {
  const { singleApplication, setShow, getLandingData } = objProps;
  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { values, errors, touched, handleSubmit, resetForm, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      validationSchema: validationSchemaForApprovedLeaveApplication,
      // validationSchema: {},
      initialValues: {
        leaveType: {
          value: singleApplication?.leaveApplication?.intLeaveTypeId,
          label: singleApplication?.leaveType,
        },
        fromDate: dateFormatterForInput(
          singleApplication?.leaveApplication?.dteFromDate
        ),
        toDate: dateFormatterForInput(
          singleApplication?.leaveApplication?.dteToDate
        ),
      },
      onSubmit: (values) => {
        handleSubmitEdit(values, () => {
          setShow(false);
          getLandingData();
        });
      },
    });
  const [startYear, setStartYear] = useState(null);
  const [, reqApprovedApi, loadingApprove] = useAxiosPost();

  const handleSubmitEdit = (values, cb) => {
    const aprovedEditPayload = {
      intEmployeeId: singleApplication?.leaveApplication?.intEmployeeId,
      intApplicationId:
        singleApplication?.leaveApplication?.intApplicationId || 0,
      intLeaveTypeId: singleApplication?.leaveApplication?.intLeaveTypeId,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      intActionBy: employeeId,
      strApprovalRemarks: values?.strApprovalRemarks || "",
    };
    reqApprovedApi(
      "/LeaveMovement/ApproveLeaveEdit",
      aprovedEditPayload,
      (res) => {
        cb?.();
      },
      true
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {loadingApprove && <Loading />}
      <div className="p-2">
        <div className="card-style">
          <div className="row">
            <div className="col-lg-4">
              <label> Leave Type</label>
              <FormikSelect
                name="leaveType"
                options={[]}
                value={values?.leaveType}
                onChange={(valueOption) => {
                  setFieldValue("leaveType", valueOption);
                }}
                placeholder=""
                styles={customStyles}
                errors={errors}
                touched={touched}
                isDisabled={true}
              />
            </div>
            <div className="col-lg-4">
              <div className="input-field-main">
                <label>From Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.fromDate}
                  placeholder="fromDate"
                  name="fromDate"
                  type="date"
                  max={lastDate}
                  onChange={(e) => {
                    setFieldValue("toDate", "");
                    setFieldValue("fromDate", e.target.value);
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
                <DefaultInput
                  classes="input-sm"
                  value={values?.toDate}
                  placeholder=""
                  name="toDate"
                  min={values?.fromDate ? values?.fromDate : firstDate}
                  max={startYear ? startYear : lastDate}
                  type="date"
                  onChange={(e) => {
                    setFieldValue("toDate", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="input-field-main">
                <label>Edit Reason</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.strApprovalRemarks}
                  placeholder="Edit Reason"
                  name="strApprovalRemarks"
                  type="text"
                  onChange={(e) => {
                    setFieldValue("strApprovalRemarks", e.target.value);
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
              Update
            </button>

            <button
              onClick={(e) => {
                resetForm();
              }}
              className="btn btn-green mt-3 ml-2"
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LeaveApprovalEditForm;
