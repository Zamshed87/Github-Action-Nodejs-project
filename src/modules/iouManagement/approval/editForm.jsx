import { useFormik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import Loading from "common/loading/Loading";
import DefaultInput from "common/DefaultInput";
import { IOUApproveReject } from "./helper";
import { useState } from "react";

const LeaveApprovalEditForm = ({ objProps }) => {
  const { setShow, getLandingData, singleDataForReject } = objProps;
  const { employeeId, isOfficeAdmin, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleSubmit, resetForm, setFieldValue } =
    useFormik({
      enableReinitialize: true,
      initialValues: {},
      onSubmit: (values) => {
        handleSubmitEdit(values, () => {
          setShow(false);
          getLandingData();
        });
      },
    });

  const handleSubmitEdit = (values) => {
    const payload = [
      {
        applicationId: singleDataForReject?.application?.intIouid,
        approverEmployeeId: employeeId,
        isReject: true,
        accountId: orgId,
        isAdmin: isOfficeAdmin,
        strRemarks: values?.strRemarks || "",
      },
    ];
    IOUApproveReject(payload, getLandingData, setLoading);
    setShow(false)
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      <div className="p-2">
        <div className="card-style">
          <div className="row">
            <div className="col-lg-12">
              <div className="input-field-main">
                <label>Add Reason</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.strRemarks}
                  placeholder="Add Reason"
                  name="strRemarks"
                  type="text"
                  onChange={(e) => {
                    setFieldValue("strRemarks", e.target.value);
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
              Yes
            </button>

            <button
              onClick={(e) => {
                resetForm();
                setShow(false);
              }}
              className="btn btn-green mt-3 ml-2"
              type="button"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LeaveApprovalEditForm;
