import React from "react";
import clockIcon from "../../../../assets/images/clockIcon.svg";
import calenderIcon from "../../../../assets/images/calenderIcon.svg";
import pdfIcon from "../../../../assets/images/pdfIcon.svg";
import NoticeIcon from "../../../../assets/images/notiveIcon.svg";
import demoUserIcon from "../../../../assets/images/userIcon.svg";
import demoUserPhoto from "../../../../assets/images/userPhotoIcon.svg";
import demoUserPhoto2 from "../../../../assets/images/userPhotoIcon2.svg";
import AttendanceCalenderComp from "./AttendanceCalenderComp";

const EmployeeDashboard = () => {
  return (
    <>
      <div className="employeeDashboard">
        <div className="customGrid">
          <div className="dashboard-mini-card customShadow">
            <div className="d-flex align-items-center">
              <div className="small-card-area">
                <img src={clockIcon} alt="" />
              </div>
              <div className="small-card-area">
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#344054",
                    lineHeight: "20px",
                  }}
                >
                  Today Working Period
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#475467",
                    lineHeight: "24px",
                  }}
                >
                  8hrs 50min
                </p>
              </div>
              <div className="small-card-area custom-border-left">
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#344054",
                    lineHeight: "20px",
                  }}
                >
                  General Calender
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#475467",
                    lineHeight: "24px",
                  }}
                >
                  9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
          <div className="dashboard-mini-card customShadow">
            <div className="d-flex align-items-center">
              <div className="small-card-area">
                <img src={calenderIcon} alt="" />
              </div>
              <div className="small-card-area">
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#344054",
                    lineHeight: "20px",
                  }}
                >
                  Length of Service
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#475467",
                    lineHeight: "24px",
                  }}
                >
                  1 yrs 4 mon 23 days
                </p>
              </div>
              <div className="small-card-area custom-border-left">
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#344054",
                    lineHeight: "20px",
                  }}
                >
                  Joining Date
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#475467",
                    lineHeight: "24px",
                  }}
                >
                  21 Sep, 2021
                </p>
              </div>
              <div className="small-card-area custom-border-left">
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "#344054",
                    lineHeight: "20px",
                  }}
                >
                  Confirmation Date
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#475467",
                    lineHeight: "24px",
                  }}
                >
                  21 Mar, 2022
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="calenderGrid">
          <div>
            <AttendanceCalenderComp />
          </div>
          <div>
            <div className="shadow-card-container myManager-Card">
              <div className="custom-card-inner">
                <h2
                  style={{
                    color: "#667085",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  My Manager
                </h2>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={demoUserIcon} alt="" />
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Daniel Lokossou
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        Manager
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={demoUserPhoto} alt="" />
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Jean-Bertrand Ali
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        Dotted Supervisor
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={demoUserPhoto2} alt="" />
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Coper Brandon
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        Supervisor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="shadow-card-container leave-balance"
              style={{ marginTop: "12px" }}
            >
              <div className="">
                <h2
                  style={{
                    padding: "12px",
                    color: "#667085",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  Leave Balance
                </h2>
                <div
                  className="table-card-styled leave-table"
                  style={{ overflow: "auto", maxHeight: "280px" }}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th style={{ textAlign: "center" }}>Taken</th>
                        <th style={{ textAlign: "center" }}>Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Casual Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Merriage Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>

                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Merriage Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>

                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Merriage Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>

                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                      <tr>
                        <td>Sick Leave</td>
                        <td style={{ textAlign: "center" }}>3</td>
                        <td style={{ textAlign: "center" }}>11</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="customCardGrid">
          <div className="leave-balance">
            <div className="shadow-card-container">
              <h2
                style={{
                  padding: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#667085",
                }}
              >
                My Application
              </h2>
              <div
                className=" table-card-styled leave-table"
                style={{
                  overflow: "auto",
                  maxHeight: "400px",
                }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th style={{ textAlign: "center" }}>Application Date</th>
                      <th style={{ textAlign: "center" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense</td>
                      <td style={{ textAlign: "center" }}>21, Sept, 2021</td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            background: "#FEF0C7",
                            color: "#B54708",
                            borderRadius: "99px",
                            padding: "1px 8px",
                          }}
                        >
                          pending
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="">
            <div className="shadow-card-container custom-card-inner">
              <h2
                style={{
                  marginBottom: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#667085",
                }}
              >
                Company Policy
              </h2>
              <div className="scrollAbleList">
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={pdfIcon} alt="" />
                    </div>
                    <div
                      className=""
                      style={{
                        marginLeft: "10px",
                        paddingBottom: "12px",
                        width: "100%",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Recruitment and Separation
                      </p>
                      <p
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          color: "#98A2B3",
                          lineHeight: "18px",
                        }}
                      >
                        File.pdf
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="shadow-card-container custom-card-inner">
              <h3
                style={{
                  marginBottom: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#667085",
                }}
              >
                Notice Board
              </h3>
              <div className="scrollAbleList">
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={NoticeIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Sylhet floods: Govt allocation inadequate, prices of
                        commoditi ...
                      </p>
                      <div
                        className="d-flex"
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <p
                          style={{
                            borderRight: "1px solid #D0D5DD",
                            paddingRight: "12px",
                          }}
                        >
                          01:00 AM
                        </p>
                        <p style={{ paddingLeft: "12px" }}>20 Sep, 2021</p>
                        {/* is new ?  */}
                        <p style={{ paddingLeft: "12px" }}>
                          <span
                            style={{
                              color: "#B42318",
                              background: "#FEE4E2",
                              borderRadius: "99px",
                              padding: "1px 8px",
                            }}
                          >
                            New
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={NoticeIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Sylhet floods: Govt allocation inadequate, prices of
                        commoditi ...
                      </p>
                      <div
                        className="d-flex"
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <p
                          style={{
                            borderRight: "1px solid #D0D5DD",
                            paddingRight: "12px",
                          }}
                        >
                          01:00 AM
                        </p>
                        <p style={{ paddingLeft: "12px" }}>20 Sep, 2021</p>
                        {/* is new ?  */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={NoticeIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Sylhet floods: Govt allocation inadequate, prices of
                        commoditi ...
                      </p>
                      <div
                        className="d-flex"
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <p
                          style={{
                            borderRight: "1px solid #D0D5DD",
                            paddingRight: "12px",
                          }}
                        >
                          01:00 AM
                        </p>
                        <p style={{ paddingLeft: "12px" }}>20 Sep, 2021</p>
                        {/* is new ?  */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={NoticeIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Sylhet floods: Govt allocation inadequate, prices of
                        commoditi ...
                      </p>
                      <div
                        className="d-flex"
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <p
                          style={{
                            borderRight: "1px solid #D0D5DD",
                            paddingRight: "12px",
                          }}
                        >
                          01:00 AM
                        </p>
                        <p style={{ paddingLeft: "12px" }}>20 Sep, 2021</p>
                        {/* is new ?  */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={NoticeIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Sylhet floods: Govt allocation inadequate, prices of
                        commoditi ...
                      </p>
                      <div
                        className="d-flex"
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <p
                          style={{
                            borderRight: "1px solid #D0D5DD",
                            paddingRight: "12px",
                          }}
                        >
                          01:00 AM
                        </p>
                        <p style={{ paddingLeft: "12px" }}>20 Sep, 2021</p>
                        {/* is new ?  */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={NoticeIcon} alt="" />
                    </div>
                    <div className="noticeCardStyle">
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Sylhet floods: Govt allocation inadequate, prices of
                        commoditi ...
                      </p>
                      <div
                        className="d-flex"
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <p
                          style={{
                            borderRight: "1px solid #D0D5DD",
                            paddingRight: "12px",
                          }}
                        >
                          01:00 AM
                        </p>
                        <p style={{ paddingLeft: "12px" }}>20 Sep, 2021</p>
                        {/* is new ?  */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mangerDetails" style={{ marginBottom: "8px" }}>
                  <div className="d-flex">
                    <div className="">
                      <img src={NoticeIcon} alt="" />
                    </div>
                    <div
                      className=""
                      style={{
                        marginLeft: "10px",
                        paddingBottom: "12px",
                        width: "100%",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 500,
                          fontSize: "12px",
                          color: "#344054",
                          lineHeight: "18px",
                        }}
                      >
                        Sylhet floods: Govt allocation inadequate, prices of
                        commoditi ...
                      </p>
                      <div
                        className="d-flex"
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <p
                          style={{
                            borderRight: "1px solid #D0D5DD",
                            paddingRight: "12px",
                          }}
                        >
                          01:00 AM
                        </p>
                        <p style={{ paddingLeft: "12px" }}>20 Sep, 2021</p>
                        {/* is new ?  */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;
