/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import Loading from "../../../common/loading/Loading";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import { customStylesSmall } from "../../../utility/selectCustomStyle";
import FormikSelect from "../../../common/FormikSelect";
import { dateFormatterForDashboard } from "../../../utility/dateFormatter";
import { Today, Star, DynamicForm, Pageview } from "@mui/icons-material";
import "./style.css";

const month = moment().format("MMMM");

const initData = {
  search: "",
  months: {
    value: moment().month() + 1,
    label: month,
  },
};

const monthDDL = [
  {
    value: 1,
    label: "January",
  },
  {
    value: 2,
    label: "February",
  },
  {
    value: 3,
    label: "March",
  },
  {
    value: 4,
    label: "April",
  },
  {
    value: 5,
    label: "May",
  },
  {
    value: 6,
    label: "June",
  },
  {
    value: 7,
    label: "July",
  },
  {
    value: 8,
    label: "August",
  },
  {
    value: 9,
    label: "September",
  },
  {
    value: 10,
    label: "October",
  },
  {
    value: 11,
    label: "November",
  },
  {
    value: 12,
    label: "December",
  },
];

const demoData = [
  {
    taskTitle: "Structural Design",
    startDate: 3,
    startMonth: "April",
    startYear: 2022,
    endDate: 6,
    endMonth: "April",
    endYear: 2022,
    totalDay: 4,
    color: "#34C759",
  },
  {
    taskTitle: "Business Requirement",
    startDate: 4,
    startMonth: "April",
    startYear: 2022,
    endDate: 8,
    endMonth: "April",
    endYear: 2022,
    totalDay: 5,
    color: "#FF9500",
  },
  {
    taskTitle: "Design Database",
    startDate: 2,
    startMonth: "April",
    startYear: 2022,
    endDate: 10,
    endMonth: "April",
    endYear: 2022,
    totalDay: 9,
    color: "#00C7BE",
  },
  {
    taskTitle: "User Journey Map",
    startDate: 4,
    startMonth: "April",
    startYear: 2022,
    endDate: 15,
    endMonth: "April",
    endYear: 2022,
    totalDay: 12,
    color: "#AF52DE",
  },
];

export default function TMDashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Task Management"));
  }, []);

  const day = moment().daysInMonth();

  const blankDay = (d, status) => {
    let dArray = [];
    const restDay = day - d;
    for (let i = 1; i <= (status === "f" ? d - 1 : restDay); i++) {
      dArray.push(i);
    }
    return dArray;
  };

  const allDay = (d) => {
    let dArray = [];
    for (let i = 1; i <= d; i++) {
      dArray.push(i);
    }
    return dArray;
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData} onSubmit={(values, { setSubmitting, resetForm }) => {}}>
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {false && <Loading />}
              <div className="table-card timeline-wrapper">
                <div className="table-card-heading d-flex flex-wrap pr-0 mb-3">
                  <div className="greetings">
                    <div className="d-flex align-items-center employeeName">
                      <p>Md. Imran Uddin</p>
                    </div>
                    <p className="welcome">User Experience (UX) Designer Executive</p>
                  </div>
                  <div className="table-card-head-right current-situation d-flex flex-wrap">
                    {/* date & time */}
                    <div className="d-flex align-items-center" style={{ marginRight: "5px" }}>
                      <Today sx={{ color: "#34A853" }} />
                      <p className="date">{dateFormatterForDashboard()}</p>
                    </div>
                  </div>
                </div>
                <div className="card card-shadow top-header-card mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-3 col-md-6  header-item">
                        <div className="d-flex align-items-center">
                          <div
                            className="icon-shadow mr-3 d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: "#E4F8DD",
                              borderRadius: "100px",
                              height: "50px",
                              width: "50px",
                            }}
                          >
                            <Star
                              sx={{
                                color: "#34A853",
                                height: "20px",
                                width: "20px",
                              }}
                            />
                          </div>
                          <div>
                            <p className="subTitle">Open</p>
                            <p className="title">70</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6  header-item">
                        <div className="d-flex align-items-center">
                          <div
                            className="icon-shadow mr-3 d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: "#E4F7FF",
                              borderRadius: "100px",
                              height: "50px",
                              width: "50px",
                            }}
                          >
                            <DynamicForm
                              sx={{
                                color: "#1084F1",
                                height: "20px",
                                width: "20px",
                              }}
                            />
                          </div>
                          <div>
                            <p className="subTitle">Inprogress</p>
                            <p className="title">34</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6  header-item">
                        <div className="d-flex align-items-center">
                          <div
                            className="icon-shadow mr-3 d-flex align-items-center justify-content-center"
                            style={{
                              backgroundColor: "#F8E8FF",
                              borderRadius: "100px",
                              height: "50px",
                              width: "50px",
                            }}
                          >
                            <Pageview
                              sx={{
                                color: "#9514D1",
                                height: "20px",
                                width: "20px",
                              }}
                            />
                          </div>
                          <div>
                            <p className="subTitle">Review</p>
                            <p className="title">65</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card card-shadow">
                  <div className="card-body" style={{ padding: "0.5rem 0 0.75rem 0", margin: "0px 15px" }}>
                    <div className="table-card-heading pr-0">
                      <p className="cardTitle">Project Timeline</p>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <div className="input-field-main">
                            <FormikSelect
                              classes="input-sm"
                              name="months"
                              options={monthDDL || []}
                              value={values?.months}
                              // label="Field Type"
                              onChange={(valueOption) => {
                                setFieldValue("months", valueOption);
                              }}
                              placeholder=""
                              styles={customStylesSmall}
                              errors={errors}
                              touched={touched}
                              isDisabled={false}
                              menuPosition="fixed"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="table-card-body">
                      <div className="horizontalScrollIndicator">
                        {/* thead */}
                        <div className="flexDirection">
                          <p style={{ width: "254px" }}></p>
                          {allDay(day).map((item, index) => (
                            <p key={index} className="allDay">
                              {item}
                            </p>
                          ))}
                        </div>
                        {/* td */}
                        {demoData.map((item, index) => (
                          <>
                            <div className="flexDirection" key={index} style={{ borderTop: "none" }}>
                              <div style={{ width: "250px", padding: "10px 5px" }}>
                                <p className="cmnTxtTitle">{item?.taskTitle}</p>
                                <p className="cmnTxt">{`${item?.startMonth} ${item?.startDate}, ${item?.startYear} - ${item?.endMonth} ${item?.endDate}, ${item?.endYear}`}</p>
                              </div>
                              {blankDay(item?.startDate, "f")?.map((item, index) => (
                                <p key={index} className="blankDay" />
                              ))}
                              <div style={{ width: `${item?.totalDay * 50}px`, backgroundColor: `${item?.color}`, height: "22px" }} className="taskStyle"></div>
                              {blankDay(item?.endDate, "b")?.map((item, i) => (
                                <p key={i} className="blankDay"></p>
                              ))}
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
