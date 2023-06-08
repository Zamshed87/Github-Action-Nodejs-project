import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import * as Yup from "yup";
import { getPeopleDeskAllLanding } from "../../../../../common/api";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikInput from "../../../../../common/FormikInput";
import { greenColor } from "../../../../../utility/customColor";
import { todayDate } from "./../../../../../utility/todayDate";
import { createTimeSheetAction } from "./../../../helper";

const style = {
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const initData = {
  exceptionOffdayName: "",
  isAlternativeDay: false,
};

const validationSchema = Yup.object({
  exceptionOffdayName: Yup.string().required(
    "Exception offday name is required"
  ),
});

const CreateExecptionOffday = ({
  // setIsExecptionOffday,
  id,
  setLoading,
  onHide,
  setRowDto,
  setAllData,
  singleData,
  setSingleData,
}) => {
  const history = useHistory();
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [modifySingleData, setModifySingleData] = useState("");

  useEffect(() => {
    getPeopleDeskAllLanding(
      "ExceptionOffdayGroupById",
      orgId,
      buId,
      id,
      setSingleData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (singleData) {
      const newRowData = {
        exceptionOffdayName: singleData[0]?.ExceptionOffdayName,
        isAlternativeDay: singleData[0]?.isAlternativeDay,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = (values, cb) => {
    const payload = {
      partType: "ExceptionOffdayGroup",
      employeeId: employeeId,
      autoId: id ? +id : 0,
      value: "",
      IntCreatedBy: employeeId,
      isActive: true,
      businessUnitId: buId,
      accountId: orgId,
      holidayGroupName: "",
      year: 0,
      holidayGroupId: 0,
      holidayName: "",
      fromDate: todayDate(),
      toDate: todayDate(),
      totalDays: 0,
      calenderCode: "",
      calendarName: "",
      startTime: "00:00:00",
      extendedStartTime: "00:00:00",
      lastStartTime: "00:00:00",
      endTime: "00:00:00",
      minWorkHour: 0,
      isConfirm: true,
      exceptionOffdayName: values?.exceptionOffdayName || "",
      isAlternativeDay: values?.isAlternativeDay || false,
      exceptionOffdayGroupId: 0,
      weekOfMonth: "",
      weekOfMonthId: 0,
      daysOfWeek: "",
      daysOfWeekId: 0,
      remarks: "",
      rosterGroupName: "",
      workplaceId: 0,
      workplaceGroupId: 0,
      overtimeDate: todayDate(),
      overtimeHour: 0,
      reason: "",
      breakStartTime: "",
      breakEndTime: "",
    };
    if (id) {
      const callback = () => {
        cb();
        onHide();
        getPeopleDeskAllLanding(
          "ExceptionOffdayGroup",
          orgId,
          buId,
          "",
          setRowDto,
          setAllData
        );
        getPeopleDeskAllLanding(
          "ExceptionOffdayGroupById",
          orgId,
          buId,
          id,
          setSingleData
        );
      };
      createTimeSheetAction(payload, setLoading, callback);
    } else {
      const callback = (id) => {
        history.push({
          pathname: `/administration/timeManagement/exceptionOffDay/${id}`,
        });
        cb();
        onHide();
        getPeopleDeskAllLanding(
          "ExceptionOffdayGroup",
          orgId,
          buId,
          "",
          setRowDto,
          setAllData
        );
      };
      createTimeSheetAction(payload, setLoading, callback);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
            <Box sx={style} className="ExecptionOffdayModal">
              <Form>
                <div className="modalBody">
                  <p>* Indicates required</p>
                  <div>
                    <label>Exception Offday Name * </label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.exceptionOffdayName}
                      name="exceptionOffdayName"
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => {
                        setFieldValue("exceptionOffdayName", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-12 p-0">
                    <div className="input-field  d-flex">
                      <div className="exception-checkbox">
                        <FormikCheckBox
                          name="isAlternativeDay"
                          styleObj={{
                            color: greenColor,
                          }}
                          checked={values?.isAlternativeDay}
                          onChange={(e) => {
                            setFieldValue("isAlternativeDay", e.target.checked);
                          }}
                          label=""
                        />
                      </div>
                      <div style={{ fontSize: "14px", marginTop: "7px" }}>
                        <label>Alternative Day?</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer form-modal-footer holiday-group-btn">
                  <button
                    type="button"
                    className="modal-btn modal-btn-cancel"
                    onClick={() => onHide()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-btn modal-btn-save"
                    onSubmit={() => handleSubmit()}
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

export default CreateExecptionOffday;
