/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import DownloadIcon from "@mui/icons-material/Download";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Slider } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import headIcon from "../../../assets/images/profile.jpg";
import demoUserIcon from "../../../assets/images/userIcon.svg";
import DefaultInput from "../../../common/DefaultInput";
import FormikSelect from "../../../common/FormikSelect";
import GraphChart from "../../../common/GraphChart";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { dateFormatter } from "../../../utility/dateFormatter";
import { customStyles } from "../../../utility/selectCustomStyle";
import { size } from "lodash";
import { formatMoney } from "utility/formatMoney";

const ManagementDashboardLanding = ({ setLoading }) => {
  // Redux
  const { employeeId, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const currentYear = new Date().getFullYear();
  const month = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  // get data api calling
  const [employeeStatusGraph, getEmployeeStatusGraph, loading1] = useAxiosGet();
  const [iouGraph, getIouGraph, loading2] = useAxiosGet();
  const [monthWiseLeaveTaken, getMonthWiseLeaveTaken, loading3] = useAxiosGet();
  const [
    topLevelDashboardDetailsDetails,
    getTopLevelDashboardDetails,
    loading4,
  ] = useAxiosGet();
  const [
    turnoverByDepartmentChartDetails,
    getTurnoverByDepartmentChartDetails,
    loading5,
  ] = useAxiosGet();
  const [
    turnoverLastFiveYearsChartDetails,
    getTurnoverLastFiveYearsChartDetails,
    loading6,
  ] = useAxiosGet();
  const [
    attendanceCircleChartDetails,
    getAttendanceCircleChartDetails,
    loading7,
  ] = useAxiosGet();
  const [initialSalaryRangeDetails, getInitialSalaryRangeDetails, loading8] =
    useAxiosGet();
  const [onChangeSalaryRangeDetails, getOnChangeSalaryRangeDetails, loading9] =
    useAxiosGet();
  const [
    internNProbationChartDetails,
    getInternNProbationChartDetails,
    loading10,
  ] = useAxiosGet();

  useEffect(() => {
    getEmployeeStatusGraph(
      `/Dashboard/EmployeeStatusGraph?IntYear=${currentYear}&workplaceGroupId=${wgId}`
    );
    getIouGraph(
      `/Dashboard/MonthWiseIOUGraph?IntYear=${currentYear}&workplaceGroupId=${wgId}`
    );
    getMonthWiseLeaveTaken(
      `/Dashboard/MonthWiseLeaveTakenGraph?IntYear=${currentYear}&IntAccountId=${orgId}&IntBusinessUnitId=${buId}&workplaceGroupId=${wgId}`
    );
    getTopLevelDashboardDetails(
      `/Dashboard/TopLevelDashboard?workPlaceGroupId=${wgId}`
    );
    getTurnoverByDepartmentChartDetails(
      `Dashboard/EmployeeTurnOverRatio?&IntAccountId=${orgId}&IntWorkplaceGroupId=${wgId}`
    );
    getTurnoverLastFiveYearsChartDetails(
      `/Dashboard/LastFiveYearEmployeeTurnOverRatio?workPlaceGroupId=${wgId}`
    );
    getInitialSalaryRangeDetails(
      `/Dashboard/EmployeeCountBySalaryRange?workplaceGroupId=${wgId}`
    );
    getOnChangeSalaryRangeDetails(
      `/Dashboard/EmployeeCountBySalaryRange?MinSalary&MaxSalary&workplaceGroupId=${wgId}
        `
    );
    getInternNProbationChartDetails(
      `/Dashboard/InternNProbationPeriodGraphData?Year=${currentYear}&workplaceGroupId=${wgId}
        `
    );
    getAttendanceCircleChartDetails(
      `/Dashboard/AttendanceGraphData?intDay=1&workplaceGroupId=${wgId}
      `
    );
    // eslint-disable-next-line
  }, [employeeId, orgId, buId, currentYear, wgId]);

  const { setFieldValue, values, errors, touched, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: {
      search: "",
      fromSalaryRange: initialSalaryRangeDetails?.minimumSalary,
      toSalaryRange: initialSalaryRangeDetails?.maximumSalary,
      attendance: { value: 1, label: "Today" },
    },
  });

  const empStatusChartLabel =
    employeeStatusGraph?.employeeStatusGraphs?.length &&
    employeeStatusGraph?.employeeStatusGraphs?.map((item) => item?.graphText);
  const empStatusChartValue =
    employeeStatusGraph?.employeeStatusGraphs?.length &&
    employeeStatusGraph?.employeeStatusGraphs?.map((item) => item?.graphValue);
  const leaveTakenChartValue =
    monthWiseLeaveTaken?.length &&
    monthWiseLeaveTaken?.map((item) => item?.leaveCount);
  const iouChartValue = iouGraph.length && iouGraph?.map((item) => item?.iou);
  const turnoverByDepartmentChartValue =
    turnoverByDepartmentChartDetails.departmentWiseTurnoverRateViewModel
      ?.length &&
    turnoverByDepartmentChartDetails?.departmentWiseTurnoverRateViewModel
      ?.filter((i) => i?.turnoverRatio !== 0)
      ?.map((item) => {
        return { x: item?.departmentName, y: item?.turnoverRatio };
      });
  const TurnoverLastFiveYearsChartValue =
    turnoverLastFiveYearsChartDetails?.length &&
    turnoverLastFiveYearsChartDetails?.map((item) => {
      return { x: item?.years, y: item?.yearlyTurnover };
    });

  const leaveStatusViewModel =
    topLevelDashboardDetailsDetails?.topLevelDashboardViewModel
      ?.leaveStatusViewModel;
  const movementStatusViewModel =
    topLevelDashboardDetailsDetails?.topLevelDashboardViewModel
      ?.movementStatusViewModel;

  const attendanceCircleChartDetailsLabel =
    attendanceCircleChartDetails?.attendanceDonutChartData?.length &&
    attendanceCircleChartDetails?.attendanceDonutChartData?.map(
      (item) => item?.name
    );
  const attendanceCircleChartDetailsValue =
    attendanceCircleChartDetails?.attendanceDonutChartData?.length &&
    attendanceCircleChartDetails?.attendanceDonutChartData?.map(
      (item) => item?.value
    );

  const attendanceCircleChart = {
    options: {
      fill: {
        colors: ["#34A853", "#FEC84B", "#F63D68"],
      },
      colors: ["#34A853", "#FEC84B", "#F63D68"],
      plotOptions: {
        donut: {
          background: "red",
        },
      },
      labels: attendanceCircleChartDetailsLabel || [],
      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val;
        },
      },
      legend: {
        position: "bottom",
      },
      tooltip: {
        theme: "light",
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
    series: attendanceCircleChartDetailsValue || [],
  };
  const leaveAndMovementChart = {
    series: [
      {
        name: "Leave",
        data: [
          leaveStatusViewModel?.todayLeave,
          leaveStatusViewModel?.tommorrowLeave,
          leaveStatusViewModel?.yesterdayLeave,
        ],
      },
      {
        name: "Movement",
        data: [
          movementStatusViewModel?.todayMovement,
          movementStatusViewModel?.tommorrowMovement,
          movementStatusViewModel?.yesterdayMovement,
        ],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: ["Today", "Tommorow", "Yesterday"],
        show: false,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      colors: ["#3290ED", "#FEC84B"],
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      grid: {
        show: false, // you can either change hear to disable all grids
        xaxis: {
          lines: {
            show: false, //or just here to disable only x axis grids
          },
        },
        yaxis: {
          lines: {
            show: false, //or just here to disable only y axis
          },
        },
      },

      legend: {
        display: false,
        position: "bottom",
        horizontalAlign: "center",
        offsetX: 40,
      },
    },
  };
  const empStatusCircleChart = {
    options: {
      fill: {
        colors: ["#34A853", "#FEC84B", "#0BA5EC", "#F63D68"],
      },
      colors: ["#34A853", "#FEC84B", "#0BA5EC", "#F63D68"],
      plotOptions: {
        donut: {
          background: "red",
        },
      },
      labels: empStatusChartLabel || [],
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
        theme: "light",
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
    series: empStatusChartValue || [],
  };
  const leaveTakenChart = {
    series: [
      {
        name: "Leave",
        data: leaveTakenChartValue || [], //leaveTakenChartValue,
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
          tooltip: {
            custom: function ({ series, seriesIndex, w }) {
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
  const iouChart = {
    series: [
      {
        name: " ",
        data: iouChartValue || [],
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
  const turnoverByDepartmentChart = {
    series: [
      {
        name: "Employee",
        data: turnoverByDepartmentChartValue,
      },
    ],
    options: {
      tooltip: {
        followCursor: true,
        marker: {
          show: true,
        },
        position: "top",
        y: {
          formatter: function (val) {
            return val + "%";
          },
        },
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
      grid: {
        show: true, // you can either change hear to disable all grids
        xaxis: {
          lines: {
            show: true, //or just here to disable only x axis grids
          },
        },
        yaxis: {
          lines: {
            show: false, //or just here to disable only y axis
          },
        },
      },

      yaxis: [
        {
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
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
  const turnoverLastFiveYearsChart = {
    series: [{ name: "Employee", data: TurnoverLastFiveYearsChartValue }],
    options: {
      dataLabels: {
        enabled: false,
      },
      markers: { size: 5, colors: "#F79009" },
      stroke: {
        curve: "straight",
        colors: ["#F79009"],
      },
      colors: ["#F79009"],
      fill: {
        gradient: {
          enabled: true,
          opacityFrom: 0.55,
          opacityTo: 0.54,
        },
      },
    },
  };
  const InternChart = {
    series: [
      {
        name: "Below 3 month",
        data: [internNProbationChartDetails?.internBellowThreeMonth],
      },
      {
        name: "Above 3 month",
        data: [internNProbationChartDetails?.internAboveThreeMonth],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: ["Intern"],
        show: false,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      colors: ["#34A853", "#F97066"],
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      grid: {
        show: false, // you can either change hear to disable all grids
        xaxis: {
          lines: {
            show: false, //or just here to disable only x axis grids
          },
        },
        yaxis: {
          lines: {
            show: false, //or just here to disable only y axis
          },
        },
      },
      legend: {
        display: false,
        position: "bottom",
        horizontalAlign: "center",
        offsetX: 40,
      },
    },
  };
  const ProbationChart = {
    series: [
      {
        name: "Below 6 month",
        data: [internNProbationChartDetails?.probationBellowSixMonth],
      },
      {
        name: "Above 6 month",
        data: [internNProbationChartDetails?.probationAboveSixMonth],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: ["Probation"],
        show: false,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      colors: ["#34A853", "#F97066"],
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      grid: {
        show: false, // you can either change hear to disable all grids
        xaxis: {
          lines: {
            show: false, //or just here to disable only x axis grids
          },
        },
        yaxis: {
          lines: {
            show: false, //or just here to disable only y axis
          },
        },
      },

      legend: {
        display: false,
        position: "bottom",
        horizontalAlign: "center",
        offsetX: 40,
      },
    },
  };

  // const [sliderValue, setSliderValue] = useState(slider?.length && slider);
  const [sliderValue, setSliderValue] = useState([]);

  useEffect(() => {
    initialSalaryRangeDetails?.minimumSalary &&
    initialSalaryRangeDetails?.maximumSalary
      ? setSliderValue([
          initialSalaryRangeDetails?.minimumSalary,
          initialSalaryRangeDetails?.maximumSalary,
        ])
      : setSliderValue([]);
  }, [initialSalaryRangeDetails]);

  const handleSalaryRangeSlider = (e, newValue) => {
    setSliderValue(newValue);
    setFieldValue("fromSalaryRange", newValue[0]);
    setFieldValue("toSalaryRange", newValue[1]);
    getOnChangeSalaryRangeDetails(
      `/Dashboard/EmployeeCountBySalaryRange?MinSalary=${
        newValue[0] || 0
      }&MaxSalary=${newValue[1]}&workplaceGroupId=${wgId}
      `
    );
  };

  const groupedData =
    topLevelDashboardDetailsDetails?.topLevelDashboardViewModel?.departmentWiseEmployeeSalaryCount.reduce(
      (acc, item) => {
        const { workPlaceName } = item;
        if (!acc[workPlaceName]) {
          acc[workPlaceName] = [];
        }
        acc[workPlaceName].push(item);
        return acc;
      },
      {}
    );

  return (
    <>
      {(loading1 ||
        loading2 ||
        loading3 ||
        loading4 ||
        loading5 ||
        loading6 ||
        loading7 ||
        loading8 ||
        loading9 ||
        loading10) && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="managerDashboard ">
          {/* first row start */}
          <div className="managerDashboardChart1">
            {/* Attendance Circle Chart start */}
            <div
              className="employee-Status-Chart-Container shadow-card-container m-0 pb-5"
              style={{ boxShadow: "0px 4px 10px #D0D5DD" }}
            >
              <div className="p-2">
                <div className="d-flex justify-content-between align-items-between">
                  <div className="pt-1">
                    <h4
                      style={{
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#667085",
                      }}
                    >
                      Attendance
                    </h4>
                  </div>
                  <div style={{ width: "140px" }}>
                    <FormikSelect
                      isClearable={false}
                      name="attendance"
                      options={[
                        { value: 1, label: "Today" },
                        { value: 2, label: "Yesterday" },
                        { value: 3, label: "Last Seven Days" },
                      ]}
                      value={values?.attendance}
                      onChange={(valueOption) => {
                        setFieldValue("attendance", valueOption);
                        getAttendanceCircleChartDetails(
                          `/Dashboard/AttendanceGraphData?intDay=${valueOption?.value}&workplaceGroupId=${wgId}`
                        );
                      }}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <p style={{ fontWeight: 400, fontSize: "14px" }}>
                  <span style={{ fontWeight: 600, fontSize: "18px" }}>
                    {attendanceCircleChartDetails?.todayPresentPercentage}%
                    &nbsp;
                  </span>
                  Present |{" "}
                  <span style={{ fontWeight: 600, fontSize: "18px" }}>
                    {attendanceCircleChartDetails?.todayLatePercentage}% &nbsp;
                  </span>
                  Late |{" "}
                  <span style={{ fontWeight: 600, fontSize: "18px" }}>
                    {attendanceCircleChartDetails?.todayAbsentPercentage}%
                    &nbsp;
                  </span>
                  Absent
                </p>
              </div>
              <div className="totalEmployeeChartGraphParent">
                <div>
                  <GraphChart
                    chartDataObj={attendanceCircleChart}
                    type="donut"
                    height="300"
                    width="100%"
                  />
                </div>
                <div className="totalEmployee-text">
                  <span className="totalEmployee-text-title">
                    {attendanceCircleChartDetails?.totalEmployeeCount}
                  </span>
                  <span>Total Employee</span>
                </div>
              </div>
            </div>
            {/* Attendance Circle Chart end*/}

            {/* Leave & Movement Bar chart start */}
            <div
              className="salaryChart shadow-card-container"
              style={{ paddingTop: "12px", boxShadow: "0px 4px 10px #D0D5DD" }}
            >
              <div style={{ paddingLeft: "12px" }}>
                <h4
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#667085",
                  }}
                >
                  Leave & Movement
                </h4>
              </div>
              <div className="row">
                <div className="col-md-9 mt-2">
                  <GraphChart
                    chartDataObj={leaveAndMovementChart}
                    type="bar"
                    height="250px"
                    width="100%"
                  />
                </div>
                <div className="col-md-3 mt-2">
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: "14px",
                      margin: "10px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#667085",
                        }}
                      >
                        LEAVE
                      </h4>
                      <hr style={{ padding: "0px", margin: "5px 0px" }} />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "18px",
                          color: "#667085",
                        }}
                      >
                        {leaveStatusViewModel?.todayLeavePercentage}% &nbsp;
                      </span>
                      Today
                      <br />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "18px",
                          color: "#667085",
                        }}
                      >
                        {leaveStatusViewModel?.tommorrowLeavePercentage}% &nbsp;
                      </span>
                      Tomorrow
                      <br />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "18px",
                          color: "#667085",
                        }}
                      >
                        {leaveStatusViewModel?.yesterdayLeavePercentage}% &nbsp;
                      </span>{" "}
                      Yesterday
                    </div>
                    <div className="pt-2">
                      <h4
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#667085",
                        }}
                      >
                        MOVEMENT
                      </h4>
                      <hr style={{ padding: "0px", margin: "5px 0px" }} />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "18px",
                          color: "#667085",
                        }}
                      >
                        {movementStatusViewModel?.todayMovementPercentage}%
                        &nbsp;
                      </span>
                      Today
                      <br />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "18px",
                          color: "#667085",
                        }}
                      >
                        {movementStatusViewModel?.tommorrowMovementPercentage}%
                        &nbsp;
                      </span>
                      Tomorrow
                      <br />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "18px",
                          color: "#667085",
                        }}
                      >
                        {movementStatusViewModel?.yesterdayMovementPercentage}%
                        &nbsp;
                      </span>{" "}
                      Yesterday
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Leave & Movement Bar chart end */}
          </div>
          {/* first row end */}

          {/* second row start */}
          <div className="managerDashboardChart">
            {/* Employment Status Circle Chart start*/}
            <div
              className="employee-Status-Chart-Container shadow-card-container m-0"
              style={{ padding: "12px", boxShadow: "0px 4px 10px #D0D5DD" }}
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
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "18px",
                  }}
                >
                  The result shows from {currentYear} Calender
                </p>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    marginTop: "18px",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "18px" }}>
                    {employeeStatusGraph?.totalMale}
                    &nbsp;
                  </span>
                  Male ({employeeStatusGraph?.malePercentage}%) |{" "}
                  <span style={{ fontWeight: 600, fontSize: "18px" }}>
                    {employeeStatusGraph?.totalFemale}
                    &nbsp;
                  </span>
                  Female ({employeeStatusGraph?.femalePercentage}
                  %)
                </p>
              </div>
              <div className="totalEmployeeChartGraphParent mt-2">
                <div className="pt-4">
                  {employeeStatusGraph?.employeeStatusGraphs?.length > 0 && (
                    <GraphChart
                      chartDataObj={empStatusCircleChart}
                      type="donut"
                      height="300"
                      width="100%"
                    />
                  )}
                </div>
                <div className="totalEmployee-text pt-2">
                  <span className="totalEmployee-text-title">
                    {employeeStatusGraph?.totalEmployee}
                  </span>
                  <span>Total Employee</span>
                </div>
              </div>
            </div>
            {/* Employment Status Circle Chart end*/}

            {/* Month wise leave Chart start*/}
            <div
              className="leaveChart shadow-card-container m-0"
              style={{ padding: "12px", boxShadow: "0px 4px 10px #D0D5DD" }}
            >
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
                <p className="mt-1">
                  The result shows from {currentYear} Calender
                </p>
              </div>
              <div className="pt-1">
                {/* {leaveTakenChartValue?.length > 0 && ( */}
                <GraphChart
                  chartDataObj={leaveTakenChart}
                  type="bar"
                  height="320px"
                  width="100%"
                />
                {/* )} */}
              </div>
            </div>
            {/* Month wise leave Chart end*/}

            {/* Month wise iou Chart start*/}
            <div
              className="monthIou-container shadow-card-container m-0"
              style={{ boxShadow: "0px 4px 10px #D0D5DD" }}
            >
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
                    The result shows from {currentYear} Calender
                  </p>
                </div>
                <div>
                  <span>
                    <FullscreenIcon />
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <GraphChart
                  chartDataObj={iouChart}
                  type="area"
                  height="300"
                  width="100%"
                />
              </div>
            </div>
            {/* Month wise iou Chart end*/}
          </div>
          {/* second row end */}

          {/* third row start */}
          <div className="employeeGrid">
            {/* Month wise turnover Chart start*/}
            <div
              className="salaryChart  shadow-card-container m-0"
              style={{ paddingTop: "12px", boxShadow: "0px 4px 10px #D0D5DD" }}
            >
              <div style={{ paddingLeft: "12px" }}>
                <h4
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#667085",
                  }}
                >
                  Employee Turnover
                </h4>
                <p className="mt-1 pr-1">
                  Employee turnover is the measurement of the number of
                  employees who leave an organization during a specified time
                  period. The result will show in last 12 month
                </p>
              </div>
              <div
                className="d-flex align-items-center my-3"
                style={{ paddingLeft: "12px" }}
              >
                <div
                  className="pr-2"
                  style={{ borderRight: "1px solid #D0D5DD" }}
                >
                  <p
                    style={{
                      backgroundColor: "#E6F9E9",

                      padding: "1em",
                    }}
                  >
                    Total Employee{" "}
                    {turnoverByDepartmentChartDetails?.totalEmployee}
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
                    Employee Left {turnoverByDepartmentChartDetails?.totalLeft}
                  </p>
                </div>
                <div className="ml-2">
                  <p style={{ backgroundColor: "#FEF3F2", padding: "1em" }}>
                    Turnover rate{" "}
                    {turnoverByDepartmentChartDetails?.turnoverRate}%
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mt-2">
                  <h4
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#667085",
                      paddingLeft: "12px",
                    }}
                  >
                    Turnover Rate By Departments
                  </h4>
                  <GraphChart
                    chartDataObj={turnoverByDepartmentChart}
                    type="bar"
                    height="550px"
                    width="100%"
                  />
                </div>
                <div className="col-md-6 mt-2">
                  <h4
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#667085",
                      paddingLeft: "12px",
                    }}
                  >
                    Turnover Rate by Last 5 year
                  </h4>
                  <GraphChart
                    chartDataObj={turnoverLastFiveYearsChart}
                    type="area"
                    height="380px"
                    width="100%"
                  />
                </div>
              </div>
            </div>
            {/* Month wise turnover Chart end*/}

            <div className="ml-1">
              {/* Upcoming birthday start*/}
              <div
                className="h-50 pr-0 emp-birthday-container shadow-card-container m-0 pb-0"
                style={{ boxShadow: "0px 4px 10px #D0D5DD" }}
              >
                <h4
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#667085",
                  }}
                >
                  Upcoming Birthday
                </h4>
                <p className="mt-1"> The result shows from current month</p>
                <div
                  style={{
                    height: "80%",
                    overflow: "auto",
                    maxHeight: "315px",
                    marginTop: "12px",
                    paddingRight: "12px",
                  }}
                >
                  {topLevelDashboardDetailsDetails?.topLevelDashboardViewModel
                    ?.upcomingBirthdayEmployeeList?.length ? (
                    topLevelDashboardDetailsDetails?.topLevelDashboardViewModel?.upcomingBirthdayEmployeeList?.map(
                      (item, i) => (
                        <div
                          className="d-flex justify-content-between align-items-center"
                          style={{
                            borderBottom: "1px solid #EAECF0",
                            padding: "4px 0",
                          }}
                          key={i}
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
                                {item?.employeeName}
                              </h4>
                              <p
                                style={{
                                  fontWeight: 400,
                                  fontSize: "10px",
                                  color: "#98A2B3",
                                  lineHeight: "18px",
                                }}
                              >
                                {item?.designation}
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
                            {dateFormatter(item?.dateOfBirth)}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <NoResult />
                  )}
                </div>
              </div>
              {/* Upcoming birthday end*/}

              {/* Employee count by Salary range start*/}
              <div
                className="h-50"
                style={{ boxSizing: "border-box", paddingTop: "12px" }}
              >
                <div
                  className="h-100 d-flex flex-column justify-content-around"
                  style={{
                    boxShadow: "0px 4px 10px #D0D5DD",
                    boxSizing: "border-box",
                    padding: "12px",
                  }}
                >
                  <div className="">
                    <h4
                      style={{
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#667085",
                      }}
                    >
                      Employee Count by Salary Range
                    </h4>
                    <p className="mt-1">
                      The results shows from {currentYear} calender
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ width: "50px" }}>
                      <img className="w-100" src={headIcon} alt="" />
                    </div>
                    <p
                      style={{ fontSize: "40px", fontWeight: 600 }}
                      className="ml-3"
                    >
                      {onChangeSalaryRangeDetails?.numberOfEmployee}
                    </p>
                  </div>
                  <div>
                    <Slider
                      getAriaLabel={() => "Salary Range"}
                      value={sliderValue}
                      onChange={handleSalaryRangeSlider}
                      min={initialSalaryRangeDetails?.minimumSalary}
                      max={initialSalaryRangeDetails?.maximumSalary}
                      valueLabelDisplay="auto"
                      getAriaValueText={(v) => v}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="input-sm mr-5 pr-4">
                      <DefaultInput
                        value={values?.fromSalaryRange}
                        name="fromSalaryRange"
                        type="number"
                        className="form-control"
                        placeholder="Min Salary"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setSliderValue([e.target.value, sliderValue[1]]);
                            setFieldValue("fromSalaryRange", e.target.value);
                            getOnChangeSalaryRangeDetails(
                              `/Dashboard/EmployeeCountBySalaryRange?MinSalary=${
                                e.target.value || 0
                              }&MaxSalary=${
                                sliderValue[1] || ""
                              }&workplaceGroupId=${wgId || ""}
                              `
                            );
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="input-sm ml-5 pl-4">
                      <DefaultInput
                        value={values?.toSalaryRange}
                        name="toSalaryRange"
                        type="number"
                        className="form-control"
                        placeholder="Max Salary"
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            setSliderValue([sliderValue[0], e.target.value]);
                            setFieldValue("toSalaryRange", e.target.value);
                            getOnChangeSalaryRangeDetails(
                              `/Dashboard/EmployeeCountBySalaryRange?MinSalary=${
                                sliderValue[0] || 0
                              }&MaxSalary=${
                                e.target.value || ""
                              }&workplaceGroupId=${wgId}
                              `
                            );
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Employee count by Salary range end*/}
            </div>
          </div>
          {/* third row end */}

          {/* fourth row start */}
          <div className="gridContainer2" style={{ maxHeight: "502px" }}>
            {/* Department details start */}
            <div
              className="shadow-card-container pb-0 m-0"
              style={{
                maxHeight: "502px",
                padding: "12px",
                boxShadow: "0px 4px 10px #D0D5DD",
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4
                    style={{
                      fontWeight: 600,
                      fontSize: "16px",
                      color: "#667085",
                    }}
                  >
                    Department Details
                  </h4>
                  <p>
                    The results shows from {month[new Date().getMonth()]}{" "}
                    {currentYear}
                  </p>
                </div>
              </div>
              <div
                className="tableOne my-emp-table mt-1"
                style={{ overflow: "auto", maxHeight: "91.5%" }}
              >
                {topLevelDashboardDetailsDetails?.topLevelDashboardViewModel
                  ?.departmentWiseEmployeeSalaryCount?.length ? (
                  <div>
                    {Object.keys(groupedData).map((workPlaceName, index) => (
                      <div key={index}>
                        <h3 style={{ color: "#4a5568", fontWeight: "bold" }}>
                         Workplace Name: {workPlaceName}
                        </h3>
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "40%" }}>
                                <p
                                  style={{ color: "#98a2b3", fontWeight: 500 }}
                                >
                                  Department
                                </p>
                              </th>
                              <th style={{ width: "30%" }}>
                                <p
                                  style={{ color: "#98a2b3", fontWeight: 500 }}
                                >
                                  Employee Count
                                </p>
                              </th>
                              <th style={{ width: "60%" }}>
                                <p
                                  style={{ color: "#98a2b3", fontWeight: 500 }}
                                >
                                  Salary
                                </p>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedData[workPlaceName].map((item, i) => (
                              <tr key={i}>
                                <td>
                                  <p className="tableBody-title">
                                    {item?.department}
                                  </p>
                                </td>
                                <td>
                                  <p className="tableBody-title">
                                    {item?.employeeCount}
                                  </p>
                                </td>
                                <td>
                                  <p className="tableBody-title">
                                    {formatMoney(item?.salary)} ৳
                                  </p>
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td></td>
                              <td
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  fontSize: "11px",
                                }}
                              >
                                Total Salary: {" "}
                              </td>
                              <td style={{ fontWeight: "bold", fontSize:'11px' }}>
                                 {formatMoney(groupedData[workPlaceName]?.reduce((acc, item) => acc + item.salary, 0))} ৳
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoResult />
                )}
              </div>
            </div>
            {/* Department details end */}

            {/* Intern to probation period Bar chart start */}
            <div
              className="shadow-card-container pb-0 m-0"
              style={{ paddingTop: "12px", boxShadow: "0px 4px 10px #D0D5DD" }}
            >
              <div style={{ paddingLeft: "12px" }}>
                <h4
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#667085",
                  }}
                >
                  Intern To Probation Period
                </h4>
                <p
                  className="mt-1"
                  style={{
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "18px",
                  }}
                >
                  The result shows from {currentYear} Calender
                </p>
              </div>
              <div className="row">
                <div className="col-md-8 mt-2 pl-5">
                  <GraphChart
                    chartDataObj={InternChart}
                    type="bar"
                    height="125px"
                    width="100%"
                  />
                  <div style={{ marginLeft: "-100x" }}>
                    <GraphChart
                      chartDataObj={ProbationChart}
                      type="bar"
                      height="125px"
                      width="100%"
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-2">
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: "14px",
                      margin: "10px",
                      padding: "0px 10px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#667085",
                        }}
                      >
                        Intern
                      </h4>
                      <hr style={{ padding: "0px", margin: "5px 0px" }} />
                      <div className="d-flex align-items-center justify-content-between">
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "18px",
                            color: "#667085",
                          }}
                        >
                          {internNProbationChartDetails?.internBellowThreeMonth}
                        </span>
                        <span className="pr-3">Below 3 month</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "18px",
                            color: "#667085",
                          }}
                        >
                          {internNProbationChartDetails?.internAboveThreeMonth}
                        </span>
                        <span className="pr-3">Above 3 month</span>
                      </div>
                      <div
                        style={{ color: "#2970FF" }}
                        className="d-flex align-items-center justify-content-between"
                      >
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: "16px",
                            color: "#2970FF",
                          }}
                        >
                          <DownloadIcon></DownloadIcon>
                        </span>
                        <span className="pr-4"> Download list</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <h4
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#667085",
                        }}
                      >
                        Probation
                      </h4>
                      <hr style={{ padding: "0px", margin: "5px 0px" }} />
                      <div className="d-flex align-items-center justify-content-between">
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "18px",
                            color: "#667085",
                          }}
                        >
                          {
                            internNProbationChartDetails?.probationBellowSixMonth
                          }
                        </span>
                        <span className="pr-3">Below 6 month</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "18px",
                            color: "#667085",
                          }}
                        >
                          {internNProbationChartDetails?.probationAboveSixMonth}
                        </span>
                        <span className="pr-3"> Above 6 month</span>
                      </div>

                      <div
                        style={{ color: "#2970FF" }}
                        className="d-flex align-items-center justify-content-between"
                      >
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: "16px",
                            color: "#2970FF",
                          }}
                        >
                          <DownloadIcon></DownloadIcon>
                        </span>
                        <span className="pr-4">Download list</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Intern to probation period Bar chart end */}
          </div>
          {/* fourth row end */}
        </div>
      </form>
    </>
  );
};

export default ManagementDashboardLanding;
