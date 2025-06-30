import React, { useState } from "react";
import BadgeComponent from "../../common/Badge";
import AvatarComponent from "./../../common/AvatarComponent";
import logo from "../../assets/images/err.png";
import {
  EditOutlined,
  NotificationsNoneOutlined,
  SaveAlt,
  CheckCircle,
  Cancel,
  InfoOutlined,
  PrintOutlined,
  AddOutlined,
  Close,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import Chips from "../../common/Chips";
import LineProgress from "../../common/LineProgress";
import { Tooltip, tooltipClasses, Button } from "@mui/material";
import { styled } from "@mui/styles";
import MuiIcon from "../../common/MuiIcon";
import { Avatar } from "@material-ui/core";
import { failColor, successColor } from "../../utility/customColor";
import PrimaryButton from "../../common/PrimaryButton";
import ResetButton from "../../common/ResetButton";
import FormikCheckBox from "./../../common/FormikCheckbox";
import { greenColor } from "./../../utility/customColor";
import SortingIcon from "./../../common/SortingIcon";
import { dateFormatter } from "./../../utility/dateFormatter";
import ScrollableTable from "./../../common/ScrollableTable";

const tooltipTag = ["MS Excell", "SQL", "JavaScript", "Python", "Programming"];

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
    fontSize: 11,
  },
}));

export default function DataDisplay({ index, tabIndex }) {
  const [empOrder, setEmpOrder] = useState("desc");

  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            {/* overview topics */}
            <div>
              <BadgeComponent label={"Avatar"} className="mr-2" />
              <BadgeComponent label={"Badge"} className="mr-2" />
              <BadgeComponent label={"Chip"} className="mr-2" />
              <BadgeComponent label={"Progressbar"} className="mr-2" />
              <BadgeComponent label={"Icons"} className="mr-2" />
              <BadgeComponent label={"Tooltip"} className="mr-2" />
              <BadgeComponent label={"Typography"} className="mr-2" />
              <BadgeComponent label={"Tag"} className="mr-2" />
              <BadgeComponent label={"Button"} className="mr-2" />
              <BadgeComponent label={"Table"} />
            </div>

            {/* Avatar */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Avatar</h2>
              </div>
              <div className="d-flex mt-2">
                <AvatarComponent
                  classess="small-avatar"
                  letterCount={1}
                  label={"Jubayer"}
                />
                <AvatarComponent
                  classess="mx-2 small-avatar"
                  letterCount={2}
                  label={"Bulbul Ahmed"}
                />
                <AvatarComponent
                  classess="mx-2 small-avatar"
                  isImage={true}
                  img={logo}
                  alt="People Desk"
                />
              </div>
            </div>

            {/* Badge */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Badge</h2>
              </div>
              <div className="d-flex mt-2">
                <div className="pointer notification-bell">
                  <span>
                    <NotificationsNoneOutlined
                      sx={{
                        color: "action.active",
                        zIndex: 1,
                      }}
                    />
                  </span>
                  <span id="notiCount" className="badge">
                    7
                  </span>
                </div>
              </div>
            </div>

            {/* Chip */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Chip</h2>
              </div>
              <div className="d-flex mt-2">
                <Chips
                  label="Online"
                  classess="success d-flex justify-content-center"
                />
                <Chips
                  label="Away"
                  classess="warning d-flex justify-content-center"
                />
                <Chips
                  label="Running"
                  classess="primary d-flex justify-content-center"
                />
                <Chips
                  label="Hold"
                  classess="secondary d-flex justify-content-center"
                />
                <Chips
                  label="Busy"
                  classess="danger d-flex justify-content-center"
                />
              </div>
            </div>

            {/* Progressbar */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Progressbar</h2>
              </div>
              <div className="d-flex mt-2 flex-column">
                <LineProgress
                  progress={30}
                  styleObj={{
                    frontBackgroundColor: "#F11014",
                    backBackgroundColor: "#ffc9cc",
                    margin: "0 0 5px",
                  }}
                />
                <LineProgress
                  progress={45}
                  styleObj={{
                    frontBackgroundColor: "#F78C12",
                    backBackgroundColor: "#fee0b3",
                    margin: "0 0 5px",
                  }}
                />
                <LineProgress
                  progress={65}
                  styleObj={{
                    frontBackgroundColor: "#009cde",
                    backBackgroundColor: "#ddf2fb",
                    margin: "0 0 5px",
                  }}
                />
                <LineProgress
                  progress={85}
                  styleObj={{
                    frontBackgroundColor: "#50DB00",
                    backBackgroundColor: "#b8f9ca",
                    margin: "0 0 0px",
                  }}
                />
              </div>
            </div>

            {/* icons */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Icons</h2>
              </div>
              <div className="d-flex mt-2">
                <SaveAlt
                  sx={{
                    color: "#637381",
                    width: "16px",
                    height: "16px",
                  }}
                />
              </div>
            </div>

            {/* tooltip */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Tooltip</h2>
              </div>
              <div className="action-row mt-2">
                <div className="d-flex align-items-center actionIcon">
                  <Tooltip title="Edit">
                    <div
                      className="mr-0 muiIconHover success"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MuiIcon
                        icon={
                          <EditOutlined
                            sx={{
                              color: "rgba(0, 0, 0, 0.6)",
                              "&.MuiSvgIcon-root": {
                                height: "1rem !important",
                                width: "1rem !important",
                              },
                            }}
                          />
                        }
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Approve">
                    <div
                      className="p-2 mr-0 muiIconHover success "
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MuiIcon
                        icon={
                          <CheckCircle
                            sx={{
                              color: successColor,
                              "&.MuiSvgIcon-root": {
                                height: "1rem !important",
                                width: "1rem !important",
                              },
                            }}
                          />
                        }
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <div
                      className="p-2 muiIconHover  danger"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MuiIcon
                        icon={
                          <Cancel
                            sx={{
                              color: failColor,
                              "&.MuiSvgIcon-root": {
                                height: "1rem !important",
                                width: "1rem !important",
                              },
                            }}
                          />
                        }
                      />
                    </div>
                  </Tooltip>
                  <LightTooltip
                    title={
                      <div className="movement-tooltip p-1">
                        <div className="border-bottom">
                          <p className="tooltip-title">Address</p>
                          <p className="tooltip-subTitle">
                            198 Bir Uttam Mir Shawkat Sarak, Kazi Nazrul Islam
                            Road, Dhaka-1207.
                          </p>
                        </div>
                      </div>
                    }
                    arrow
                  >
                    <InfoOutlined
                      sx={{
                        marginLeft: "12px",
                        color: "rgba(0, 0, 0, 0.6)",
                        "&.MuiSvgIcon-root": {
                          height: "1rem !important",
                          width: "1rem !important",
                        },
                      }}
                    />
                  </LightTooltip>
                </div>
              </div>
            </div>

            {/* typography */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Typography</h2>
              </div>
              <div className="d-flex mt-2">
                <div className="table-card-heading">
                  <h2>Title</h2>
                </div>
                <p className="text-subtitle">Subtitle</p>
                <p className="text-subtitle bold">Subtitle Bold</p>
              </div>
            </div>

            {/* tag */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Tag</h2>
              </div>
              <div className="mt-2">
                <ul className="d-flex">
                  {tooltipTag?.map((list, index) => {
                    return (
                      <li
                        key={index}
                        style={{ backgroundColor: "#EEEEEE", border: 0 }}
                        className="chips success relative chips-two mr-1 mb-2"
                      >
                        {list}
                        <span
                          className="pointer cross-chips-icon white"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Close sx={{ fontSize: "12px" }} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* button */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Button</h2>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-warp mt-2">
                <div
                  onClick={() => {
                    alert("Edit");
                  }}
                >
                  <Avatar className="icon-btn">
                    <EditOutlined sx={{ color: "#637381", fontSize: "16px" }} />
                  </Avatar>
                </div>
                <Tooltip title="Export CSV" arrow>
                  <button
                    type="button"
                    className="btn-save"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <SaveAlt sx={{ color: "#637381", fontSize: "16px" }} />
                  </button>
                </Tooltip>
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    alert("Click");
                  }}
                  sx={{
                    borderColor: "rgba(0, 0, 0, 0.6)",
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "10px",
                    fontWeight: "bold",
                    letterSpacing: "1.25px",
                    "&:hover": {
                      borderColor: "rgba(0, 0, 0, 0.6)",
                    },
                    "&:focus": {
                      backgroundColor: "transparent",
                    },
                  }}
                  startIcon={
                    <PrintOutlined
                      sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                      className="emp-print-icon"
                    />
                  }
                >
                  Go for print
                </Button>
                <Button
                  type="button"
                  variant="text"
                  sx={{
                    padding: "6px 22px",
                    borderRadius: "8px",
                    color: "#34A853",
                    fontSize: "12px",
                    lineHeight: "16px",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    alert("Click");
                  }}
                >
                  Add Info
                </Button>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Button"}
                  icon={
                    <AddOutlined
                      sx={{
                        marginRight: "0px",
                        fontSize: "15px",
                      }}
                    />
                  }
                  onClick={(e) => {
                    alert("Click");
                  }}
                />
                <PrimaryButton
                  type="button"
                  className="btn btn-green btn-green-less"
                  label={"Button"}
                  icon={
                    <AddOutlined
                      sx={{
                        marginRight: "0px",
                        fontSize: "15px",
                      }}
                    />
                  }
                  onClick={(e) => {
                    alert("Click");
                  }}
                />
                <PrimaryButton
                  type="button"
                  className="btn-light-green"
                  label={"Loan Application"}
                  onClick={(e) => {
                    alert("Click");
                  }}
                />
                <PrimaryButton
                  type="button"
                  className="btn btn-green btn-green-less border"
                  label={"Add"}
                  onClick={(e) => {
                    alert("Click");
                  }}
                />
                <PrimaryButton
                  type="button"
                  className="btn add-ddl-btn"
                  icon={
                    <AddOutlined
                      sx={{
                        marginRight: "0px",
                        fontSize: "15px",
                      }}
                    />
                  }
                  onClick={(e) => {
                    alert("Click");
                  }}
                />
                <ResetButton
                  title="reset"
                  icon={
                    <SettingsBackupRestoreOutlined
                      sx={{ marginRight: "10px" }}
                    />
                  }
                  onClick={() => {
                    alert("Click");
                  }}
                />
              </div>
            </div>

            {/* table */}
            <div>
              <div className="table-card-heading mt-3">
                <h2>Table</h2>
              </div>

              <div className="table-card-styled tableOne">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px", textAlign: "center" }}>SL</th>
                      <th scope="col">
                        <div className="d-flex align-items-center">
                          <FormikCheckBox
                            styleObj={{
                              margin: "0 auto!important",
                              color: greenColor,
                            }}
                            name="allSelected"
                            onChange={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div
                          className="d-flex align-items-center m-0 p-0 pointer"
                          onClick={() => {
                            setEmpOrder(empOrder === "desc" ? "asc" : "desc");
                          }}
                        >
                          Employee
                          <SortingIcon viewOrder={empOrder} />
                        </div>
                      </th>
                      <th scope="col">Designation</th>
                      <th scope="col">Department</th>
                      <th scope="col">Leave Type</th>
                      <th scope="col">Date Range</th>
                      <th scope="col">Application Date</th>
                      <th scope="col" width="10%">
                        <div className="d-flex align-items-center justify-content-center">
                          Status
                        </div>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 4]?.map((item, index) => (
                      <tr className="hasEvent" key={index}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td
                          className="m-0 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <FormikCheckBox
                            styleObj={{
                              margin: "0 auto!important",
                              color: greenColor,
                            }}
                            name="selectCheckbox"
                            color={greenColor}
                            onChange={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </td>
                        <td className="m-0 p-0">
                          <div className="employeeInfo d-flex align-items-center">
                            <AvatarComponent
                              classess="small-avatar"
                              letterCount={1}
                              label={"Jubayer"}
                            />
                            <div className="ml-3">jubayer</div>
                          </div>
                        </td>
                        <td>Quality Analyst,Permanent</td>
                        <td>Quality Management</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div>Sick Leave</div>
                            <LightTooltip
                              title={
                                <div className="movement-tooltip p-1">
                                  <div className="border-bottom">
                                    <p className="tooltip-title">Reason</p>
                                    <p className="tooltip-subTitle">
                                      Cold Fever
                                    </p>
                                  </div>
                                  <div>
                                    <p className="tooltip-title mt-1">
                                      Location
                                    </p>
                                    <p className="tooltip-subTitle mb-0">
                                      Dhaka
                                    </p>
                                  </div>
                                </div>
                              }
                              arrow
                            >
                              <InfoOutlined sx={{ marginLeft: "12px" }} />
                            </LightTooltip>
                          </div>
                        </td>

                        <td>
                          {`${dateFormatter(
                            "2022-03-03T00:00:00"
                          )} to ${dateFormatter("2022-03-05T00:00:00")}`}
                        </td>
                        <td>{dateFormatter("2022-02-06T00:00:00")}</td>

                        <td className="text-center action-chip">
                          {"Pending" && (
                            <>
                              <div className="actionChip">
                                <Chips label="Pending" classess=" warning" />
                              </div>
                              <div className="d-flex actionIcon justify-content-center">
                                <Tooltip title="Edit">
                                  <div
                                    className="mr-0 muiIconHover success "
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <EditOutlined
                                          sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                                <Tooltip title="Approve">
                                  <div
                                    className="p-2 mr-0 muiIconHover success "
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <CheckCircle
                                          sx={{ color: successColor }}
                                        />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <div
                                    className="p-2 muiIconHover  danger"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <MuiIcon
                                      icon={
                                        <Cancel sx={{ color: failColor }} />
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            </>
                          )}
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {[1, 2, 3]?.length > 0 && (
                <div className="self-card" style={{ height: "130px" }}>
                  <div className="table-card-styled employee-table-card tableOne">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>
                            <div className="sortable">
                              <span>Leave Type</span>
                            </div>
                          </th>
                          <th>
                            <div className="sortable">
                              <span>Allocated Leave</span>
                            </div>
                          </th>
                          <th>
                            <div className="sortable">
                              <span>Taken Leave</span>
                            </div>
                          </th>
                          <th>
                            <div className="sortable">
                              <span>Remaining Leave</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <div className="tableBody-title">
                                  Maternal Leave
                                </div>
                              </td>
                              <td>
                                <div className="tableBody-title">84</div>
                              </td>
                              <td>
                                <div className="tableBody-title">0</div>
                              </td>
                              <td>
                                <div className="tableBody-title">0</div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="table-card-styled tableOne">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th
                        style={{
                          minWidth: "40px",
                          width: "40px",
                        }}
                      >
                        SL
                      </th>
                      <th
                        style={{
                          minWidth: "50px",
                          width: "50px",
                        }}
                      >
                        Group
                      </th>
                      <th
                        style={{
                          width: "170px",
                        }}
                      >
                        Employee Name
                      </th>
                      <th
                        style={{
                          minWidth: "70px",
                          width: "80px",
                        }}
                      >
                        Rank
                      </th>
                      <th className="print-design">
                        <p>Passport</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3]?.length > 0 &&
                      [1, 2, 3]?.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <div className="tableBody-title">{index++}</div>
                          </td>
                          <td>
                            <div className="tableBody-title">Officer</div>
                          </td>
                          <td>
                            <div className="tableBody-title">Mr. Watson</div>
                          </td>
                          <td>
                            <div className="tableBody-title">Master</div>
                          </td>
                          <td>
                            <div className="tableBody-title">
                              {dateFormatter("2022-03-24T00:00:00")}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <ScrollableTable>
                <thead>
                  <th style={{ minWidth: "40px" }}>
                    <div
                      style={{
                        color: "rgba(0,0,0,0.6)",
                      }}
                      className="pl-3"
                    >
                      SL
                    </div>
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                  >
                    Department
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    Man Power
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    O.T AMT
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    E.SIDE
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    N/A AMT
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    ATT. Bonus
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    Salary
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    Gross Salary
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    C.B.A Subscription
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    Deduct AMT
                  </th>
                  <th
                    style={{
                      color: "rgba(0,0,0,0.6)",
                    }}
                    className="text-center"
                  >
                    Net Payable
                  </th>
                </thead>
                <tbody>
                  {[1, 2, 3]?.length > 0 &&
                    [1, 2, 3].map((data, index) => (
                      <tr key={index}>
                        <td>
                          <div className="pl-3">{index + 1}</div>
                        </td>
                        <td>Quality Management</td>
                        <td className="text-center">1</td>
                        <td className="text-center">2</td>
                        <td className="text-center">3</td>
                        <td className="text-center">4</td>
                        <td className="text-center">5</td>
                        <td className="text-center">6</td>
                        <td className="text-center">7</td>
                        <td className="text-center">8</td>
                        <td className="text-center">9</td>
                        <td className="text-center">10</td>
                      </tr>
                    ))}
                </tbody>
              </ScrollableTable>

              <div className="table-card-body">
                <ScrollableTable
                  classes="salary-process-table"
                  secondClasses="table-card-styled tableOne"
                >
                  <thead>
                    <tr>
                      <th rowSpan="2" style={{ textAlign: "center" }}>
                        <span>SL</span>
                      </th>
                      <th rowSpan="2">
                        <div className="d-flex align-items-center">
                          <FormikCheckBox
                            styleObj={{
                              margin: "0 auto!important",
                              color: greenColor,
                            }}
                            name="allSelected"
                            onChange={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          <span className="pl-3">Emp Name</span>
                        </div>
                      </th>
                      <th rowSpan="2">Stage</th>
                      <th rowSpan="2">Employment Type</th>
                      <th rowSpan="2">Designation</th>
                      <th rowSpan="2">Department</th>
                      <th rowSpan="2">Joining Date</th>
                      <th rowSpan="2">Service Length</th>
                      <th rowSpan="2">Email</th>
                      <th rowSpan="2">Contact No.</th>
                      <th rowSpan="2">Workplace</th>
                      <th rowSpan="2">Workplace Group</th>
                      <th rowSpan="2">Account Name</th>
                      <th rowSpan="2">Account No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((item, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FormikCheckBox
                              styleObj={{
                                margin: "0 auto!important",
                                color: greenColor,
                              }}
                              name="allSelected"
                              checked={item?.selectCheckbox}
                              onChange={(e) => {
                                e.stopPropagation();
                              }}
                            />
                            <div className="pl-3">
                              <div className="d-flex align-items-center">
                                <div className="emp-avatar">
                                  <AvatarComponent
                                    classess="mr-2"
                                    letterCount={1}
                                    label={"Jubayer"}
                                  />
                                </div>
                                <div>{"Jubayer"}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {true && (
                            <Chips label={"Unpaid"} classess={`warning`} />
                          )}
                        </td>
                        <td>Intern</td>
                        <td>Development</td>
                        <td>Development</td>
                        <td>20/2/22</td>
                        <td>3 month</td>
                        <td>jubayer@ibos.io</td>
                        <td>123456789</td>
                        <td>iBOS</td>
                        <td>iBOS</td>
                        <td>Jubayer</td>
                        <td>987654321</td>
                      </tr>
                    ))}
                  </tbody>
                </ScrollableTable>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
