import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import FormikInput from "../../../../../common/FormikInput";
import Loading from "../../../../../common/loading/Loading";
import { createTimeSheetAction } from "../../../helper";
import FormikSelect from "common/FormikSelect";
import { customStyles } from "utility/selectCustomStyle";
import { getPeopleDeskAllDDL } from "common/api";
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
  const { orgId, buId, employeeId, wgId, wgName, wName, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [organizationDDL, setOrganizationDDL] = useState([]);
  const [workPlaceDDL, setWorkPlaceDDL] = useState([]);
  const [loader, setLoader] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setOrganizationDDL
    );
  }, [buId]);

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
      workplaceId: values?.workplace?.value || 0,
      workplaceGroupId: values?.orgName?.value || 0,
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
          rosterGroupName: rosterName || "",orgName: { value: wgId, label: wgName }, workplace:{value:wId, label: wName}
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
                <div className="modalBody">
                  <div className="row">
                    {/* workPlaceGroup */}
                    <div className="col-md-6">
                      <label className="mb-2">Workplace Group </label>
                      <FormikSelect
                        // isDisabled={isEdit}
                        classes="input-sm"
                        styles={customStyles}
                        name="orgName"
                        options={organizationDDL || []}
                        value={values?.orgName}
                        onChange={(valueOption) => {
                          setLoader(true);
                          setFieldValue("orgName", valueOption);
                          setFieldValue("workplace", "");

                          getPeopleDeskAllDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption.value}&intId=${employeeId}`,
                            "intWorkplaceId",
                            "strWorkplace",
                            setWorkPlaceDDL
                          );
                          setLoader(false);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        isClearable={false}
                      />
                    </div>
                    {/* workPlace */}
                    <div className="col-md-6">
                      <label className="mb-2">Workplace </label>
                      <FormikSelect
                        // isDisabled={isEdit}
                        classes="input-sm"
                        styles={customStyles}
                        name="workplace"
                        options={
                          [
                            {
                              value: 0,
                              label: "All",
                            },
                            ...workPlaceDDL,
                          ] || []
                        }
                        value={values?.workplace || { value: -1, label: "" }}
                        onChange={(valueOption) => {
                          setFieldValue("workplace", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        isClearable={true}
                      />
                    </div>
                    <div className="col-md-6">
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
                    style={{ height: "30px", width: "150px" }}
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
