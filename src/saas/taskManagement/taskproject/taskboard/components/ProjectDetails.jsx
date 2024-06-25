import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import { Avatar, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import * as React from "react";

const members = [
  { name: "Arif", position: "UX Desiner" },
  { name: "Atik", position: "frontend developer" },
  { name: "Topu", position: "backend developer" },
  { name: "Manna", position: "DevOps" },
];
export default function ProjectDetails() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 556 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <span
        style={{
          position: "absolute",
          marginTop: "29px",
          // paddingTop: "20px",
          top: "0",
          left: "-60px",
          width: "60px",
          height: "60px",
          //   borderRadius: "50%",
          background: "white",
          transform: "translateY(-50%)",
          display: "flex",
        }}
        className="d-flex justify-content-center align-items-center"
      >
        <IconButton
          onClick={() => {
            // setIsOpen(false);
            // getEmployeeSalaryInfo(setAllData, setRowDto, setLoading, {
            //   partType: "SalaryAssignLanding",
            //   businessUnitId: buId,
            //   workplaceGroupId: 0,
            //   departmentId: 0,
            //   designationId: 0,
            //   supervisorId: 0,
            //   employeeId: 0,
            // });
          }}
        >
          <CancelIcon sx={{ color: "rgba(50, 50, 50, 1)" }} className="icon" />
        </IconButton>
      </span>
      <div>
        {/* <div
          style={{
            position: "absolute",
            top: "0",
            left: "-10px",
            background: "black",
            zIndex: "9999",
          }}
        >
          <CancelIcon className="icon" />
        </div> */}
        <div
          style={{
            fontSize: "20px",
            padding: "15px 0px 14px 20px",
            marginBottom: "20px",
            color: "rgba(0, 0, 0, 0.6)",
            boxShadow: "0px 1px 18px rgba(0, 0, 0, 0.12)",
          }}
        >
          Project Details
        </div>
        <div
          style={{
            padding: "5px 10px 0px 20px",
            overflowY: "Scroll",
            height: "640px",
            margin: "5px",

            overflow: "auto",
            textAlign: "justify",
          }}
        >
          <div>
            <div>
              <StarsRoundedIcon sx={{ color: "#637381" }} />{" "}
              <p
                style={{
                  fontSize: "16px",
                  color: "#637381",
                  fontWeight: "600",
                  display: "inline",
                }}
              >
                TASK
              </p>
            </div>
            <p style={{ fontSize: "14px", color: "#6F7D8A" }}>
              Create User Journey Map
            </p>
            <hr />
          </div>
          <div>
            <div style={{ fontSize: "16px", color: "#637381!important" }}>
              <DescriptionIcon sx={{ color: "#637381" }} />{" "}
              <p
                style={{
                  fontSize: "16px",
                  color: "#637381",
                  fontWeight: "600",
                  display: "inline",
                }}
              >
                DESCRIPTION
              </p>
            </div>
            <p style={{ fontSize: "14px", color: "#6F7D8A" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure
              eveniet exercitationem adipisci perspiciatis similique animi esse
              corrupti, sint ratione optio, incidunt natus nobis dignissimos
              dicta vitae autem cupiditate. Neque, sit.
            </p>
            <hr />
          </div>
          <div>
            <div>
              <DateRangeRoundedIcon sx={{ color: "#637381" }} />{" "}
              <p
                style={{
                  fontSize: "16px",
                  color: "#637381",
                  fontWeight: "600",
                  display: "inline",
                }}
              >
                TIMELINE
              </p>
            </div>
            <div className="d-flex mt-2">
              <div
                style={{ borderRight: "1px solid #919CA5" }}
                className=" pl-1 pr-4"
              >
                <p style={{ color: "#919CA5" }}>11/09/2021</p>
                <p style={{ color: "#919CA5" }}>Start Date</p>
              </div>
              <div className="pl-4">
                <p style={{ color: "#919CA5" }}>12/09/2021</p>
                <p style={{ color: "#919CA5" }}>End Date</p>
              </div>
            </div>
            <hr />
          </div>
          <div>
            <div className="pb-2">
              <AttachFileRoundedIcon sx={{ color: "#637381" }} />{" "}
              <p
                style={{
                  fontSize: "16px",
                  color: "#637381",
                  fontWeight: "600",
                  display: "inline",
                }}
              >
                ATTACHMENT
              </p>
            </div>
            <p style={{ color: "#1084F1", marginLeft: "7px" }}>
              userjourney.pdf
            </p>
            <hr />
          </div>
          <div>
            <div className="pb-3">
              <PersonIcon sx={{ color: "#637381" }} />{" "}
              <p
                style={{
                  fontSize: "16px",
                  color: "#637381",
                  fontWeight: "600",
                  display: "inline",
                }}
              >
                ASSIGN INFO
              </p>
            </div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "600",
                paddingBottom: "5px",
                marginLeft: "4px",
                color: "#55616C",
              }}
            >
              Assignee
            </p>
            <div>
              <div className="d-flex align-items-center px-1 ">
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <div className=" ml-2">
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#55616C",
                    }}
                  >
                    Shafiq
                  </p>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#97A5B1",
                    }}
                    className="text-secondary"
                  >
                    Chief Executive Officer
                  </span>
                </div>
              </div>
              <hr />
            </div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "600",
                paddingBottom: "5px",
                marginLeft: "4px",
                color: "#55616C",
              }}
            >
              Reporter
            </p>
            <div>
              <div className="d-flex align-items-center px-1 ">
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <div className=" ml-2">
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#55616C",
                    }}
                  >
                    Rafiq
                  </p>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#97A5B1",
                    }}
                    className="text-secondary"
                  >
                    Software Engineer
                  </span>
                </div>
              </div>
              <hr />
            </div>
          </div>
          <div>
            <p
              style={{ fontSize: "12px", fontWeight: "600", color: "#55616C" }}
            >
              Member
            </p>
            {members?.map((member, index) => (
              <div key={index} className="d-flex align-items-center px-1 my-2">
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <div className=" ml-3">
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#55616C",
                    }}
                  >
                    {member?.name}
                  </p>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#97A5B1",
                    }}
                    className="text-secondary"
                  >
                    {member?.position}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <button
          // style={{ color: "#637381", background: "" }}
          style={{
            backgroundColor: "#F2F2F7",
            borderRadius: "4px",
            width: "100%",
            border: "none",
            height: "30px",
          }}
          className=" d-flex align-items-center justify-content-center "
          onClick={toggleDrawer("right", true)}
        >
          <InfoIcon
            sx={{ color: "#637381", fontSize: "16px", marginRight: "8px" }}
          />{" "}
          <p style={{ fontSize: "14px", fontWeight: "500", color: "#5F6368" }}>
            Project Detail
          </p>
        </button>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
          sx={{
            "& .MuiPaper-root": {
              // position: "relative",
              //   left: "50%",
              width: "556px",
            },
            "& .MuiDrawer-paperAnchorRight": {
              overflowY: "visible",
              // overflowX: "hidden",
              // overflowY: "scroll !important",
            },
          }}
        >
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
