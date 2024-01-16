import PushPinIcon from "@mui/icons-material/PushPin";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { LightTooltip } from "common/LightTooltip";
import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const QuickAccess = () => {
  let history = useHistory();
  const { mostClickedMenuList } = useSelector(
    (state) => state?.auth,
    shallowEqual
  );
  const sortedMenuList = useMemo(() => {
    const menuList = mostClickedMenuList ?? []; // Check for null or undefined
    const sortedArray = menuList
      .slice()
      .sort((a, b) => b.totalClicked - a.totalClicked);
    return sortedArray.slice(0, 10);
  }, [mostClickedMenuList]);

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        {/* <p style={{ fontSize: "12px" }}>Quick Access</p> */}
        <LightTooltip
          title={
            <div style={{ cursor: "pointer" }}>
              {/* <div
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
              </div> */}
              {sortedMenuList.map((element) => {
                return (
                  <div
                    key={element.id}
                    className="p-2"
                    onClick={() => history.push(element.to)}
                  >
                    <PushPinIcon style={{ fontSize: "12px" }} /> {element.label}
                  </div>
                );
              })}
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
