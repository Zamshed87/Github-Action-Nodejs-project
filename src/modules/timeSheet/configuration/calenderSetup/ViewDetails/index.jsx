import React, { useEffect } from "react";
import { Box } from "@mui/system";
import { Edit, CalendarToday, WatchLater, Watch } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { shallowEqual, useSelector } from "react-redux";
import { timeFormatter } from "../../../../../utility/timeFormatter";
import { getTimeSheetCalenderById } from "../AddEditForm/helper";

const ViewCalendarSetup = ({
  id,
  handleOpen,
  setId,
  singleData,
  setSingleData,
  setLoading,
  setAllData,
}) => {
  const style = {
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const { buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getTimeSheetCalenderById(buId, id, setSingleData, setAllData, setLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
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
                  {singleData?.strCalenderName}
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
                  {timeFormatter(singleData?.dteStartTime)}
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
                  {timeFormatter(singleData?.dteEndTime)}
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
                  {singleData?.numMinWorkHour}
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
                  {timeFormatter(singleData?.dteExtendedStartTime)}
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
                  {timeFormatter(singleData?.dteOfficeStartTime)}
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
                  {timeFormatter(singleData?.dteOfficeCloseTime)}
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
                  {timeFormatter(singleData?.dteLastStartTime)}
                </h6>
                <p className="subtitle-p">Last Start Time</p>
              </div>
            </div>
            {singleData?.timeSheetCalenderRows?.length > 0 && (
              <div className="table-card-body  pt-1">
                <div
                  className=" table-card-styled tableOne"
                  style={{ padding: "0px 12px" }}
                >
                  <table className="table align-middle">
                    <thead style={{ color: "#212529" }}>
                      <tr>
                        <th>
                          <div className="d-flex align-items-center">
                            Workplace name
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <>
                        {singleData.timeSheetCalenderRows?.map(
                          (item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item?.strWorkplaceName}</td>
                              </tr>
                            );
                          }
                        )}
                      </>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="modal-footer view-modal-footer">
        <button
          className="modal-btn modal-btn-edit"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
            // setViewCalenderSetup(false);
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
