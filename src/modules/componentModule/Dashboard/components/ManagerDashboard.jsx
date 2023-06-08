import React, { useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ActionMenu from "../../../../common/ActionMenu";
import GraphChart from "../../../../common/GraphChart";
import demoUserIcon from "../../../../assets/images/userIcon.svg";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { gray300 } from "../../../../utility/customColor";
import MasterFilter from "../../../../common/MasterFilter";
import { Slider } from "@mui/material";
import headIcon from "../dashboard_head.png";
const ManagerDashboard = ({ fakeCardData = [], onRemoveCardHandeler }) => {
  const [sliderValue, setSliderValue] = useState([20, 50]);
  // const { userId, orgId, buId, employeeId } = useSelector(
  //   (state) => state?.auth?.profileData,
  //   shallowEqual
  // );

  const salaryByDepartmentChart = {
    series: [
      {
        name: "Salary",
        data: [
          { x: "Engineering & Technology", y: 48 },
          { x: "HR & Admin", y: 38 },
          { x: "Sales, Service & Support", y: 38 },
          { x: "Legal", y: 27 },
          { x: "Marketing", y: 24 },
          { x: "Finance", y: 24 },
          { x: "Business Strategy", y: 17 },
          { x: "Design & Creative", y: 10 },
        ],
      },
    ],
    options: {
      tooltip: {
        followCursor: true,
        marker: {
          show: true,
        },
        position: "top",
      },

      dataLabels: {
        formatter: (val) => `${val}%`,
      },
      stroke: {
        width: 0,
        colors: ["transparent"],
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 2,
        },
      },
      fill: {
        gradient: {
          enabled: true,
          opacityFrom: 0.55,
          opacityTo: 0,
        },
      },

      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#C4C4C4",
          },
          labels: {
            formatter: function (val) {
              return val;
            },
          },
        },
      ],
    },
  };
  const salaryYearsChart = {
    series: [
      {
        data: [
          {
            x: 2021,
            y: 5,
          },
          { x: 2020, y: 15 },
          { x: 2019, y: 25 },
          { x: 2018, y: 45 },
          { x: 2017, y: 30 },
        ],
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
      },
      markers: { size: 5, colors: "#F79009" },
      stroke: {
        curve: "straight",
        colors: ["#F79009"],
      },
      colors:["#F79009"],
      fill: {
        gradient: {
          enabled: true,
          opacityFrom: 0.55,
          opacityTo: 0.54,
        },
      },
    },
  };
  const leaveTakenChart = {
    series: [
      {
        name: "Salary",
        data: [30, 40, 50, 29, 38, 23, 37, 47, 38, 45, 27, 24], //salaryData,
      },
    ],
    options: {
      colors: ["#34A853", "#34A853"],
      fill: {
        colors: ["#34A853", "#34A853"],
      },
      chart: {
        type: "bar",
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      tooltip: {
        followCursor: true,
        marker: {
          show: true,
        },
        position: "top",
      },
      legend: {
        show: false,
        position: "top",
        offsetY: 20,
        horizontalAlign: "top",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
        colors: ["transparent"],
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 2,
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ], // salaryCategories,
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#C4C4C4",
          },
          labels: {
            formatter: function (val) {
              return val;
            },
          },
          // tooltip: {
          //   custom: function ({ series, seriesIndex, w }) {
          //     return (
          //       '<div className="arrow_box">' +
          //       "<span class='tooltip_text'>" +
          //       w.globals.labels[seriesIndex] +
          //       ": " +
          //       series[seriesIndex] +
          //       "</span>" +
          //       "</div>"
          //     );
          //   },
          // },
        },
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
    },
  };
  const genderCircleChart = {
    options: {
      fill: {
        colors: ["#34A853", "#4E5BA6", "#F79009", "#F63D68"],
      },
      colors: ["#34A853", "#4E5BA6", "#F79009", "#F63D68"],
      plotOptions: {
        donut: {
          background: "red",
        },
      },
      labels: ["Full Time", "Probation", "Part time", "Intern"],
      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val + "%";
        },
      },
      legend: {
        position: "bottom",
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div className="arrow_box">' +
            "<span class='tooltip_text'>" +
            w.globals.labels[seriesIndex] +
            ": " +
            series[seriesIndex] +
            "</span>" +
            "</div>"
          );
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              // show: false,
            },
          },
        },
      ],
    },
    series: [44, 55, 41, 17],
  };
  const separationChart = {
    series: [
      {
        name: " ",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        format: "{value:.2f}",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        // categories: saparationCategories,
      },
      yaxis: [
        {
          labels: {
            formatter: function (val) {
              return val.toFixed();
            },
          },
        },
      ],
      colors: ["#0BA5EC"],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          // shadeIntensity: 0.5,
          opacityFrom: 0.5,
          opacityTo: 0.45,
          // stops: [0, 100],
        },
      },
    },
  };

  return (
    <div className="managerDashboard">
      <div className="activities-Summery-grid-Container shadow-card-container">
        {fakeCardData?.map(
          (item, idx) =>
            item?.isView && (
              <div
                key={idx}
                className="managerDashboard-Report-Card"
                style={{ borderTop: `3px solid ${item?.border}` }}
              >
                <div className="inner">
                  <div className="card-head">
                    <h4>{item?.header}</h4>
                    <span>
                      <ActionMenu
                        color={"rgba(0, 0, 0, 0.6)"}
                        fontSize={"18px"}
                        options={[
                          {
                            value: 1,
                            label: "Remove",
                            onClick: () => {
                              onRemoveCardHandeler(item?.header);
                            },
                          },
                        ]}
                      />
                    </span>
                  </div>
                  <div className="card-context">
                    {item?.header === "Today Attendence" && (
                      <>
                        <div>
                          <h4>{item?.value?.present}</h4>
                          <span>Present</span>
                        </div>
                        <div>
                          <h4>{item?.value?.late}</h4>
                          <span>Late</span>
                        </div>
                        <div>
                          <h4>{item?.value?.absent}</h4>
                          <span>Absent</span>
                        </div>
                      </>
                    )}
                    {item?.header === "Today Attendance Missed" && (
                      <>
                        <div>
                          <h4>{item?.value?.today}</h4>
                          <span>Today</span>
                        </div>
                        <div>
                          <h4>{item?.value?.yesterday}</h4>
                          <span>Yesterday</span>
                        </div>
                      </>
                    )}
                    {item?.header === "Movement" && (
                      <>
                        <div>
                          <h4>{item?.value?.today}</h4>
                          <span>Today</span>
                        </div>
                        <div>
                          <h4>{item?.value?.yesterday}</h4>
                          <span>Yesterday</span>
                        </div>
                        <div>
                          <h4>{item?.value?.tommorrow}</h4>
                          <span>Tommorrow</span>
                        </div>
                      </>
                    )}
                    {item?.header === "Leave" && (
                      <>
                        <div>
                          <h4>{item?.value?.today}</h4>
                          <span>Today</span>
                        </div>
                        <div>
                          <h4>{item?.value?.tommorrow}</h4>
                          <span>Tommorrow</span>
                        </div>
                      </>
                    )}
                    {item?.header === "Overtime" && (
                      <>
                        <div>
                          <h4>{item?.value?.today}</h4>
                          <span>Today</span>
                        </div>
                        <div>
                          <h4>{item?.value?.tommorrow}</h4>
                          <span>Tommorrow</span>
                        </div>
                      </>
                    )}
                    {item?.header === "Approval" && (
                      <>
                        <div>
                          <h4>{item?.value?.total}</h4>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <p className="viewBtn" onClick={() => {}}>
                  View Details{" "}
                  <span className="ml-2">
                    <ArrowForwardIcon
                      sx={{
                        fontSize: "16px",
                      }}
                    />
                  </span>
                </p>
              </div>
            )
        )}
      </div>
      <div className="managerDashboardChart ">
        <div
          className="employee-Status-Chart-Container shadow-card-container m-0"
          style={{ padding: "12px" }}
        >
          <div>
            <h4
              style={{
                fontWeight: 600,
                fontSize: "16px",
                color: "#667085",
              }}
            >
              Employee Status
            </h4>
            <p
              className="mt-1"
              style={{ fontWeight: 400, fontSize: "12px", lineHeight: "18px" }}
            >
              The result shows from 2021 Calender
            </p>
            <p style={{ fontWeight: 400, fontSize: "14px", marginTop: "18px" }}>
              <span style={{ fontWeight: 600, fontSize: "18px" }}>
                2180 &nbsp;
              </span>
              Male (81%) |{" "}
              <span style={{ fontWeight: 600, fontSize: "18px" }}>
                368 &nbsp;
              </span>
              Female (19%)
            </p>
          </div>
          <div className="totalEmployeeChartGraphParent mt-2">
            <div className="">
              <GraphChart
                chartDataObj={genderCircleChart}
                type="donut"
                height="300"
                width="100%"
              />
            </div>
            <div className="totalEmployee-text">
              <span className="totalEmployee-text-title">2548</span>
              <span>Total Employee</span>
            </div>
          </div>
        </div>
        <div className="leaveChart shadow-card-container m-0" style={{ padding: "12px" }}>
          <div>
            <h4
              style={{
                fontWeight: 600,
                fontSize: "16px",
                color: "#667085",
              }}
            >
              Month Wise Leave Taken
            </h4>
            <p className="mt-1">The result shows from 2021 Calender</p>
          </div>
          <div className="h-100">
            <GraphChart
              chartDataObj={leaveTakenChart}
              type="bar"
              height="100%"
              width="100%"
            />
          </div>
        </div>
        <div className="monthIou-container shadow-card-container m-0">
          <div className="d-flex justify-content-between">
            <div>
              <h4
                style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#667085",
                }}
              >
                Month Wise IOU
              </h4>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "#98A2B3",
                }}
              >
                The result shows from 2021 Calender
              </p>
            </div>
            <div>
              <span>
                <FullscreenIcon />
              </span>
            </div>
          </div>
          <div>
            <GraphChart
              chartDataObj={separationChart}
              type="area"
              height="300"
              width="100%"
            />
          </div>
        </div>
      </div>
      <div className="employeeGrid">
        <div className="salaryChart  shadow-card-container m-0" style={{paddingTop:"12px"}}>
          <div>
            <h4>Employee Turnover</h4>
            <p className="mt-1">
              Employee turnover is the measurement of the number of employees
              who leave an organization during a specified time period. The
              result will show in last 12 month
            </p>
          </div>
          <div className="d-flex align-items-center my-3">
            <div className="pr-2" style={{ borderRight: "1px solid #D0D5DD" }}>
              <p
                style={{
                  backgroundColor: "#E6F9E9",

                  padding: "1em",
                }}
              >
                Total Employee 310
              </p>
            </div>
            <div
              className="pr-2 ml-2"
              style={{ borderRight: "1px solid #D0D5DD" }}
            >
              <p
                style={{
                  backgroundColor: "#EAECF5",

                  padding: "1em",
                }}
              >
                Employee Left 24
              </p>
            </div>
            <div className="ml-2">
              <p style={{ backgroundColor: "#FEF3F2", padding: "1em" }}>
                Turnover rate 7.7%
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-2">
              <h5>Turnover Rate by Top 8 Department</h5>
              <GraphChart
                chartDataObj={salaryByDepartmentChart}
                type="bar"
                height="380px"
                width="100%"
              />
            </div>
            <div className="col-md-6 mt-2">
              <h5>Turnover Rate by Last 5 year</h5>
              <GraphChart
                chartDataObj={salaryYearsChart}
                type="area"
                height="380px"
                width="100%"
              />
            </div>
          </div>
        </div>
        <div className="ml-1">
          <div className="h-50 emp-birthday-container shadow-card-container m-0 pb-0">
            <h4>Upcoming Birthday</h4>
            <p className="mt-1">Sep, Oct, and Nov Calender</p>
            <div
              style={{
                height: "79%",
                overflow: "auto",
                maxHeight: "315px",
                marginTop: "20px",
                paddingRight: "20px",
              }}
            >
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ borderBottom: "1px solid #EAECF0", padding: "4px 0" }}
              >
                <div className="d-flex">
                  <div>
                    <img src={demoUserIcon} alt="" />
                  </div>
                  <div className="ml-2">
                    <h4
                      style={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "#344054",
                        lineHeight: "18px",
                      }}
                    >
                      Marvin McKinney
                    </h4>
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#98A2B3",
                        lineHeight: "18px",
                      }}
                    >
                      President of Sales
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 400,
                    fontsize: "10px",
                    lineheight: "18px",
                    color: "#667085",
                  }}
                >
                  12 Sept, 2022
                </p>
              </div>
            </div>
          </div>
          <div
            className="shadow-card-container mt-3 d-flex flex-column justify-content-around px-3"
            style={{ height: "47.2%" }}
          >
            <div className="">
              <h4>Employee Count by Salary Range</h4>
              <p className="mt-1">The results shows from 2021 calender</p>
            </div>
            <div className="d-flex align-items-center my-3">
              <div style={{ width: "50px" }}>
                <img className="w-100" src={headIcon} alt="" />
              </div>
              <p style={{ fontSize: "40px", fontWeight: 600 }} className="ml-3">
                23
              </p>
            </div>
            <div>
              <Slider
                getAriaLabel={() => "Salary Range"}
                value={sliderValue}
                onChange={(e, value) => setSliderValue(value)}
                valueLabelDisplay="auto"
                getAriaValueText={(v) => v}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div
                style={{
                  padding: ".3em 1em",
                  border: `1px solid ${gray300}`,
                  borderRadius: "4px",
                }}
              >
                93,033
              </div>
              <div
                style={{
                  padding: ".3em 1em",
                  border: `1px solid ${gray300}`,
                  borderRadius: "4px",
                }}
              >
                4000000
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gridContainer2" style={{ maxHeight: "502px" }}>
        <div
          className="myEmployeeContainer shadow-card-container pb-0 m-0 h-100"
          style={{ maxHeight: "502px", padding:"12px" }}
        >
          <div className="emp-container-header d-flex align-items-center justify-content-between">
            <div>
              <h4>My Employess</h4>
              <p>
                Today Status | Total Employee <span>72</span>
              </p>
            </div>
            <div>
              <MasterFilter
                styles={{ marginRight: "0px" }}
                inputWidth="250px"
                width="250px"
                isHiddenFilter
                value={""}
                setValue={(value) => {}}
                cancelHandler={() => {}}
                handleClick={(e) => {}}
              />
            </div>
          </div>
          <div style={{ height: "92.3%" }}>
            <div
              className="table-card-styled my-emp-table"
              style={{ overflow: "auto", maxHeight: "100%" }}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>In-time</th>
                    <th>Out-time</th>
                    <th>
                      <div className="d-flex justify-content-center">
                        <div className="sortable">
                          <span>Status &nbsp;</span>
                          <span>
                            <ActionMenu
                              color={"rgba(0, 0, 0, 0.6)"}
                              fontSize={"18px"}
                              options={[
                                {
                                  value: 1,
                                  label: "Filter",
                                  onClick: () => {},
                                },
                              ]}
                            />
                          </span>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#299647",
                          background: "#E6F9E9",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Present
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#B54708",
                          background: "#FEF0C7",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Late
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#6927DA",
                          background: "#ECE9FE",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Leave
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#9F1AB1",
                          background: "#FBE8FF",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Movement
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#B42318",
                          background: "#FEE4E2",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Absent
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#B54708",
                          background: "#FEF0C7",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Late
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#6927DA",
                          background: "#ECE9FE",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Leave
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#9F1AB1",
                          background: "#FBE8FF",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Movement
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                      <div className="d-flex">
                        <div>
                          <img src={demoUserIcon} alt="" />
                        </div>
                        <div className="ml-2">
                          <h4
                            style={{
                              fontWeight: 400,
                              fontSize: "14px",
                              color: "#344054",
                              lineHeight: "18px",
                            }}
                          >
                            Guy Hawkins
                          </h4>
                          <p
                            style={{
                              fontWeight: 400,
                              fontSize: "12px",
                              color: "#667085",
                              lineHeight: "18px",
                            }}
                          >
                            Medical Assistant
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>Logistics</td>
                    <td>9:00 AM</td>
                    <td>6:00 PM</td>
                    <td className="text-center">
                      <span
                        style={{
                          color: "#B42318",
                          background: "#FEE4E2",
                          borderRadius: "99px",
                          padding: "1px 8px",
                          fontWeight: 600,
                        }}
                      >
                        Absent
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="shadow-card-container pb-0 m-0" style={{ maxHeight: "502px", padding:"12px" }}>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4>Department Details</h4>
              <p>The results shows from october 2022</p>
            </div>
            <div>
              <MasterFilter
                inputWidth="250px"
                styles={{ marginRight: "0px" }}
                width="250px"
                isHiddenFilter
                value={""}
                setValue={(value) => {}}
                cancelHandler={() => {}}
                handleClick={(e) => {}}
              />
            </div>
          </div>
          <div
            className="tableOne my-emp-table mt-1"
            style={{ overflow: "auto", maxHeight: "91.5%" }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <p
                      style={{
                        color: "#98a2b3",
                        fontWeight: 500,
                      }}
                    >
                      Department
                    </p>
                  </th>
                  <th>
                    <p
                      style={{
                        color: "#98a2b3",
                        fontWeight: 500,
                      }}
                    >
                      Employee Count
                    </p>
                  </th>
                  <th>
                    <p
                      style={{
                        color: "#98a2b3",
                        fontWeight: 500,
                      }}
                    >
                      Salary
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="tableBody-title">Engineering & Technology</p>
                  </td>
                  <td>
                    <p className="tableBody-title">400</p>
                  </td>
                  <td>
                    <p className="tableBody-title">40000$</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
