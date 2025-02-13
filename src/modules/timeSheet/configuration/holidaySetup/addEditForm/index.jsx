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
import { useApiRequest } from "Hooks";
import { getWorkplaceDDL } from "common/api/commonApi";

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
  workplace: "",
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
const validationSchemaExtend = Yup.object({
  workplace: Yup.object()
    .shape({
      label: Yup.string().required("Workplace is required"),
      value: Yup.string().required("Workplace is required"),
    })
    .typeError("Workplace is required"),
});
const HolidayGroupModal = ({
  id,
  setLoading,
  onHide,
  setRowDto,
  setAllData,
  singleData,
  setSingleData,
  row,
}) => {
  const yearDDL = yearDDLAction(2, 10);
  const [modifySingleData, setModifySingleData] = useState("");
  const history = useHistory();
  const workplaceDDL = useApiRequest();
  const { orgId, buId, employeeId, wId, wgId } = useSelector(
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
        setSingleData,
        null,
        null,
        null,
        null,
        null,
        wId
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
      partType: row?.HolidayGroupId ? "HolidayGroupExtend" : "HolidayGroup",
      employeeId: employeeId,
      autoId: id ? +id : 0,
      value: "",
      IntCreatedBy: employeeId,
      isActive: true,
      businessUnitId: buId,
      accountId: orgId,
      holidayGroupName: row?.HolidayGroupId
        ? row?.HolidayGroupName
        : values?.holidayGroup,
      year: row?.HolidayGroupId ? row?.Year : +values?.year?.value || 0,
      holidayGroupId: row?.HolidayGroupId ? row?.HolidayGroupId : 0,
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
      workplaceId: row?.HolidayGroupId ? values?.workplace?.value : wId,
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
          setAllData,
          null,
          null,
          null,
          null,
          wId
        );
        getPeopleDeskAllLanding(
          "HolidayGroupById",
          orgId,
          buId,
          id,
          setSingleData,
          null,
          null,
          null,
          null,
          null,
          wId
        );
      };
      createTimeSheetAction(payload, setLoading, callback);
    } else {
      const callback = (id) => {
        !row?.HolidayGroupId &&
          history.push({
            pathname: `/administration/timeManagement/holidaySetup/${id}`,
            // state: row?.HolidayGroupId ? { ...row, isExtend: true } : "",
          });
        cb();
        onHide();
        getPeopleDeskAllLanding(
          "HolidayGroup",
          orgId,
          buId,
          "",
          setRowDto,
          setAllData,
          null,
          null,
          null,
          wgId,
          wId
        );
      };
      createTimeSheetAction(payload, setLoading, callback);
    }
  };
  useEffect(() => {
    getWorkplaceDDL({ workplaceDDL, orgId, buId, wgId });
  }, [row?.HolidayGroupId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={
          row?.HolidayGroupId ? validationSchemaExtend : validationSchema
        }
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
                  {!row?.HolidayGroupId ? (
                    <>
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
                    </>
                  ) : (
                    <div>
                      <label>Workplace </label>
                      <FormikSelect
                        name="workplace"
                        options={workplaceDDL?.data || []}
                        value={values?.workplace}
                        onChange={(valueOption) => {
                          setFieldValue("workplace", valueOption);
                        }}
                        placeholder=""
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                        menuPosition="fixed"
                      />
                    </div>
                  )}
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
