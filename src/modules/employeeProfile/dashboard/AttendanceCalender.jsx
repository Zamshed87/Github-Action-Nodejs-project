import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../common/FormikInput";
import { currentYear } from "../../timeSheet/attendence/attendanceApprovalRequest/utilities/currentYear";
import { getEmployeeAttendenceDetailsReport } from "../../timeSheet/reports/dailyAttendance/Landing/helper";
import CalenderDateBody from "./CalenderDateBody";

const validationSchema = Yup.object({});
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const   AttendanceCalenderComp = ({ employeeDashboard }) => {
  const [value, setValue] = useState(moment());
  const [allDayList, setAllDayList] = useState([]);
  const [attendanceListDate, setAttendanceListDate] = useState([]);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [totalMovement, setTotalMovement] = useState(0);
  const [totalLeave, setTotalLeave] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);

  function currMonth() {
    return value.format("MM");
  }

  function currYear() {
    return value.format("YYYY");
  }
  // Generate 1 month all day's
  useEffect(() => {
    const endDay = Number(moment(value).endOf("month").format("D"));
    let finalDayList = [...(Array(endDay) + 1)]?.map((item, index) => {
      if (index + 1 < 10) {
        return `0${index + 1}`;
      } else {
        return `${index + 1}`;
      }
    });
    setAllDayList(finalDayList);
  }, [value]);
  useEffect(() => {
    setValue(moment(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initData = {
    name: "",
    number: "",
    fromDate: "",
    toDate: "",
    email: "",
    password: "",
    dropDown: "",
    time: "",
    password2: "",
    reason: "",
    employee: "",
    year: { value: currentYear, label: currentYear },
    inputFieldType: "",
    businessUnit: "",
    fromMonth: "",
  };
  // month default
  let date = new Date();
  let initYear = date.getFullYear(); // 2022
  let initMonth = date.getMonth() + 1; // 6
  let modifyMonthResult = initMonth <= 9 ? `0${initMonth}` : `${initMonth}`;

  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (allDayList?.length > 0) {
      getEmployeeAttendenceDetailsReport(
        employeeId,
        currMonth(),
        currYear(),
        setAttendanceListDate,
        allDayList
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDayList]); // This dependancy must need for change the date and fetch next or prev month day's data
  
  useEffect(() => {
    setTotalAbsent(
      attendanceListDate.filter(
        (itm) => itm?.presentStatus.toLowerCase() === "absent"
      ).length
    );
    setTotalLeave(
      attendanceListDate.filter(
        (itm) => itm?.presentStatus.toLowerCase() === "leave"
      ).length
    );
    setTotalLate(
      attendanceListDate.filter(
        (itm) => itm?.presentStatus.toLowerCase() === "late"
      ).length
    );
    setTotalPresent(
      attendanceListDate.filter(
        (itm) => itm?.presentStatus.toLowerCase() === "present"
      ).length
    );
    setTotalMovement(
      attendanceListDate.filter(
        (itm) => itm?.presentStatus.toLowerCase() === "movement"
      ).length
    );
    setTotalWorkingDays(totalPresent.length + totalLate.length);
  }, [attendanceListDate]);
  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          fromMonth: `${initYear}-${modifyMonthResult}`,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          //   saveHandler(values, () => {
          //     resetForm(initData);
          //   });
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
          <div className="new-dashboard-body ">
            <div className="custom-card shadow-card-container">
              <div className="custom-heading">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="">
                    <label
                      htmlFor=""
                      className="new-dashboard-month-picker-label"
                      style={{ color: "#667085" }}
                    >
                      Attendance Calender
                    </label>
                    <div style={{ width: "60%" }}>
                      <FormikInput
                        classes="input-sm month-picker custom-DatePicker_color"
                        value={values?.fromMonth}
                        name="fromMonth"
                        type="month"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("fromMonth", e.target.value);
                          getEmployeeAttendenceDetailsReport(
                            employeeId,
                            +e.target.value.split("-")[1],
                            +e.target.value.split("-")[0],
                            setAttendanceListDate,
                            allDayList
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="finalAttendanceResult d-flex justify-content-between align-items-center">
                    <div className="totalWorking">
                      <span>{totalWorkingDays}</span>
                      <span>Working Day</span>
                    </div>
                    <div className="totalPresent">
                      <span>{totalPresent}</span>
                      <span>Present</span>
                    </div>
                    <div className="totalLate">
                      <span>{totalLate}</span>
                      <span>Late</span>
                    </div>
                    <div className="totalMovement">
                      <span>{totalMovement}</span>
                      <span>Movement</span>
                    </div>
                    <div className="totalLeave">
                      <span>{totalLeave}</span>
                      <span>Leave</span>
                    </div>
                    <div className="totalAbsent">
                      <span>{totalAbsent}</span>
                      <span>Absent</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="new-dashboard-calender">
                  <div className="calenderContainerGrid">
                    <div className="calenderCardBody calender-card-inner">
                      <div className="">
                        <div className="">
                          <div className="allDays allDays-name">
                            {weekdays?.map((item, index) => {
                              return (
                                <h5 key={index} className="day w-100">
                                  {item}
                                </h5>
                              );
                            })}
                          </div>
                          <CalenderDateBody
                            allDayList={allDayList}
                            value={value}
                            attendanceListDate={attendanceListDate}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="calender-card-inner">
                      <div className="h-100">
                        <div className="h-100">
                          <div className="scrollAbleCard h-100">
                            <div className="custom-card mb-2">
                              <div className="attendenceCard">
                                <div className="d-flex align-items-center">
                                  <span className="currDate">12 Sep, 2021</span>
                                  <span className="totalCurrTime">
                                    8Hrs 23 Min
                                  </span>
                                </div>
                                <div className="checkInOutDetails d-flex align-items-center">
                                  <div className="checkIn d-flex align-items-center justify-content-between">
                                    <div className="upperIcon">
                                      <ArrowUpwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-in-text">Check In</p>
                                      <p>09:00 AM</p>
                                    </div>
                                  </div>
                                  <div className="checkOut d-flex align-items-center justify-content-between">
                                    <div className="downIcon">
                                      <ArrowDownwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-out-text">
                                        Check Out
                                      </p>
                                      <p>06:20 AM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="custom-card mb-2">
                              <div className="attendenceCard">
                                <div className="d-flex align-items-center">
                                  <span className="currDate">12 Sep, 2021</span>
                                  <span className="totalCurrTime">
                                    8Hrs 23 Min
                                  </span>
                                </div>
                                <div className="checkInOutDetails d-flex align-items-center">
                                  <div className="checkIn d-flex align-items-center justify-content-between">
                                    <div className="upperIcon">
                                      <ArrowUpwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-in-text">Check In</p>
                                      <p>09:00 AM</p>
                                    </div>
                                  </div>
                                  <div className="checkOut d-flex align-items-center justify-content-between">
                                    <div className="downIcon">
                                      <ArrowDownwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-out-text">
                                        Check Out
                                      </p>
                                      <p>06:20 AM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="custom-card mb-2">
                              <div className="attendenceCard">
                                <div className="d-flex align-items-center">
                                  <span className="currDate">12 Sep, 2021</span>
                                  <span className="totalCurrTime">
                                    8Hrs 23 Min
                                  </span>
                                </div>
                                <div className="checkInOutDetails d-flex align-items-center">
                                  <div className="checkIn d-flex align-items-center justify-content-between">
                                    <div className="upperIcon">
                                      <ArrowUpwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-in-text">Check In</p>
                                      <p>09:00 AM</p>
                                    </div>
                                  </div>
                                  <div className="checkOut d-flex align-items-center justify-content-between">
                                    <div className="downIcon">
                                      <ArrowDownwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-out-text">
                                        Check Out
                                      </p>
                                      <p>06:20 AM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className=" custom-card mb-2">
                              <div className="attendenceCard">
                                <div className="d-flex align-items-center">
                                  <span className="currDate">12 Sep, 2021</span>
                                  <span className="totalCurrTime">
                                    8Hrs 23 Min
                                  </span>
                                </div>
                                <div className="checkInOutDetails d-flex align-items-center">
                                  <div className="checkIn d-flex align-items-center justify-content-between">
                                    <div className="upperIcon">
                                      <ArrowUpwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-in-text">Check In</p>
                                      <p>09:00 AM</p>
                                    </div>
                                  </div>
                                  <div className="checkOut d-flex align-items-center justify-content-between">
                                    <div className="downIcon">
                                      <ArrowDownwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-out-text">
                                        Check Out
                                      </p>
                                      <p>06:20 AM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className=" custom-card mb-2">
                              <div className="attendenceCard">
                                <div className="d-flex align-items-center">
                                  <span className="currDate">12 Sep, 2021</span>
                                  <span className="totalCurrTime">
                                    8Hrs 23 Min
                                  </span>
                                </div>
                                <div className="checkInOutDetails d-flex align-items-center">
                                  <div className="checkIn d-flex align-items-center justify-content-between">
                                    <div className="upperIcon">
                                      <ArrowUpwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-in-text">Check In</p>
                                      <p>09:00 AM</p>
                                    </div>
                                  </div>
                                  <div className="checkOut d-flex align-items-center justify-content-between">
                                    <div className="downIcon">
                                      <ArrowDownwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-out-text">
                                        Check Out
                                      </p>
                                      <p>06:20 AM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className=" custom-card mb-2">
                              <div className="attendenceCard">
                                <div className="d-flex align-items-center">
                                  <span className="currDate">12 Sep, 2021</span>
                                  <span className="totalCurrTime">
                                    8Hrs 23 Min
                                  </span>
                                </div>
                                <div className="checkInOutDetails d-flex align-items-center">
                                  <div className="checkIn d-flex align-items-center justify-content-between">
                                    <div className="upperIcon">
                                      <ArrowUpwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-in-text">Check In</p>
                                      <p>09:00 AM</p>
                                    </div>
                                  </div>
                                  <div className="checkOut d-flex align-items-center justify-content-between">
                                    <div className="downIcon">
                                      <ArrowDownwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-out-text">
                                        Check Out
                                      </p>
                                      <p>06:20 AM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="custom-card mb-2">
                              <div className="attendenceCard">
                                <div className="d-flex align-items-center">
                                  <span className="currDate">12 Sep, 2021</span>
                                  <span className="totalCurrTime">
                                    8Hrs 23 Min
                                  </span>
                                </div>
                                <div className="checkInOutDetails d-flex align-items-center">
                                  <div className="checkIn d-flex align-items-center justify-content-between">
                                    <div className="upperIcon">
                                      <ArrowUpwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-in-text">Check In</p>
                                      <p>09:00 AM</p>
                                    </div>
                                  </div>
                                  <div className="checkOut d-flex align-items-center justify-content-between">
                                    <div className="downIcon">
                                      <ArrowDownwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-out-text">
                                        Check Out
                                      </p>
                                      <p>06:20 AM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="custom-card mb-2">
                              <div className="attendenceCard">
                                <div className="d-flex align-items-center">
                                  <span className="currDate">12 Sep, 2021</span>
                                  <span className="totalCurrTime">
                                    8Hrs 23 Min
                                  </span>
                                </div>
                                <div className="checkInOutDetails d-flex align-items-center">
                                  <div className="checkIn d-flex align-items-center justify-content-between">
                                    <div className="upperIcon">
                                      <ArrowUpwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-in-text">Check In</p>
                                      <p>09:00 AM</p>
                                    </div>
                                  </div>
                                  <div className="checkOut d-flex align-items-center justify-content-between">
                                    <div className="downIcon">
                                      <ArrowDownwardIcon />
                                    </div>
                                    <div className="ml-2">
                                      <p className="check-out-text">
                                        Check Out
                                      </p>
                                      <p>06:20 AM</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default AttendanceCalenderComp;
