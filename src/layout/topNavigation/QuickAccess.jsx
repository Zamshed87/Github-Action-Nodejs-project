import PushPinIcon from "@mui/icons-material/PushPin";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { styled, Tooltip, tooltipClasses } from "@mui/material";
import { useHistory } from "react-router-dom";

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

const QuickAccess = () => {
  let history = useHistory();
  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        {/* <p style={{ fontSize: "12px" }}>Quick Access</p> */}
        <LightTooltip
          title={
            <div style={{ cursor: "pointer" }}>
              <div
                className="p-2"
                onClick={() =>
                  history.push("/SelfService/leaveAndMovement/leaveApplication")
                }
              >
                <PushPinIcon style={{ fontSize: "12px" }} /> Leave Application
              </div>
              <div
                className="p-2"
                onClick={() =>
                  history.push(
                    "/SelfService/leaveAndMovement/movementApplication"
                  )
                }
              >
                <PushPinIcon style={{ fontSize: "12px" }} /> Movement
                Application
              </div>
              {/* <div className="p-2">
                <PushPinIcon style={{ fontSize: "12px" }} /> Food Corner
              </div> */}
            </div>
          }
          arrow
        >
          <StarBorderIcon className="text-success" />
        </LightTooltip>
      </div>
    </>
  );
};

export default QuickAccess;
