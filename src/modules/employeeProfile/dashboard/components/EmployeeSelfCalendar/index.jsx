import { North, South } from "@mui/icons-material";
import axios from "axios";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FormikInput from "../../../../../common/FormikInput";
import {
  gray200,
  gray500,
  gray600,
  gray900,
} from "../../../../../utility/customColor";
const initData = {
  monthYear: moment().format("YYYY-MM"),
};
const EmployeeSelfCalendar = ({ employeeDashboard }) => {
  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [days, setDays] = useState("");
  const [attendenceList, setAttendenceList] = useState([]);
  const [checkInOutList, setCheckInOutList] = useState([]);
  const [blankDates, setBlankDates] = useState([]);
  const [date, setDate] = useState({
    year: moment().year(),
    month: moment().month() + 1,
  });

  // if there is no data in database about attendence of employee
  useEffect(() => {
    let days = moment(`${date?.month}/01/${date?.year}`).daysInMonth();
    const demoDate = [];
    while (days) {
      demoDate.push({
        day: `${days}`,
        dayName: moment(`${date?.month}/${days}/${date?.year}`).format("dddd"),
      });
      days--;
    }
    setBlankDates(demoDate.reverse());
  }, [date]);

  // get attendence of employee self
  useEffect(() => {
    axios
      .get(
        `/Dashboard/GetAttendanceSummaryCalenderViewReport?Month=${date.month}&Year=${date.year}`
      )
      .then((response) => {
        setAttendenceList(response?.data?.attendanceDailySummaryViewModel);
        setDays({
          absentDays: response?.data?.absentDays || "0",
          lateDays: response?.data?.lateDays || "0",
          leaveDays: response?.data?.leaveDays || "0",
          movementDays: response?.data?.movementDays || "0",
          presentDays: response?.data?.presentDays || "0",
          workingDays: response?.data?.workingDays || "0",
        });
        setCheckInOutList(response?.data?.timeAttendanceDailySummaries);
      })
      .catch((error) => setAttendenceList([]));
  }, [date, employeeId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values) => {}}
    >
      {({ handleSubmit, errors, touched, setFieldValue, values }) => (
        <Form onSubmit={handleSubmit} className="h-100">
          <div className="employee-attendance-calendar-wrapper h-100">
            <div
              className="heading d-flex align-items-center justify-content-between"
              style={{
                padding: "12px",
                borderBottom: `1px solid ${gray200}`,
                height: "20%",
              }}
            >
              <div>
                <h2 style={{ color: gray500, fontSize: "1rem" }}>
                  Attendance Calendar
                </h2>
                <FormikInput
                  classes="input-sm month-picker custom-DatePicker_color"
                  value={values?.monthYear}
                  name="month"
                  type="month"
                  className="form-control"
                  onChange={(e) => {
                    setDate({
                      year: e.target.value.split("-")[0],
                      month: e.target.value.split("-")[1],
                    });
                    setFieldValue("monthYear", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="d-flex align-items-center calendar-time-block-wrapper">
                <div className="" style={{ borderColor: "#98A2B3" }}>
                  <h2>{days?.workingDays}</h2>
                  <p>Working Days</p>
                </div>
                <div style={{ borderColor: "#65D380" }}>
                  <h2>{days?.presentDays}</h2>
                  <p>Present</p>
                </div>
                <div style={{ borderColor: "#FDB022" }}>
                  <h2>{days?.lateDays}</h2>
                  <p>Late</p>
                </div>
                <div style={{ borderColor: "#D444F1" }}>
                  <h2>{days?.movementDays}</h2>
                  <p>Movement</p>
                </div>
                <div style={{ borderColor: "#9B8AFB" }}>
                  <h2>{days?.leaveDays}</h2>
                  <p>Leave</p>
                </div>
                <div style={{ borderColor: "#D92D20" }}>
                  <h2>{days?.absentDays}</h2>
                  <p>Absent</p>
                </div>
              </div>
            </div>
            <div className="row mx-0 " style={{ height: "80%" }}>
              <div
                className="col-md-8 h-100"
                style={{
                  padding: "12px",
                  borderRight: `1px solid ${gray200}`,
                }}
              >
                <div className="calendar p-0 rounded-0">
                  <div className="calendar-heading">
                    <div>
                      <p>Sunday</p>
                    </div>
                    <div>
                      <p>Monday</p>
                    </div>
                    <div>
                      <p>Tuesday</p>
                    </div>
                    <div>
                      <p>Wednesday</p>
                    </div>
                    <div>
                      <p>Thursday</p>
                    </div>
                    <div>
                      <p>Friday</p>
                    </div>
                    <div>
                      <p>Saturday</p>
                    </div>
                  </div>
                  <div className="calendar-body">
                    {attendenceList
                      ? attendenceList?.map((item, i) => (
                          <div
                            className="calendar-date-cell"
                            key={i}
                            style={{
                              gridColumn: `${
                                item?.dayName === "Monday"
                                  ? "2/3"
                                  : item?.dayName === "Tuesday"
                                  ? "3/4"
                                  : item?.dayName === "Wednesday"
                                  ? "4/5"
                                  : item?.dayName === "Thursday"
                                  ? "5/6"
                                  : item?.dayName === "Friday"
                                  ? "6/7"
                                  : item?.dayName === "Saturday"
                                  ? "7/8"
                                  : "1/2"
                              }`,
                            }}
                          >
                            <p>{item?.dayNumber}</p>
                            <span style={getChipStyle(item?.presentStatus)}>
                              {item?.presentStatus || " "}
                            </span>
                          </div>
                        ))
                      : blankDates?.map((item, i) => (
                          <div
                            className="calendar-date-cell"
                            key={i}
                            style={{
                              gridColumn: `${
                                item?.dayName === "Monday"
                                  ? "2/3"
                                  : item?.dayName === "Tuesday"
                                  ? "3/4"
                                  : item?.dayName === "Wednesday"
                                  ? "4/5"
                                  : item?.dayName === "Thursday"
                                  ? "5/6"
                                  : item?.dayName === "Friday"
                                  ? "6/7"
                                  : item?.dayName === "Saturday"
                                  ? "7/8"
                                  : "1/2"
                              }`,
                            }}
                          >
                            {item?.day}
                          </div>
                        ))}
                  </div>
                </div>
              </div>
              <div
                className="col-md-4 checkInOutWrapper"
                style={{ padding: "12px" }}
              >
                <div
                  className="h-100 p-0"
                  style={{ overflowX: "hidden", overflowY: "auto" }}
                >
                  {checkInOutList?.length > 0
                    ? checkInOutList?.map((item, i) => (
                        <div
                          className="checkout-info-wrapper"
                          style={{ padding: "6px" }}
                          key={i}
                        >
                          <div className="d-flex align-items-center">
                            <p
                              style={{ color: gray600, margin: "0 16px 0 6px" }}
                            >
                              {moment(
                                item?.dteAttendanceDate,
                                "YYYY-MM-DDThh:mm:ss"
                              ).format("DD MMM, YYYY")}
                            </p>
                            <p
                              style={{
                                color: gray900,
                                padding: "1px 6px",
                                borderRadius: "13px",
                                backgroundColor: "#EAECF0",
                              }}
                            >
                              {item?.strWorkingHours}
                            </p>
                          </div>
                          <div className="d-flex mt-3">
                            <div
                              className="d-flex"
                              style={{ marginRight: "12px" }}
                            >
                              <div style={{ marginRight: "6px" }}>
                                <North />
                              </div>
                              <div>
                                <p
                                  style={{
                                    color: "#0BA5EC",
                                    fontWeight: 400,
                                  }}
                                >
                                  Check In
                                </p>
                                <p
                                  style={{
                                    color: "#5A687E",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.tmeInTime &&
                                    moment(item?.tmeInTime, "hh:mm:ss").format(
                                      "hh:mm A"
                                    )}
                                </p>
                              </div>
                            </div>
                            <div className="d-flex">
                              <div style={{ marginRight: "6px" }}>
                                <South />
                              </div>
                              <div>
                                <p
                                  style={{
                                    color: "#F79009",
                                    fontWeight: 400,
                                  }}
                                >
                                  Check Out
                                </p>
                                <p
                                  style={{
                                    color: "#5A687E",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.tmeLastOutTime &&
                                    moment(
                                      item?.tmeLastOutTime,
                                      "hh:mm:ss"
                                    ).format("hh:mm A")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : blankCheckInOutDates(values?.monthYear).map((item, i) => (
                        <div
                          className="checkout-info-wrapper"
                          style={{ padding: "6px" }}
                          key={i}
                        >
                          <div className="d-flex align-items-center">
                            <p
                              style={{ color: gray600, margin: "0 16px 0 6px" }}
                            >
                              {item}
                            </p>
                          </div>
                          <div className="d-flex mt-3">
                            <div
                              className="d-flex"
                              style={{ marginRight: "12px" }}
                            >
                              <div style={{ marginRight: "6px" }}>
                                <North />
                              </div>
                              <div>
                                <p
                                  style={{
                                    color: "#0BA5EC",
                                    fontWeight: 400,
                                  }}
                                >
                                  Check In
                                </p>
                              </div>
                            </div>
                            <div className="d-flex">
                              <div style={{ marginRight: "6px" }}>
                                <South />
                              </div>
                              <div>
                                <p
                                  style={{
                                    color: "#F79009",
                                    fontWeight: 400,
                                  }}
                                >
                                  Check Out
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmployeeSelfCalendar;

export const getChipStyle = (status) => ({
  color:
    status === "Leave"
      ? "#6927DA"
      : status === "Absent"
      ? "#B42318"
      : status === "Present"
      ? "#299647"
      : status === "Late"
      ? " #B54708"
      : status === "Holiday"
      ? "#3538CD"
      : "#667085",
  backgroundColor:
    status === "Leave"
      ? "#ECE9FE"
      : status === "Absent"
      ? "#FEE4E2"
      : status === "Present"
      ? "#E6F9E9"
      : status === "Late"
      ? "#FEF0C7"
      : status === "Holiday"
      ? "#E0EAFF"
      : "#F2F4F7",
  borderRadius: "99px",
  fontSize: "12px",
  padding: "2px 5px",
  fontWeight: 500,
});

const blankCheckInOutDates = (date) => {
  let dateList = [];
  let monthYear = moment(date, "YYYY-MM").format("MMM, YYYY");
  let days = moment(
    moment(date, "YYYY-MM").format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  ).daysInMonth();
  while (days) {
    dateList.push(`${days} ${monthYear}`);
    days--;
  }
  return dateList.reverse();
};
