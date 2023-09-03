import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import * as Yup from "yup";
import { getPeopleDeskAllLanding } from "../../../../../common/api";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { createTimeSheetAction } from "../../../helper";
import { todayDate } from "./../../../../../utility/todayDate";
import { yearDDLAction } from "./../../../../../utility/yearDDL";

const style = {
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const initData = {
  holidayGroup: "",
  year: "",
};

const validationSchema = Yup.object({
  holidayGroup: Yup.string().required("Holiday Group is required"),
  year: Yup.object()
    .shape({
      label: Yup.string().required("Year is required"),
      value: Yup.string().required("Year is required"),
    })
    .typeError("Year is required"),
});

const HolidayGroupModal = ({
  id,
  setLoading,
  onHide,
  setRowDto,
  setAllData,
  singleData,
  setSingleData,
}) => {
  const yearDDL = yearDDLAction(2, 10);
  const [modifySingleData, setModifySingleData] = useState("");
  const history = useHistory();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (id) {
      getPeopleDeskAllLanding(
        "HolidayGroupById",
        orgId,
        buId,
        id,
        setSingleData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (singleData) {
      const newRowData = {
        holidayGroup: singleData[0]?.HolidayGroupName,
        year: {
          value: singleData[0]?.Year,
          label: singleData[0]?.Year,
        },
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = (values, cb) => {
    const payload = {
      partType: "HolidayGroup",
      employeeId: employeeId,
      autoId: id ? +id : 0,
      value: "",
      IntCreatedBy: employeeId,
      isActive: true,
      businessUnitId: buId,
      accountId: orgId,
      holidayGroupName: values?.holidayGroup,
      year: +values?.year?.value || 0,
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
      exceptionOffdayName: "",
      isAlternativeDay: true,
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
          "HolidayGroup",
          orgId,
          buId,
          "",
          setRowDto,
          setAllData
        );
        getPeopleDeskAllLanding(
          "HolidayGroupById",
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
          pathname: `/administration/timeManagement/holidaySetup/${id}`,
        });
        cb();
        onHide();
        getPeopleDeskAllLanding(
          "HolidayGroup",
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
            <Box sx={style} className="holidayGroupModal">
              <Form>
                <div
                  className="modalBody"
                  style={{ padding: "0px 12px 0px 16px" }}
                >
                  <div>
                    <label>Holiday Group Name</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.holidayGroup}
                      name="holidayGroup"
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => {
                        setFieldValue("holidayGroup", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <label>Year </label>
                    <FormikSelect
                      name="year"
                      options={yearDDL || []}
                      value={values?.year}
                      onChange={(valueOption) => {
                        setFieldValue("year", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                      menuPosition="fixed"
                    />
                  </div>
                </div>
                <div className="modal-footer form-modal-footer holiday-group-btn">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={() => onHide()}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-green btn-green-disable"
                    style={{ width: "auto" }}
                    type="submit"
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

export default HolidayGroupModal;
