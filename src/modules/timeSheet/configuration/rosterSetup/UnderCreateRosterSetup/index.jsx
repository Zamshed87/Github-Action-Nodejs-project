/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import {
  getPeopleDeskAllDDL,
  getPeopleDeskAllLanding,
} from "../../../../../common/api";
import BackButton from "../../../../../common/BackButton";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import Loading from "../../../../../common/loading/Loading";
import PrimaryButton from "../../../../../common/PrimaryButton";
import SortingIcon from "../../../../../common/SortingIcon";
import ViewModal from "../../../../../common/ViewModal";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { createTimeSheetAction } from "../../../helper";
import RosterSetupCreate from "../addEditForm";
import * as Yup from "yup";
import "./styles.css";
import axios from "axios";
const initData = {
  calendarName: "",
  noOfChangeDays: "",
  nextCalendar: "",
};

const validationSchema = Yup.object({
  rosterGroupName: Yup.string().required("Roster name is required"),
  orgName: Yup.object({
    label: Yup.string().required("Workplace Group is required"),
    value: Yup.string().required("Workplace Group is required"),
  }),
  workplace: Yup.object({
    label: Yup.string().required("Workplace  is required"),
    value: Yup.string().required("Workplace  is required"),
  }).typeError("Workplace is required"),
});

export default function UnderCreateRosterSetup() {
  const history = useHistory();
  const params = useParams();

  const { orgId, buId, employeeId, wgId, wId, wgName, wName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [calendarDDL, setCalendarDDL] = useState([]);

  const [isRosterSetup, setIsRosterSetup] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const saveHandler = (values, cb) => {
    if (rowDto?.length < 2)
      return toast.warn("Please add atleast two calender");

    const firstRowCalId = rowDto[0]?.calendarId;
    const lastRowNextCalId = rowDto[rowDto?.length - 1]?.nextCalenderId;

    // firstRowCalId and lastRowNextCalId should be equal
    if (firstRowCalId !== lastRowNextCalId) return toast.warn("Invalid circle");

    const createRosterPayload = {
      partType: "RosterGroup",
      employeeId: employeeId,
      autoId: +params?.id || 0,
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

    axios
      .post(`/TimeSheet/TimeSheetCRUD`, createRosterPayload)
      .then((res) => {
        const temp = rowDto?.map((item) => {
          return {
            calenderName: item?.calendarName || item?.calenderName,
            rosterGroupId: res?.data?.autoId,
            calendarId: +item?.calendarId,
            noOfDaysChange: item?.noOfDaysChange,
            nextCalenderId: +item?.nextCalenderId,
            nextCalendarName: item?.nextCalendarName,
            IntCreatedBy: item?.insertByUserId || employeeId,
          };
        });
        const rosterCyclePayload = {
          partType: "Roster",
          businessUnitId: buId,
          timeSheetRosterJsons: [...temp],
        };
        res?.data?.autoId &&
          createTimeSheetAction(rosterCyclePayload, setLoading, cb);
      })
      .catch((err) =>
        toast.warn(err?.response?.data?.message || "Something went wrong")
      );

    //
  };
  const setter = (values) => {
    // rosterGroup id means edit, user must clear all row data for editing
    if (rowDto?.[0]?.rosterId) {
      return toast.warn("Please clear data , then add again");
    }
    if (values?.noOfChangeDays < 0) {
      return toast.warn("No. of change days must be positive");
    }
    const payload = {
      // =======
      calenderName: values?.calendarName?.label,
      rosterGroupId: +params?.id,
      calendarId: +values?.calendarName?.value,
      noOfDaysChange: values?.noOfChangeDays,
      nextCalenderId: +values?.nextCalendar?.value,
      nextCalendarName: values?.nextCalendar?.label,
      IntCreatedBy: employeeId,
    };

    // if (params?.id) {
    //   console.log({ params });
    //   let temp = rowDto?.map((item) => {
    //     return {
    //       calenderName: item?.calendarName || values?.calendarName?.label,
    //       rosterGroupId: item?.rosterGroupId,
    //       calendarId: +item?.calendarId,
    //       noOfDaysChange: item?.noOfDaysChange
    //         ? item?.noOfDaysChange
    //         : values?.noOfChangeDays,
    //       nextCalenderId: +item?.nextCalenderId,
    //       nextCalendarName: item?.nextCalendarName,
    //       IntCreatedBy: item?.insertByUserId
    //         ? item?.insertByUserId
    //         : employeeId,
    //     };
    //   });
    //   console.log({ temp });
    //   setRowDto([...temp, payload]);
    // } else {
    setRowDto([...rowDto, payload]);
    // }
  };

  const filterCalenderListFunc = (values) => {
    const filterCalenderList = calendarDDL?.filter(
      (item) => item?.value !== values?.calendarName?.value
    );
    return filterCalenderList;
  };

  const getData = () => {
    getPeopleDeskAllLanding(
      "RosterByRosterGroupId",
      orgId,
      buId,
      params?.id,
      null,
      setRowDto,
      null,
      null,
      null,
      wgId,
      wId
    );
  };

  useEffect(() => {
    params?.id && getData();
  }, [orgId, buId, params, wgId]);

  // useEffect(() => {
  //   if (location?.state !== wgId) {
  //     history.push(`/administration/timeManagement/rosterSetup`);
  //   }
  // }, [wgId]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Calender&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}`,
      "CalenderId",
      "CalenderName",
      setCalendarDDL
    );
  }, [orgId, buId, wgId, wId]);
  // for sorting the row
  const [calendarOrder, setCalendarOrder] = useState("desc");
  const commonSortByFilter = (filterType, property) => {
    filterType === "asc"
      ? setRowDto((prev) => [
          ...prev?.sort((a, b) => (a[property] > b[property] ? -1 : 1)),
        ])
      : setRowDto((prev) => [
          ...prev?.sort((a, b) => (b[property] > a[property] ? -1 : 1)),
        ]);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          rosterGroupName: params?.rosterName || "",
          orgName: { value: wgId, label: wgName },
          workplace: { value: wId, label: wName },
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          saveHandler(values, () => {
            // don't reset form, not use ful for the purpose
            // resetForm(initData);
            history.push(`/administration/timeManagement/rosterSetup`);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}

              <div className="UnderCreateRosterSetup row">
                {/* {permission?.isEdit ? ( */}
                <div className="col-md-12">
                  <div className="container-UnderCreateRosterSetup">
                    <div className="header-UnderCreateRosterSetup mt-5">
                      <div className="header-left">
                        <BackButton />
                        <h4>
                          {params?.id ? params?.rosterName : "Create Roster"}
                        </h4>
                      </div>
                      <div>
                        <PrimaryButton
                          type="submit"
                          className="btn btn-green btn-green-disable"
                          label="Save"
                          disabled={!values?.rosterGroupName}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: "-25px" }}>
                      <RosterSetupCreate
                        id={params?.id}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        values={values}
                      />
                    </div>
                    <div>
                      <div
                        className="card-style"
                        style={{ padding: "4px 12px 12px" }}
                      >
                        <div
                          className="d-flex align-items-start  justify-content-between"
                          style={{ marginTop: "12px" }}
                        >
                          <h4>Roster Cycle Configuration</h4>
                          {rowDto?.length > 0 && (
                            <div>
                              <PrimaryButton
                                type="button"
                                className="btn btn-green btn-green-disable"
                                label="Clear"
                                onClick={() => setRowDto([])}
                              />
                            </div>
                          )}
                        </div>
                        <div className="row">
                          <div className="col-3">
                            <div className="input-field">
                              <label htmlFor="">Calendar </label>
                              <FormikSelect
                                name="calendarName"
                                options={calendarDDL}
                                value={values?.calendarName}
                                onChange={(valueOption) => {
                                  setFieldValue("nextCalendar", "");
                                  setFieldValue("calendarName", valueOption);
                                }}
                                placeholder=" "
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                // roster id means edit, if edit, don't need to disabled this
                                isDisabled={
                                  rowDto?.[0]?.rosterId
                                    ? false
                                    : rowDto?.length > 0
                                }
                              />
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="input-field">
                              <label htmlFor="">No. of change days </label>
                              <FormikInput
                                classes="input-sm"
                                label=" "
                                value={values?.noOfChangeDays}
                                name="noOfChangeDays"
                                type="number"
                                min={0}
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "noOfChangeDays",
                                    e.target.value
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="input-field">
                              <label htmlFor="">Next Calendar</label>
                              <FormikSelect
                                name="nextCalendar"
                                options={filterCalenderListFunc(values)}
                                value={values?.nextCalendar}
                                onChange={(valueOption) => {
                                  setFieldValue("nextCalendar", valueOption);
                                }}
                                placeholder=" "
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setter(values);
                              setFieldValue(
                                "calendarName",
                                values?.nextCalendar
                              );
                              setFieldValue("nextCalendar", "");
                            }}
                            disabled={
                              !values?.noOfChangeDays ||
                              !values?.nextCalendar ||
                              !values?.calendarName ||
                              !values?.rosterGroupName
                            }
                            type="button"
                            className="btn btn-green col-3"
                            style={{ marginTop: "21px", maxWidth: "60px" }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="table-UnderCreateRosterSetup-main">
                      <div className="d-flex align-items-center"></div>

                      {rowDto?.length > 0 && (
                        <>
                          <div className="table-card-body">
                            <div className="table-card-styled tableOne">
                              <table className="table">
                                <thead style={{ color: "#212529" }}>
                                  <tr>
                                    <th>
                                      <div
                                        className="sortable"
                                        onClick={() => {
                                          setCalendarOrder((prev) =>
                                            prev === "desc" ? "asc" : "desc"
                                          );
                                          commonSortByFilter(
                                            calendarOrder,
                                            "calenderName"
                                          );
                                        }}
                                      >
                                        <span>Calendar</span>
                                        <div>
                                          <SortingIcon
                                            viewOrder={calendarOrder}
                                          ></SortingIcon>
                                        </div>
                                      </div>
                                    </th>
                                    <th className="text-center">
                                      No. of change days
                                    </th>
                                    <th>Next Calendar</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rowDto?.map((item, index) => (
                                    <tr key={index}>
                                      <td>
                                        <div className="content tableBody-title">
                                          {item?.calenderName}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="content tableBody-title text-center">
                                          {item?.noOfDaysChange}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="content tableBody-title text-start">
                                          {item?.nextCalendarName}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* ) : (
                      <NotPermittedPage />
                    )} */}
              </div>
            </Form>
          </>
        )}
      </Formik>

      <ViewModal
        show={isRosterSetup}
        title={"Edit Roster Setup"}
        onHide={() => setIsRosterSetup(false)}
        size="lg"
        backdrop="static"
        classes="default-modal form-modal"
      >
        <RosterSetupCreate
          id={params?.id}
          rosterName={params?.rosterName}
          setIsRosterSetup={setIsRosterSetup}
          // getData={getData}
        />
      </ViewModal>
    </>
  );
}
