import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { Edit, CalendarToday, WatchLater, Watch } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { shallowEqual, useSelector } from "react-redux";
import { getPeopleDeskAllLanding } from "../../../../../common/api";
import { timeFormatter } from "../../../../../utility/timeFormatter";

const ViewCalendarSetup = ({
  id,
  handleOpen,
  onHide,
  setId,
  singleData,
  setSingleData,
}) => {
  const style = {
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllLanding(
      "CalenderById",
      orgId,
      buId,
      id,
      setSingleData,
      null,
      null,
      null,
      null,
      wgId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, wgId, buId]);
  const avatarSx = {
    background: "#F2F2F7",
    "&": {
      height: "30px",
      width: "30px",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "16px",
    },
  };
  return (
    <Box sx={style} className="calenderViewModal">
      <div className="modalBody pt-1" style={{ padding: "0px 12px" }}>
        {singleData && (
          <>
            <div className="details-item d-flex align-items-center">
              <div className="">
                {/* <Avatar sx={avatarSx}>
                  <CalendarToday sx={{ color: "#616163" }} />
                </Avatar> */}
                <div style={{ marginRight: "17px" }}>
                  <Avatar sx={avatarSx}>
                    <CalendarToday sx={{ color: "#616163" }} />
                  </Avatar>
                </div>
              </div>
              <div className="modal-body-txt">
                <h6 className="title-item-name">
                  {singleData[0]?.CalenderName}
                </h6>
                <p className="subtitle-p">Calendar Name</p>
              </div>
            </div>
            <div className="details-item d-flex align-items-center">
              <div
                className="icon-details-item"
                style={{ marginRight: "17px" }}
              >
                <Avatar sx={avatarSx}>
                  <WatchLater sx={{ color: "#616163" }} />
                </Avatar>
              </div>
              <div className="modal-body-txt">
                <h6 className="title-item-name">
                  {timeFormatter(singleData[0]?.StartTime)}
                </h6>
                <p className="subtitle-p">Start Time</p>
              </div>
            </div>
            <div className="details-item d-flex align-items-center">
              <div
                className="icon-details-item"
                style={{ marginRight: "17px" }}
              >
                <Avatar sx={avatarSx}>
                  <WatchLater sx={{ color: "#616163" }} />
                </Avatar>
              </div>
              <div className="modal-body-txt">
                <h6 className="title-item-name">
                  {timeFormatter(singleData[0]?.EndTime)}
                </h6>
                <p className="subtitle-p">End Time</p>
              </div>
            </div>
            <div className="details-item d-flex align-items-center">
              <div
                className="icon-details-item"
                style={{ marginRight: "17px" }}
              >
                <Avatar sx={avatarSx}>
                  <Watch sx={{ color: "#616163" }} />
                </Avatar>
              </div>
              <div className="modal-body-txt">
                <h6 className="title-item-name">
                  {singleData[0]?.MinWorkHour}
                </h6>
                <p className="subtitle-p">Minimum Working Hour</p>
              </div>
            </div>
            <div className="details-item d-flex align-items-center">
              <div
                className="icon-details-item"
                style={{ marginRight: "17px" }}
              >
                <Avatar sx={avatarSx}>
                  <Watch sx={{ color: "#616163" }} />
                </Avatar>
              </div>
              <div className="modal-body-txt">
                <h6 className="title-item-name">
                  {timeFormatter(singleData[0]?.ExtendedStartTime)}
                </h6>
                <p className="subtitle-p">Allowed Start Time</p>
              </div>
            </div>
            <div className="details-item d-flex align-items-center">
              <div
                className="icon-details-item"
                style={{ marginRight: "17px" }}
              >
                <Avatar sx={avatarSx}>
                  <Watch sx={{ color: "#616163" }} />
                </Avatar>
              </div>
              <div className="modal-body-txt">
                <h6 className="title-item-name">
                  {timeFormatter(singleData[0]?.OfficeStartTime)}
                </h6>
                <p className="subtitle-p">Office Open Time</p>
              </div>
            </div>
            <div className="details-item d-flex align-items-center">
              <div
                className="icon-details-item"
                style={{ marginRight: "17px" }}
              >
                <Avatar sx={avatarSx}>
                  <Watch sx={{ color: "#616163" }} />
                </Avatar>
              </div>
              <div className="modal-body-txt">
                <h6 className="title-item-name">
                  {timeFormatter(singleData[0]?.OfficeCloseTime)}
                </h6>
                <p className="subtitle-p">Office End Time</p>
              </div>
            </div>
            <div className="details-item d-flex align-items-center">
              <div
                className="icon-details-item"
                style={{ marginRight: "17px" }}
              >
                <Avatar sx={avatarSx}>
                  <Watch sx={{ color: "#616163" }} />
                </Avatar>
              </div>
              <div className="modal-body-txt">
                <h6 className="title-item-name">
                  {timeFormatter(singleData[0]?.LastStartTime)}
                </h6>
                <p className="subtitle-p">Last Start Time</p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="modal-footer view-modal-footer">
        <button
          className="modal-btn modal-btn-edit"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
            // setViewCalenderSetup(false);s
            setId(id);
          }}
          // type="submit"
        >
          <Edit sx={{ marginRight: "13px", fontSize: "16px" }} />
          Edit
        </button>
        {/* <button
          className="btn btn-cancel"
          onClick={() =>
            //  setViewCalenderSetup(false);
            onHide()
          }
        >
          Cancel
        </button> */}
      </div>
    </Box>
  );
};

export default ViewCalendarSetup;
