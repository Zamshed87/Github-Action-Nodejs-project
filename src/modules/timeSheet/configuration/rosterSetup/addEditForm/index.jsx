import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import FormikInput from "../../../../../common/FormikInput";
import Loading from "../../../../../common/loading/Loading";
import { createTimeSheetAction } from "../../../helper";
const style = {
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const validationSchema = Yup.object({
  rosterGroupName: Yup.string().required("Roster name is required"),
});

const RosterSetupCreate = ({ setIsRosterSetup, id, rosterName, getData }) => {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const saveHandler = (values, cb) => {
    let payload = {
      partType: "RosterGroup",
      employeeId: employeeId,
      autoId: +id || 0,
      value: "",
      IntCreatedBy: employeeId,
      isActive: true,
      businessUnitId: buId,
      accountId: orgId,
      holidayGroupName: "",
      year: 0,
      holidayGroupId: 0,
      holidayName: "",
      fromDate: null,
      toDate: null,
      totalDays: 0,
      calenderCode: "",
      calendarName: "",
      startTime: "00:00:00",
      extendedStartTime: "00:00:00",
      lastStartTime: "00:00:00",
      endTime: "00:00:00",
      minWorkHour: 0,
      isConfirm: true,
      exceptionOffdayName: "",
      isAlternativeDay: true,
      exceptionOffdayGroupId: 0,
      weekOfMonth: "",
      weekOfMonthId: 0,
      daysOfWeek: "",
      daysOfWeekId: 0,
      remarks: "",
      rosterGroupName: values?.rosterGroupName,
      workplaceId: 0,
      workplaceGroupId: 0,
      overtimeDate: "2022-05-08T09:13:19.700Z",
      overtimeHour: 0,
      reason: "",
      breakStartTime: "",
      breakEndTime: "",
      timeSheetRosterJsons: [],
    };

    createTimeSheetAction(payload, setLoading, cb);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          rosterGroupName: rosterName || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, (autoId, autoName) => {
            resetForm({ rosterGroupName: "" });
            setIsRosterSetup(false);
            // getData && getData();
            history.push(
              `/administration/timeManagement/rosterSetup/${autoId}/${autoName}`
            );
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
            <Box sx={style} className="rosterSetupModal">
              <Form onSubmit={handleSubmit}>
                {loading && <Loading />}
                <div className="modalBody" style={{padding:"0px 12px"}}>
                  <div>
                    <label>Roster Name </label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.rosterGroupName}
                      name="rosterGroupName"
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => {
                        setFieldValue("rosterGroupName", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="modal-footer form-modal-footer">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    style={{
                      marginRight: "15px",
                    }}
                    onClick={() => setIsRosterSetup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    style={{ height: "30px", width:"150px" }}
                    className="btn btn-green"
                    type="submit"
                  >
                    Save & Continue
                  </button>
                </div>
              </Form>
            </Box>
          </>
        )}
      </Formik>
    </>
  );
};

export default RosterSetupCreate;
