/* eslint-disable no-unused-vars */
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { shallowEqual, useSelector } from "react-redux";

export default function LocationAssignDrawer(props) {
  const { isOpen, setIsOpen, styles, setRowDto, setAllData, setLoading } =
    props;

  const { buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    <div className="position-relative">
      <Drawer
        anchor="right"
        open={isOpen}
        // onClose={() => setIsOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            // position: "relative",
            left: "50%",
            width: "50%",
            ...styles,
          },
          "& .MuiDrawer-paperAnchorRight": {
              // overflowY: "visible",
              overflowX: "hidden",
              overflowY: "scroll !important",
          },
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "-30px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "white",
            transform: "translateY(-50%)",
            display: "flex",
          }}
          className="d-flex justify-content-center align-items-center"
        >
          <IconButton
            onClick={(e) => {
              setIsOpen(false);
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </span>

        {props?.children}
      </Drawer>
    </div>
  );
}
