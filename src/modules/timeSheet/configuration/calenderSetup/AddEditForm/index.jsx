/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { getPeopleDeskAllLanding } from "../../../../../common/api";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikInput from "../../../../../common/FormikInput";
import { greenColor } from "../../../../../utility/customColor";
import { createTimeSheetAction } from "../../../helper";
import { onCreateCalendarSetupWithValidation } from "./helper";
const style = {
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const initData = {
  calendarName: "",
  startTime: "",
  endTime: "",
  minWork: "",
  lastStartTime: "",
  allowedStartTime: "",
  breakStartTime: "",
  breakEndTime: "",
  officeStartTime: "",
  officeCloseTime: "",
  nightShift: false,
};

const validationSchema = Yup.object({
  calendarName: Yup.string().required("Calendar Name is required"),
  startTime: Yup.string().required("Start Time is required"),
  endTime: Yup.string().required("End Time is required"),
  minWork: Yup.number()
    .min(0, "Min Working is invalid")
    .required("Min Working is required"),
  lastStartTime: Yup.string().required("Last Start Time is required"),
  allowedStartTime: Yup.string().required("Allowed Start Time is required"),
  officeStartTime: Yup.string().required("Office Open Time is required"),
  officeCloseTime: Yup.string().required("Office Close Time is required"),
});

const CalendarSetupModal = ({
  onHide,
  singleData,
  setSingleData,
  setRowDto,
  id,
  setAllData,
}) => {
  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const [modifySingleData, setModifySingleData] = useState("");

  useEffect(() => {
    if (id) {
      getPeopleDeskAllLanding(
        "CalenderById",
        orgId,
        buId,
        id,
        setSingleData,
        null,
        setLoading,
        null,
        null,
        wgId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (singleData) {
      const newRowData = {
        calendarName: singleData[0]?.CalenderName,
        startTime: singleData[0]?.StartTime,
        endTime: singleData[0]?.EndTime,
        minWork: singleData[0]?.MinWorkHour,
        lastStartTime: singleData[0]?.LastStartTime,
        allowedStartTime: singleData[0]?.ExtendedStartTime,
        breakStartTime: singleData[0]?.BreakStartTime || "",
        breakEndTime: singleData[0]?.BreakEndTime || "",
        officeStartTime: singleData[0]?.OfficeStartTime || "",
        officeCloseTime: singleData[0]?.OfficeCloseTime || "",
        nightShift: singleData[0]?.isNightShift || "",
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = (values, cb) => {
    onCreateCalendarSetupWithValidation(
      values,
      employeeId,
      orgId,
      buId,
      id,
      cb,
      onHide,
      getPeopleDeskAllLanding,
      setRowDto,
      setAllData,
      createTimeSheetAction,
      setLoading,
      wgId
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (id) {
              resetForm(modifySingleData);
            } else {
              resetForm(initData);
            }
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
            <Box sx={style} className="calenderSetupModal">
              <Form>
                <div className="modalBody p-0">
                  <div className="row mx-0">
                    <div className="col-6">
                      <label>Calendar Name </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.calendarName}
                        onChange={(e) =>
                          setFieldValue("calendarName", e.target.value)
                        }
                        name="calendarName"
                        type="text"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Minimum Working Hour </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.minWork}
                        onChange={(e) =>
                          setFieldValue("minWork", e.target.value)
                        }
                        name="minWork"
                        type="number"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Office Opening Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.officeStartTime}
                        onChange={(e) => {
                          setFieldValue("officeStartTime", e.target.value);
                        }}
                        name="officeStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Start Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.startTime}
                        onChange={(e) => {
                          setFieldValue("startTime", e.target.value);
                          // if (singleData?.length > 0) {
                          //   let duration = parseInt(format_ms(moment.duration(values?.endTime) - moment.duration(values?.startTime)))
                          //   if (duration > 12) {
                          //     setFieldValue('minWork', duration - 12)

                          //   } else {
                          //     setFieldValue('minWork', duration)

                          //   }
                          // }
                        }}
                        name="startTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Extended Start Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.allowedStartTime}
                        onChange={(e) => {
                          setFieldValue("allowedStartTime", e.target.value);
                        }}
                        name="allowedStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Last Start Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.lastStartTime}
                        onChange={(e) =>
                          setFieldValue("lastStartTime", e.target.value)
                        }
                        name="lastStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Break Start Time</label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.breakStartTime}
                        onChange={(e) =>
                          setFieldValue("breakStartTime", e.target.value)
                        }
                        name="breakStartTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Break End Time</label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.breakEndTime}
                        onChange={(e) =>
                          setFieldValue("breakEndTime", e.target.value)
                        }
                        name="breakEndTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>End Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.endTime}
                        onChange={(e) => {
                          setFieldValue("endTime", e.target.value);
                          // if (singleData?.length > 0) {
                          //   let duration = parseInt(format_ms(moment.duration(values?.endTime) - moment.duration(values?.startTime)))
                          //   if (duration > 12) {
                          //     setFieldValue('minWork', duration - 12)

                          //   } else {
                          //     setFieldValue('minWork', duration)

                          //   }
                          // }
                        }}
                        name="endTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Office Closing Time </label>
                      <FormikInput
                        classes="input-sm"
                        value={values?.officeCloseTime}
                        onChange={(e) => {
                          setFieldValue("officeCloseTime", e.target.value);
                        }}
                        name="officeCloseTime"
                        type="time"
                        className="form-control"
                        placeholder=""
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6"></div>
                    <div className="col-6">
                      <FormikCheckBox
                        name="nightShift"
                        styleObj={{
                          color: greenColor,
                        }}
                        label="Is Night Shift"
                        checked={values?.nightShift}
                        onChange={(e) => {
                          setFieldValue("nightShift", e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer form-modal-footer">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => onHide()}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-green"
                    style={{ width: "auto" }}
                    onSubmit={() => handleSubmit()}
                    type="submit"
                  >
                    Save
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

export default CalendarSetupModal;
